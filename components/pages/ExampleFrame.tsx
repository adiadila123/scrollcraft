'use client';
import { useEffect, useState } from 'react';
import { motionOverride, withMotionParam } from '@/lib/motion';

/** The example viewer's frame. After mounting it passes on the reader's choice to keep animations on, if they made one. */
export default function ExampleFrame({ src, title }: { src: string; title: string }) {
  const [url, setUrl] = useState(src);
  useEffect(() => {
    /* the choice lives in localStorage, which the server cannot read */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (motionOverride()) setUrl(withMotionParam(src));
  }, [src]);
  return <iframe className="vw-frame" src={url} title={title} sandbox="allow-scripts" />;
}
