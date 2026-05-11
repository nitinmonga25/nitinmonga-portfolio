"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const isPointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isPointerFine) return;
    setIsTouch(false);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const handleInteractive = () => {
      const interactives = document.querySelectorAll("a, button, [data-cursor='pointer']");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          ringRef.current?.classList.add("scale-[1.4]");
        });
        el.addEventListener("mouseleave", () => {
          ringRef.current?.classList.remove("scale-[1.4]");
        });
      });
    };

    handleInteractive();
    const observer = new MutationObserver(handleInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      const lerp = 0.12;
      ring.current.x += (pos.current.x - ring.current.x) * lerp;
      ring.current.y += (pos.current.y - ring.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px) scale(${ringRef.current.classList.contains("scale-[1.4]") ? 1.4 : 1})`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
    };
  }, [mounted, visible]);

  if (!mounted || isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--color-gold)] pointer-events-none z-[9999] transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-[var(--color-gold)] pointer-events-none z-[9999] transition-[opacity,transform] duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ willChange: "transform" }}
      />
    </>
  );
}
