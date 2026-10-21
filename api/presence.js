// Optional, anonymous, short-lived presence. Credentials stay on the server.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const url = process.env.UPSTASH_REDIS_REST_URL,
    token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(200).json({ enabled: false });
  if (req.method === "GET") return res.status(200).json({ enabled: true });
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const origin = req.headers.origin;
    if (!origin || new URL(origin).host !== req.headers.host)
      return res.status(403).json({ error: "Origin not allowed" });
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (
      !body ||
      typeof body.id !== "string" ||
      !/^[a-f0-9-]{36}$/.test(body.id) ||
      !Number.isFinite(body.x) ||
      !Number.isFinite(body.y) ||
      typeof body.message !== "string" ||
      body.message.length > 120
    )
      return res.status(400).json({ error: "Invalid presence" });
    const command = async (args) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw Error("Store unavailable");
      const result = await response.json();
      if (result.error) throw Error("Store error");
      return result.result;
    };
    const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0];
    const { createHash } = await import("node:crypto");
    const key =
      "moosey:rate:" +
      createHash("sha256")
        .update(ip + Math.floor(Date.now() / 60000))
        .digest("hex")
        .slice(0, 20);
    const count = await command(["INCR", key]);
    if (count === 1) await command(["EXPIRE", key, 65]);
    if (count > 100) return res.status(429).json({ error: "Please slow down" });
    const value = {
      id: body.id,
      x: Math.max(0, Math.min(1, body.x)),
      y: Math.max(0, Math.min(1, body.y)),
      message: body.message.replace(/[\u0000-\u001f]/g, "").trim(),
      time: Date.now(),
    };
    await command(["ZADD", "moosey:visitors", Date.now(), body.id]);
    await command([
      "SET",
      "moosey:visitor:" + body.id,
      JSON.stringify(value),
      "EX",
      12,
    ]);
    await command([
      "ZREMRANGEBYSCORE",
      "moosey:visitors",
      "-inf",
      Date.now() - 12000,
    ]);
    const ids = await command(["ZRANGE", "moosey:visitors", -40, -1]);
    const values = ids.length
      ? await command(["MGET", ...ids.map((id) => "moosey:visitor:" + id)])
      : [];
    return res
      .status(200)
      .json({
        enabled: true,
        visitors: values
          .filter(Boolean)
          .map((v) => (typeof v === "string" ? JSON.parse(v) : v)),
      });
  } catch {
    return res
      .status(503)
      .json({ error: "Live space temporarily unavailable" });
  }
}
