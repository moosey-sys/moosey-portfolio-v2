import React, { useState } from "react";
import {
  ArrowUpRight,
  Code2,
  Server,
  BookOpen,
  Database,
  Cloud,
  Monitor,
} from "lucide-react";
import "./story.css";

const modes = [
  {
    name: "Build",
    icon: Code2,
    title: "Make the complex feel simple.",
    text: "From a school website to AI learning services, I connect responsive interfaces with the APIs and data behind them.",
    proof: "Guru International School · Tiny Equations",
    href: "#work",
    link: "Explore my projects",
  },
  {
    name: "Operate",
    icon: Server,
    title: "Understand what keeps it running.",
    text: "My systems work spans Windows and Linux infrastructure, service monitoring, networking, and selected cloud migrations.",
    proof: "CB Bank · NTT DATA Myanmar",
    href: "#experience",
    link: "Explore my experience",
  },
  {
    name: "Teach",
    icon: BookOpen,
    title: "Make technology approachable.",
    text: "At Candellar, I develop and deliver GenAI curriculum for learners aged 8–14 through visual storytelling and hands-on activities.",
    proof: "Candellar · AI education",
    href: "#experience",
    link: "Explore my teaching role",
  },
];
const layers = [
  {
    name: "Interface",
    icon: Monitor,
    label: "Where people begin",
    text: "Responsive pages, accessible navigation, and clear workflows. My frontend work turns application features into something people can use.",
    tools: "React · responsive interfaces",
    evidence: "See Guru",
    href: "#case-study",
  },
  {
    name: "API",
    icon: Code2,
    label: "Where features connect",
    text: "At Tiny Equations, I contribute Python/FastAPI services and integrations for authentication, document processing, and assessment workflows.",
    tools: "Python · FastAPI · integrations",
    evidence: "Explore projects",
    href: "#work",
  },
  {
    name: "Data",
    icon: Database,
    label: "Where information lives",
    text: "My experience includes Cloud SQL integration for learning services, MongoDB in academic applications, and PostgreSQL service investigation in systems work.",
    tools: "Cloud SQL · MongoDB · PostgreSQL",
    evidence: "View experience",
    href: "#experience",
  },
  {
    name: "Cloud",
    icon: Cloud,
    label: "Where systems run",
    text: "I connect application services with GCP and contribute to selected AWS and Huawei Cloud migrations in my infrastructure role.",
    tools: "GCP · AWS · Huawei Cloud",
    evidence: "View experience",
    href: "#experience",
  },
  {
    name: "Operations",
    icon: Server,
    label: "Where reliability continues",
    text: "Windows and Linux support, Zabbix monitoring, network troubleshooting, and administrative automation connect my development work to real operations.",
    tools: "Linux · Zabbix · PowerShell",
    evidence: "View my toolkit",
    href: "#stack",
  },
];
function keyboardTabs(event, index, length, setter) {
  const next =
    event.key === "ArrowRight"
      ? (index + 1) % length
      : event.key === "ArrowLeft"
        ? (index + length - 1) % length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? length - 1
            : null;
  if (next !== null) {
    event.preventDefault();
    setter(next);
    event.currentTarget.parentElement
      .querySelectorAll("[role=tab]")
      [next].focus();
  }
}
export function EngineeringStory() {
  const [mode, setMode] = useState(0),
    [layer, setLayer] = useState(0);
  const selected = modes[mode],
    node = layers[layer];
  return (
    <section
      className="engineering-story section"
      id="approach"
      data-scene="paper"
    >
      <div className="section-label">
        <span>ONE ENGINEER / THREE PERSPECTIVES</span>
        <span>HOW I CONTRIBUTE</span>
      </div>
      <div className="perspective-layout">
        <div>
          <h2 className="display">
            Good software.
            <br />
            <em>The whole picture.</em>
          </h2>
          <div
            className="perspective-tabs"
            role="tablist"
            aria-label="Ways I work"
          >
            {modes.map((m, i) => (
              <button
                key={m.name}
                role="tab"
                id={`perspective-${i}`}
                aria-controls="perspective-panel"
                aria-selected={i === mode}
                tabIndex={i === mode ? 0 : -1}
                onKeyDown={(e) => keyboardTabs(e, i, modes.length, setMode)}
                onClick={() => setMode(i)}
              >
                <m.icon size={18} />
                {m.name}
              </button>
            ))}
          </div>
        </div>
        <div
          id="perspective-panel"
          role="tabpanel"
          aria-labelledby={`perspective-${mode}`}
          tabIndex={0}
          className="perspective-copy"
        >
          <span className="mono">
            0{mode + 1} / {selected.name.toUpperCase()}
          </span>
          <h3>{selected.title}</h3>
          <p>{selected.text}</p>
          <small>{selected.proof}</small>
          <a href={selected.href}>
            {selected.link}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <div className="system-map">
        <div className="map-heading">
          <h3>Follow the connection.</h3>
          <p>
            A map of my experience across the stack.
            <br />
            Choose a layer to explore.
          </p>
        </div>
        <div
          className="system-nodes"
          role="tablist"
          aria-label="Engineering layers"
        >
          {layers.map((l, i) => (
            <button
              key={l.name}
              id={`layer-${i}`}
              role="tab"
              aria-controls="layer-panel"
              aria-selected={layer === i}
              tabIndex={layer === i ? 0 : -1}
              onKeyDown={(e) => keyboardTabs(e, i, layers.length, setLayer)}
              onClick={() => setLayer(i)}
            >
              <span className="node-orb">
                <l.icon size={25} />
              </span>
              <span>{l.name}</span>
              <small className="mono">0{i + 1}</small>
            </button>
          ))}
        </div>
        <div
          id="layer-panel"
          role="tabpanel"
          aria-labelledby={`layer-${layer}`}
          tabIndex={0}
          className="layer-detail"
        >
          <div>
            <span className="mono">{node.tools}</span>
            <h4>{node.label}</h4>
          </div>
          <div>
            <p>{node.text}</p>
            <a href={node.href}>
              {node.evidence}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <p className="map-caption mono">
          EXPERIENCE MAP · NOT A CLIENT'S PRODUCTION ARCHITECTURE
        </p>
      </div>
    </section>
  );
}
export function CaseStory() {
  return (
    <section className="case-story section" id="case-study" data-scene="paper">
      <div className="section-label">
        <span>IN FOCUS / GURU INTERNATIONAL SCHOOL</span>
        <span>PUBLIC WEBSITE + STAFF WORKSPACE</span>
      </div>
      <div className="case-intro">
        <h2 className="display">
          Two audiences.
          <br />
          <em>One connected school.</em>
        </h2>
        <p>
          A closer look at the public-facing experience and the tools behind the
          content.
        </p>
      </div>
      <a className="case-image" href="#studio">
        <img
          src="/assets/home-light.jpg"
          alt="Guru International School public website with school information and navigation"
          loading="lazy"
        />
        <span>
          EXPLORE THE WORKSPACE <ArrowUpRight size={18} />
        </span>
      </a>
      <div className="case-chapters">
        {[
          [
            "01 / THE NEED",
            "A clear front door.",
            "Families need to explore school information, while staff need a practical place to manage enquiries, news, and gallery content.",
          ],
          [
            "02 / MY CONTRIBUTION",
            "Connect both experiences.",
            "My work includes the responsive public interface, English and Myanmar content support, and dashboard previews for traffic, enquiries, news, and gallery management.",
          ],
          [
            "03 / THE RESULT",
            "Something you can explore.",
            "The portfolio documents 10 public pages, four admin workspaces, and two languages. Explore the screenshots and public site to see the work in context.",
          ],
        ].map(([label, title, text]) => (
          <article key={label}>
            <span className="mono">{label}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <a
        className="story-link"
        href="https://www.guru-school.org/"
        target="_blank"
        rel="noreferrer"
      >
        Visit the school website <ArrowUpRight size={18} />
      </a>
    </section>
  );
}
export function PersonalStory({ onPhoto }) {
  const pictures = [
    {
      src: "aquarium.jpeg",
      label: "A different perspective.",
      caption: "01 / CURIOSITY",
      alt: "Win Min Thaw looking into a blue aquarium",
    },
    {
      src: "graduation.jpeg",
      label: "A chapter worth celebrating.",
      caption: "02 / THE FOUNDATION",
      alt: "Win Min Thaw in graduation robes holding his certificate",
    },
    {
      src: "city.jpeg",
      label: "Life, in motion.",
      caption: "03 / OFF THE CLOCK",
      alt: "Win Min Thaw walking through a red interior",
    },
  ];
  return (
    <section className="personal-story section" id="outside" data-scene="paper">
      <div className="section-label">
        <span>OFF THE CLOCK</span>
        <span>A FEW FRAMES OF MY WORLD</span>
      </div>
      <div className="personal-heading">
        <h2 className="display">
          There’s a person
          <br />
          <em>behind the systems.</em>
        </h2>
        <p>
          Learning, exploring, and making room for life outside the terminal.
        </p>
      </div>
      <div className="personal-frames">
        {pictures.map((p) => (
          <figure key={p.src}>
            <button
              onClick={() => onPhoto(p)}
              aria-label={`Enlarge: ${p.label}`}
            >
              <img
                src={`/assets/${p.src}`}
                alt={p.alt}
                loading="lazy"
                width="1290"
                height="1770"
              />
              <ArrowUpRight size={22} />
            </button>
            <figcaption>
              <small className="mono">{p.caption}</small>
              <h3>{p.label}</h3>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="now-note">
        <span className="mono">NOW / OCTOBER 2026</span>
        <p>
          Supporting banking infrastructure. Building AI learning services.
          Helping younger learners explore GenAI.
        </p>
        <a href="#experience">
          The work behind the update <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}
