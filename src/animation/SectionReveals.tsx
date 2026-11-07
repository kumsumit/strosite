import { useEffect } from 'react';
import { animate, inView, useReducedMotion } from 'motion/react';
import { animation as a } from './config';
// Progressive enhancement: never hide server-rendered content, even before observation.
export function SectionReveals() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const running: ReturnType<typeof animate>[] = [];
    const stops = Array.from(document.querySelectorAll<HTMLElement>('.product-principles>div,.section-intro,.feature,.sector,.ecosystem-diagram,.access-banner')).map((element, index) => inView(element, () => {
      running.push(animate(element, { transform: [`translateY(${a.distance.reveal}px)`, 'translateY(0px)'] }, { duration: a.duration.reveal, delay: (index % 3) * a.stagger, ease: a.ease }));
    }, { amount: .15 }));
    return () => { stops.forEach(stop => stop()); running.forEach(control => control.stop()); };
  }, [reduced]);
  return null;
}
