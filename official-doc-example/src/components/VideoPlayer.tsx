import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  isPlaying: boolean;
}

export default function VideoPlayer({ src, isPlaying }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isPlaying) {
      console.log('play');
      ref.current.play();
    } else {
      console.log('pause');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} controls={isPlaying} />;
}
