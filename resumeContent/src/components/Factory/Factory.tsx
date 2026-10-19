// src/components/Factory/Factory.tsx
// Play-mode home: the career as a Factorio-style factory. Layout comes from
// utils/factoryModel.ts; this file draws it and makes it playable.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quests from '../../data/quests.data';
import { labels } from '../../data/labels';
import { factoryLabels } from '../../data/factory.data';
import { buildFactory, FactoryLane, FactoryMachine } from '../../utils/factoryModel';
import './Factory.css';

type Selection =
  | { kind: 'machine'; questId: number }
  | { kind: 'lane'; laneId: string }
  | { kind: 'ore' | 'silo' | 'lab' }
  | null;

interface View {
  scale: number;
  tx: number;
  ty: number;
}

const SPEEDS = [0, 1, 2, 4];
const BASE_SPEED = 55; // floor units per second at 1x
const MIN_SCALE = 0.25;
const MAX_SCALE = 3;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);

const Factory: React.FC = () => {
  const navigate = useNavigate();
  const model = useMemo(() => buildFactory(quests), []);
  const play = labels.play;

  const [speed, setSpeed] = useState(() => (prefersReducedMotion() ? 0 : 1));
  const [altMode, setAltMode] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [selection, setSelection] = useState<Selection>(null);
  const [view, setView] = useState<View>({ scale: 1, tx: 0, ty: 0 });

  const viewportRef = useRef<HTMLDivElement>(null);
  const routeRefs = useRef<Record<string, SVGPathElement | null>>({});
  const itemRefs = useRef<Record<string, (SVGRectElement | null)[]>>({});
  const shippedRef = useRef<SVGTextElement>(null);
  const researchedRef = useRef<SVGTextElement>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // ---------- view: fit, zoom, pan ----------
  // The floor is much wider than tall. Fit shows all of it; the opening view
  // fits the height instead and starts at the ore field, so the career reads
  // left to right at a size you can read.
  const fit = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const scale = Math.min(width / model.width, height / model.height) * 0.96;
    setView({
      scale,
      tx: (width - model.width * scale) / 2,
      ty: (height - model.height * scale) / 2,
    });
  }, [model]);

  const fitHeight = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const scale = Math.max(
      Math.min(width / model.width, height / model.height) * 0.96,
      Math.min(1.1, (height / model.height) * 0.96),
    );
    setView({ scale, tx: 8, ty: (height - model.height * scale) / 2 });
  }, [model]);

  useEffect(() => {
    fitHeight();
    window.addEventListener('resize', fitHeight);
    return () => window.removeEventListener('resize', fitHeight);
  }, [fitHeight]);

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = cx ?? rect.width / 2;
    const py = cy ?? rect.height / 2;
    setView((v) => {
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
      const k = scale / v.scale;
      return { scale, tx: px - (px - v.tx) * k, ty: py - (py - v.ty) * k };
    });
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  // Drag to pan with one pointer, pinch to zoom with two.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragDistance = useRef(0);
  const pinchStart = useRef<number | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragDistance.current = 0;
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinchStart.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);
    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = viewportRef.current!.getBoundingClientRect();
      zoomAt(dist / pinchStart.current, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
      pinchStart.current = dist;
      dragDistance.current += 10;
      return;
    }
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    dragDistance.current += Math.abs(dx) + Math.abs(dy);
    if (dragDistance.current > 4) {
      if (!viewportRef.current!.hasPointerCapture(e.pointerId)) {
        viewportRef.current!.setPointerCapture(e.pointerId);
      }
      setView((v) => ({ ...v, tx: v.tx + dx, ty: v.ty + dy }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  };

  // A click at the end of a drag is not a click.
  const clickGuard = (fn: () => void) => () => {
    if (dragDistance.current <= 4) fn();
  };

  const openQuest = useCallback((id: number) => navigate(`/quests/${id}`), [navigate]);

  // ---------- belt items: one animation loop, no React renders ----------
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let travelled = 0;
    let shipped = model.totals.products;
    let researched = model.totals.science;
    const lastPos: Record<string, number[]> = {};

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      travelled += dt * BASE_SPEED * speedRef.current;
      model.routes.forEach((route) => {
        const path = routeRefs.current[route.id];
        const items = itemRefs.current[route.id];
        if (!path || !items) return;
        const length = path.getTotalLength();
        const prev = lastPos[route.id] ?? [];
        items.forEach((rect, i) => {
          if (!rect) return;
          const pos = (travelled + (i * length) / items.length) % length;
          if (prev[i] !== undefined && pos < prev[i]) {
            if (route.kind === 'products') shipped += 1;
            if (route.kind === 'science') researched += 1;
          }
          prev[i] = pos;
          const p = path.getPointAtLength(pos);
          rect.setAttribute('transform', `translate(${p.x - 3.5} ${p.y - 3.5})`);
        });
        lastPos[route.id] = prev;
      });
      if (shippedRef.current) shippedRef.current.textContent = `${shipped} shipped`;
      if (researchedRef.current) researchedRef.current.textContent = `${researched} researched`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [model]);

  // ---------- keyboard ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const onButton =
        e.target instanceof Element &&
        (e.target.tagName === 'BUTTON' || e.target.getAttribute('role') === 'button');
      switch (e.key) {
        case 'Alt':
          e.preventDefault();
          if (!e.repeat) setAltMode((a) => !a);
          break;
        case ' ':
          if (onButton) return;
          e.preventDefault();
          setSpeed((s) => (s === 0 ? 1 : 0));
          break;
        case '1': case '2': case '3':
          setSpeed(SPEEDS[Number(e.key)]);
          break;
        case 'p': case 'P':
          setStatsOpen((o) => !o);
          break;
        case '+': case '=':
          zoomAt(1.2);
          break;
        case '-': case '_':
          zoomAt(1 / 1.2);
          break;
        case '0':
          fit();
          break;
        case 'ArrowLeft': case 'ArrowRight': case 'ArrowUp': case 'ArrowDown': {
          if (onButton) return;
          e.preventDefault();
          const step = 60;
          const dx = e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0;
          const dy = e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0;
          setView((v) => ({ ...v, tx: v.tx + dx, ty: v.ty + dy }));
          break;
        }
        case 'Escape':
          setSelection(null);
          setStatsOpen(false);
          break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [fit, zoomAt]);

  // ---------- lookups for drawing ----------
  const laneById = useMemo(
    () => new Map(model.lanes.map((l) => [l.id, l])),
    [model],
  );
  const itemColor = useMemo(() => {
    const map = new Map<string, string>();
    model.lanes.forEach((l) => l.kind === 'skill' && map.set(l.item, l.color));
    return map;
  }, [model]);

  const selectedLaneId = selection?.kind === 'lane' ? selection.laneId : null;
  const selectedQuest = selection?.kind === 'machine' ? selection.questId : null;
  const highlighted = (lane: FactoryLane) =>
    selectedLaneId === lane.id ||
    (selectedQuest !== null && lane.stops.some((s) => s.questId === selectedQuest));

  const maxCount = Math.max(...model.machines.flatMap((m) => [m.products, m.science]));
  const barWidth = (n: number) => Math.round((n / maxCount) * 48);

  const running = speed > 0;
  const beltDuration = running ? `${1.2 / speed}s` : '1s';

  // ---------- render ----------
  const renderMachine = (m: FactoryMachine) => {
    const active = selectedQuest === m.questId;
    const years = m.startYear === Number(m.endLabel) ? `${m.startYear}` : `${m.startYear} to ${m.endLabel}`;
    const sharedRecipe = m.recipe.filter((r) => r.shared);
    return (
      <g
        key={m.questId}
        className={`factory-machine ${m.row} ${active ? 'active' : ''}`}
        transform={`translate(${m.x} ${m.y})`}
        role="button"
        tabIndex={0}
        aria-label={`${m.retroTitle}. ${m.name}, ${years}. ${m.products} accomplishments, ${m.science} learnings. Press Enter to open the quest.`}
        onClick={clickGuard(() => openQuest(m.questId))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openQuest(m.questId);
          }
        }}
        onMouseEnter={() => setSelection({ kind: 'machine', questId: m.questId })}
        onFocus={() => setSelection({ kind: 'machine', questId: m.questId })}
      >
        <rect className="machine-body" width={m.w} height={m.h} rx={4} />
        <rect className="machine-inset" x={6} y={6} width={m.w - 12} height={m.h - 12} rx={2} />
        <g className="machine-gear" transform={`translate(${m.w - 20} 20)`}>
          <g className="gear-spin">
            {[0, 45, 90, 135].map((a) => (
              <rect key={a} x={-2} y={-11} width={4} height={22} transform={`rotate(${a})`} />
            ))}
            <circle r={7} />
            <circle className="gear-hole" r={2.5} />
          </g>
        </g>
        <text className={`machine-name ${m.name.length > 10 ? "long" : ""}`} x={10} y={22}>{m.name}</text>
        <text className="machine-years" x={10} y={38}>{years}</text>
        {altMode ? (
          <g className="machine-recipe">
            {sharedRecipe.map((r, i) => (
              <rect
                key={r.item}
                x={10 + i * 12}
                y={48}
                width={9}
                height={9}
                fill={itemColor.get(r.item)}
              />
            ))}
            <text x={10} y={76}>{`${m.products} acc  ${m.science} learn`}</text>
          </g>
        ) : (
          <text className="machine-role" x={10} y={76}>
            {m.role.length > 22 ? `${m.role.slice(0, 21)}.` : m.role}
          </text>
        )}
        <rect className={`machine-status ${running ? 'on' : ''}`} x={m.w - 14} y={m.h - 14} width={7} height={7} />
      </g>
    );
  };

  const inspector = (() => {
    if (!selection) {
      return (
        <>
          <h2>{factoryLabels.title}</h2>
          <p>Every machine is a quest. Belts carry skills from the job where they first showed up to every later job that used them again.</p>
          <p className="hint">Hover or Tab to inspect. Click or Enter to open a quest. Drag to pan, scroll to zoom.</p>
        </>
      );
    }
    if (selection.kind === 'machine') {
      const m = model.machines.find((x) => x.questId === selection.questId)!;
      return (
        <>
          <h2>{m.retroTitle}</h2>
          <p className="sub">{m.name}, {m.startYear} to {m.endLabel}</p>
          <p className="sub">{m.role}</p>
          <h3>Recipe</h3>
          <ul className="recipe">
            <li><span className="chip" style={{ background: laneById.get('ore')!.color }} />{factoryLabels.ore}</li>
            {m.recipe.map((r) => (
              <li key={r.tag} className={r.shared ? 'shared' : ''}>
                <span className="chip" style={{ background: itemColor.get(r.item) ?? '#555' }} />
                {r.tag}
              </li>
            ))}
          </ul>
          <h3>Output</h3>
          <p>{m.products} accomplishments, {m.science} learnings</p>
          <button onClick={() => openQuest(m.questId)}>Open quest</button>
        </>
      );
    }
    if (selection.kind === 'lane') {
      const lane = laneById.get(selection.laneId)!;
      if (lane.kind !== 'skill') {
        return (
          <>
            <h2>{lane.item}</h2>
            <p>{lane.kind === 'ore'
              ? 'Raw input to every machine.'
              : lane.kind === 'products'
                ? 'Every machine ships its accomplishments to the silo.'
                : 'Every machine sends its learnings to the lab.'}</p>
          </>
        );
      }
      const [first, ...rest] = lane.stops;
      return (
        <>
          <h2><span className="chip" style={{ background: lane.color }} />{lane.item}</h2>
          <p className="sub">First made at {first.name} ({first.year})</p>
          <h3>Carried to</h3>
          <ul className="recipe">
            {rest.map((s) => (
              <li key={s.questId}>
                <button className="link" onClick={() => openQuest(s.questId)}>{s.name} ({s.year})</button>
                {s.tag !== lane.item && <span className="sub"> as {s.tag}</span>}
              </li>
            ))}
          </ul>
        </>
      );
    }
    const copy = {
      ore: [factoryLabels.ore, `${factoryLabels.oreSub}. The raw input every machine consumes.`],
      silo: [factoryLabels.silo, `Where ${model.totals.products} accomplishments ship. Launch it to open the ${play.resume.toLowerCase()}.`],
      lab: [factoryLabels.lab, `${model.totals.science} learnings, one per lesson worth keeping. Open ${play.accomplishments} to read them.`],
    }[selection.kind];
    return (
      <>
        <h2>{copy[0]}</h2>
        <p>{copy[1]}</p>
      </>
    );
  })();

  return (
    <div className={`factory ${running ? 'running' : 'paused'} ${altMode ? 'alt' : ''}`}
      style={{ ['--belt-duration' as string]: beltDuration } as React.CSSProperties}>
      <div className="factory-toolbar" role="toolbar" aria-label="Factory controls">
        <span className="factory-title">{factoryLabels.title}</span>
        <div className="factory-group" role="group" aria-label="Game speed">
          {SPEEDS.map((s, i) => (
            <button
              key={s}
              className={speed === s ? 'on' : ''}
              aria-pressed={speed === s}
              title={`${s === 0 ? 'Pause' : `${s}x`} (${i === 0 ? 'Space' : i})`}
              onClick={() => setSpeed(s)}
            >
              {s === 0 ? '||' : `${s}x`}
            </button>
          ))}
        </div>
        <div className="factory-group">
          <button className={altMode ? 'on' : ''} aria-pressed={altMode} title="Show recipes (Alt)" onClick={() => setAltMode((a) => !a)}>Alt</button>
          <button className={statsOpen ? 'on' : ''} aria-pressed={statsOpen} title="Production stats (P)" onClick={() => setStatsOpen((o) => !o)}>P</button>
        </div>
        <div className="factory-group" role="group" aria-label="Zoom">
          <button title="Zoom out (-)" aria-label="Zoom out" onClick={() => zoomAt(1 / 1.2)}>-</button>
          <button title="Fit (0)" aria-label="Fit to view" onClick={fit}>[ ]</button>
          <button title="Zoom in (+)" aria-label="Zoom in" onClick={() => zoomAt(1.2)}>+</button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="factory-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg className="factory-svg" width="100%" height="100%" role="img" aria-label={`${factoryLabels.title}: the career as a factory`}>
          <defs>
            <pattern id="factory-ground" width={20} height={20} patternUnits="userSpaceOnUse">
              <rect width={20} height={20} className="ground" />
              <path d="M 20 0 L 0 0 0 20" className="ground-line" />
            </pattern>
          </defs>
          <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
            <rect x={-2000} y={-2000} width={model.width + 4000} height={model.height + 4000} fill="url(#factory-ground)" />

            {/* Taps: short vertical belts between machines and the bus. */}
            {model.taps.map((t, i) => {
              const lane = laneById.get(t.laneId)!;
              return (
                <g key={`tap-${i}`} className={`belt tap ${highlighted(lane) ? 'hl' : ''}`}>
                  <line x1={t.x} y1={t.y1} x2={t.x} y2={t.y2} className="belt-bed" />
                  <line
                    x1={t.x}
                    y1={t.output ? t.y1 : t.y2}
                    x2={t.x}
                    y2={t.output ? t.y2 : t.y1}
                    className="belt-flow"
                    stroke={lane.color}
                  />
                </g>
              );
            })}

            {/* The main bus. */}
            {model.lanes.map((lane) => (
              <g
                key={lane.id}
                className={`belt lane ${lane.kind} ${highlighted(lane) ? 'hl' : ''}`}
                onMouseEnter={() => setSelection({ kind: 'lane', laneId: lane.id })}
              >
                <line x1={lane.x1} y1={lane.y} x2={lane.x2} y2={lane.y} className="belt-bed" />
                <line x1={lane.x1} y1={lane.y} x2={lane.x2} y2={lane.y} className="belt-flow" stroke={lane.color} />
                <line x1={lane.x1} y1={lane.y} x2={lane.x2} y2={lane.y} className="belt-hit" />
                {altMode && lane.kind === 'skill' && (
                  <text className="lane-label" x={lane.x1 + 6} y={lane.y - 7}>{lane.item}</text>
                )}
              </g>
            ))}

            {/* Ore field. */}
            <g
              className="factory-entity ore"
              transform={`translate(${model.ore.x} ${model.ore.y})`}
              onMouseEnter={() => setSelection({ kind: 'ore' })}
            >
              <rect width={model.ore.w} height={model.ore.h} rx={10} className="ore-patch" />
              {[[18, 20], [46, 14], [80, 24], [110, 16], [30, 56], [64, 66], [98, 58], [120, 72]].map(([x, y]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={9} height={7} className="ore-chunk" />
              ))}
              <text className="entity-name" x={10} y={44}>{factoryLabels.ore}</text>
            </g>

            {/* Rocket silo: click to launch into the printed resume. */}
            <g
              className="factory-entity silo"
              transform={`translate(${model.silo.x} ${model.silo.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${factoryLabels.silo}. Open the ${play.resume}.`}
              onClick={clickGuard(() => navigate('/resume'))}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), navigate('/resume'))}
              onMouseEnter={() => setSelection({ kind: 'silo' })}
              onFocus={() => setSelection({ kind: 'silo' })}
            >
              <rect width={model.silo.w} height={model.silo.h} rx={6} className="machine-body" />
              <circle cx={model.silo.w / 2} cy={44} r={30} className="silo-pit" />
              <g className="rocket" transform={`translate(${model.silo.w / 2} 44)`}>
                <path d="M 0 -26 L 7 -12 L 7 10 L 12 18 L -12 18 L -7 10 L -7 -12 Z" />
                <rect className="flame" x={-4} y={18} width={8} height={7} />
              </g>
              <text className="entity-name" x={8} y={14}>{factoryLabels.silo}</text>
              <text ref={shippedRef} className="entity-count" x={8} y={model.silo.h - 6}>{model.totals.products} shipped</text>
            </g>

            {/* Research lab. */}
            <g
              className="factory-entity lab"
              transform={`translate(${model.lab.x} ${model.lab.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${factoryLabels.lab}. Open ${play.accomplishments}.`}
              onClick={clickGuard(() => navigate('/accomplishments'))}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), navigate('/accomplishments'))}
              onMouseEnter={() => setSelection({ kind: 'lab' })}
              onFocus={() => setSelection({ kind: 'lab' })}
            >
              <rect width={model.lab.w} height={model.lab.h} rx={6} className="machine-body" />
              <path className="lab-dome" d={`M 25 ${model.lab.h - 18} A 40 40 0 0 1 105 ${model.lab.h - 18} Z`} />
              <circle className="lab-core" cx={65} cy={model.lab.h - 32} r={9} />
              <text className="entity-name" x={8} y={14}>{factoryLabels.lab}</text>
              <text ref={researchedRef} className="entity-count" x={8} y={model.lab.h - 6}>{model.totals.science} researched</text>
            </g>

            {model.machines.map(renderMachine)}

            {/* Item paths (invisible) and the items riding them. */}
            {model.routes.map((r) => (
              <g key={r.id} className={`route ${r.kind}`}>
                <path ref={(el) => { routeRefs.current[r.id] = el; }} d={r.d} className="route-path" />
                {Array.from({ length: r.itemCount }).map((_, i) => (
                  <rect
                    key={i}
                    ref={(el) => {
                      const list = itemRefs.current[r.id] ?? (itemRefs.current[r.id] = []);
                      list[i] = el;
                    }}
                    width={7}
                    height={7}
                    rx={r.kind === 'science' ? 3.5 : 1}
                    className="belt-item"
                    fill={laneById.get(r.laneId)!.color}
                  />
                ))}
              </g>
            ))}
          </g>
        </svg>

        <aside className="factory-inspector" aria-live="polite">{inspector}</aside>

        {statsOpen && (
          <section className="factory-stats" aria-label="Production statistics">
            <h2>Production</h2>
            <table>
              <thead>
                <tr><th>Machine</th><th>Acc</th><th>Learn</th></tr>
              </thead>
              <tbody>
                {model.machines.map((m) => (
                  <tr key={m.questId}>
                    <td>{m.name}</td>
                    <td><span className="bar products" style={{ width: barWidth(m.products) }} />{m.products}</td>
                    <td><span className="bar science" style={{ width: barWidth(m.science) }} />{m.science}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td>Total</td><td>{model.totals.products}</td><td>{model.totals.science}</td></tr>
              </tfoot>
            </table>
          </section>
        )}
      </div>

      <nav className="factory-quickbar" aria-label="Views">
        <button onClick={() => navigate('/timeline')}><span className="slot" aria-hidden="true" />{play.timeline}</button>
        <button onClick={() => navigate('/accomplishments')}><span className="slot" aria-hidden="true" />{play.accomplishments}</button>
        <button onClick={() => navigate('/resume')}><span className="slot" aria-hidden="true" />{play.resume}</button>
      </nav>
    </div>
  );
};

export default Factory;
