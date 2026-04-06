
import { useEffect, useState } from "react";

const COLORS = [
  
  "#6366f1",
  "#8b5cf6",
  "#7c3aed",
  "#4f46e5",
  "#3b82f6",
  "#60a5fa",

  
  "#06b6d4",
  "#22d3ee",
  "#0ea5e9",
  "#38bdf8",

  
  "#ec4899",
  "#f472b6",
  "#e879f9",
  "#d946ef",

  
  "#14b8a6",
  "#10b981",
  "#2dd4bf",

  
  "#f97316",
  "#fb7185",
  "#f43f5e",

  
  "#1e1b4b",
  "#312e81",
  "#0f172a",
  "#1e293b",
];



export default function Blobs() {
  const [blobs, setBlobs] = useState([]);

  useEffect(() => {
    function spawnBlob() {
      const id = crypto.randomUUID?.() ?? String(Math.random());

      const size = Math.floor(Math.random() * 300) + 200; // 200–500px
      const top = Math.random() * 100; // 0–100%
      const left = Math.random() * 100; // 0–100%
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      const blob = { id, size, top, left, color };

      setBlobs((prev) => [...prev, blob]);

      
      setTimeout(() => {
        setBlobs((prev) => prev.filter((b) => b.id !== id));
      }, 18000);
    }

    
    spawnBlob();

    
    const interval = setInterval(() => {
      spawnBlob();
    }, 5000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="blob-anim absolute rounded-full blur-3xl mix-blend-multiply"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            top: `${blob.top}%`,
            left: `${blob.left}%`,
            background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
