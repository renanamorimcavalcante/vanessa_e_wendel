import { useEffect, useRef } from "react";
import petalBranca from "../assets/decor/petala-branca.png";
import petalRosa from "../assets/decor/petala-rosa.png";
import folhas1 from "../assets/decor/folhas-1.png";
import folha2 from "../assets/decor/folha-2.png";
import folha4 from "../assets/decor/folha-4.png";
import duasFolhas from "../assets/decor/2-folhas.png";

/**
 * Pétalas e folhas caindo (canvas 2D) — versão otimizada.
 *
 * Diferenças para a versão do convite da Sofia (que travava):
 *  - Canvas do tamanho da TELA (antes: 6 telas de altura, redesenhado inteiro a cada frame).
 *  - Sem `ctx.filter = blur()` por frame: o desfoque é pré-renderizado UMA vez em sprites.
 *  - Menos partículas (26 desktop / 18 celular) e devicePixelRatio limitado a 1.5.
 *  - Pausa quando a aba está oculta; desligado se o usuário pede "reduzir movimento".
 */
const SOURCES = [petalBranca, petalBranca, petalBranca, petalRosa, folhas1, folha2, folha4, duasFolhas];

type Sprite = HTMLCanvasElement;
type Particle = {
  x: number; y: number; size: number;
  speedX: number; speedY: number;
  rotation: number; rotationSpeed: number;
  opacity: number; sprite: Sprite;
  vx: number; vy: number;
};

/** Desenha a imagem num canvas pequeno, opcionalmente já desfocada. */
const makeSprite = (img: HTMLImageElement, size: number, blur: number): Sprite => {
  const pad = Math.ceil(blur * 2);
  const c = document.createElement("canvas");
  c.width = c.height = size + pad * 2;
  const g = c.getContext("2d");
  if (g) {
    if (blur > 0 && "filter" in g) g.filter = `blur(${blur}px)`;
    g.drawImage(img, pad, pad, size, size);
  }
  return c;
};

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 18 : 26;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;
    let lastScroll = window.scrollY;
    const mouse = { x: -9999, y: -9999 };
    const particles: Particle[] = [];

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const build = (imgs: HTMLImageElement[]) => {
      for (let i = 0; i < COUNT; i++) {
        const img = imgs[Math.floor(Math.random() * imgs.length)];
        const roll = Math.random();
        const size = roll < 0.45 ? 10 + Math.random() * 16 : roll < 0.85 ? 26 + Math.random() * 22 : 50 + Math.random() * 30;
        const blur = size > 50 && Math.random() < 0.5 ? 2 + Math.random() * 2 : 0;
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: Math.random() * 0.3 + 0.12,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.012,
          opacity: Math.random() * 0.3 + 0.2,
          sprite: makeSprite(img, Math.round(size * dpr), blur * dpr),
          vx: 0,
          vy: 0,
        });
      }
    };

    const tick = () => {
      if (!running) return;
      // efeito parallax: ao rolar a página, as partículas "sobem" um pouco
      const sy = window.scrollY;
      const dScroll = (sy - lastScroll) * 0.25;
      lastScroll = sy;

      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = ((150 - d) / 150) * 0.35;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.speedX + p.vx;
        p.y += p.speedY + p.vy - dScroll;
        p.rotation += p.rotationSpeed;

        const m = p.size;
        if (p.x < -m) p.x = W + m;
        else if (p.x > W + m) p.x = -m;
        if (p.y > H + m) p.y = -m;
        else if (p.y < -m) p.y = H + m;

        const s = p.sprite.width / dpr;
        ctx.globalAlpha = p.opacity;
        ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.rotation);
        ctx.drawImage(p.sprite, -s / 2, -s / 2, s, s);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    // carrega imagens e começa
    let cancelled = false;
    Promise.all(
      SOURCES.map(
        (src) =>
          new Promise<HTMLImageElement | null>((res) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = () => res(null);
            img.src = src;
          }),
      ),
    ).then((imgs) => {
      if (cancelled) return;
      build(imgs.filter((i): i is HTMLImageElement => i !== null));
      raf = requestAnimationFrame(tick);
    });

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        lastScroll = window.scrollY;
        raf = requestAnimationFrame(tick);
      } else cancelAnimationFrame(raf);
    };

    window.addEventListener("resize", resize);
    if (!isMobile) window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

export default ParticleField;
