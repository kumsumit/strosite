import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animation as a } from './config';
gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function ScrollStory() {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
      const display = document.querySelector<HTMLElement>('.story-display');
      if (!display) return;
      const labels = ['01 / STOCK', '02 / THE LEDGER', '03 / THE PEOPLE', '04 / THE NEXT STEP'];
      const values = ['42 → 40', 'One account.', 'A shared view.', 'See. Decide. Act.'];
      const copies = ['Two bags sold. Available stock changes with the transaction.', 'The customer and their transaction history stay in the same story.', 'Responsibilities follow the people doing the work.', 'Records become context for a recommendation you can review.'];
      const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]');
      const select = (index: number) => {
        display.dataset.storyStage = String(index);
        display.querySelector('.story-display-label')!.textContent = labels[index];
        display.querySelector('.story-display-value')!.textContent = values[index];
        display.querySelector('.story-display-copy')!.textContent = copies[index];
        chapters.forEach((chapter, i) => chapter.classList.toggle('is-current', i === index));
        display.querySelectorAll('.story-markers i').forEach((marker, i) => marker.classList.toggle('active', i === index));
      };
      chapters.forEach((chapter, index) => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: chapter, start: 'top 65%', end: 'bottom 45%', onEnter: () => select(index), onEnterBack: () => select(index) } });
        timeline.fromTo(chapter.querySelector('.chapter-index'), { x: -a.distance.reveal }, { x: 0, duration: a.duration.reveal, ease: a.gsapEase });
      });
      return () => chapters.forEach(chapter => chapter.classList.remove('is-current'));
    });
    return () => media.revert();
  });
  return null;
}
