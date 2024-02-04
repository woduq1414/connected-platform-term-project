import { useEffect, useState, useRef, useDeferredValue } from "react";
import { CustomMovie, Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import VideoItemWithHoverPure from "./VideoItemWithHoverPure";
interface VideoItemWithHoverProps {
  video: CustomMovie;
}

export default function VideoItemWithHover({ video }: VideoItemWithHoverProps) {
  const { setPortal } = usePortal();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const deferredStatus = useDeferredValue(isHovered);

  const { data: configuration } = useGetConfigurationQuery(undefined);

  useEffect(() => {
    if (deferredStatus) {
      setPortal(elementRef.current, video);
    }
  }, [deferredStatus]);

  return (
    <VideoItemWithHoverPure
      src={"https://image.tmdb.org/t/p/w500_and_h282_face" + video.thumbnailUrl}
      handleHover={setIsHovered}
      ref={elementRef}
    />
  );
}
