import React, { useMemo } from 'react';
/* eslint-disable @typescript-eslint/no-require-imports */
const QRCode = require('qrcode');

interface DottedQRProps {
  data: string;
  color?: string;
  size?: number;
  fallbackSrc?: string;
}

export function DottedQRCode({ data, color = "#0F172A", size = 200, fallbackSrc }: DottedQRProps) {
  const matrix = useMemo(() => {
    try {
      if (!data) return { matrix: [], size: 0 };
      const qr = QRCode.create(data, { errorCorrectionLevel: 'H' });
      const size = qr.modules.size;
      const dataArray = qr.modules.data;
      const matrix: number[][] = [];
      for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
          matrix[i][j] = dataArray[i * size + j];
        }
      }
      return { matrix, size };
    } catch (e) {
      console.error("QR Code generation error:", e);
      return { matrix: [], size: 0 };
    }
  }, [data]);

  if (!matrix.size) {
    if (fallbackSrc) {
      /* eslint-disable-next-line @next/next/no-img-element */
      return <img src={fallbackSrc} alt="QR Code" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain' }} crossOrigin="anonymous" />;
    }
    return null;
  }

  const { matrix: m, size: qrSize } = matrix;
  const cellSize = size / qrSize;

  const isFinder = (x: number, y: number) => {
    return (
      (x < 7 && y < 7) ||
      (x > qrSize - 8 && y < 7) ||
      (x < 7 && y > qrSize - 8)
    );
  };

  const circles = [];
  for (let y = 0; y < qrSize; y++) {
    for (let x = 0; x < qrSize; x++) {
      if (m[y][x] && !isFinder(x, y)) {
        circles.push(
          <circle
            key={`${x}-${y}`}
            cx={(x + 0.5) * cellSize}
            cy={(y + 0.5) * cellSize}
            r={cellSize * 0.45}
            fill={color}
          />
        );
      }
    }
  }

  const renderFinder = (xStart: number, yStart: number) => {
    const x = xStart * cellSize;
    const y = yStart * cellSize;
    const width = 7 * cellSize;
    const innerX = (xStart + 2) * cellSize;
    const innerY = (yStart + 2) * cellSize;
    const innerWidth = 3 * cellSize;

    return (
      <g key={`${xStart}-${yStart}`}>
        {/* Outer border (rounded) */}
        <rect
          x={x}
          y={y}
          width={width}
          height={width}
          rx={cellSize * 1.5}
          fill="none"
          stroke={color}
          strokeWidth={cellSize}
        />
        {/* Inner square (rounded) */}
        <rect
          x={innerX}
          y={innerY}
          width={innerWidth}
          height={innerWidth}
          rx={cellSize * 0.75}
          fill={color}
        />
      </g>
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Top Left */}
      {renderFinder(0, 0)}
      {/* Top Right */}
      {renderFinder(qrSize - 7, 0)}
      {/* Bottom Left */}
      {renderFinder(0, qrSize - 7)}
      {/* Dots */}
      {circles}
    </svg>
  );
}
