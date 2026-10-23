import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowUpRight,
  Plus,
  Minus,
  RotateCcw,
  MessageCircle,
  X,
  Send,
} from "lucide-react";
import { skills, photos, profile } from "./data";
import { skillIcons } from "./skill-icons";

export function FluidPortrait({ paused }) {
  const wrap = useRef(null);
  useEffect(() => {
    if (paused || matchMedia("(pointer: coarse)").matches) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      return;
    }
    const el = wrap.current,
      w = el.clientWidth,
      h = el.clientHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      pointer = new THREE.Vector2(0.5, 0.5);
    let frame,
      active = false,
      visible = true,
      disposed = false;
    const texture = new THREE.TextureLoader().load(
      "/assets/portrait.webp",
      () => {
        if (disposed) texture.dispose();
      },
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    const uniforms = {
      uTexture: { value: texture },
      uMouse: { value: pointer },
      uTime: { value: 0 },
      uStrength: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:
        "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}",
      fragmentShader: `uniform sampler2D uTexture;uniform vec2 uMouse;uniform float uTime;uniform float uStrength;varying vec2 vUv;void main(){vec2 uv=vUv;float d=distance(uv,uMouse);float ripple=sin(d*24.0-uTime*4.0)*exp(-d*5.0)*uStrength;uv+=normalize(uv-uMouse+0.001)*ripple;uv=clamp(uv,0.002,0.998);gl_FragColor=texture2D(uTexture,uv);
#include <colorspace_fragment>
}`,
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geo, material));
    const move = (e) => {
      const r = el.getBoundingClientRect();
      pointer.set(
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      );
      active = true;
    };
    const leave = () => (active = false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      uniforms.uTime.value += 0.016;
      uniforms.uStrength.value +=
        (Number(active) * 0.035 - uniforms.uStrength.value) * 0.08;
      renderer.render(scene, camera);
    };
    draw();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      texture.dispose();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [paused]);
  return (
    <div ref={wrap} className="fluid-portrait">
      <img
        src="/assets/portrait.webp"
        alt="Win Min Thaw at sunrise, wearing an orange scarf"
        fetchPriority="high"
      />
    </div>
  );
}

