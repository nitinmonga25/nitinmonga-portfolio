"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const mount = mountRef.current;
    if (!mount) return;

    gsap.registerPlugin(ScrollTrigger);

    // ─── Renderer ──────────────────────────────────────────────────────────
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ─── Scene + Camera ───────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, 0, 3);

    // ─── Bezier Patch Particle Surface ───────────────────────────────────
    // 4×4 control points forming an organic S-curve surface (bezier pen reference)
    const cpZ = [
      [0.0, 0.2, 0.4, 0.0],
      [0.2, 0.9, 0.7, 0.3],
      [0.3, 0.8, 0.5, 0.1],
      [0.0, 0.3, 0.2, 0.0],
    ];

    const COUNT = 2500;
    const sqN = 50; // 50×50 grid
    const positions = new Float32Array(COUNT * 3);
    const originalPositions = new Float32Array(COUNT * 3);

    for (let i = 0; i < sqN; i++) {
      for (let j = 0; j < sqN; j++) {
        const u = i / (sqN - 1);
        const v = j / (sqN - 1);
        const idx = (i * sqN + j) * 3;

        const x = (u - 0.5) * 3.2;
        const y = (v - 0.5) * 4.2;

        // Bicubic bezier surface for z depth
        const z0 = cubicBezier(u, cpZ[0][0], cpZ[0][1], cpZ[0][2], cpZ[0][3]);
        const z1 = cubicBezier(u, cpZ[1][0], cpZ[1][1], cpZ[1][2], cpZ[1][3]);
        const z2 = cubicBezier(u, cpZ[2][0], cpZ[2][1], cpZ[2][2], cpZ[2][3]);
        const z3 = cubicBezier(u, cpZ[3][0], cpZ[3][1], cpZ[3][2], cpZ[3][3]);
        const z = cubicBezier(v, z0, z1, z2, z3) * 0.75 - 0.2;

        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;
        originalPositions[idx] = x;
        originalPositions[idx + 1] = y;
        originalPositions[idx + 2] = z;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff3d00,
      size: 0.02,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
      opacity: 0,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Fade in particles
    gsap.to(material, { opacity: 0.75, duration: 2.0, delay: 0.5, ease: "power2.out" });

    // ─── Mouse tracking ───────────────────────────────────────────────────
    const mouseNDC = new THREE.Vector2(9999, 9999); // off-screen default
    const mouse3D = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const intersectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    mount.addEventListener("mousemove", onMouseMove);

    // ─── GSAP scroll: camera zoom out as hero scrolls away ───────────────
    const heroSection = mount.closest("[data-hero]") || mount.parentElement?.parentElement;
    const scrollTween = gsap.to(camera.position, {
      z: 6,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection ?? "body",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // ─── Animation loop ───────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Resolve mouse in 3D world (on z=0 plane)
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(intersectPlane, mouse3D);

      const posArr = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        // Organic drift — sin/cos noise at low frequency
        let x = ox + Math.sin(t * 0.22 + oy * 1.4 + i * 0.01) * 0.055;
        let y = oy + Math.cos(t * 0.18 + ox * 1.4 + i * 0.01) * 0.055;
        const z = oz + Math.sin(t * 0.28 + ox + oy) * 0.03;

        // Mouse attraction — pull nearby particles toward cursor
        const dx = x - mouse3D.x;
        const dy = y - mouse3D.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 1.44) { // within 1.2 units
          const dist = Math.sqrt(distSq);
          const force = ((1.2 - dist) / 1.2) * 0.28;
          x -= (dx / dist) * force;
          y -= (dy / dist) * force;
        }

        posArr[i3] = x;
        posArr[i3 + 1] = y;
        posArr[i3 + 2] = z;
      }
      geometry.attributes.position.needsUpdate = true;

      // Slow organic rotation
      points.rotation.y = Math.sin(t * 0.07) * 0.12;
      points.rotation.x = Math.cos(t * 0.05) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Resize handler ───────────────────────────────────────────────────
    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);

    // ─── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}
