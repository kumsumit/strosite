import { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import { Dashboard } from './components/Dashboard';
import { ScrollProgress, useCapabilities } from './animation/primitives';
import './premium.css';
import { SectionReveals } from './animation/SectionReveals';
const Story = lazy(() => import('./animation/ScrollStory'));
function Enhancements() {
  const { desktop } = useCapabilities();
  const [story, setStory] = useState(false);
  useEffect(() => {
    const target = document.querySelector('#transaction-story');
    if (!target || !desktop) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setStory(true); observer.disconnect(); } }, { rootMargin: '300px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [desktop]);
  return <><ScrollProgress /><SectionReveals />{desktop && story && <Suspense fallback={null}><Story /></Suspense>}</>;
}
const preview = document.querySelector('#product-preview');
if (preview) hydrateRoot(preview, <Dashboard />);
const enhancements = document.querySelector('#site-enhancements');
if (enhancements) createRoot(enhancements).render(<Enhancements />);

document.documentElement.classList.add('interactive-ready');

const studio = document.querySelector('#business-studio-root');
if (studio) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    import('./components/BusinessStudio').then(({ BusinessStudio }) => { hydrateRoot(studio, <BusinessStudio />); }).catch(() => { /* Preserve the pre-rendered workflow on a failed optional download. */ });
    observer.disconnect();
  }, { rootMargin: '400px' });
  observer.observe(studio);
}
