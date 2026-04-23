import Image from "next/image";

import type { Video } from "@/lib/types";

type VideoCardProps = {
  video: Video;
};

export function VideoCard({ video }: VideoCardProps) {
  return (
    <a className="video-card" href={video.videoUrl} target="_blank" rel="noreferrer">
      <div className="video-thumb">
        <Image src={video.thumbnail} alt={video.title} width={720} height={480} />
        <span className="video-play">Watch</span>
      </div>
      <div className="video-copy">
        <h3>{video.title}</h3>
        <p>{video.excerpt}</p>
        <strong>{video.duration}</strong>
      </div>
    </a>
  );
}
