import React from 'react';
import { ImageLayer } from "@/types/canvas";

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
  const { x, y, width, height, src, opacity } = layer;

  if (!isUploading) {
    return (
      <>
        {selectionColor && (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            stroke={selectionColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        )}
        <image
          crossOrigin="anonymous"
          opacity={opacity ? opacity : 1}
          id={id}
          href={src}
          x={x}
          y={y}
          width={width}
          height={height}
          onPointerDown={(e) => onPointerDown(e, id)}
        />
      </>
    );
  } else {
    return null;
  }
};