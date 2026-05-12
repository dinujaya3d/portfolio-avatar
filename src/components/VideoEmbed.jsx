'use client';

import { useEffect, useRef, useState } from 'react';

function getYouTubeEmbedUrl(rawUrl, autoplay) {
  let id = null;
  for (const pattern of [
    /youtu\.be\/([^?&/]+)/,
    /[?&]v=([^&]+)/,
    /\/embed\/([^?&/]+)/,
  ]) {
    const m = rawUrl.match(pattern);
    if (m) { id = m[1]; break; }
  }
  if (!id) return rawUrl;
  return `https://www.youtube.com/embed/${id}?mute=1&rel=0${autoplay ? '&autoplay=1' : ''}`;
}

const isYouTube = (url) => /youtube\.com|youtu\.be/.test(url);
const isDirectVideo = (url) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

export default function VideoEmbed({ url }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [triggered, setTriggered] = useState(false);

  // IntersectionObserver — shared for both types
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // YouTube: one-way trigger — once in view, swap src to include autoplay=1
  useEffect(() => {
    if (inView && !triggered) setTriggered(true);
  }, [inView, triggered]);

  // Direct video: play/pause imperatively on intersection
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  if (isYouTube(url)) {
    return (
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          borderRadius: 14,
          background: '#111',
          margin: '2rem 0',
        }}
      >
        <iframe
          src={getYouTubeEmbedUrl(url, triggered)}
          title="Video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    );
  }

  if (isDirectVideo(url)) {
    return (
      <div
        ref={wrapRef}
        style={{ borderRadius: 14, overflow: 'hidden', margin: '2rem 0' }}
      >
        <video
          ref={videoRef}
          src={url}
          muted
          playsInline
          loop
          style={{ width: '100%', display: 'block' }}
        />
      </div>
    );
  }

  return null;
}
