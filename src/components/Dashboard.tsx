import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { animation as a } from '../animation/config';
import { MagneticButton, Reveal, Stagger } from '../animation/primitives';
const views = [
  { id: 'inventory', label: 'Inventory', title: 'Everything on your shelf. In view.', heading: ['Product', 'Available', 'Status'], rows: [['Royal Basmati Rice · 5 kg', '42 bags', 'In stock'], ['Mustard Oil · 1 L', '54 bottles', 'In stock'], ['Sugar · 1 kg', '8 packs', 'Review stock']], note: 'Catalogue → stock movement → purchase planning' },
  { id: 'billing', label: 'Billing', title: 'A sale that keeps everything connected.', heading: ['Counter order #4809', 'Quantity', 'Amount'], rows: [['Royal Basmati Rice · 5 kg', '2', '₹1,180'], ['Mustard Oil · 1 L', '4', '₹760'], ['Sugar · 1 kg', '5', '₹245']], note: 'Bill subtotal ₹2,185 · 11 items · Sample order' },
  { id: 'relationships', label: 'Customers', title: 'Know the account behind every sale.', heading: ['Customer', 'Account', 'Outstanding'], rows: [['Gupta Provision Stores', 'Customer', '₹14,200'], ['Shreeji Supermarket', 'Customer', '₹8,600'], ['Kisan Agro Traders', 'Customer', '₹0']], note: 'Account history → balance review → reminder draft' },
  { id: 'purchases', label: 'Purchases', title: 'From your supplier to your shelf.', heading: ['Supplier / purchase', 'Delivery', 'Status'], rows: [['Kisan Agro · 8 bags of rice', 'Today', 'Received'], ['Fresh Harvest · 24 oils', 'Tomorrow', 'Expected'], ['Purchase order #PO-024', 'Draft', 'For review']], note: 'Supplier → purchase order → goods received → stock' },
  { id: 'payments', label: 'Payments', title: 'Make the next follow-up a clear one.', heading: ['Account', 'Balance', 'Next step'], rows: [['Gupta Provision Stores', '₹14,200', 'Review'], ['Shreeji Supermarket', '₹8,600', 'Review'], ['Reminder draft', 'Not sent', 'Approval']], note: 'Illustrative reminder workflow · No messages are sent' },
  { id: 'team', label: 'Team', title: 'The people who keep your day moving.', heading: ['Employee', 'Responsibility', 'Attendance'], rows: [['Asha', 'Counter', 'Present'], ['Ravi', 'Stockroom', 'Present'], ['Meera', 'Purchases', 'On leave']], note: 'Employee records → attendance → roles & permissions' },
  { id: 'reports', label: 'Reports', title: 'See the day. Plan your next move.', heading: ['Business signal', 'Sample value', 'Context'], rows: [['Sales recorded', '₹24,850', 'Today'], ['Invoices', '32', 'Today'], ['Stock to review', '3 products', 'Planning']], note: 'Illustrative insights · Reporting scope subject to development' },
];
const rail = [
  'M3 7.5l9-4.5 9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
  'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5',
  'M2 6h11v10H2zM13 9h4l4 4v3h-8',
  'M3 6h18v12H3zM3 10h18M7 15h3',
  'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  'M4 20V10M10 20V4M16 20v-7M22 20H2',
];
const positive = new Set(['In stock', 'Received', 'Present']);
const attention = new Set(['Review stock', 'Expected', 'For review', 'Review', 'Approval', 'On leave']);
function Cell({ text, status }: { text: string; status: boolean }) {
  if (!status || !(positive.has(text) || attention.has(text))) return <>{text}</>;
  return <span className={`preview-status ${positive.has(text) ? 'is-ok' : 'is-warn'}`}>{text}</span>;
}
// Same six-day sample series the working-day report uses.
const sales = [38, 59, 45, 72, 61, 78];
const spark = sales.map((v, i) => `${(i * 72) / (sales.length - 1)},${30 - (v / 100) * 28}`).join(' ');
export function Dashboard() {
  const [active, setActive] = useState(0);
  const [sold, setSold] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const view = views[active];
  const statusColumn = view.heading.length - 1;
  return <div className="product-preview">
    <Reveal><div className="preview-window">
      <div className="preview-topbar">
        <span className="preview-logo"><img src="assets/logo-96.png" width="22" height="22" alt="" /><span>stromule</span></span>
        <span className="preview-search" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>Search records<kbd>/</kbd></span>
        <span className="preview-store">Everyday Stores<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" /></svg></span>
        <span className="preview-avatar">ES</span>
      </div>
      <div className="preview-body">
        <div className="preview-rail" aria-hidden="true">{rail.map((d, i) => <i key={d} className={active === i ? 'on' : undefined}><svg viewBox="0 0 24 24"><path d={d} /></svg></i>)}</div>
        <div className="preview-main">
          <div className="preview-context"><span>Workspace <b aria-hidden="true">/</b> Overview</span><span className="preview-date"><i aria-hidden="true" />Today</span></div>
          <h2>Your business, at a glance.</h2><p className="preview-subtitle">A connected view of a working day.</p>
          <Stagger>{[
            ['Sales today', '₹24,850', '32 sample invoices', <svg key="s" className="preview-spark" viewBox="0 0 72 32" preserveAspectRatio="none" aria-hidden="true"><polyline points={spark} vectorEffect="non-scaling-stroke" /></svg>],
            ['Available stock', sold ? '40 bags' : '42 bags', 'Royal Basmati · 5 kg', sold ? <span key="d" className="preview-delta">−2</span> : null],
            ['Receivables', '₹22,800', '2 sample accounts', <span key="r" className="preview-split" aria-hidden="true"><i style={{ flexGrow: 14200 }} /><i style={{ flexGrow: 8600 }} /></span>],
          ].map(([label, value, note, extra]) => <motion.div key={label as string} className="preview-metric" variants={{ rest: { y: 0 }, visible: { y: reduced ? 0 : [a.distance.reveal / 2, 0], transition: { duration: reduced ? 0 : a.duration.reveal, ease: a.ease } } }}><span>{label}</span><strong>{value}</strong><small>{note}</small>{extra}</motion.div>)}</Stagger>
          <div className="preview-tabs" role="tablist" aria-label="Explore product workflows">{views.map((item, i) => <button key={item.id} id={`tab-${item.id}`} ref={element => { tabs.current[i] = element; }} role="tab" aria-selected={active === i} aria-controls="product-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={event => {
            let next = i;
            if (event.key === 'ArrowRight') next = (i + 1) % views.length;
            else if (event.key === 'ArrowLeft') next = (i - 1 + views.length) % views.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = views.length - 1;
            else return;
            event.preventDefault(); setActive(next); tabs.current[next]?.focus();
          }}>{item.label}</button>)}</div>
          <div role="tabpanel" id="product-panel" aria-labelledby={`tab-${view.id}`} className="preview-panel">
            <AnimatePresence mode="wait" initial={false}><motion.div key={view.id} initial={{ y: 0 }} animate={{ y: reduced ? 0 : [a.distance.reveal / 2, 0] }} exit={{ opacity: 1 }} transition={{ duration: reduced ? 0 : a.duration.quick, ease: a.ease }}>
              <h3>{view.title}</h3><table><thead><tr>{view.heading.map(text => <th key={text} scope="col">{text}</th>)}</tr></thead><tbody>{view.rows.map((row, i) => <tr key={row[0]}>{row.map((text, col) => <td key={col}><Cell text={active === 0 && i === 0 && col === 1 && sold ? '40 bags' : text} status={col === statusColumn} /></td>)}</tr>)}</tbody></table><p className="preview-note">{view.note}</p>
            </motion.div></AnimatePresence>
          </div>
        </div>
      </div>
      <div className="preview-flow"><div aria-live="polite"><span className="preview-live-dot" />{sold ? 'Sample sale recorded · 42 − 2 = 40 bags' : 'Try it: sell two bags of rice.'}</div><MagneticButton onClick={() => setSold(!sold)}>{sold ? 'Reset demo ↺' : 'Record sample sale →'}</MagneticButton></div>
    </div></Reveal><p className="preview-disclosure">Interactive product concept · Sample records · In development</p>
  </div>;
}
