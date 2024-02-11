import { ImageLayer } from "@/types/canvas";

interface ImageProps {
  id: string;
  layer: ImageLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
};

export const InsertImage = ({
  id,
  layer,
  onPointerDown,
}: ImageProps) => {
  const dftImageSrc = "/logo.svg"
  const { x, y, width, height, src } = layer;
    return (
      <image 
        id={id}
        href = {src || dftImageSrc} 
        x={x}
        y={y}
        width={width}
        height={height}
        onPointerDown={(e) => onPointerDown(e, id)}
      />
    );  
  };

