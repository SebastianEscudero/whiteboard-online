import { ImageLayer } from "@/types/canvas";
import { Dispatch, SetStateAction } from "react";

interface ImageProps {
  isUploading: boolean;
  id: string;
  layer: ImageLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export const InsertImage = ({
  isUploading,
  id,
  layer,
  onPointerDown,
  selectionColor,
}: ImageProps) => {
  const { x, y, width, height, src } = layer;
    if (!isUploading ) {
      return (
        <image 
        id={id}
        href = {src} 
        x={x}
        y={y}
        width={width}
        height={height}
        onPointerDown={(e) => onPointerDown(e, id)}
      />
      );
    } else {
      return null;
    }
  };

