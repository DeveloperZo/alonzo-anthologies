// Generates INFO-405-hurry-up-and-wait.svg. Usage: node INFO-405-hurry-up-and-wait.gen.mjs <out.svg>
// Scale: 1.7 units = 1 percent. Source 7, Faros 2026, teams with high AI adoption against low.
import { plate, write } from './frame.mjs';
import { bars, STYLE, foot } from './chart.mjs';
const c = bars({ U: 1.7, X0: 348, zero: 'teams that use AI little', groups: [
  { head: 'FINISHED', rows: [ { label: 'Epics completed', v: 66.2, text: '+66.2%' } ] },
  { head: 'SHIPPED', rows: [ { label: 'Deployments a week', v: -11.7, text: '−11.7%', accent: true, note: 'More finished. Less shipped.' } ] },
  { head: 'BROKE', rows: [
    { label: 'Incidents a month', v: 57.9, text: '+57.9%' },
    { label: 'Bugs per developer', v: 54, text: '+54%' },
    { label: 'Incidents per change', v: 242.7, text: '+242.7%' } ] },
] });
write(process.argv[2], plate({
  n: 405, roman: 'V', section: 5, sectionName: 'THE PASS', title: 'Hurry Up and Wait',
  caption: 'Teams using AI heavily finished more, shipped less often and broke more, on one scale.',
  desc: 'A bar chart on one scale comparing teams with high AI adoption against teams with low adoption, which sit on the zero line. Finished: epics completed, up 66.2 percent. Shipped: deployments a week, down 11.7 percent, drawn in rust to the left of the line. Broke: incidents a month up 57.9 percent, bugs per developer up 54 percent, and incidents per change up 242.7 percent. A note adds that changes sat in review more than five times as long. Vendor telemetry from 22,000 developers on 4,000 teams, compared and not randomized.',
  style: STYLE,
  body: c.svg + `<text x="900" y="${c.y + 20}" text-anchor="end" class="it">Changes sat in review more than five times as long.</text>` + foot('Teams with high AI adoption against low. Vendor telemetry from 22,000 developers on 4,000 teams, compared, not assigned.'),
}));