export function SkillCloud({ paused }) {
  const canvas = useRef(null),
    [selected, setSelected] = useState("");
  useEffect(() => {
    const el = canvas.current,
      ctx = el.getContext("2d");
    const icons = Object.fromEntries(skills.map(label => {
      const img = new Image();
      img.src = `/assets/skills/${skillIcons[label]}.svg`;
      return [label, img];
    }));
    let frame,
      rotation = { x: 0.1, y: 0 },
      drag = false,
      last = { x: 0, y: 0 },
      visible = true,
      focus = null,
      projected = [];
    const points = skills.map((label, i) => {
      const y = 1 - (i / (skills.length - 1)) * 2,
        r = Math.sqrt(1 - y * y),
        theta = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, label };
    });
    let size = 400;
    const resize = () => {
      size = el.clientWidth;
      el.width = size * Math.min(devicePixelRatio, 2);
      el.height = el.width;
      ctx.setTransform(el.width / size, 0, 0, el.width / size, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const paint = () => {
      frame = requestAnimationFrame(paint);
      if (!visible) return;
      if (!paused && !drag) {
        rotation.y += 0.002;
        if (focus) {
          rotation.x += (focus.x - rotation.x) * 0.05;
          rotation.y += (focus.y - rotation.y) * 0.05;
          if (Math.abs(focus.y - rotation.y) < 0.02) focus = null;
        }
      }
      ctx.clearRect(0, 0, size, size);
      const radius = size * 0.32;
      ctx.strokeStyle = "#899b7145";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(
        size / 2,
        size / 2,
        radius * 1.16,
        radius * 0.3,
        -0.4,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      projected = points
        .map((p) => {
          const x = p.x * Math.cos(rotation.y) - p.z * Math.sin(rotation.y),
            z = p.x * Math.sin(rotation.y) + p.z * Math.cos(rotation.y),
            y = p.y * Math.cos(rotation.x) - z * Math.sin(rotation.x),
            zz = p.y * Math.sin(rotation.x) + z * Math.cos(rotation.x);
          const scale = (zz + 3) / 3;
          return {
            ...p,
            px: size / 2 + x * radius,
            py: size / 2 + y * radius,
            z: zz,
            scale,
          };
        })
        .sort((a, b) => a.z - b.z);
      projected.forEach((p) => {
        ctx.globalAlpha = 0.45 + (p.z + 1) * 0.275;
        ctx.font = `${Math.max(9, 12 * p.scale)}px 'DM Mono',monospace`;
        const iconSize = 21 * p.scale;
        const width = ctx.measureText(p.label).width + iconSize + 25;
        ctx.fillStyle = p.label === selected ? "#f8d8c5" : "#ffffff";
        ctx.strokeStyle = "#899b7150";
        ctx.beginPath();
        ctx.roundRect(
          p.px - width / 2,
          p.py - 17 * p.scale,
          width,
          34 * p.scale,
          5,
        );
        ctx.fill();
        ctx.stroke();
        const icon = icons[p.label];
        if (icon.complete && icon.naturalWidth) {
          const ratio = Math.min(iconSize / icon.naturalWidth, iconSize / icon.naturalHeight);
          const iw = icon.naturalWidth * ratio, ih = icon.naturalHeight * ratio;
          ctx.drawImage(icon, p.px - width / 2 + 8 + (iconSize-iw)/2, p.py-ih/2, iw, ih);
        }
        ctx.fillStyle = "#263023";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, p.px - width / 2 + iconSize + 16, p.py);
      });
      ctx.globalAlpha = 1;
    };
    paint();
    const down = (e) => {
      if (e.pointerType === "touch") return;
      drag = true;
      last = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (drag) {
        rotation.x += (e.clientY - last.y) * 0.006;
        rotation.y += (e.clientX - last.x) * 0.006;
        last = { x: e.clientX, y: e.clientY };
      }
    };
    const up = (e) => {
      drag = false;
      el.releasePointerCapture?.(e.pointerId);
    };
    const click = (e) => {
      const r = el.getBoundingClientRect(),
        x = e.clientX - r.left,
        y = e.clientY - r.top;
      const p = [...projected]
        .reverse()
        .find((p) => Math.abs(p.px - x) < 50 && Math.abs(p.py - y) < 18);
      if (p) {
        setSelected(p.label);
        const original = points.find((o) => o.label === p.label);
        focus = {
          y: Math.atan2(original.x, original.z),
          x: Math.atan2(
            original.y,
            Math.sqrt(original.x ** 2 + original.z ** 2),
          ),
        };
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click);
    };
  }, [paused, selected]);
  return (
    <canvas
      ref={canvas}
      className="skill-cloud"
      role="img"
      aria-label={
        "Interactive skill sphere. " +
        skills.join(", ") +
        (selected ? ". Selected: " + selected : "")
      }
    />
  );
}

export function ProjectGlobe({ items, paused, onSelect }) {
  const container = useRef(null),
    callback = useRef(onSelect),
    [error, setError] = useState(false);
  callback.current = onSelect;
  useEffect(() => {
    const el = container.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setError(true);
      return;
    }
    let frame,
      down = false,
      travel = 0,
      last = { x: 0, y: 0 },
      visible = true;
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 8.2;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setClearColor(0, 0);
    el.prepend(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    const sphereGeo = new THREE.SphereGeometry(1.7, 24, 14),
      wireMat = new THREE.MeshBasicMaterial({
        color: 0x899482,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
      wire = new THREE.Mesh(sphereGeo, wireMat);
    group.add(wire);
    const meshes = [],
      textures = [],
      geometries = [sphereGeo],
      materials = [wireMat];
    items.forEach((p, i) => {
      const c = document.createElement("canvas");
      c.width = 600;
      c.height = 390;
      const ctx = c.getContext("2d");
      ctx.fillStyle = p.color;
      ctx.fillRect(0, 0, 600, 390);
      ctx.fillStyle = "#252821";
      ctx.font = "16px monospace";
      ctx.fillText(p.number + " / " + p.category.toUpperCase(), 32, 40);
      ctx.font = "38px Arial";
      const words = p.title.split(" ");
      let line = "",
        y = 180;
      words.forEach((w) => {
        if (ctx.measureText(line + w).width > 530) {
          ctx.fillText(line, 32, y);
          line = w + " ";
          y += 48;
        } else line += w + " ";
      });
      ctx.fillText(line, 32, y);
      ctx.font = "15px monospace";
      ctx.fillText(p.name, 32, 340);
      const texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);
      const mat = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        }),
        geo = new THREE.PlaneGeometry(2.25, 1.46);
      materials.push(mat);
      geometries.push(geo);
      const m = new THREE.Mesh(geo, mat),
        angle = (i / items.length) * Math.PI * 2;
      m.position.set(
        Math.sin(angle) * 2.25,
        Math.sin(i * 2.4) * 0.75,
        Math.cos(angle) * 2.25,
      );
      m.lookAt(m.position.clone().multiplyScalar(2));
      m.userData.project = p;
      group.add(m);
      meshes.push(m);
    });
    const ray = new THREE.Raycaster(),
      mouse = new THREE.Vector2();
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.z = w < 600 ? 11 : 8.2;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const paint = () => {
      frame = requestAnimationFrame(paint);
      if (!visible) return;
      if (!paused && !down) group.rotation.y += 0.0017;
      renderer.render(scene, camera);
    };
    paint();
    const start = (e) => {
      if (e.pointerType === "touch") return;
      down = true;
      travel = 0;
      last = { x: e.clientX, y: e.clientY };
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!down) return;
      const dx = e.clientX - last.x,
        dy = e.clientY - last.y;
      travel += Math.abs(dx) + Math.abs(dy);
      group.rotation.y += dx * 0.006;
      group.rotation.x = THREE.MathUtils.clamp(
        group.rotation.x + dy * 0.003,
        -0.6,
        0.6,
      );
      last = { x: e.clientX, y: e.clientY };
    };
    const end = (e) => {
      down = false;
      if (travel > 8) return;
      const r = renderer.domElement.getBoundingClientRect();
      mouse.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        (-(e.clientY - r.top) / r.height) * 2 + 1,
      );
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObjects(meshes)[0];
      if (hit) callback.current(hit.object.userData.project);
    };
    renderer.domElement.addEventListener("pointerdown", start);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", end);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", start);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", end);
      textures.forEach((x) => x.dispose());
      materials.forEach((x) => x.dispose());
      geometries.forEach((x) => x.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [items, paused]);
  return (
    <div
      className="project-globe"
      ref={container}
      aria-label="3D project orbit"
    >
      {error ? (
        <p className="webgl-fallback">
          3D graphics aren’t available in this browser. Explore each project
          with the buttons below.
        </p>
      ) : (
        <span className="globe-help mono">
          DRAG TO ORBIT · SELECT A CARD · OR USE THE PROJECT LINKS BELOW
        </span>
      )}
    </div>
  );
}

