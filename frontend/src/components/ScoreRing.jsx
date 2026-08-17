import React from "react";

// percent: 0-100 (drives the ring fill angle)
// label: text shown in the center — defaults to "{percent}%" but pass e.g. "3.8/5" to show raw score instead
export default function ScoreRing({ percent, color, label, size = 76 }) {
  const deg = Math.max(0, Math.min(100, percent)) * 3.6;
  const style = {
    background: `conic-gradient(${color} ${deg}deg, #e5e9f5 ${deg}deg)`,
    width: size,
    height: size,
  };
  const innerSize = size - 16;
  return (
    <div className="score-ring" style={style}>
      <div className="score-ring-inner" style={{ width: innerSize, height: innerSize }}>
        {label ?? `${percent}%`}
      </div>
    </div>
  );
}
