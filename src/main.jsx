import React, { useEffect, useRef, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  X,
  Plus,
  Minus,
  Play,
  Pause,
  Grid2X2,
  Globe,
  MoveUpRight,
  Sun,
  Moon,
  Copy,
  Check,
  Download,
  Github,
  Linkedin,
  Instagram,
  Hand,
  Command,
  Terminal,
  Layers,
  Server,
  Cloud,
  Code2,
  ExternalLink,
  Maximize2,
  RotateCcw,
  Send,
  ChevronRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { profile, projects, experiences, skills, photos } from "./data";
import {
  SkillCloud,
  ProjectGlobe,
  PhotoPlayground,
  FluidPortrait,
  Presence,
} from "./visuals";
import "./style.css";
gsap.registerPlugin(ScrollTrigger);
const Icon = ({ name, ...props }) => {
  const I = { cloud: Cloud, code: Code2, server: Server }[name] || ArrowUpRight;
  return <I {...props} />;
};
function Star({ className = "" }) {
  return (
    <svg
      className={"star " + className}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d="M50 0v100M0 50h100M15 15l70 70M15 85l70-70"
        stroke="currentColor"
        strokeWidth="13"
      />
    </svg>
  );
}
function App() {
  const reduced = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [paused, setPaused] = useState(reduced.current),
    [menu, setMenu] = useState(false),
    [theme, setTheme] = useState(
      () => localStorage.getItem("moosey-theme") || "paper",
    ),
    [auto, setAuto] = useState(false),
    [grid, setGrid] = useState(false),
    [loaded, setLoaded] = useState(false),
    [progress, setProgress] = useState(0),
    [modal, setModal] = useState(null),
    [view, setView] = useState("cards"),
    [filter, setFilter] = useState("All"),
    [tab, setTab] = useState("traffic"),
    [darkPreview, setDarkPreview] = useState(false),
    [copied, setCopied] = useState(false),
    [role, setRole] = useState(0),
    [clock, setClock] = useState(""),
    [command, setCommand] = useState(false),
    [chat, setChat] = useState(false),
    [logoIndex, setLogoIndex] = useState(0);
  const page = useRef(null),
    lenis = useRef(null),
    dialog = useRef(null),
    lastFocus = useRef(null),
    track = useRef(null),
    work = useRef(null),
    cursor = useRef(null),
    previousY = useRef(0),
    [hiddenNav, setHiddenNav] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const roles = [
    "Systems & Cloud Engineer",
    "Full-Stack Developer",
    "DevOps practitioner",
    "AI builder & educator",
  ];
  const filtered = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter],
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)"),
      change = (e) => setPaused(e.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!menu && !command) return;
    const area = document.querySelector(
        command ? ".command-panel" : "#navigation",
      ),
      before = document.activeElement;
    const get = () => [
      ...area.querySelectorAll("a[href],button:not([disabled]),input"),
    ];
    get()[0]?.focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const list = get(),
        first = list[0],
        last = list.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    area.addEventListener("keydown", trap);
    return () => {
      area.removeEventListener("keydown", trap);
      before?.focus();
    };
  }, [menu, command]);
  useEffect(() => {
    if (paused || matchMedia("(pointer: coarse)").matches) return;
    const buttons = [...document.querySelectorAll(".magnetic")];
    const handlers = buttons.map((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.13,
          y: (e.clientY - r.top - r.height / 2) * 0.13,
          duration: 0.35,
        });
      };
      const leave = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.5)" });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.set(el, { clearProps: "transform" });
      };
    });
    return () => handlers.forEach((fn) => fn());
  }, [paused, loaded]);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), reduced.current ? 80 : 1100);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Yangon",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setRole((x) => (x + 1) % roles.length);
      setLogoIndex((x) => (x + 1) % 3);
    }, 4500);
    return () => clearInterval(t);
  }, [paused]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("moosey-theme", theme);
    const color = {
      paper: "#e75a2b",
      night: "#ff784d",
      sage: "#465f43",
      cobalt: "#315dd7",
      rose: "#b83f60",
    }[theme];
    document.querySelector('meta[name="theme-color"]').content =
      theme === "night" ? "#181a17" : "#f1eee7";
    document.querySelector('link[rel="icon"]').href =
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="${color}"/><text x="12" y="46" font-size="47" font-family="Arial" font-weight="bold" fill="white">m</text></svg>`,
      );
  }, [theme]);
  useEffect(() => {
    document.body.classList.toggle("paused", paused);
    if (paused) return;
    const l = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    let raf;
    const tick = (t) => {
      l.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      lenis.current = null;
    };
  }, [paused]);
  useEffect(() => {
    const onScroll = () => {
      const y = scrollY,
        total = document.documentElement.scrollHeight - innerHeight;
      setProgress(total ? y / total : 0);
      setScrolled(y > 50);
      setHiddenNav(y > previousY.current && y > 180);
      previousY.current = y;
      if (auto) {
        const sections = [...document.querySelectorAll("[data-scene]")];
        const current = sections
          .filter((el) => el.getBoundingClientRect().top < innerHeight * 0.4)
          .at(-1);
        setTheme(current?.dataset.scene || "paper");
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [auto]);
  useEffect(() => {
    if (!loaded || paused) return;
    const ctx = gsap.context(() => {
      gsap.utils
        .toArray(".reveal")
        .forEach((el) =>
          gsap.fromTo(
            el,
            { y: 34, opacity: 0, filter: "blur(5px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            },
          ),
        );
      gsap.utils
        .toArray(".read-word")
        .forEach((el, i) =>
          gsap.fromTo(
            el,
            { opacity: 0.18 },
            {
              opacity: 1,
              scrollTrigger: {
                trigger: ".statement",
                start: `top ${80 - i * 0.9}%`,
                end: `top ${72 - i * 0.9}%`,
                scrub: true,
              },
            },
          ),
        );
      gsap.fromTo(
        ".portrait-float",
        { y: 0, rotate: 4 },
        {
          y: -55,
          rotate: -3,
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      gsap.utils.toArray("[data-count]").forEach((el) => {
        let obj = { v: 0 };
        gsap.to(obj, {
          v: Number(el.dataset.count),
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        });
      });
    }, page);
    return () => ctx.revert();
  }, [loaded, paused]);
  useEffect(() => {
    if (view !== "cards" || paused || filter !== "All" || innerWidth < 900)
      return;
    const ctx = gsap.context(() => {
      const distance = () =>
        Math.max(0, track.current.scrollWidth - work.current.clientWidth + 64);
      gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: work.current,
          start: "top 92px",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, work);
    return () => ctx.revert();
  }, [view, filter, paused, loaded]);
  useEffect(() => {
    if (!loaded || paused) return;
    const el = document.querySelector(".scramble");
    const final = "WIN MIN THAW";
    let frame = 0;
    const t = setInterval(() => {
      frame++;
      el.textContent = final
        .split("")
        .map((c, i) =>
          c === " "
            ? " "
            : i < frame / 2
              ? c
              : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)],
        )
        .join("");
      if (frame > final.length * 2) {
        el.textContent = final;
        clearInterval(t);
      }
    }, 35);
    return () => {
      clearInterval(t);
      el.textContent = final;
    };
  }, [loaded, paused]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        setCommand(false);
        setChat(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(e.target.tagName)) {
        e.preventDefault();
        setChat((v) => !v);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (menu || command) {
      document.body.style.overflow = "hidden";
      lenis.current?.stop();
    } else if (!modal) {
      document.body.style.overflow = "";
      lenis.current?.start();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, command, modal]);
  useEffect(() => {
    if (!modal) return;
    lastFocus.current = document.activeElement;
    dialog.current?.showModal();
    lenis.current?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      lenis.current?.start();
      lastFocus.current?.focus();
    };
  }, [modal]);
  const go = (id) => {
    setMenu(false);
    setCommand(false);
    setTimeout(() => {
      document
        .querySelector(id)
        ?.scrollIntoView({ behavior: paused ? "instant" : "smooth" });
    }, 50);
  };
  const openModal = (value) => setModal(value);
  const changeTheme = (value, event) => {
    setAuto(false);
    const x = event?.clientX || innerWidth / 2,
      y = event?.clientY || innerHeight / 2;
    document.documentElement.style.setProperty("--wipe-x", x + "px");
    document.documentElement.style.setProperty("--wipe-y", y + "px");
    if (document.startViewTransition && !paused)
      document.startViewTransition(() => setTheme(value));
    else setTheme(value);
    if (!paused) {
      document.body.classList.remove("theme-flip");
      void document.body.offsetWidth;
      document.body.classList.add("theme-flip");
    }
    navigator.vibrate?.(12);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      location.href = "mailto:" + profile.email;
    }
  };
  const onPointer = (e) => {
    if (paused || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mx",
      (e.clientX - r.left - r.width / 2) / r.width,
    );
    e.currentTarget.style.setProperty(
      "--my",
      (e.clientY - r.top - r.height / 2) / r.height,
    );
    if (cursor.current) {
      cursor.current.style.left = e.clientX + "px";
      cursor.current.style.top = e.clientY + "px";
      cursor.current.classList.add("active");
    }
  };
  const tabInfo = {
    traffic: [
      "Traffic overview",
      "admin-traffic-chart.jpg",
      "Daily, monthly and yearly activity views, visitor measures, and CSV reporting.",
    ],
    enquiries: [
      "Every conversation, in one place.",
      "admin-inbox.jpg",
      "Enquiry filtering, follow-up status, internal notes, and email replies.",
    ],
    news: [
      "Fresh updates. No code needed.",
      "admin-news.jpg",
      "Bilingual stories, images, drafts, and scheduled publishing.",
    ],
    gallery: [
      "A visual story that grows.",
      "admin-gallery-controls.jpg",
      "Photo uploads, categories, captions, and visibility controls.",
    ],
  }[tab];
  return (
    <div ref={page} className={grid ? "app show-grid" : "app"}>
      <a className="skip" href="#work">
        Skip to selected work
      </a>
      {!loaded && (
        <div className="preloader">
          <span className="wordmark">
            moosey
            <Star />
          </span>
          <div className="loader-line" />
          <span className="mono">
            CONNECTING THE DOTS <span className="load-count">100%</span>
          </span>
        </div>
      )}
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${progress})` }}
      />
      <header
        className={`${hiddenNav && !menu ? "nav-hidden" : ""} ${scrolled ? "scrolled" : ""}`}
      >
        <a className="wordmark" href="#home" aria-label="Moosey home">
          moosey
          <Star />
        </a>
        <div className="nav-center mono">
          <span className="status-dot" /> BASED IN YANGON, MM{" "}
          <span className="nav-time">{clock}</span>
        </div>
        <div className="nav-actions">
          <button
            title="Show design grid"
            aria-label="Toggle design grid"
            aria-pressed={grid}
            onClick={() => setGrid(!grid)}
          >
            <Grid2X2 size={17} />
          </button>
          <button
            aria-label={paused ? "Resume animations" : "Pause animations"}
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            aria-label="Switch light or dark appearance"
            onClick={(e) =>
              changeTheme(theme === "night" ? "paper" : "night", e)
            }
          >
            {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="menu-button"
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu(!menu)}
          >
            MENU <Plus size={18} />
          </button>
        </div>
      </header>
      <nav
        id="navigation"
        className={"menu-overlay " + (menu ? "is-open" : "")}
        inert={!menu ? true : undefined}
        aria-label="Main navigation"
      >
        <div className="menu-top">
          <span className="wordmark">
            moosey
            <Star />
          </span>
          <button className="pill" onClick={() => setMenu(false)}>
            CLOSE <X size={18} />
          </button>
        </div>
        <div className="menu-grid">
          <div>
            <p className="eyebrow">GOOD TO SEE YOU HERE.</p>
            <p className="menu-aside">
              Systems.
              <br />
              Stories.
              <br />A little motion.
            </p>
            <a href={"mailto:" + profile.email}>
              {profile.email} <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="menu-links">
            {[
              ["01", "Selected work", "#work"],
              ["02", "The human", "#about"],
              ["03", "Experience", "#experience"],
              ["04", "Playground", "#playground"],
              ["05", "Let’s talk", "#contact"],
            ].map(([n, label, id], i) => (
              <a
                style={{ "--i": i }}
                href={id}
                key={id}
                onClick={(e) => {
                  e.preventDefault();
                  go(id);
                }}
              >
                <small>{n}</small>
                {label}
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </div>
        <div className="menu-bottom mono">
          <span>FROM INTERFACE TO INFRASTRUCTURE.</span>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GITHUB ↗
          </a>
        </div>
      </nav>
      <main>
        <section
          className="hero"
          id="home"
          data-scene="paper"
          onPointerMove={onPointer}
          onPointerLeave={() => cursor.current?.classList.remove("active")}
        >
          <div className="hero-topline mono">
            <span>SYSTEMS / CLOUD / CODE</span>
            <span>PORTFOLIO — 2026</span>
          </div>
          <div className="hero-title">
            <div className="hero-intro">
              <span className="tiny-cross">✳</span> HELLO, I’M WIN MIN THAW.
              CALL ME MOOSEY.
            </div>
            <h1>
              From interface
              <br />
              to <span className="serif">infrastructure.</span>
            </h1>
          </div>
          <div className="hero-lower">
            <div className="hero-copy">
              <div className="role-line" key={role}>
                <span className="status-dot" />
                {roles[role]}
              </div>
              <p>
                I connect the things you see
                <br />
                with the systems you depend on.
              </p>
              <a
                className="round-cta magnetic"
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  go("#work");
                }}
              >
                <span>EXPLORE MY WORK</span>
                <span className="circle">
                  <ArrowDown size={22} />
                </span>
              </a>
            </div>
            <div className="hero-art">
              <div className="orbit-label mono">
                BUILD · DEPLOY · KEEP IT RUNNING ·
              </div>
              <button
                className="portrait-float"
                onClick={() => openModal({ photo: photos[1] })}
                aria-label="Open portrait of Win Min Thaw"
              >
                <FluidPortrait paused={paused} />
                <div className="photo-caption mono">
                  THE HUMAN BEHIND THE SYSTEMS <ArrowUpRight size={15} />
                </div>
              </button>
              <div className="floating-tag tag-one mono">
                <Terminal size={15} /> HELLO, WORLD_
              </div>
              <div className="floating-tag tag-two mono">
                <span className="status-dot" /> ENGINEERING WITH CARE
              </div>
              <Star className="hero-star" />
            </div>
          </div>
          <div className="hero-footer mono">
            <span>01 / A LITTLE ABOUT WHAT I DO</span>
            <span className="scramble" aria-label="Win Min Thaw">
              WIN MIN THAW
            </span>
            <span>
              SCROLL TO CONNECT <ArrowDown size={13} />
            </span>
          </div>
        </section>
        <div className="ticker" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                BUILD WITH PURPOSE <Star /> DEPLOY WITH CONFIDENCE <Star /> KEEP
                PEOPLE CONNECTED <Star />
              </span>
            ))}
          </div>
        </div>
        <section className="statement section" data-scene="paper">
          <div className="section-label">
            <span>THE THROUGH-LINE</span>
            <span>ENGINEERING, END TO END</span>
          </div>
          <div className="statement-layout">
            <span className="statement-mark">↳</span>
            <h2>
              {"Thoughtful on the surface. Reliable underneath. I bring infrastructure thinking to the things I build."
                .split(" ")
                .map((w, i) => (
                  <React.Fragment key={i}>
                    <span className="read-word">{w}</span>{" "}
                  </React.Fragment>
                ))}
            </h2>
          </div>
          <div className="statement-foot">
            <span className="mono">LESS FRICTION. MORE POSSIBILITY.</span>
            <p>
              From banking systems to AI learning tools,
              <br />
              my work connects technical detail with everyday usefulness.
            </p>
          </div>
        </section>
        <section className="work-section" id="work" data-scene="paper">
          <div className="section work-heading">
            <div className="section-label">
              <span>01 / SELECTED WORK</span>
              <span>REAL WORK. DIFFERENT SCALES.</span>
            </div>
            <div className="heading-row">
              <h2 className="display reveal">
                Things I’ve
                <br />
                <em>put together.</em>
              </h2>
              <div className="view-switch" aria-label="Project view">
                <button
                  className={view === "cards" ? "selected" : ""}
                  onClick={() => setView("cards")}
                  aria-pressed={view === "cards"}
                >
                  <Grid2X2 size={16} /> CARDS
                </button>
                <button
                  className={view === "globe" ? "selected" : ""}
                  onClick={() => setView("globe")}
                  aria-pressed={view === "globe"}
                >
                  <Globe size={16} /> ORBIT
                </button>
              </div>
            </div>
            <div className="filters" aria-label="Filter projects">
              {["All", "Full-stack", "AI & Cloud", "Systems"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={filter === f ? "selected" : ""}
                >
                  {f}
                  <span>
                    {f === "All"
                      ? "05"
                      : projects
                          .filter((p) => p.category === f)
                          .length.toString()
                          .padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {view === "cards" ? (
            <div
              ref={work}
              className={
                "work-pin " + (filter !== "All" || paused ? "unpin" : "")
              }
            >
              <div ref={track} className="project-track">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    className="project-card"
                    onClick={() => openModal({ project: p })}
                    onPointerMove={(e) => {
                      if (paused) return;
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty(
                        "--tilt",
                        ((e.clientX - r.left) / r.width - 0.5) * 4 + "deg",
                      );
                    }}
                    onPointerLeave={(e) =>
                      e.currentTarget.style.setProperty("--tilt", "0deg")
                    }
                  >
                    <div
                      className="project-visual"
                      style={{ "--card-color": p.color }}
                    >
                      {p.image ? (
                        <div className="browser-preview">
                          <div className="browser-bar">
                            <span>● ● ●</span>
                            <span>guru-school.org</span>
                            <ArrowUpRight size={10} />
                          </div>
                          <img
                            src={"/assets/" + p.image}
                            alt="Guru school website homepage"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <ProjectVisual project={p} />
                      )}
                      <span className="project-number mono">
                        {p.number} / {p.category.toUpperCase()}
                      </span>
                      <span className="project-open">
                        <ArrowUpRight />
                      </span>
                    </div>
                    <div className="project-meta">
                      <div>
                        <h3>{p.title}</h3>
                        <p>{p.name}</p>
                      </div>
                      <span className="mono">{p.year}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="drag-hint mono">
                SCROLL TO EXPLORE <span>—</span> SELECT A PROJECT FOR THE STORY{" "}
                <ArrowUpRight size={13} />
              </div>
            </div>
          ) : (
            <div className="globe-section">
              <ProjectGlobe
                items={filtered}
                paused={paused}
                onSelect={(p) => openModal({ project: p })}
              />
              <div className="globe-links">
                {filtered.map((p) => (
                  <button key={p.id} onClick={() => openModal({ project: p })}>
                    {p.number} / {p.name}
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
        <section className="studio section" id="studio" data-scene="night">
          <div className="section-label">
            <span>A CLOSER LOOK / GURU</span>
            <span>THE OTHER HALF OF THE EXPERIENCE</span>
          </div>
          <div className="studio-top">
            <h2 className="display reveal">
              Beautiful outside.
              <br />
              <em>Useful inside.</em>
            </h2>
            <p>
              A public website is only half the story.
              <br />
              Here’s the workspace that keeps it moving.
            </p>
          </div>
          <div className="studio-layout">
            <div className="studio-copy">
              <div
                className="tabs"
                role="tablist"
                aria-label="Guru dashboard previews"
              >
                {["traffic", "enquiries", "news", "gallery"].map((t, i) => (
                  <button
                    role="tab"
                    id={"tab-" + t}
                    aria-controls="dashboard-panel"
                    aria-selected={tab === t}
                    tabIndex={tab === t ? 0 : -1}
                    key={t}
                    onClick={() => setTab(t)}
                    onKeyDown={(e) => {
                      const keys = ["traffic", "enquiries", "news", "gallery"];
                      if (
                        ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                          e.key,
                        )
                      ) {
                        e.preventDefault();
                        const n =
                          e.key === "Home"
                            ? 0
                            : e.key === "End"
                              ? 3
                              : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                        setTab(keys[n]);
                        document.getElementById("tab-" + keys[n]).focus();
                      }
                    }}
                  >
                    {String(i + 1).padStart(2, "0")} {t}
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
              <div
                role="tabpanel"
                id="dashboard-panel"
                aria-labelledby={"tab-" + tab}
              >
                <h3>{tabInfo[0]}</h3>
                <p>{tabInfo[2]}</p>
                <span className="mono preview-note">
                  CAPTURED INTERFACE · NOT LIVE DATA
                </span>
              </div>
            </div>
            <button
              className="admin-preview"
              onClick={() =>
                openModal({ image: tabInfo[1], title: tabInfo[0] })
              }
            >
              <div className="browser-bar">
                <span>● ● ●</span>
                <span>STAFF WORKSPACE</span>
                <Maximize2 size={14} />
              </div>
              <img
                key={tab}
                src={"/assets/" + tabInfo[1]}
                alt={tabInfo[0]}
                loading="lazy"
              />
            </button>
          </div>
          <div className="studio-bottom">
            <a
              href="https://www.guru-school.org/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Visit the live school website <ArrowUpRight />
            </a>
            <div className="studio-stats">
              <span>
                <b data-count="10">10</b> PUBLIC PAGES
              </span>
              <span>
                <b data-count="4">4</b> ADMIN WORKSPACES
              </span>
              <span>
                <b data-count="2">2</b> LANGUAGES
              </span>
            </div>
          </div>
        </section>
        <section className="about section" id="about" data-scene="paper">
          <div className="section-label">
            <span>02 / THE HUMAN</span>
            <span>MORE THAN A TERMINAL WINDOW</span>
          </div>
          <div className="about-grid">
            <div className="about-photo reveal">
              <button
                onClick={() => openModal({ photo: photos[0] })}
                aria-label="Enlarge sunrise photograph"
              >
                <img
                  src="/assets/sunrise.webp"
                  alt="Win Min Thaw sitting on a mountain at sunrise"
                  loading="lazy"
                />
                <span className="photo-stamp">
                  A LITTLE
                  <br />
                  PERSPECTIVE. <ArrowUpRight size={20} />
                </span>
              </button>
              <p className="mono">OUTSIDE THE OFFICE. STILL CURIOUS.</p>
            </div>
            <div className="about-copy">
              <h2 className="display reveal">
                Serious about systems.
                <br />
                <em>Curious about life.</em>
              </h2>
              <p className="lead reveal">
                I’m Win Min Thaw — most people call me Moosey. A systems
                engineer who also loves building the interface.
              </p>
              <p className="reveal">
                Based in Yangon, I work across banking infrastructure, cloud
                services, and full-stack development. My day-to-day spans
                production support, network troubleshooting, automation, and
                turning ideas into usable applications.
              </p>
              <p className="reveal">
                Beyond the terminal, you’ll find me exploring new places,
                playing football, or helping younger learners find their way
                into AI. I like work that connects people, and systems that make
                life a little easier.
              </p>
              <a
                className="pill solid magnetic"
                href="/Win-Min-Thaw-CV.pdf"
                target="_blank"
                rel="noreferrer"
              >
                READ MY RÉSUMÉ <Download size={17} />
              </a>
              <div className="about-note mono">
                FIRST-CLASS HONOURS · B.SC. COMPUTING
                <br />
                EDINBURGH NAPIER UNIVERSITY
              </div>
            </div>
          </div>
        </section>
        <section
          className="experience section"
          id="experience"
          data-scene="paper"
        >
          <div className="section-label">
            <span>03 / THE JOURNEY</span>
            <span>LEARNING BY DOING</span>
          </div>
          <div className="experience-layout">
            <h2 className="display reveal">
              Where I’ve
              <br />
              <em>made it work.</em>
              <Star />
            </h2>
            <div>
              {experiences.map((job, i) => (
                <details
                  key={job.company}
                  className="experience-row reveal"
                  open={i === 0}
                >
                  <summary>
                    <span className="mono job-number">0{i + 1}</span>
                    <span>
                      <small>{job.date}</small>
                      <h3>{job.company}</h3>
                      <p>{job.role}</p>
                    </span>
                    <Plus className="detail-plus" />
                  </summary>
                  <div className="job-detail">
                    <p>{job.copy}</p>
                    <span className="mono">{job.tech}</span>
                  </div>
                </details>
              ))}
            </div>
          </div>
          <div className="education">
            <div className="section-label">
              <span>EDUCATION & CONTINUOUS LEARNING</span>
              <span>THE FOUNDATION</span>
            </div>
            <div className="education-grid">
              <article className="reveal">
                <span className="mono">2023 — 2025</span>
                <h3>B.Sc. (Hons) Computing</h3>
                <p>Edinburgh Napier University</p>
                <b>First-Class Honours</b>
              </article>
              <article className="reveal">
                <span className="mono">2020 — 2023</span>
                <h3>HNC / HND in Computing</h3>
                <p>Info Myanmar College · Pearson</p>
                <b>Merit</b>
              </article>
              <article className="reveal">
                <span className="mono">ALWAYS LEARNING</span>
                <h3>Systems, cloud & AI</h3>
                <p>
                  ITIL, ESXi, AWS SAA, Red Hat Linux, Google Cloud AI, and
                  Generative AI coursework listed in my CV.
                </p>
                <a href="/Win-Min-Thaw-CV.pdf" target="_blank" rel="noreferrer">
                  View qualifications in résumé <ArrowUpRight size={14} />
                </a>
              </article>
            </div>
          </div>
        </section>
        <section className="stack section" id="stack" data-scene="night">
          <div className="section-label">
            <span>04 / MY TOOLKIT</span>
            <span>THE RIGHT TOOL. THE RIGHT REASON.</span>
          </div>
          <div className="stack-layout">
            <div>
              <h2 className="display reveal">
                Different layers.
                <br />
                <em>One connected stack.</em>
              </h2>
              <div className="stack-groups">
                {[
                  [
                    "server",
                    "Systems & security",
                    "Windows Server · Linux · VMware · Hyper-V · Fortinet · Check Point · Zabbix",
                  ],
                  [
                    "cloud",
                    "Cloud & delivery",
                    "AWS · Huawei Cloud · GCP · Azure · Docker · Terraform · CI/CD",
                  ],
                  [
                    "code",
                    "Applications & data",
                    "Python · React · FastAPI · Flask · PostgreSQL · MongoDB · TensorFlow",
                  ],
                ].map(([icon, title, text]) => (
                  <div className="stack-group reveal" key={title}>
                    <Icon name={icon} />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="skill-cloud-wrap">
              <SkillCloud paused={paused} />
              <span className="mono">DRAG TO ROTATE · CLICK TO FOCUS</span>
              <div className="skill-accessible">
                {skills.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="process section" data-scene="paper">
          <div className="section-label">
            <span>HOW I THINK</span>
            <span>FROM AN IDEA TO EVERYDAY USE</span>
          </div>
          <h2 className="display reveal">
            The work between
            <br />
            <em>“what if” and “it works”.</em>
          </h2>
          <div className="process-grid">
            {[
              [
                "01",
                "Understand the system.",
                "Start with the people, the constraints, and the job that needs doing.",
              ],
              [
                "02",
                "Build the connection.",
                "Bring the interface, services, data, and infrastructure together.",
              ],
              [
                "03",
                "Keep making it better.",
                "Monitor, investigate, automate, and learn from how people actually use it.",
              ],
            ].map(([n, t, c]) => (
              <article className="reveal" key={n}>
                <span className="mono">{n}</span>
                <h3>{t}</h3>
                <p>{c}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="playground section"
          id="playground"
          data-scene="paper"
        >
          <div className="section-label">
            <span>05 / OFF THE CLOCK</span>
            <span>A SMALL WINDOW INTO MY WORLD</span>
          </div>
          <div className="heading-row">
            <h2 className="display reveal">
              Leave room
              <br />
              <em>to play.</em>
            </h2>
            <button
              className="pill"
              onClick={() => openModal({ playground: true })}
            >
              ENTER THE CANVAS <Maximize2 size={16} />
            </button>
          </div>
          <div className="photo-orbit" aria-label="Personal photo gallery">
            {photos.slice(0, 5).map((p, i) => (
              <button
                key={p.src}
                style={{ "--i": i, "--angle": (i - 2) * 7 + "deg" }}
                className="orbit-photo"
                onClick={() => openModal({ photo: p })}
              >
                <img loading="lazy" src={"/assets/" + p.src} alt={p.label} />
                <span className="mono">
                  0{i + 1} / {p.label}
                </span>
              </button>
            ))}
          </div>
          <div className="playground-bottom">
            <span className="mono">PHOTOGRAPHS, NOT PERFECT POSES.</span>
            <p>
              Mountain mornings. Football evenings.
              <br />A little life between the deployments.
            </p>
          </div>
        </section>
        <section className="contact section" id="contact" data-scene="night">
          <div className="section-label">
            <span>HAVE SOMETHING IN MIND?</span>
            <span>LET’S CONNECT THE DOTS.</span>
          </div>
          <div className="contact-title">
            <h2>
              Good things
              <br />
              start with <em>hello.</em>
            </h2>
            <a
              href={"mailto:" + profile.email}
              className="contact-arrow magnetic"
              aria-label="Email Win Min Thaw"
            >
              <ArrowUpRight />
            </a>
          </div>
          <div className="contact-main">
            <div>
              <a className="email-link" href={"mailto:" + profile.email}>
                {profile.email}
              </a>
              <button
                onClick={copy}
                className="copy-button"
                aria-label="Copy email address"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
              <p>
                Systems, cloud, a new digital experience —<br />
                I’d love to hear what you’re working on.
              </p>
              <span role="status" className="mono">
                {copied ? "EMAIL COPIED. SAY HELLO!" : ""}
              </span>
            </div>
            <div
              className="contact-dial"
              onPointerMove={(e) => {
                if (paused) return;
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty(
                  "--dial",
                  ((e.clientX - r.left) / r.width - 0.5) * 18 + "deg",
                );
              }}
              onPointerLeave={(e) =>
                e.currentTarget.style.setProperty("--dial", "0deg")
              }
            >
              <Star className="dial-star" />
              {[
                [Github, profile.github, "GitHub"],
                [Linkedin, profile.linkedin, "LinkedIn"],
                [Instagram, profile.instagram, "Instagram"],
              ].map(([I, url, label], i) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={"dial-link dial-" + i}
                  aria-label={label}
                >
                  <I size={21} />
                  <span>{label}</span>
                </a>
              ))}
              <a
                className="dial-link dial-3"
                href={"mailto:" + profile.email}
                aria-label="Email"
              >
                <ArrowUpRight size={24} />
                <span>Email</span>
              </a>
            </div>
          </div>
          <div className="social-row">
            {[
              ["GitHub", profile.github],
              ["LinkedIn", profile.linkedin],
              ["Instagram", profile.instagram],
              ["Facebook", profile.facebook],
            ].map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer">
                <span className="rolling">
                  <span>{name}</span>
                  <span aria-hidden="true">{name}</span>
                </span>
                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
          <div className="theme-row">
            <div>
              <span className="mono">MAKE YOURSELF AT HOME.</span>
              <p>Choose your atmosphere.</p>
            </div>
            <div className="theme-swatches">
              {["paper", "night", "sage", "cobalt", "rose"].map((t) => (
                <button
                  className={"swatch swatch-" + t}
                  key={t}
                  title={t}
                  aria-label={"Use " + t + " theme"}
                  aria-pressed={!auto && theme === t}
                  onClick={(e) => changeTheme(t, e)}
                >
                  {!auto && theme === t ? <Check size={16} /> : null}
                </button>
              ))}
              <button
                className={"auto-theme " + (auto ? "selected" : "")}
                aria-pressed={auto}
                onClick={() => setAuto(!auto)}
              >
                AUTO
              </button>
            </div>
            <button
              className="motion-control mono"
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />} MOTION{" "}
              {paused ? "OFF" : "ON"}
            </button>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-upper mono">
          <span>WIN MIN THAW / YANGON, MYANMAR</span>
          <span>{clock} MMT</span>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("#home");
            }}
          >
            BACK TO THE TOP <ArrowUp size={15} />
          </a>
        </div>
        <div className="footer-word">
          <span>moosey</span>
          <button
            aria-label="Change footer symbol"
            onClick={() => setLogoIndex((logoIndex + 1) % 3)}
          >
            {logoIndex === 0 ? (
              <Star />
            ) : logoIndex === 1 ? (
              <Command />
            ) : (
              <Globe />
            )}
          </button>
        </div>
        <div className="footer-bottom mono">
          <span>© {new Date().getFullYear()} WIN MIN THAW</span>
          <span>BUILT WITH CARE. ALWAYS EVOLVING.</span>
          <button onClick={() => setCommand(true)}>
            QUICK NAV <kbd>⌘ K</kbd>
          </button>
        </div>
      </footer>
      <div ref={cursor} className="custom-cursor" aria-hidden="true">
        <MoveUpRight size={18} />
        <span>moosey</span>
      </div>
      <button
        className={"back-top " + (progress > 0.12 ? "visible" : "")}
        aria-label="Back to top"
        onClick={() => go("#home")}
      >
        <ArrowUp size={18} />
      </button>
      <button
        className="command-fab"
        aria-label="Open quick navigation"
        onClick={() => setCommand(true)}
      >
        <Command size={17} />
      </button>
      <div className="scroll-rail" aria-label="Page scroll control">
        <input
          type="range"
          min="0"
          max="1000"
          value={Math.round(progress * 1000)}
          aria-label="Scroll position"
          onChange={(e) => {
            const y =
              (Number(e.target.value) / 1000) *
              (document.documentElement.scrollHeight - innerHeight);
            if (lenis.current) lenis.current.scrollTo(y, { immediate: true });
            else scrollTo(0, y);
          }}
        />
      </div>
      <Presence open={chat} setOpen={setChat} paused={paused} />
      {command && (
        <div className="command-overlay" onClick={() => setCommand(false)}>
          <div
            className="command-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-head">
              <Terminal size={18} />
              <span>moosey / quick navigation</span>
              <button
                autoFocus
                onClick={() => setCommand(false)}
                aria-label="Close quick navigation"
              >
                <X size={20} />
              </button>
            </div>
            {[
              ["Selected work", "#work"],
              ["About Moosey", "#about"],
              ["Experience", "#experience"],
              ["Toolkit", "#stack"],
              ["Playground", "#playground"],
              ["Contact", "#contact"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => go(id)}>
                {label}
                <ArrowUpRight size={18} />
              </button>
            ))}
            <a href="/Win-Min-Thaw-CV.pdf" target="_blank" rel="noreferrer">
              Open résumé <Download size={17} />
            </a>
          </div>
        </div>
      )}
      <dialog
        ref={dialog}
        className={
          "detail-dialog " + (modal?.playground ? "canvas-dialog" : "")
        }
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModal(null);
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close preview"
          onClick={() => {
            dialog.current.close();
            setModal(null);
          }}
        >
          <X size={23} />
        </button>
        {modal?.project && (
          <div className="project-detail">
            <span className="eyebrow">
              {modal.project.category} / {modal.project.year}
            </span>
            <h2>{modal.project.name}</h2>
            <p className="detail-lead">{modal.project.summary}</p>
            <div
              className="detail-visual"
              style={{ "--card-color": modal.project.color }}
            >
              {modal.project.image ? (
                <img
                  src={
                    "/assets/" +
                    (darkPreview ? modal.project.dark : modal.project.image)
                  }
                  alt="Guru homepage preview"
                />
              ) : (
                <ProjectVisual project={modal.project} />
              )}
            </div>
            {modal.project.dark && (
              <button
                className="pill"
                onClick={() => setDarkPreview(!darkPreview)}
              >
                {darkPreview ? <Sun size={16} /> : <Moon size={16} />}{" "}
                {darkPreview ? "Light" : "Dark"} screenshot
              </button>
            )}
            <p>{modal.project.detail}</p>
            <h3>My contribution</h3>
            <ul>
              {modal.project.contribution.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="tags">
              {modal.project.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {modal.project.link ? (
              <a
                className="pill solid"
                href={modal.project.link}
                target="_blank"
                rel="noreferrer"
              >
                VISIT LIVE PROJECT <ExternalLink size={16} />
              </a>
            ) : (
              <p className="detail-note">
                {modal.project.private
                  ? "Professional work · Internal systems and client data are not publicly accessible."
                  : "Academic project · Summary based on my CV."}{" "}
                The visual above is an illustrative concept, not a product
                screenshot.
              </p>
            )}
          </div>
        )}
        {modal?.photo && (
          <figure className="photo-detail">
            <img src={"/assets/" + modal.photo.src} alt={modal.photo.label} />
            <figcaption>{modal.photo.label}</figcaption>
          </figure>
        )}
        {modal?.image && (
          <figure className="photo-detail">
            <img src={"/assets/" + modal.image} alt={modal.title} />
            <figcaption>{modal.title}</figcaption>
          </figure>
        )}
        {modal?.playground && (
          <PhotoPlayground
            paused={paused}
            onSelect={(p) => setModal({ photo: p })}
          />
        )}
      </dialog>
      <svg className="svg-defs" aria-hidden="true">
        <filter id="goo">
          <feGaussianBlur stdDeviation="6" />
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8" />
        </filter>
      </svg>
    </div>
  );
}
function ProjectVisual({ project: p }) {
  return (
    <div
      className={"concept concept-" + p.visual}
      aria-label={"Illustrative concept for " + p.name}
    >
      <span className="concept-label mono">
        {p.visual === "infra"
          ? "SYSTEM MAP"
          : p.visual === "lms"
            ? "LEARNING WORKSPACE"
            : "PROJECT CONCEPT"}
      </span>
      {p.visual === "lms" ? (
        <>
          <div className="mini-sidebar">
            <span>t.</span>
            <i />
            <i />
            <i />
          </div>
          <div className="mini-lms">
            <span className="mono">A LITTLE MORE POSSIBLE.</span>
            <h4>
              Make room
              <br />
              for discovery.
            </h4>
            <div className="mini-progress">
              <span />
              <span />
              <span />
            </div>
            <div className="lms-bottom">
              <span>
                01
                <br />
                <b>Learn</b>
              </span>
              <span>
                02
                <br />
                <b>Explore</b>
              </span>
              <span>
                03
                <br />
                <b>Grow</b>
              </span>
            </div>
          </div>
        </>
      ) : p.visual === "stream" ? (
        <>
          <span className="stream-brand">
            streamflix<span>✳</span>
          </span>
          <div className="movie-posters">
            <div>
              BEYOND
              <br />
              <b>THE FRAME</b>
            </div>
            <div>
              AFTER
              <br />
              <b>HOURS</b>
            </div>
            <div>
              INTO
              <br />
              <b>THE BLUE</b>
            </div>
          </div>
          <p className="mono">YOUR NEXT STORY STARTS HERE.</p>
        </>
      ) : p.visual === "sign" ? (
        <>
          <div className="hand-map">
            <Hand strokeWidth={0.8} />
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} style={{ "--n": i }} />
            ))}
          </div>
          <span className="sign-caption">
            A gesture.
            <br />
            <em>A connection.</em>
          </span>
          <div className="scan-line" />
        </>
      ) : (
        <>
          <div className="infra-node node-cloud">
            <Cloud />
            <span>CLOUD</span>
          </div>
          <div className="infra-connector" />
          <div className="infra-nodes">
            {["API", "SERVICES", "DATA"].map((s) => (
              <div className="infra-node" key={s}>
                <Server />
                <span>{s}</span>
                <i />
              </div>
            ))}
          </div>
          <p className="mono infra-label">OBSERVE → INVESTIGATE → IMPROVE</p>
        </>
      )}
      <span className="concept-disclaimer mono">ILLUSTRATIVE CONCEPT</span>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