export function PhotoPlayground({ paused, onSelect }) {
  const canvas = useRef(null),
    controls = useRef({ x: 0, y: 0, z: 1 }),
    callback = useRef(onSelect);
  callback.current = onSelect;
  useEffect(() => {
    const el = canvas.current,
      ctx = el.getContext("2d"),
      state = controls.current;
    let frame,
      w = 0,
      h = 0,
      drag = false,
      moved = 0,
      last = { x: 0, y: 0 },
      keys = {},
      items = [];
    const images = photos.map((p) => {
      const image = new Image();
      image.src = "/assets/" + p.src;
      return image;
    });
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = w * Math.min(devicePixelRatio, 2);
      el.height = h * Math.min(devicePixelRatio, 2);
      ctx.setTransform(el.width / w, 0, 0, el.height / h, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const paint = () => {
      frame = requestAnimationFrame(paint);
      if (keys.ArrowLeft || keys.a) state.x += 7;
      if (keys.ArrowRight || keys.d) state.x -= 7;
      if (keys.ArrowUp || keys.w) state.y += 7;
      if (keys.ArrowDown || keys.s) state.y -= 7;
      ctx.fillStyle = "#181e18";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#b9c29d0d";
      const spacing = 80 * state.z;
      for (
        let x = ((state.x % spacing) + spacing) % spacing;
        x < w;
        x += spacing
      ) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (
        let y = ((state.y % spacing) + spacing) % spacing;
        y < h;
        y += spacing
      ) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      items = [];
      const cellW = 285 * state.z,
        cellH = 365 * state.z;
      for (let row = -3; row < 4; row++)
        for (let col = -4; col < 5; col++) {
          const worldCol = col - Math.floor(state.x / cellW),
            worldRow = row - Math.floor(state.y / cellH),
            idx =
              (((worldCol + worldRow * 3) % photos.length) + photos.length) %
              photos.length;
          const x = w / 2 + col * cellW + (state.x % cellW) - cellW / 2,
            y = h / 2 + row * cellH + (state.y % cellH) - cellH / 2;
          const width = 210 * state.z,
            height = 275 * state.z;
          if (x > w || x + width < 0 || y > h || y + height < 0) continue;
          ctx.save();
          ctx.translate(x + width / 2, y + height / 2);
          const angle = Math.sin(worldCol * 2 + worldRow) * 0.05;
          ctx.rotate(angle);
          ctx.fillStyle = "#e8e3d8";
          ctx.fillRect(
            -width / 2 - 6,
            -height / 2 - 6,
            width + 12,
            height + 30 * state.z,
          );
          const img = images[idx];
          if (img.complete && img.naturalWidth) {
            const ratio = Math.max(width / img.width, height / img.height),
              sw = width / ratio,
              sh = height / ratio;
            ctx.drawImage(
              img,
              (img.width - sw) / 2,
              (img.height - sh) / 2,
              sw,
              sh,
              -width / 2,
              -height / 2,
              width,
              height,
            );
          }
          ctx.fillStyle = "#34392f";
          ctx.font = `${8 * state.z}px monospace`;
          ctx.fillText(
            photos[idx].label,
            -width / 2,
            height / 2 + 17 * state.z,
          );
          ctx.restore();
          items.push({ x, y, w: width, h: height, p: photos[idx] });
        }
    };
    paint();
    const down = (e) => {
      drag = true;
      moved = 0;
      last = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
      el.focus();
    };
    const move = (e) => {
      if (drag) {
        const dx = e.clientX - last.x,
          dy = e.clientY - last.y;
        state.x += dx;
        state.y += dy;
        moved += Math.abs(dx) + Math.abs(dy);
        last = { x: e.clientX, y: e.clientY };
      }
    };
    const up = (e) => {
      drag = false;
      if (moved < 6) {
        const r = el.getBoundingClientRect(),
          x = e.clientX - r.left,
          y = e.clientY - r.top,
          p = items.find(
            (i) => x >= i.x && x <= i.x + i.w && y >= i.y && y <= i.y + i.h,
          );
        if (p) callback.current(p.p);
      }
    };
    const wheel = (e) => {
      e.preventDefault();
      state.z = Math.max(0.45, Math.min(1.7, state.z - e.deltaY * 0.001));
    };
    const key = (e) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      ) {
        e.preventDefault();
        keys[e.key] = e.type === "keydown";
      }
    };
    const blur = () => (keys = {});
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", () => (drag = false));
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("keydown", key);
    el.addEventListener("keyup", key);
    el.addEventListener("blur", blur);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("keydown", key);
      el.removeEventListener("keyup", key);
      el.removeEventListener("blur", blur);
    };
  }, [paused]);
  return (
    <div className="photo-playground">
      <canvas
        ref={canvas}
        tabIndex={0}
        aria-label="Photo canvas. Drag to pan, scroll to zoom, use arrow keys or W A S D to move, and click a photograph to enlarge."
      />
      <div className="canvas-ui">
        <span className="mono">MOOSEY / THE OPEN CANVAS</span>
        <h2>A little life. In every direction.</h2>
      </div>
      <div className="canvas-controls">
        <button
          aria-label="Zoom in"
          onClick={() =>
            (controls.current.z = Math.min(1.7, controls.current.z + 0.15))
          }
        >
          <Plus size={18} />
        </button>
        <button
          aria-label="Zoom out"
          onClick={() =>
            (controls.current.z = Math.max(0.45, controls.current.z - 0.15))
          }
        >
          <Minus size={18} />
        </button>
        <button
          aria-label="Reset canvas"
          onClick={() => Object.assign(controls.current, { x: 0, y: 0, z: 1 })}
        >
          <RotateCcw size={18} />
        </button>
        <span className="mono">
          DRAG TO EXPLORE · SCROLL TO ZOOM · CLICK TO OPEN · ARROW KEYS TO MOVE
        </span>
      </div>
    </div>
  );
}

