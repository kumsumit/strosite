import { lazy, Suspense, useEffect, useRef, useState, Component, type PropsWithChildren } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { animation as a } from '../animation/config';
import { MagneticButton, Reveal, Stagger, useCapabilities } from '../animation/primitives';
const Depth = lazy(() => import('./DashboardDepth'));
const views = [
  { id: 'inventory', label: 'Inventory', title: 'Everything on your shelf. In view.', heading: ['Product', 'Available', 'Status'], rows: [['Royal Basmati Rice · 5 kg', '42 bags', 'In stock'], ['Mustard Oil · 1 L', '54 bottles', 'In stock'], ['Sugar · 1 kg', '8 packs', 'Review stock']], note: 'Catalogue → stock movement → purchase planning' },
  { id: 'billing', label: 'Billing', title: 'A sale that keeps everything connected.', heading: ['Counter order #4809', 'Quantity', 'Amount'], rows: [['Royal Basmati Rice · 5 kg', '2', '₹1,180'], ['Mustard Oil · 1 L', '4', '₹760'], ['Sugar · 1 kg', '5', '₹245']], note: 'Bill subtotal ₹2,185 · 11 items · Sample order' },
  { id: 'relationships', label: 'Customers', title: 'Know the account behind every sale.', heading: ['Customer', 'Account', 'Outstanding'], rows: [['Gupta Provision Stores', 'Customer', '₹14,200'], ['Shreeji Supermarket', 'Customer', '₹8,600'], ['Kisan Agro Traders', 'Customer', '₹0']], note: 'Account history → balance review → reminder draft' },
  { id: 'purchases', label: 'Purchases', title: 'From your supplier to your shelf.', heading: ['Supplier / purchase', 'Delivery', 'Status'], rows: [['Kisan Agro · 8 bags of rice', 'Today', 'Received'], ['Fresh Harvest · 24 oils', 'Tomorrow', 'Expected'], ['Purchase order #PO-024', 'Draft', 'For review']], note: 'Supplier → purchase order → goods received → stock' },
  { id: 'payments', label: 'Payments', title: 'Make the next follow-up a clear one.', heading: ['Account', 'Balance', 'Next step'], rows: [['Gupta Provision Stores', '₹14,200', 'Review'], ['Shreeji Supermarket', '₹8,600', 'Review'], ['Reminder draft', 'Not sent', 'Approval']], note: 'Illustrative reminder workflow · No messages are sent' },
  { id: 'team', label: 'Team', title: 'The people who keep your day moving.', heading: ['Employee', 'Responsibility', 'Attendance'], rows: [['Asha', 'Counter', 'Present'], ['Ravi', 'Stockroom', 'Present'], ['Meera', 'Purchases', 'On leave']], note: 'Employee records → attendance → roles & permissions' },
  { id: 'reports', label: 'Reports', title: 'See the day. Plan your next move.', heading: ['Business signal', 'Sample value', 'Context'], rows: [['Sales recorded', '₹24,850', 'Today'], ['Invoices', '32', 'Today'], ['Stock to review', '3 products', 'Planning']], note: 'Illustrative insights · Reporting scope subject to development' },
];
class SceneBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
export function Dashboard() {
  const [active, setActive] = useState(0);
  const [sold, setSold] = useState(false);
  const [depth, setDepth] = useState(false);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { desktop } = useCapabilities();
  const reduced = useReducedMotion();
  const view = views[active];
  useEffect(() => {
    if (!desktop || !root.current) return;
    // Wait until the product preview is near the viewport, then yield to idle work.
    let idle: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        idle = window.setTimeout(() => setDepth(true), 900);
        observer.disconnect();
      }
    }, { rootMargin: '100px' });
    observer.observe(root.current);
    return () => { observer.disconnect(); clearTimeout(idle); };
  }, [desktop]);
  return <div ref={root} className="product-preview">
    {depth && desktop && !paused && <SceneBoundary><Suspense fallback={null}><Depth /></Suspense></SceneBoundary>}
    <Reveal><div className="preview-window">
      <div className="preview-topbar"><span className="preview-logo">s<span>stromule</span></span><span className="preview-store">Everyday Stores <span aria-hidden="true">⌄</span></span><span className="preview-avatar">ES</span></div>
      <div className="preview-context"><span>WORKSPACE / OVERVIEW</span><button className="preview-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Enable depth' : 'Pause depth'}</button></div>
      <h2>Your business, at a glance.</h2><p className="preview-subtitle">A connected view of a working day.</p>
      <Stagger>{[['Sales today', '₹24,850', '32 sample invoices'], ['Available stock', sold ? '40 bags' : '42 bags', 'Royal Basmati · 5 kg'], ['Receivables', '₹22,800', '2 sample accounts']].map(([label, value, note]) => <motion.div key={label} className="preview-metric" variants={{ rest: { y: 0 }, visible: { y: reduced || paused ? 0 : [a.distance.reveal / 2, 0], transition: { duration: reduced || paused ? 0 : a.duration.reveal, ease: a.ease } } }}><span>{label}</span><strong>{value}</strong><small>{note}</small></motion.div>)}</Stagger>
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
        <AnimatePresence mode="wait" initial={false}><motion.div key={view.id} initial={{ y: 0 }} animate={{ y: reduced || paused ? 0 : [a.distance.reveal / 2, 0] }} exit={{ opacity: 1 }} transition={{ duration: reduced || paused ? 0 : a.duration.quick, ease: a.ease }}>
          <h3>{view.title}</h3><table><thead><tr>{view.heading.map(text => <th key={text} scope="col">{text}</th>)}</tr></thead><tbody>{view.rows.map((row, i) => <tr key={row[0]}>{row.map((text, col) => <td key={col}>{active === 0 && i === 0 && col === 1 && sold ? '40 bags' : text}</td>)}</tr>)}</tbody></table><p className="preview-note">{view.note}</p>
        </motion.div></AnimatePresence>
      </div>
      <div className="preview-flow"><div aria-live="polite"><span className="preview-live-dot" />{sold ? 'Sample sale recorded · 42 − 2 = 40 bags' : 'Try it: sell two bags of rice.'}</div><MagneticButton onClick={() => setSold(!sold)}>{sold ? 'Reset demo ↺' : 'Record sample sale →'}</MagneticButton></div>
    </div></Reveal><p className="preview-disclosure">INTERACTIVE PRODUCT CONCEPT · SAMPLE RECORDS · IN DEVELOPMENT</p>
  </div>;
}
