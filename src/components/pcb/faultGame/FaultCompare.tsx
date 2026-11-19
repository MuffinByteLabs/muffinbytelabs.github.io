"use client";

import FaultBoard from "./FaultBoard";
import { FAULT_BY_ID, type FaultId } from "./faults";

/* ════════════════════════════════════════════════════════════════════════
   One layout mistake, right and wrong side by side: the practice board
   from Spot the fault, cropped to the place the mistake lives. Used in the
   Field Note on review findings, so the article and the game show the
   same drawings.
   ════════════════════════════════════════════════════════════════════════ */

const NONE: FaultId[] = [];
const W = 170;
const H = 112;

/** "Power trace pinched thin" → "power trace pinched thin", but an
    acronym at the start ("USB pair split apart") keeps its capitals */
const lowerFirst = (s: string) => (/^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

export default function FaultCompare({ fault }: { fault: FaultId }) {
  const f = FAULT_BY_ID[fault];
  const vx = Math.min(Math.max(f.mark.x - W / 2, 0), 640 - W);
  const vy = Math.min(Math.max(f.mark.y - H / 2, 0), 400 - H);
  const view = `${vx} ${vy} ${W} ${H}`;
  const board = (active: FaultId[]) => (
    <FaultBoard active={active} found={NONE} missed={NONE} misses={[]} probe={null} portrait={false} innerRef={null} view={view} />
  );
  return (
    <figure className="fault-compare">
      <div className="fault-compare-grid">
        <div>
          <div className="fault-compare-board">{board(NONE)}</div>
          <p className="fault-compare-label">Right</p>
        </div>
        <div>
          <div className="fault-compare-board is-wrong">{board([fault])}</div>
          <p className="fault-compare-label is-wrong">Wrong: {lowerFirst(f.title)}</p>
        </div>
      </div>
    </figure>
  );
}
