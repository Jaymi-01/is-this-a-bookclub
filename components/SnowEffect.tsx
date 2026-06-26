"use client";

import { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  r: number; // radius
  d: number; // speed/density
  swing: number; // sway amount
  swingStep: number;
}

export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate snowflakes
    const numSnowflakes = 75;
    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < numSnowflakes; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3.5 + 1.2, // snowflake radius (1.2px to 4.7px)
        d: Math.random() * 0.9 + 0.4, // downward fall speed
        swing: Math.random() * 0.02 + 0.005, // frequency of drift sway
        swingStep: Math.random() * 100, // random start offset for sway
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
      ctx.beginPath();

      for (let i = 0; i < numSnowflakes; i++) {
        const f = snowflakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);

        // Update snowflake coordinates
        f.y += f.d;
        f.swingStep += f.swing;
        f.x += Math.sin(f.swingStep) * 0.4;

        // Reset snowflake back to top when it drifts off canvas bottom or sides
        if (f.y > height + 10 || f.x > width + 10 || f.x < -10) {
          snowflakes[i] = {
            x: Math.random() * width,
            y: -10,
            r: f.r,
            d: f.d,
            swing: f.swing,
            swingStep: f.swingStep,
          };
        }
      }

      ctx.fill();
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999] w-screen h-screen"
    />
  );
}
