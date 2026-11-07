import { useEffect, useReducer, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { animation as a } from '../animation/config';
import { businessReducer, businessSnapshot, initialBusiness, money } from './businessModel';
import './business-studio.css';
const chapters = [
  ['A normal day. A connected business.', 'Choose a basket, a payment method and press Play. Follow the records behind one sale.'],
  ['From the shelf to the basket.', 'The customer picks their rice. The basket is prepared before anything is posted to stock.'],
  ['A real bill takes shape.', 'Quantity × unit price. One clear bill, linked to the customer and the person at the counter.'],
  ['The stockroom gets the same story.', 'The billed quantity leaves available stock. No second entry in another spreadsheet.'],
  ['A payment. Or a customer balance.', 'A paid sale records the payment. A credit sale adds the exact amount to the customer account.'],
  ['The day becomes a little clearer.', 'Sales, invoice count and stock now reflect the same transaction. One sale, connected records.'],
];
function Bag({ x, y, delay = 0, moving = false, reduced = false, destination = 0 }: { x: number; y: number; delay?: number; moving?: boolean; reduced?: boolean; destination?: number }) {
  return <motion.g initial={false} animate={{ x: moving ? [x, x + 35, 395 + destination * 7] : x, y: moving ? [y, y - 85, 279 - destination % 3 * 4] : y, rotate: moving ? [0, -12, 0] : 0 }} transition={{ duration: reduced ? 0 : a.duration.transfer, delay: reduced ? 0 : delay, ease: a.ease }}>
    <path d="M-15-24H15L20 18Q0 25-20 18Z" fill="#f5dfad" stroke="#a78a51" strokeWidth="1.5"/><path d="M-13-24Q0-30 13-24M-16-17H16" fill="none" stroke="#a78a51"/><rect x="-12" y="-9" width="24" height="20" rx="2" fill="#e9f0dc"/><path d="M0 7V-5M0 1L-5-3M0 4L5-1" stroke="#49704c" strokeWidth="1.5"/><text y="16" textAnchor="middle" fontSize="5" fill="#65522f">BASMATI · 5 KG</text>
  </motion.g>;
}
function Person({ x, customer = false, present = true, phase, reduced }: { x: number; customer?: boolean; present?: boolean; phase: number; reduced: boolean }) {
  return <motion.g initial={false} animate={{ x, opacity: present ? 1 : .3 }} transition={{ duration: reduced ? 0 : a.duration.scene }}>
    <ellipse cx="0" cy="365" rx="31" ry="7" fill="#203e2910"/><path d="M-14 300L-18 355M13 300L20 355" stroke={customer ? '#485b6a' : '#334f41'} strokeWidth="13" strokeLinecap="round"/><path d="M-22 360H-10M13 360H27" stroke="#263b32" strokeWidth="8" strokeLinecap="round"/>
    <path d="M-24 252Q0 235 24 252L20 307H-20Z" fill={customer ? '#b9825c' : '#447c5b'}/><path d="M-14 247L-17 299H17L14 247" fill={customer ? '#cda07d' : '#e8e6d6'}/><circle cy="223" r="20" fill="#c9946b"/><path d="M-20 221Q-24 191 4 199Q23 197 20 221L13 210Q-8 216-18 210" fill="#343a31"/><circle cx="7" cy="224" r="1.5" fill="#26382b"/><path d="M3 234Q8 237 12 231" stroke="#7c503b" fill="none" strokeWidth="1.5"/>
    <motion.g style={{ originX: '0px', originY: '255px' }} animate={{ rotate: reduced ? 0 : phase === 1 ? (customer ? -17 : 15) : phase === 2 ? (customer ? -8 : -12) : 0 }} transition={{ duration: reduced ? 0 : a.duration.scene }}><path d={customer ? 'M-19 255L-32 276L-62 270' : 'M20 255L34 277L65 266'} stroke="#c9946b" strokeWidth="11" fill="none" strokeLinecap="round"/></motion.g>
  </motion.g>;
}
export function BusinessStudio() {
  const [state, dispatch] = useReducer(businessReducer, initialBusiness);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [reminder, setReminder] = useState(false);
  const [visiblePage, setVisiblePage] = useState(true);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { amount: .2 });
  const record = businessSnapshot(state);
  const duration = reduced ? 0 : a.duration.scene;
  useEffect(() => {
    const update = () => setVisiblePage(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (!playing || !visible || !visiblePage || state.phase >= 5) return;
    const timer = setTimeout(() => dispatch({ type: 'next' }), a.duration.chapter * 1000);
    return () => clearTimeout(timer);
  }, [playing, state.phase, visible, visiblePage]);
  useEffect(() => { if (state.phase === 5) setPlaying(false); }, [state.phase]);
  const reset = () => { setPlaying(false); setReminder(false); dispatch({ type: 'reset' }); };
  const play = () => { if (state.phase === 5) { reset(); setPlaying(true); } else { if (state.phase === 0) dispatch({ type: 'next' }); setPlaying(!playing); } };
  return <div className={`business-studio${ready ? ' studio-ready' : ''}`} ref={root} data-phase={state.phase} data-playing={playing}>
    <div className="studio-heading"><div><span className="eyebrow">THE BUSINESS, IN MOTION</span><h2>Don’t just read about it.<br />Run a working day.</h2><p>Build a basket. Print the bill. Watch the same sale move through your business.</p></div><span className="studio-sample">INTERACTIVE SIMULATION<br />Sample records · Product in development</span></div>
    <div className="studio-workspace">
      <div className="studio-toolbar"><span><i /> EVERYDAY STORES / CONNECTED WORKSPACE</span><button onClick={reset} className="studio-reset">Reset day ↺</button></div>
      <div className="studio-main">
        <div className="shop-illustration">
          <div className="shop-status"><span>{state.phase === 5 ? 'SALE CONNECTED' : `STEP ${state.phase + 1} OF 6`}</span><span>{state.present ? 'Asha · At the counter' : 'Asha · Away from counter'}</span></div>
          <svg viewBox="0 0 700 435" role="img" aria-label={`Illustrated shop. ${chapters[state.phase][0]} Available rice: ${record.stock} bags.`}>
            <defs><pattern id="shop-grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#e0e7dc" strokeWidth=".5"/></pattern><linearGradient id="shop-wall" x2="0" y2="1"><stop stopColor="#f1f5eb"/><stop offset="1" stopColor="#e6ecdf"/></linearGradient></defs>
            <rect width="700" height="435" fill="url(#shop-wall)"/><rect y="340" width="700" height="95" fill="url(#shop-grid)"/><path d="M0 340H700" stroke="#c3d0bb"/>
            <rect x="35" y="48" width="185" height="262" rx="4" fill="#dfe7d7" stroke="#b6c6ac"/><path d="M42 129H213M42 205H213M42 280H213" stroke="#98ad8e" strokeWidth="6"/>
            <text x="52" y="69" fontSize="9" letterSpacing="2" fill="#53694c">THE STOCKROOM</text>
            {[0,1,2,3].map(i => <Bag key={`top${i}`} x={66 + i * 43} y={104} moving={state.phase >= 1 && i < Math.max(0, state.quantity - 4)} delay={(i+4) * .12} destination={i+4} reduced={!!reduced} />)}
            {[0,1,2,3].map(i => <Bag key={`middle${i}`} x={66 + i * 43} y={180} moving={state.phase >= 1 && i < Math.min(4, state.quantity)} delay={i * .12} destination={i} reduced={!!reduced} />)}
            {[0,1,2,3].map(i => <g key={`jar${i}`}><rect x={51+i*43} y="232" width="28" height="40" rx="4" fill={i%2 ? '#aabc8c' : '#d4b67c'} stroke="#8f9c74"/><rect x={55+i*43} y="225" width="20" height="9" rx="2" fill="#778e66"/></g>)}
            <motion.g initial={false} animate={{ y: state.delivery ? 0 : 65, opacity: state.delivery ? 1 : 0 }} transition={{ duration }}><path d="M47 320L79 309L110 320V352L79 365L47 352Z" fill="#d1ad75" stroke="#987843"/><path d="M47 320L79 333L110 320M79 333V365M64 315L94 327" fill="none" stroke="#987843"/><text x="79" y="347" textAnchor="middle" fontSize="8" fill="#58482f">+8 BAGS</text></motion.g>
            <rect x="293" y="54" width="245" height="45" rx="3" fill="#fffdf5" stroke="#c7d2bd"/><text x="415" y="82" textAnchor="middle" fontSize="17" fill="#28563d" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="3">EVERYDAY STORES</text><path d="M314 45V54M517 45V54" stroke="#a9b99c"/>
            <Person x={325} phase={state.phase} reduced={!!reduced} present={state.present}/><Person x={535} phase={state.phase} reduced={!!reduced} customer/>
            <path d="M266 288H474L489 310H253Z" fill="#b4c7a5" stroke="#809977"/><rect x="258" y="309" width="226" height="60" fill="#d5dfca" stroke="#a1b495"/><path d="M274 322H465M274 354H465" stroke="#c2cfb6"/><text x="370" y="344" textAnchor="middle" fontSize="10" letterSpacing="4" fill="#53754e">STROMULE</text>
            <path d="M345 258H382L388 289H340Z" fill="#2e4f3f"/><path d="M350 264H378L380 281H347Z" fill="#c4dec0"/><motion.path d="M354 272L360 277L372 267" fill="none" stroke="#36714f" strokeWidth="2" initial={false} animate={{ pathLength: state.phase >= 2 ? 1 : 0 }} transition={{ duration }}/>
            <path d="M391 284H441L435 306H398Z" fill="#d8bd8b" stroke="#a48b5e"/><path d="M401 284Q414 261 432 284M403 287V301M414 287V303M427 287V301" stroke="#a48b5e" fill="none"/>
            <AnimatePresence>{state.phase >= 2 && <motion.g key="printed-bill" initial={{ x: 12, y: reduced ? 0 : 60, opacity: 0 }} animate={{ x: 12, y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration }}><path d="M549 116H669V270L661 265L653 270L645 265L637 270L629 265L621 270L613 265L605 270L597 265L589 270L581 265L573 270L565 265L557 270L549 265Z" fill="#fffdf6" stroke="#bdc9b3"/><text x="563" y="137" fontSize="8" fill="#52704b">BILL #4809</text><path d="M562 148H655" stroke="#c5cfbd" strokeDasharray="3 3"/>{['Royal Basmati · 5 kg', `${state.quantity} bags × ₹590`, 'Gupta Provision Stores'].map((line,i)=><motion.text key={i} x="563" y={163+i*15} fontSize="7" fill="#57704c" initial={{opacity:reduced?1:0}} animate={{opacity:1}} transition={{duration:a.duration.quick,delay:reduced?0:i*a.stagger}}>{line}</motion.text>)}<text x="563" y="224" fontSize="17" fill="#28563d" fontWeight="600">{money(record.amount)}</text><text x="563" y="245" fontSize="8" fill="#52704b">{state.quantity} × ₹590 · {state.credit?'ON ACCOUNT':'PAID SALE'}</text></motion.g>}</AnimatePresence>
            <motion.g initial={false} animate={{x:state.delivery?0:-180,opacity:state.delivery?1:0}} transition={{duration:reduced?0:a.duration.transfer,ease:a.ease}}><rect x="287" y="377" width="78" height="35" rx="3" fill="#c5d4b9" stroke="#8da27e"/><path d="M365 388H387L400 401V414H365Z" fill="#87a678" stroke="#66885d"/><path d="M372 392H383L392 402H372Z" fill="#e5efe0"/><circle cx="307" cy="415" r="9" fill="#40563b"/><circle cx="383" cy="415" r="9" fill="#40563b"/><circle cx="307" cy="415" r="4" fill="#bdc9b4"/><circle cx="383" cy="415" r="4" fill="#bdc9b4"/><text x="326" y="397" textAnchor="middle" fontSize="7" fill="#3e6239">KISAN AGRO</text></motion.g>
            <AnimatePresence>{state.phase>=4&&!state.credit&&<motion.g key="payment-coin" initial={{x:520,y:275,opacity:0}} animate={{x:[520,450,355],y:[275,195,259],opacity:[0,1,1]}} exit={{opacity:0}} transition={{duration:reduced?0:a.duration.transfer,ease:a.ease}}><circle r="15" fill="#e7cf85" stroke="#ab8e3f" strokeWidth="1.5"/><text y="6" textAnchor="middle" fontSize="18" fill="#7c652e">₹</text></motion.g>}</AnimatePresence>
            <motion.g initial={false} animate={{ opacity: state.phase >= 3 ? 1 : 0, y: state.phase >= 3 ? 0 : 12 }} transition={{duration}}><rect x="42" y="382" width="180" height="30" rx="3" fill="#2f6748"/><text x="132" y="401" textAnchor="middle" fontSize="11" fill="white">Stock updated · {record.stock} bags</text></motion.g>
            <motion.g initial={false} animate={{opacity:state.phase>=4?1:0,scale:state.phase>=4?1:.8}} transition={{duration}}><circle cx="611" cy="333" r="25" fill="#d8e9cd" stroke="#84a375"/><path d="M599 332L608 341L623 324" stroke="#3d714a" strokeWidth="3" fill="none"/><text x="611" y="380" textAnchor="middle" fontSize="9" fill="#3e6747">{state.credit?'ACCOUNT UPDATED':'PAYMENT RECORDED'}</text></motion.g>
          </svg>
          <div className="studio-caption" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.div key={state.phase} initial={{ y: reduced ? 0 : 9, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{duration:reduced?0:a.duration.quick}}><h3>{chapters[state.phase][0]}</h3><p>{chapters[state.phase][1]}</p></motion.div></AnimatePresence></div>
        </div>
        <aside className="studio-controls" aria-label="Configure the business simulation">
          <span className="eyebrow">YOUR COUNTER. YOUR CALL.</span><h3>Build this sale.</h3><p>Royal Basmati Rice · 5 kg<br /><strong>₹590 per bag</strong></p>
          <div className="basket-quantity"><span>Quantity</span><div><button aria-label="Remove one bag" disabled={state.phase>0||state.quantity<=1} onClick={()=>dispatch({type:'quantity',value:state.quantity-1})}>−</button><output aria-label="Basket quantity">{state.quantity}</output><button aria-label="Add one bag" disabled={state.phase>0||state.quantity>=8} onClick={()=>dispatch({type:'quantity',value:state.quantity+1})}>+</button></div></div>
          <fieldset disabled={state.phase>0}><legend>Payment method</legend><label><input type="radio" name="sale-payment" checked={!state.credit} onChange={()=>dispatch({type:'credit',value:false})}/> Paid at counter</label><label><input type="radio" name="sale-payment" checked={state.credit} onChange={()=>dispatch({type:'credit',value:true})}/> Add to customer account</label></fieldset>
          <div className="studio-total"><span>Bill total</span><strong>{money(record.amount)}</strong></div>
          <div className="studio-playback"><motion.button whileTap={{scale:.97}} className="studio-play" onClick={play}>{state.phase===5?'Replay the sale ↺':playing?'Pause animation Ⅱ':state.phase===0?'Play the sale ▶':'Continue animation ▶'}</motion.button><button className="studio-step" onClick={()=>{setPlaying(false);dispatch({type:'next'});}} disabled={state.phase===5}>Next step →</button></div>
          <p className="studio-help">{reduced?'Reduced motion enabled. Use Next step to explore at your own pace.':'Pause at any point, or use Next step to follow each change.'}</p>
        </aside>
      </div>
      <div className="studio-steps" aria-label="Transaction progress">{['Basket','Bill','Stock','Account','Report'].map((label,i)=><div key={label} className={state.phase>i?'step-done':''}><span>{state.phase>i?'✓':`0${i+1}`}</span>{label}<motion.i initial={false} animate={{scaleX:state.phase>i?1:0}} transition={{duration}}/></div>)}</div>
      <div className="studio-records">
        <Record title="INVENTORY" value={`${record.stock} bags`} detail={state.delivery?'Supplier delivery received · +8 bags':'Available at Main Store'} active={state.phase===3} reduced={!!reduced}><button disabled={state.delivery||(state.phase>0&&state.phase<5)} onClick={()=>dispatch({type:'delivery'})}>{state.delivery?'Delivery received ✓':'Receive 8 bags from supplier ↗'}</button></Record>
        <Record title="CUSTOMER ACCOUNT" value={money(record.balance)} detail="Gupta Provision Stores · Outstanding" active={state.phase===4} reduced={!!reduced}><button disabled={state.phase<4||reminder} onClick={()=>setReminder(true)}>{reminder?'Reminder draft ready ✓':'Prepare a payment reminder ↗'}</button>{reminder&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} transition={{duration:reduced?0:a.duration.reveal}} className="reminder-draft">Draft: Please review your outstanding balance of {money(record.balance)}. <strong>Not sent · Approval required.</strong></motion.p>}</Record>
        <Record title="TODAY’S REPORT" value={money(record.sales)} detail={`${record.invoices} invoices · Sample business day`} active={state.phase===5} reduced={!!reduced}><div className="studio-chart" role="img" aria-label={`Sales chart. Today's sales ${money(record.sales)}`}>{[38,59,45,72,61,state.phase>=5?96:78].map((height,i)=><motion.i key={i} initial={false} animate={{height:`${height}%`}} transition={{duration}} style={{background:i===5?'#2e704b':'#c7d7bd'}}/>)}</div></Record>
        <Record title="PEOPLE & ATTENDANCE" value={state.present?'Asha is present':'Asha is away'} detail="Counter operator · Billing role" active={false} reduced={!!reduced}><button onClick={()=>dispatch({type:'attendance'})}>{state.present?'Mark away ↗':'Mark present ↗'}</button></Record>
      </div>
      <p className="studio-disclaimer">A working simulation of the intended connected workflow. No real bills, payments or messages are created. Figures exclude tax for clarity.</p>
    </div>
  </div>;
}
function Record({title,value,detail,active,reduced,children}: React.PropsWithChildren<{title:string;value:string;detail:string;active:boolean;reduced:boolean}>) {
  return <motion.article className="studio-record" animate={{backgroundColor:active?'#e4f0dc':'#ffffff',borderColor:active?'#7ca268':'#d9e2d3'}} transition={{duration:reduced?0:a.duration.scene}}><span>{title}</span><AnimatePresence mode="wait" initial={false}><motion.strong key={value} initial={{y:reduced?0:12,opacity:0}} animate={{y:0,opacity:1}} exit={{y:reduced?0:-8,opacity:0}} transition={{duration:reduced?0:a.duration.quick}}>{value}</motion.strong></AnimatePresence><small>{detail}</small>{children}</motion.article>;
}
