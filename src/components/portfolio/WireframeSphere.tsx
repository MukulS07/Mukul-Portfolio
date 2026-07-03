import { useEffect, useRef } from "react";

/**
 * Rotating wireframe icosphere drawn on canvas.
 * Sits behind page content, in front of BackgroundFX.
 */
export function WireframeSphere() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = 1;

    // Build an icosphere (icosahedron subdivided once → 42 verts, 120 edges)
    const t = (1 + Math.sqrt(5)) / 2;
    const baseVerts: [number, number, number][] = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ];
    const baseFaces: [number, number, number][] = [
      [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
      [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
      [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
      [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
    ];

    const verts: [number, number, number][] = [];
    const vIndex = new Map<string, number>();
    const addVert = (v: [number, number, number]) => {
      const len = Math.hypot(v[0], v[1], v[2]);
      const n: [number, number, number] = [v[0]/len, v[1]/len, v[2]/len];
      const key = n.map((x) => x.toFixed(5)).join(",");
      const existing = vIndex.get(key);
      if (existing !== undefined) return existing;
      const idx = verts.length;
      verts.push(n);
      vIndex.set(key, idx);
      return idx;
    };
    baseVerts.forEach((v) => addVert(v));
    const edgeSet = new Set<string>();
    const edges: [number, number][] = [];
    const addEdge = (a: number, b: number) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (edgeSet.has(k)) return;
      edgeSet.add(k);
      edges.push([a, b]);
    };
    // subdivide once
    baseFaces.forEach(([a, b, c]) => {
      const va = baseVerts[a], vb = baseVerts[b], vc = baseVerts[c];
      const mid = (p: number[], q: number[]) =>
        [(p[0]+q[0])/2, (p[1]+q[1])/2, (p[2]+q[2])/2] as [number, number, number];
      const ab = addVert(mid(va, vb));
      const bc = addVert(mid(vb, vc));
      const ca = addVert(mid(vc, va));
      const ia = addVert(va), ib = addVert(vb), ic = addVert(vc);
      [[ia,ab],[ab,ib],[ib,bc],[bc,ic],[ic,ca],[ca,ia],[ab,bc],[bc,ca],[ca,ab]]
        .forEach(([x, y]) => addEdge(x, y));
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let start = performance.now();

    // mouse-driven rotation offsets (critically-damped spring smoothing)
    let targetMX = 0, targetMY = 0;
    let mx = 0, my = 0;
    let vx = 0, vy = 0; // velocity for spring
    let lastT = performance.now();
    const onMove = (e: MouseEvent) => {
      targetMX = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
      targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // spring constants — low stiffness + near-critical damping = fluid trail
    const STIFFNESS = 40;
    const DAMPING = 9;

    const draw = (now: number) => {
      if (document.body.classList.contains("fx-off")) {
        ctx.clearRect(0, 0, w, h);
        raf = requestAnimationFrame(draw);
        return;
      }
      const elapsed = (now - start) / 1000;
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      // spring toward target for buttery, non-snappy follow
      const axf = (targetMX - mx) * STIFFNESS - vx * DAMPING;
      const ayf = (targetMY - my) * STIFFNESS - vy * DAMPING;
      vx += axf * dt;
      vy += ayf * dt;
      mx += vx * dt;
      my += vy * dt;
      const ay = reduce ? 0.3 : elapsed * 0.12 + mx * 1.2;
      const ax = reduce ? 0.2 : elapsed * 0.05 + my * 0.9;
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      const cosX = Math.cos(ax), sinX = Math.sin(ax);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.42;
      const persp = R * 2.2;

      ctx.clearRect(0, 0, w, h);

      // project all verts once
      const proj: { x: number; y: number; z: number; s: number }[] = verts.map(([x, y, z]) => {
        // rotate Y then X
        let rx = x * cosY + z * sinY;
        let rz = -x * sinY + z * cosY;
        let ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;
        const scale = persp / (persp - rz * R);
        return {
          x: cx + rx * R * scale,
          y: cy + ry * R * scale,
          z: rz,
          s: scale,
        };
      });

      // Get current theme accent color dynamically
      const accentColor = window.getComputedStyle(canvas).getPropertyValue("--accent").trim() || "oklch(0.82 0.18 235)";

      // edges
      ctx.strokeStyle = accentColor;
      for (const [a, b] of edges) {
        const pa = proj[a], pb = proj[b];
        const zAvg = (pa.z + pb.z) / 2;
        const front = (zAvg + 1) / 2; // 0..1
        const alpha = 0.08 + front * 0.35;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 0.6 + front * 0.4;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // vertex dots
      ctx.fillStyle = accentColor;
      for (const p of proj) {
        const front = (p.z + 1) / 2;
        const a = 0.15 + front * 0.55;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 + front * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Reset alpha
      ctx.globalAlpha = 1.0;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] opacity-60"
    />
  );
}