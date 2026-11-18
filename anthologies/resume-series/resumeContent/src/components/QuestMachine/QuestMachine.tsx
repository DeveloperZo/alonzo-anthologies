// src/components/QuestMachine/QuestMachine.tsx
// Play-mode quest detail: opening a machine from the career factory. The window
// borrows Factorio's assembler GUI for the header band (inputs, crafting bar,
// outputs) and Factoriopedia for the rest (an entry list on the left, and a
// readable pane with the recipe and every product). Work mode keeps QuestDetail.
import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import quests, { Quest } from '../../data/quests.data';
import { factoryLabels } from '../../data/factory.data';
import {
  buildFactory,
  FactoryMachine,
  IngredientLink,
  LaneStop,
  neighbours,
  questLinks,
} from '../../utils/factoryModel';
import {
  formatDurationShort,
  formatMonthYear,
  isOngoing,
  monthsBetween,
} from '../../utils/questDates';
import { rememberMachine } from '../../utils/factoryFocus';
import './QuestMachine.css';

const model = buildFactory(quests);

// The bar compares tenures, so a full bar is the longest single role.
// Education is longer than any role and simply fills the bar.
const roleQuests = quests.filter((q) => q.type !== 'education');
const longestRole = roleQuests.reduce(
  (best, q) => {
    const months = monthsBetween(q.startDate, q.endDate);
    return months > best.months ? { months, quest: q } : best;
  },
  { months: 1, quest: roleQuests[0] },
);

const typeLabel = (type: Quest['type']) =>
  ({
    career: 'Career',
    independent: 'Independent',
    hobby: 'Personal project',
    education: 'Education',
  })[type];

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);

interface QuestMachineProps {
  id: number;
}

