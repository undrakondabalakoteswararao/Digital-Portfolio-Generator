import { useEffect, useRef, useState } from 'react';
import TemplateRenderer from './TemplateRenderer';

// A scaled-down, non-interactive render of the real template using the student's own data.
export default function TemplatePreviewThumb({ template, data, height = 220 }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const update = () => box.current && setScale(box.current.clientWidth / 1100);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="relative w-full overflow-hidden bg-white" style={{ height }} aria-hidden="true">
      <div className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: 1100, transform: `scale(${scale})` }}>
        <TemplateRenderer template={template} data={data} />
      </div>
    </div>
  );
}
