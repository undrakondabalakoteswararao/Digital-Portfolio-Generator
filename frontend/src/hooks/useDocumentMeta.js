import { useEffect } from 'react';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

// Sets the page title and SEO / social-sharing tags, and restores the title on unmount.
export default function useDocumentMeta({ title, description }) {
  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = title;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:type', 'profile');
    return () => { document.title = previous; };
  }, [title, description]);
}