const QuestMachine: React.FC<QuestMachineProps> = ({ id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);

  const quest = quests.find((q) => q.id === id)!;
  const machine = model.machines.find((m) => m.questId === id)!;
  const links = useMemo(() => questLinks(model, id), [id]);
  const { prev, next } = neighbours(model, id);
  const cameFromFactory = !!(location.state as { fromFactory?: boolean } | null)?.fromFactory;

  const ongoing = isOngoing(quest.endDate);
  const months = monthsBetween(quest.startDate, quest.endDate);
  const barShare = Math.min(1, months / longestRole.months);
  const learnings = quest.accomplishments.reduce((n, a) => n + a.learnings.length, 0);
  const shared = links.filter((l) => l.shared);
  const showRoles = quest.roles.length > 1;
  const isEducation = quest.type === 'education';

  // A fresh machine opens at the top with focus on its title.
  useEffect(() => {
    paneRef.current?.scrollTo(0, 0);
    titleRef.current?.focus();
    rememberMachine(id);
  }, [id]);

  const go = (questId: number) =>
    navigate(`/quests/${questId}`, { replace: true, state: location.state });

  const close = () => {
    if (cameFromFactory) navigate(-1);
    else navigate('/main-menu', { state: { focusQuestId: id } });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        close();
      } else if (e.key === '[' && prev) {
        go(prev.questId);
      } else if (e.key === ']' && next) {
        go(next.questId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const period = `${formatMonthYear(quest.startDate, 'short')} to ${
    ongoing ? 'now' : formatMonthYear(quest.endDate, 'short')
  }`;

  const stopLinks = (stops: LaneStop[]) =>
    stops.map((s, i) => (
      <React.Fragment key={s.questId}>
        {i > 0 && ', '}
        <button className="qm-link" onClick={() => go(s.questId)}>
          {s.name} ({s.year})
        </button>
      </React.Fragment>
    ));

  const ingredientLine = (l: IngredientLink) => {
    if (l.from.length === 0) {
      return <>Used again at {stopLinks(l.to)}.</>;
    }
    if (l.to.length === 0) {
      return <>Used earlier at {stopLinks(l.from)}.</>;
    }
    return (
      <>
        Used earlier at {stopLinks(l.from)}. Used again at {stopLinks(l.to)}.
      </>
    );
  };

  const sidebarGroups: [string, FactoryMachine[]][] = [
    ['Career', model.machines.filter((m) => m.row === 'main')],
    ['Side work', model.machines.filter((m) => m.row === 'side')],
  ];

  return (
    <div className="factory-stage">
      <div className={`qm ${ongoing ? 'is-working' : 'is-done'}`}>
        {/* ---------- window title bar ---------- */}
        <header className="qm-titlebar">
          <div className="qm-heading">
            <h1 ref={titleRef} tabIndex={-1}>{quest.titles.retro}</h1>
            <span className="qm-sub">
              {machine.name}, {typeLabel(quest.type)}
            </span>
          </div>
          <nav className="qm-steps" aria-label="Neighbouring quests">
            <button
              onClick={() => prev && go(prev.questId)}
              disabled={!prev}
              title="Previous ([)"
            >
              <span aria-hidden="true">&lt;</span> {prev ? prev.name : 'Earliest'}
            </button>
            <button
              onClick={() => next && go(next.questId)}
              disabled={!next}
              title="Next (])"
            >
              {next ? next.name : 'Latest'} <span aria-hidden="true">&gt;</span>
            </button>
          </nav>
          <button className="qm-close" onClick={close} title="Back to the factory (Esc or E)" aria-label="Close and return to the factory">
            X
          </button>
        </header>

        <div className="qm-body">
          {/* ---------- Factoriopedia entry list ---------- */}
          <aside className="qm-sidebar" aria-label="All entries">
            <label className="qm-select-label">
              <span>Go to</span>
              <select value={id} onChange={(e) => go(Number(e.target.value))}>
                {sidebarGroups.map(([group, ms]) => (
                  <optgroup key={group} label={group}>
                    {ms.map((m) => (
                      <option key={m.questId} value={m.questId}>
                        {m.name} ({m.startYear})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            {sidebarGroups.map(([group, ms]) => (
              <div key={group} className="qm-group">
                <h2>{group}</h2>
                <ul>
                  {ms.map((m) => (
                    <li key={m.questId}>
                      <button
                        className={m.questId === id ? 'current' : ''}
                        aria-current={m.questId === id ? 'page' : undefined}
                        onClick={() => go(m.questId)}
                      >
                        <span className="qm-mini" aria-hidden="true">
                          {m.recipe.slice(0, 4).map((r) => (
                            <i key={r.tag} style={{ background: r.color }} />
                          ))}
                        </span>
                        <span className="qm-entry-name">{m.name}</span>
                        <span className="qm-entry-year">{m.startYear}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <div className="qm-pane" ref={paneRef}>
            {/* ---------- assembler band ---------- */}
            <section className="qm-band" aria-label="Machine">
              <div className="qm-preview">
                <svg viewBox="0 0 120 90" role="img" aria-label={`${machine.name} machine, ${ongoing ? 'current' : 'completed'}`}>
                  <rect className="qm-body-rect" x={1} y={1} width={118} height={88} rx={4} />
                  <rect className="qm-inset" x={7} y={7} width={106} height={76} rx={2} />
                  <g transform="translate(60 45)">
                    <g className="qm-gear">
                      {[0, 45, 90, 135].map((a) => (
                        <rect key={a} x={-4} y={-26} width={8} height={52} transform={`rotate(${a})`} />
                      ))}
                      <circle r={17} />
                      <circle className="qm-gear-hole" r={6} />
                    </g>
                  </g>
                  <rect className="qm-lamp" x={104} y={76} width={8} height={8} />
                </svg>
                <p className="qm-status">
                  <span className="qm-dot" aria-hidden="true" />
                  {ongoing ? 'Current' : 'Completed'}
                </p>
              </div>

              <div className="qm-craft">
                <div className="qm-slots-label">Skills</div>
                <ul className="qm-slots" aria-label="Skills">
                  <li className="qm-slot ore" title={`${factoryLabels.ore}: what every role starts from`}>
                    <span className="qm-slot-swatch" />
                    <span className="qm-slot-name">{factoryLabels.ore}</span>
                  </li>
                  {links.map((l) => (
                    <li
                      key={l.tag}
                      className={`qm-slot ${l.shared ? 'shared' : ''}`}
                      title={l.shared ? `${l.tag}: also used in ${l.from.length + l.to.length} other role${l.from.length + l.to.length > 1 ? 's' : ''}` : l.tag}
                    >
                      <span className="qm-slot-swatch" style={{ background: l.color }} />
                      <span className="qm-slot-name">{l.tag}</span>
                      {l.shared && (
                        <span className="qm-slot-badge" aria-label={`also used in ${l.from.length + l.to.length} other roles`}>
                          {l.from.length + l.to.length}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="qm-tenure">
                  <div className="qm-tenure-head">
                    <span>{period}</span>
                    <span>{formatDurationShort(months)}{ongoing ? ', ongoing' : ''}</span>
                  </div>
                  <div
                    className="qm-bar"
                    role="img"
                    aria-label={`Tenure ${formatDurationShort(months)}. A full bar is the longest role, ${formatDurationShort(longestRole.months)}.`}
                  >
                    <span style={{ ['--share' as string]: barShare } as React.CSSProperties} />
                  </div>
                  <div className="qm-tenure-foot">
                    Bar scale: longest role ({formatDurationShort(longestRole.months)})
                  </div>
                </div>

                <div className="qm-slots-label">Output</div>
                <ul className="qm-slots outputs" aria-label="Output">
                  <li className="qm-slot experience">
                    <span className="qm-slot-swatch" />
                    <span className="qm-slot-name">{factoryLabels.silo}</span>
                    <span className="qm-slot-count">{quest.accomplishments.length}</span>
                  </li>
                  <li className="qm-slot knowledge">
                    <span className="qm-slot-swatch" />
                    <span className="qm-slot-name">{factoryLabels.lab}</span>
                    <span className="qm-slot-count">{learnings}</span>
                  </li>
                </ul>
              </div>

              {/* A short belt carrying this machine's ingredients through it. */}
              <div className="qm-belt" aria-hidden="true">
                {links.slice(0, 6).map((l, i) => (
                  <i key={l.tag} style={{ background: l.color, animationDelay: `${-i * 0.7}s` }} />
                ))}
              </div>
            </section>

            {/* ---------- Factoriopedia pane ---------- */}
            <section className="qm-section qm-about">
              {!isEducation && <p className="qm-lede">{quest.description}</p>}
              {quest.summary && <p>{quest.summary}</p>}
              {showRoles && (
                <ul className="qm-roles" aria-label="Roles">
                  {quest.roles.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              )}
            </section>

            {/* Only skills that also appear in other roles; the full list is in the band above. */}
            {shared.length > 0 && (
            <section className="qm-section">
              <h2>Shared skills</h2>
                <ul className="qm-recipe">
                  {shared.map((l) => (
                    <li key={l.tag}>
                      <span className="qm-chip" style={{ background: l.color }} aria-hidden="true" />
                      <div>
                        <strong>{l.tag}</strong>
                        {l.tag !== l.item && <span className="qm-dim"> (grouped with {l.item})</span>}
                        <p>{ingredientLine(l)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
            </section>
            )}

            <section className="qm-section">
              <h2>Accomplishments</h2>
              <ol className="qm-products">
                {quest.accomplishments.map((a, i) => (
                  <li key={i}>
                    <span className="qm-product-icon" aria-hidden="true" />
                    <div>
                      <p>{a.description}</p>
                      {showRoles && <span className="qm-role">{a.role}</span>}
                      {a.learnings.length > 0 && (
                        <ul className="qm-learnings" aria-label="Learnings">
                          {a.learnings.map((l) => (
                            <li key={l}>
                              <span className="qm-pack" aria-hidden="true" />
                              {l}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestMachine;
