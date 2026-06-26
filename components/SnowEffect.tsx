"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number; // size/radius
  d: number; // speed
  swing: number; // drift sway
  swingStep: number; // drift start
  color?: string;
  w?: number;
  h?: number;
  rotation?: number;
  rotationSpeed?: number;
}

interface SnowEffectProps {
  activeTheme: string;
}

const CONFETTI_COLORS = ["#D42F2F", "#1E5128", "#D4AF37", "#FF4081", "#8C52FF", "#2A734D", "#EBD48F", "#FDFBF7"];

export function SnowEffect({ activeTheme }: SnowEffectProps) {
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

    // Particles array
    const numParticles = activeTheme === "newyear" ? 100 : 70;
    const particles: Particle[] = [];

    const createParticle = (initY = false): Particle => {
      const radius = activeTheme === "christmas" 
        ? Math.random() * 3.5 + 1.2 
        : activeTheme === "eid" 
        ? Math.random() * 4 + 2 
        : activeTheme === "valentine"
        ? Math.random() * 5 + 4
        : Math.random() * 4 + 3; // newyear confetti size

      return {
        x: Math.random() * width,
        y: initY ? Math.random() * height : -15,
        r: radius,
        d: activeTheme === "valentine" 
          ? Math.random() * 0.6 + 0.3 // slow drift for hearts
          : activeTheme === "newyear"
          ? Math.random() * 1.5 + 1.0 // faster fall for confetti
          : Math.random() * 0.9 + 0.4, // standard drift
        swing: Math.random() * 0.02 + 0.005,
        swingStep: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        w: Math.random() * 8 + 6,
        h: Math.random() * 4 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.03 - 0.015,
      };
    };

    for (let i = 0; i < numParticles; i++) {
      particles.push(createParticle(true));
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      c.moveTo(x, y + r / 4);
      c.bezierCurveTo(x, y - r / 2, x - r, y - r / 2, x - r, y + r / 4);
      c.bezierCurveTo(x - r, y + r, x, y + r * 1.3, x, y + r * 1.6);
      c.bezierCurveTo(x, y + r * 1.3, x + r, y + r, x + r, y + r / 4);
      c.bezierCurveTo(x + r, y - r / 2, x, y - r / 2, x, y + r / 4);
    };

    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      // 4-point star
      c.moveTo(x, y - r);
      c.lineTo(x + r / 3, y - r / 3);
      c.lineTo(x + r, y);
      c.lineTo(x + r / 3, y + r / 3);
      c.lineTo(x, y + r);
      c.lineTo(x - r / 3, y + r / 3);
      c.lineTo(x - r, y);
      c.lineTo(x - r / 3, y - r / 3);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (activeTheme === "christmas") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        for (let i = 0; i < numParticles; i++) {
          const p = particles[i];
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);

          // Update position
          p.y += p.d;
          p.swingStep += p.swing;
          p.x += Math.sin(p.swingStep) * 0.4;

          // Recycle
          if (p.y > height + 10 || p.x > width + 10 || p.x < -10) {
            particles[i] = createParticle(false);
          }
        }
        ctx.fill();
      } else if (activeTheme === "eid") {
        ctx.fillStyle = "rgba(212, 175, 55, 0.85)"; // Gold stars
        ctx.beginPath();
        for (let i = 0; i < numParticles; i++) {
          const p = particles[i];
          drawStar(ctx, p.x, p.y, p.r);

          p.y += p.d;
          p.swingStep += p.swing;
          p.x += Math.sin(p.swingStep) * 0.3;

          if (p.y > height + 10 || p.x > width + 10 || p.x < -10) {
            particles[i] = createParticle(false);
          }
        }
        ctx.fill();
      } else if (activeTheme === "valentine") {
        ctx.fillStyle = "rgba(194, 24, 91, 0.7)"; // Rose hearts
        ctx.beginPath();
        for (let i = 0; i < numParticles; i++) {
          const p = particles[i];
          drawHeart(ctx, p.x, p.y, p.r);

          p.y += p.d;
          p.swingStep += p.swing;
          p.x += Math.sin(p.swingStep) * 0.2;

          if (p.y > height + 15 || p.x > width + 15 || p.x < -15) {
            particles[i] = createParticle(false);
          }
        }
        ctx.fill();
      } else if (activeTheme === "newyear") {
        // Draw colorful confetti
        for (let i = 0; i < numParticles; i++) {
          const p = particles[i];

          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.rotation !== undefined) {
            ctx.rotate(p.rotation);
          }
          ctx.fillStyle = p.color || "#D4AF37";
          ctx.fillRect(-(p.w || 8) / 2, -(p.h || 4) / 2, p.w || 8, p.h || 4);
          ctx.restore();

          p.y += p.d;
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }
          p.swingStep += p.swing;
          p.x += Math.sin(p.swingStep) * 0.5;

          if (p.y > height + 10 || p.x > width + 10 || p.x < -10) {
            particles[i] = createParticle(false);
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [activeTheme]);

  return activeTheme === "default" ? null : (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999] w-screen h-screen"
    />
  );
}
