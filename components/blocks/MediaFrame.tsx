import type { ImagePacket } from "@/lib/imageEngine";
import type { MediaLoaderConfig } from "@/lib/loadingProfiles";
import { MediaFrameClient } from "./MediaFrameClient";

type MediaFrameProps = {
  image: ImagePacket;
  className?: string;
  label?: string;
  /** Fill its container with no frame/caption (used for full-bleed hero backgrounds). */
  plain?: boolean;
  /** Allow real video assets to actually play (capped — only hero/ad pass this). */
  motion?: boolean;
  loader?: MediaLoaderConfig | null;
};

export function MediaFrame({ image, className = "", label, plain = false, motion = false, loader }: MediaFrameProps) {
  return (
    <MediaFrameClient
      image={image}
      className={className}
      label={label}
      plain={plain}
      motion={motion}
      loader={loader}
    />
  );
}