export function Presence({ open, setOpen, paused }) {
  const [status, setStatus] = useState("checking"),
    [enabled, setEnabled] = useState(false),
    [visitors, setVisitors] = useState([]),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const position = useRef({ x: 0.5, y: 0 }),
    id = useRef(null),
    outgoing = useRef("");
  useEffect(() => {
    fetch("/api/presence")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => setStatus(d.enabled ? "available" : "offline"))
      .catch(() => setStatus("offline"));
  }, []);
  useEffect(() => {
    if (!enabled || paused) return;
    id.current = crypto.randomUUID();
    const move = (e) => {
      position.current = {
        x: e.clientX / innerWidth,
        y: (e.clientY + scrollY) / document.documentElement.scrollHeight,
      };
    };
    addEventListener("pointermove", move, { passive: true });
    let stopped = false,
      busy = false;
    const poll = async () => {
      if (document.hidden || busy) return;
      busy = true;
      try {
        const r = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id.current,
            ...position.current,
            message: outgoing.current,
          }),
        });
        const data = await r.json();
        if (!r.ok) throw Error(data.error || "Connection unavailable");
        if (!stopped) {
          setVisitors((data.visitors || []).filter((v) => v.id !== id.current));
          setError("");
        }
      } catch {
        if (!stopped) setError("Connection interrupted. Retrying…");
      } finally {
        busy = false;
      }
    };
    poll();
    const timer = setInterval(poll, 2000);
    return () => {
      stopped = true;
      clearInterval(timer);
      removeEventListener("pointermove", move);
      setVisitors([]);
    };
  }, [enabled, paused]);
  return (
    <>
      <button
        className="presence-toggle"
        aria-label="Open visitor chat"
        onClick={() => setOpen(!open)}
      >
        <MessageCircle size={17} />
      </button>
      {open && (
        <aside className="presence-panel" aria-label="Visitor chat">
          <div className="presence-heading">
            A shared little space
            <button
              onClick={() => setOpen(false)}
              aria-label="Close visitor chat"
            >
              <X size={17} />
            </button>
          </div>
          {status === "checking" ? (
            <p>Checking live connection…</p>
          ) : status === "offline" ? (
            <>
              <p>
                Live visitor chat is not connected yet. You can still reach
                Moosey directly.
              </p>
              <a href={"mailto:" + profile.email}>
                Say hello by email <ArrowUpRight size={14} />
              </a>
            </>
          ) : !enabled ? (
            <>
              <p>
                Join to share your cursor position and a short message with
                other visitors. Presence expires after you leave.
              </p>
              <button className="pill" onClick={() => setEnabled(true)}>
                JOIN LIVE SPACE <ArrowUpRight size={15} />
              </button>
            </>
          ) : (
            <>
              <p>
                {visitors.length} other visitor
                {visitors.length === 1 ? "" : "s"} here.{" "}
                {paused
                  ? "Resume motion to enable presence."
                  : error || "Press / to open or close this panel."}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  outgoing.current = message.trim();
                  setMessage("");
                  setTimeout(() => (outgoing.current = ""), 15000);
                }}
              >
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={120}
                  aria-label="Message to other visitors"
                  placeholder="Say a little hello…"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!message.trim() || paused}
                >
                  <Send size={16} />
                </button>
              </form>
              <button
                style={{ fontSize: 10, marginTop: 16 }}
                onClick={() => setEnabled(false)}
              >
                Leave live space
              </button>
            </>
          )}
        </aside>
      )}
      {enabled &&
        !paused &&
        visitors.map((v) => (
          <div
            key={v.id}
            className="remote-cursor"
            style={{
              left: v.x * innerWidth,
              top: v.y * document.documentElement.scrollHeight,
            }}
          >
            <ArrowUpRight size={19} />
            {v.message && <span>{v.message}</span>}
          </div>
        ))}
    </>
  );
}
