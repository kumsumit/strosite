import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { animation as a } from './config';
export function useCapabilities() {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const update = () => setDesktop(query.matches && !navigator.connection?.saveData);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return { reduced, desktop: desktop && !reduced };
}
declare global { interface Navigator { connection?: { saveData?: boolean } } }
export function Reveal({ children }: PropsWithChildren) {
  const reduced = useReducedMotion();
  return <motion.div initial={false} whileInView={{ y: reduced ? 0 : [a.distance.reveal, 0] }} viewport={{ once: true, amount: .1 }} transition={{ duration: reduced ? 0 : a.duration.reveal, ease: a.ease }}>{children}</motion.div>;
}
export function Stagger({ children }: PropsWithChildren) {
  return <motion.div className="preview-metrics" initial="rest" animate="visible" variants={{ visible: { transition: { staggerChildren: a.stagger } } }}>{children}</motion.div>;
}
export function MagneticButton({ children, onClick }: PropsWithChildren<{ onClick: () => void }>) {
  const { desktop } = useCapabilities();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return <motion.button className="preview-action" onClick={onClick} animate={offset} whileTap={{ scale: .98 }} transition={{ duration: a.duration.quick }} onPointerMove={event => {
    if (!desktop) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({ x: (event.clientX - rect.left - rect.width / 2) / rect.width * a.distance.magnet, y: (event.clientY - rect.top - rect.height / 2) / rect.height * a.distance.magnet });
  }} onPointerLeave={() => setOffset({ x: 0, y: 0 })}>{children}</motion.button>;
}
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 35 });
  return <motion.div className="premium-progress" aria-hidden="true" style={{ scaleX: reduced ? scrollYProgress : smooth }} />;
}
