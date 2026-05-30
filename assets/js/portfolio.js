/* ============================================
   SANKET PATIL — PORTFOLIO ENGINE
   Particles, Animations, Interactions
   ============================================ */

(function () {
  'use strict';

  // --- Particle Network Canvas ---
  class ParticleNetwork {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: null, y: null };
      this.resize();
      this.init();
      this.bindEvents();
      this.animate();
    }

    resize() {
      this.w = this.canvas.width = this.canvas.parentElement.offsetWidth;
      this.h = this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    init() {
      const count = Math.min(Math.floor((this.w * this.h) / 12000), 100);
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          o: Math.random() * 0.5 + 0.1,
        });
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => { this.resize(); this.init(); });
      this.canvas.addEventListener('mousemove', (e) => {
        const r = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - r.left;
        this.mouse.y = e.clientY - r.top;
      });
      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const mult = window.systemLoadMultiplier || 1.0;
        p.x += p.vx * mult;
        p.y += p.vy * mult;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;

        // Mouse repulsion
        if (this.mouse.x !== null) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const f = (150 - dist) / 150 * 0.02;
            p.vx += dx * f;
            p.vy += dy * f;
          }
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 212, 255, ${p.o})`;
        this.ctx.fill();

        // Connections
        for (let j = i + 1; j < this.particles.length; j++) {
          const q = this.particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(q.x, q.y);
            this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }
      requestAnimationFrame(() => this.animate());
    }
  }

  // --- Skills 3D Nebula Constellation ---
  class SkillsConstellation {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.mouse = { x: null, y: null };
      this.nodes = [];
      this.dust = [];
      this.angleY = 0.0015;
      this.angleX = 0.0008;
      this.rotX = 0.3;
      this.rotY = 0;
      this.targetRotX = 0.3;
      this.targetRotY = 0;
      
      this.categories = {
        languages: { label: 'Languages', color: '#00d4ff', items: [['Go', 95], ['Rust', 75], ['Python', 80], ['PHP', 85], ['TypeScript', 75], ['SQL', 90], ['C', 60], ['C++', 55], ['Bash', 80]] },
        databases: { label: 'Databases', color: '#10b981', items: [['PostgreSQL', 88], ['MongoDB', 80], ['MySQL', 90], ['Redis', 85], ['RocksDB', 65], ['ClickHouse', 70], ['Cassandra', 60], ['Elasticsearch', 75]] },
        infra: { label: 'Infrastructure', color: '#7c3aed', items: [['Kafka', 82], ['Docker', 85], ['gRPC', 78], ['WebSockets', 82], ['Linux', 90], ['Kubernetes', 75], ['AWS', 78], ['Prometheus', 70], ['Grafana', 72], ['Nginx', 80], ['Envoy', 65], ['Git', 88]] },
        frameworks: { label: 'Frameworks', color: '#f59e0b', items: [['Gin', 90], ['FastAPI', 70], ['Node.js', 80], ['Laravel', 75], ['Tauri', 65], ['Next.js', 70], ['React', 68], ['Fiber', 75], ['CGO', 80], ['WebAssembly', 60]] },
      };

      this.resize();
      this.createConstellation();
      this.bindEvents();
      this.animate();
    }

    resize() {
      const p = this.canvas.parentElement;
      this.w = this.canvas.width = p.offsetWidth;
      this.h = this.canvas.height = p.offsetHeight;
    }

    createConstellation() {
      this.nodes = [];
      this.dust = [];

      let index = 0;
      const cats = Object.entries(this.categories);
      
      cats.forEach(([catKey, cat]) => {
        cat.items.forEach(([name, level]) => {
          const theta = index * 2.4;
          const r = 40 + index * 5.8;
          
          this.nodes.push({
            name,
            level,
            catKey,
            color: cat.color,
            x: Math.cos(theta) * r,
            y: (Math.random() - 0.5) * 50,
            z: Math.sin(theta) * r,
            r: 4 + (level / 100) * 10,
            hover: false
          });
          index++;
        });
      });

      for (let i = 0; i < 60; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const dist = 50 + Math.random() * 220;

        this.dust.push({
          x: dist * Math.sin(phi) * Math.cos(theta),
          y: dist * Math.sin(phi) * Math.sin(theta),
          z: dist * Math.cos(phi),
          o: Math.random() * 0.4 + 0.1
        });
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => { this.resize(); this.createConstellation(); });
      this.canvas.addEventListener('mousemove', (e) => {
        const r = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - r.left;
        this.mouse.y = e.clientY - r.top;

        const cx = this.w / 2;
        const cy = this.h / 2;
        this.targetRotY = ((this.mouse.x - cx) / cx) * 0.4;
        this.targetRotX = 0.3 - ((this.mouse.y - cy) / cy) * 0.4;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
        this.targetRotX = 0.3;
        this.targetRotY = 0;
      });
    }

    rotate3D(point, rx, ry) {
      let y1 = point.y * Math.cos(rx) - point.z * Math.sin(rx);
      let z1 = point.y * Math.sin(rx) + point.z * Math.cos(rx);
      
      let x2 = point.x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -point.x * Math.sin(ry) + z1 * Math.cos(ry);

      return { x: x2, y: y1, z: z2 };
    }

    draw3DOrbitalRing(radius, rx, ry, cx, cy, focalLength) {
      this.ctx.beginPath();
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const rawPt = {
          x: Math.cos(theta) * radius,
          y: 0,
          z: Math.sin(theta) * radius
        };
        const rotPt = this.rotate3D(rawPt, rx, ry);
        const scale = focalLength / (focalLength + rotPt.z);
        const px = cx + rotPt.x * scale;
        const py = cy + rotPt.y * scale;

        if (i === 0) this.ctx.moveTo(px, py);
        else this.ctx.lineTo(px, py);
      }
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    animate() {
      this.ctx.clearRect(0, 0, this.w, this.h);
      const cx = this.w / 2;
      const cy = this.h / 2;
      const focalLength = 350;

      this.rotX += (this.targetRotX - this.rotX) * 0.05;
      this.rotY += (this.targetRotY - this.rotY) * 0.05;

      this.nodes.forEach(n => {
        const rotated = this.rotate3D(n, this.angleX, this.angleY);
        n.x = rotated.x;
        n.y = rotated.y;
        n.z = rotated.z;
      });

      this.dust.forEach(d => {
        const rotated = this.rotate3D(d, this.angleX, this.angleY);
        d.x = rotated.x;
        d.y = rotated.y;
        d.z = rotated.z;
      });

      this.dust.forEach(d => {
        const rot = this.rotate3D(d, this.rotX, this.rotY);
        const scale = focalLength / (focalLength + rot.z);
        const px = cx + rot.x * scale;
        const py = cy + rot.y * scale;
        
        if (px >= 0 && px <= this.w && py >= 0 && py <= this.h) {
          const alpha = d.o * scale * Math.max(0, 1 - (rot.z / 350));
          this.ctx.beginPath();
          this.ctx.arc(px, py, 1 * scale, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          this.ctx.fill();
        }
      });

      this.draw3DOrbitalRing(80, this.rotX, this.rotY, cx, cy, focalLength);
      this.draw3DOrbitalRing(150, this.rotX, this.rotY, cx, cy, focalLength);
      this.draw3DOrbitalRing(220, this.rotX, this.rotY, cx, cy, focalLength);

      const projected = this.nodes.map((n, idx) => {
        const rot = this.rotate3D(n, this.rotX, this.rotY);
        const scale = focalLength / (focalLength + rot.z);
        const px = cx + rot.x * scale;
        const py = cy + rot.y * scale;

        let hover = false;
        if (this.mouse.x !== null) {
          const dx = px - this.mouse.x;
          const dy = py - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < (n.r * scale) + 12) hover = true;
        }

        return {
          idx,
          name: n.name,
          level: n.level,
          color: n.color,
          catKey: n.catKey,
          px, py,
          z: rot.z,
          scale,
          r: n.r * scale,
          hover
        };
      });

      const hoveredNode = projected.find(p => p.hover);

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];

          const sameCat = a.catKey === b.catKey;
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (sameCat && dist < 140) {
            let alpha = 0.05 * (1 - dist / 140) * a.scale;
            if (hoveredNode) {
              if (hoveredNode.idx === a.idx || hoveredNode.idx === b.idx) {
                alpha = 0.3 * (1 - dist / 140);
              } else {
                alpha *= 0.2;
              }
            }
            
            this.ctx.beginPath();
            this.ctx.moveTo(a.px, a.py);
            this.ctx.lineTo(b.px, b.py);
            this.ctx.lineWidth = sameCat && hoveredNode && (hoveredNode.idx === a.idx || hoveredNode.idx === b.idx) ? 1.0 : 0.4;
            this.ctx.strokeStyle = `rgba(${this.hexToRgb(sameCat ? a.color : '#ffffff')}, ${alpha})`;
            this.ctx.stroke();
          }
        }
      }

      const sortedNodes = [...projected].sort((a, b) => b.z - a.z);

      sortedNodes.forEach(p => {
        let isFocused = hoveredNode ? (hoveredNode.idx === p.idx) : false;
        let isRelated = hoveredNode ? (hoveredNode.catKey === p.catKey) : false;
        let opacity = hoveredNode ? (isFocused || isRelated ? 1.0 : 0.15) : 0.7;

        if (p.hover) {
          this.ctx.beginPath();
          this.ctx.arc(p.px, p.py, p.r + 14, 0, Math.PI * 2);
          const g = this.ctx.createRadialGradient(p.px, p.py, p.r, p.px, p.py, p.r + 14);
          g.addColorStop(0, p.color + '44');
          g.addColorStop(1, 'transparent');
          this.ctx.fillStyle = g;
          this.ctx.fill();
        }

        this.ctx.beginPath();
        this.ctx.arc(p.px, p.py, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.hover ? 1.0 : opacity})`;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(p.px, p.py, p.r + 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(${this.hexToRgb(p.color)}, ${isFocused ? 0.6 : 0.15})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        if (isFocused || (p.r > 7 && !hoveredNode)) {
          this.ctx.font = isFocused ? '600 11px Inter, sans-serif' : '500 8px Inter, sans-serif';
          this.ctx.fillStyle = isFocused ? '#ffffff' : 'rgba(228, 228, 231, 0.4)';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(p.name, p.px, p.py + p.r + 11);
        }
      });

      if (hoveredNode) {
        this.drawHUD(hoveredNode);
      }

      requestAnimationFrame(() => this.animate());
    }

    hexToRgb(hex) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
    }

    drawHUD(n) {
      const hx = this.mouse.x + 15;
      const hy = this.mouse.y + 15;
      const hw = 150;
      const hh = 75;

      this.ctx.save();
      this.ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
      this.ctx.strokeStyle = n.color + '55';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.roundRect(hx, hy, hw, hh, 6);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = n.color + '15';
      this.ctx.fillRect(hx + 1, hy + 1, hw - 2, 18);
      
      this.ctx.font = '700 8px JetBrains Mono, monospace';
      this.ctx.fillStyle = n.color;
      this.ctx.textAlign = 'left';
      this.ctx.fillText('[SYSTEM NODE ACTIVE]', hx + 8, hy + 12);

      this.ctx.font = '500 10px Inter, sans-serif';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(`Tech: ${n.name}`, hx + 8, hy + 34);

      this.ctx.font = '500 8px JetBrains Mono, monospace';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fillText(`Category: ${n.catKey.toUpperCase()}`, hx + 8, hy + 48);

      this.ctx.fillStyle = 'rgba(255,255,255,0.08)';
      this.ctx.fillRect(hx + 8, hy + 58, hw - 16, 4);

      this.ctx.fillStyle = n.color;
      this.ctx.fillRect(hx + 8, hy + 58, (hw - 16) * (n.level / 100), 4);

      this.ctx.font = '600 7px JetBrains Mono, monospace';
      this.ctx.fillStyle = n.color;
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`${n.level}%`, hx + hw - 8, hy + 48);

      this.ctx.restore();
    }
  }

  // --- Architecture Flow Diagram ---
  class ArchDiagram {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.t = 0;
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    resize() {
      const p = this.canvas.parentElement;
      this.w = this.canvas.width = p.offsetWidth;
      this.h = this.canvas.height = p.offsetHeight;
    }

    drawBox(x, y, w, h, label, sub, color) {
      // Glass box
      this.ctx.fillStyle = 'rgba(255,255,255,0.03)';
      this.ctx.strokeStyle = color + '44';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
      this.ctx.fill();
      this.ctx.stroke();

      // Label
      this.ctx.font = '600 12px Inter, sans-serif';
      this.ctx.fillStyle = '#e4e4e7';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, x, y - 2);
      if (sub) {
        this.ctx.font = '400 9px JetBrains Mono, monospace';
        this.ctx.fillStyle = color;
        this.ctx.fillText(sub, x, y + 14);
      }
    }

    drawArrow(x1, y1, x2, y2, color, progress) {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      // Line
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = color + '33';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Animated dot
      const p = ((this.t * 0.3 + progress * 100) % 100) / 100;
      const px = x1 + dx * p, py = y1 + dy * p;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      // Glow
      this.ctx.beginPath();
      this.ctx.arc(px, py, 8, 0, Math.PI * 2);
      const g = this.ctx.createRadialGradient(px, py, 2, px, py, 8);
      g.addColorStop(0, color + '66');
      g.addColorStop(1, 'transparent');
      this.ctx.fillStyle = g;
      this.ctx.fill();
    }

    animate() {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.t++;

      const cx = this.w / 2, cy = this.h / 2;
      const bw = 110, bh = 50;
      const spacing = this.w < 600 ? 130 : 170;

      // Nodes
      const nodes = [
        { x: cx - spacing * 2, y: cy, label: 'Client', sub: 'REST / WS', color: '#f59e0b' },
        { x: cx - spacing, y: cy, label: 'API Gateway', sub: 'Go / Gin', color: '#00d4ff' },
        { x: cx, y: cy - 60, label: 'Kafka', sub: 'Events', color: '#7c3aed' },
        { x: cx, y: cy + 60, label: 'Service', sub: 'Go / gRPC', color: '#10b981' },
        { x: cx + spacing, y: cy - 40, label: 'PostgreSQL', sub: 'Primary', color: '#00d4ff' },
        { x: cx + spacing, y: cy + 40, label: 'Redis', sub: 'Cache', color: '#f59e0b' },
        { x: cx + spacing * 2, y: cy, label: 'WebSocket', sub: 'Real-time', color: '#7c3aed' },
      ];

      // Arrows
      const arrows = [
        [0, 1, '#f59e0b', 0],
        [1, 2, '#00d4ff', 0.2],
        [1, 3, '#00d4ff', 0.4],
        [2, 3, '#7c3aed', 0.3],
        [3, 4, '#10b981', 0.5],
        [3, 5, '#10b981', 0.6],
        [3, 6, '#10b981', 0.7],
      ];

      arrows.forEach(([a, b, col, p]) => {
        this.drawArrow(nodes[a].x, nodes[a].y, nodes[b].x, nodes[b].y, col, p);
      });

      nodes.forEach(n => {
        this.drawBox(n.x, n.y, bw, bh, n.label, n.sub, n.color);
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  // --- Typewriter Effect ---
  class Typewriter {
    constructor(el, strings, speed = 80) {
      this.el = el;
      this.strings = strings;
      this.speed = speed;
      this.current = 0;
      this.charIndex = 0;
      this.deleting = false;
      this.tick();
    }

    tick() {
      const str = this.strings[this.current];
      if (!this.deleting) {
        this.charIndex++;
        if (this.charIndex > str.length) {
          setTimeout(() => { this.deleting = true; this.tick(); }, 2000);
          return;
        }
      } else {
        this.charIndex--;
        if (this.charIndex < 0) {
          this.deleting = false;
          this.current = (this.current + 1) % this.strings.length;
          setTimeout(() => this.tick(), 400);
          return;
        }
      }
      this.el.textContent = str.substring(0, this.charIndex);
      setTimeout(() => this.tick(), this.deleting ? 40 : this.speed);
    }
  }

  // --- Scroll Reveal (Intersection Observer) ---
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .timeline-item, .project-card, .thought-card').forEach(el => {
      observer.observe(el);
    });
  }

  // --- Nav scroll state ---
  function initNav() {
    const nav = document.querySelector('.nav');
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);

      // Active link
      let current = '';
      sections.forEach(s => {
        const top = s.offsetTop - 200;
        if (window.scrollY >= top) current = s.getAttribute('id');
      });
      links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    });

    // Mobile menu
    const btn = document.querySelector('.nav-menu-btn');
    const menu = document.querySelector('.mobile-menu');
    const close = document.querySelector('.mobile-close');
    if (btn && menu) {
      btn.addEventListener('click', () => menu.classList.add('open'));
      close.addEventListener('click', () => menu.classList.remove('open'));
      menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => menu.classList.remove('open'));
      });
    }
  }

  // --- Smooth scroll for nav links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Counter animation ---
  function animateCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const end = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * end) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  }

  // --- Terminal typing animation ---
  function initTerminal() {
    const lines = document.querySelectorAll('.terminal-line');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          lines.forEach((line, i) => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            setTimeout(() => {
              line.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
              line.style.opacity = '1';
              line.style.transform = 'translateX(0)';
            }, i * 200);
          });
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    const terminal = document.querySelector('.contact-terminal');
    if (terminal) observer.observe(terminal);
  }

  // --- About 3D Concurrency Topology ---
  class AboutFlow {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.nodes = [];
      this.connections = [];
      this.packets = [];
      this.angleX = 0.002;
      this.angleY = 0.003;
      this.targetRotX = 0;
      this.targetRotY = 0;
      this.rotX = 0;
      this.rotY = 0;
      this.mouse = { x: null, y: null };
      
      this.resize();
      this.initNodes();
      this.bindEvents();
      this.animate();
    }

    resize() {
      const p = this.canvas.parentElement;
      this.w = this.canvas.width = p.offsetWidth;
      this.h = this.canvas.height = p.offsetHeight;
    }

    initNodes() {
      this.nodes = [];
      const numNodes = 18;
      const radius = 100;

      // Create nodes distributed on a 3D sphere shell
      for (let i = 0; i < numNodes; i++) {
        const phi = Math.acos(-1 + (2 * i) / numNodes);
        const theta = Math.sqrt(numNodes * Math.PI) * phi;

        this.nodes.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta),
          z: radius * Math.cos(phi),
          baseColor: i % 3 === 0 ? '#00d4ff' : (i % 3 === 1 ? '#7c3aed' : '#10b981'),
          size: Math.random() * 2 + 3
        });
      }

      // Generate connections based on 3D distance
      this.connections = [];
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const dx = this.nodes[i].x - this.nodes[j].x;
          const dy = this.nodes[i].y - this.nodes[j].y;
          const dz = this.nodes[i].z - this.nodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < 130) {
            this.connections.push({ from: i, to: j });
            // Add a packet traveler
            if (Math.random() > 0.4) {
              this.packets.push({
                connIdx: this.connections.length - 1,
                progress: Math.random(),
                speed: Math.random() * 0.008 + 0.003,
                direction: Math.random() > 0.5 ? 1 : -1
              });
            }
          }
        }
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => this.resize());
      this.canvas.addEventListener('mousemove', (e) => {
        const r = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - r.left;
        this.mouse.y = e.clientY - r.top;
        
        // Influence target rotations from screen center
        const cx = this.w / 2;
        const cy = this.h / 2;
        this.targetRotY = ((this.mouse.x - cx) / cx) * 0.5;
        this.targetRotX = -((this.mouse.y - cy) / cy) * 0.5;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
        this.targetRotX = 0;
        this.targetRotY = 0;
      });
    }

    rotate3D(node, rx, ry) {
      // Rotate around X axis
      let y1 = node.y * Math.cos(rx) - node.z * Math.sin(rx);
      let z1 = node.y * Math.sin(rx) + node.z * Math.cos(rx);
      
      // Rotate around Y axis
      let x2 = node.x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -node.x * Math.sin(ry) + z1 * Math.cos(ry);

      return { x: x2, y: y1, z: z2 };
    }

    animate() {
      this.ctx.clearRect(0, 0, this.w, this.h);
      const cx = this.w / 2;
      const cy = this.h / 2;
      const focalLength = 300;

      // Smooth dampening
      this.rotX += (this.targetRotX + this.angleX - this.rotX) * 0.05;
      this.rotY += (this.targetRotY + this.angleY - this.rotY) * 0.05;

      // Project coordinates
      const projected = this.nodes.map(n => {
        const rotated = this.rotate3D(n, this.rotX, this.rotY);
        
        n.x = rotated.x;
        n.y = rotated.y;
        n.z = rotated.z;

        const scale = focalLength / (focalLength + rotated.z);
        return {
          x: cx + rotated.x * scale,
          y: cy + rotated.y * scale,
          z: rotated.z,
          scale: scale,
          color: n.baseColor,
          size: n.size * scale
        };
      });

      // Sort connections by depth (back to front)
      const sortedConns = this.connections.map((c, idx) => {
        const avgZ = (projected[c.from].z + projected[c.to].z) / 2;
        return { c, idx, avgZ };
      }).sort((a, b) => b.avgZ - a.avgZ);

      // Draw connections
      sortedConns.forEach(({ c }) => {
        const p1 = projected[c.from];
        const p2 = projected[c.to];
        const alpha = Math.max(0.02, Math.min(0.25, (300 - (p1.z + p2.z) / 2) / 400));
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      });

      // Update and draw traveling packets
      this.packets.forEach(p => {
        const c = this.connections[p.connIdx];
        const p1 = projected[c.from];
        const p2 = projected[c.to];

        p.progress += p.speed * p.direction;
        if (p.progress > 1) {
          p.progress = 1;
          p.direction = -1;
        } else if (p.progress < 0) {
          p.progress = 0;
          p.direction = 1;
        }

        const px = p1.x + (p2.x - p1.x) * p.progress;
        const py = p1.y + (p2.y - p1.y) * p.progress;
        const scale = p1.scale + (p2.scale - p1.scale) * p.progress;
        
        this.ctx.beginPath();
        this.ctx.arc(px, py, 4 * scale, 0, Math.PI * 2);
        this.ctx.fillStyle = p1.color + '44';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(px, py, 1.8 * scale, 0, Math.PI * 2);
        this.ctx.fillStyle = p1.color;
        this.ctx.fill();
      });

      // Sort and draw nodes
      const sortedNodes = projected.map((p, idx) => ({ p, idx })).sort((a, b) => b.p.z - a.p.z);
      sortedNodes.forEach(({ p }) => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color + '15';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        this.ctx.strokeStyle = p.color + '22';
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  // --- Custom Sci-fi Cursor ---
  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const dot = document.getElementById('customCursorDot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Dynamic hover scaling
    const hoverElements = document.querySelectorAll('a, button, .project-card, .thought-card, .linkedin-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // --- Scroll Progress Bar ---
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      bar.style.width = progress + '%';
    });
  }

  // --- 3D Card Hover Tilt Effect ---
  function initCardTilt() {
    const cards = document.querySelectorAll('.project-card, .thought-card, .linkedin-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 8; // Max 8 degrees tilt
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Expose coordinates for glowing borders
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // --- Live Node Diagnostics Terminal Logs ---
  function initSystemMetrics() {
    const log1 = document.querySelector('.log-line-1');
    const log2 = document.querySelector('.log-line-2');
    const log3 = document.querySelector('.log-line-3');
    const log4 = document.querySelector('.log-line-4');

    if (!log1 || !log2 || !log3 || !log4) return;

    setInterval(() => {
      // Service registry node status
      const registryStatus = Math.random() > 0.1 ? 'active' : 're-indexing';
      const registryColor = registryStatus === 'active' ? 'var(--accent-cyan)' : 'var(--accent-amber)';
      log1.innerHTML = `[Discovery] Consul service registry... <span style="color:${registryColor}">${registryStatus}</span>`;

      // phpgo goroutines count
      const routines = Math.floor(Math.random() * 28) + 8;
      log2.innerHTML = `[Concurrency] phpgo extension running... <span style="color:var(--accent-violet)">${routines} active goroutines</span>`;

      // CacheGate request throughput
      const reqs = Math.floor(Math.random() * 400) + 120;
      const hitRate = (97.5 + Math.random() * 2).toFixed(1);
      log3.innerHTML = `[Proxy] CacheGate routing... <span style="color:var(--accent-emerald)">${reqs} req/sec</span> (hit rate: ${hitRate}%)`;

      // General hardware and kernel stats
      const mem = (40.5 + Math.random() * 4.2).toFixed(1);
      const syscalls = Math.floor(Math.random() * 80) + 80;
      log4.innerHTML = `[System] Mem: <span style="color:var(--text-primary)">${mem}MB</span> | Threads: 8 | Syscalls: <span style="color:var(--accent-amber)">${syscalls}/s</span>`;
    }, 1500);
  }

  // --- Hero Cluster Monitor Dashboard ---
  function initClusterMonitor() {
    const nodeGrid = document.getElementById('monitorNodeGrid');
    const nodeCountEl = document.getElementById('monitorNodeCount');
    const goroutinesEl = document.getElementById('monitorGoroutines');
    const reqSecEl = document.getElementById('monitorReqSec');
    const chartCanvas = document.getElementById('heroThroughputChart');
    const statusTag = document.querySelector('.panel-status-tag');

    const btnScale = document.getElementById('btnScaleGrid');
    const btnFailover = document.getElementById('btnFailover');
    const btnInject = document.getElementById('btnInjectLoad');

    if (!nodeGrid || !chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    let nodes = [
      { id: 'L-N01', port: 8001, status: 'active' },
      { id: 'L-N02', port: 8002, status: 'active' },
      { id: 'L-N03', port: 8003, status: 'active' },
      { id: 'L-N04', port: 8004, status: 'active' },
      { id: 'L-N05', port: 8005, status: 'active' },
      { id: 'L-N06', port: 8006, status: 'active' },
      { id: 'L-N07', port: 8007, status: 'active' },
      { id: 'L-N08', port: 8008, status: 'active' },
      { id: 'L-N09', port: 8009, status: 'active' }
    ];

    let isScaled = false;
    let failoverActive = false;
    let highLoadActive = false;
    let highLoadTimeout = null;

    let chartData = Array(30).fill(20);

    // Render nodes
    function renderNodes() {
      nodeGrid.innerHTML = '';
      nodes.forEach(n => {
        const item = document.createElement('div');
        item.className = `node-item ${n.status === 'failed' ? 'failed' : ''}`;
        item.innerHTML = `
          <div class="node-dot"></div>
          <div class="node-lbl">${n.id}</div>
          <div class="node-sub">:${n.port}</div>
        `;
        nodeGrid.appendChild(item);
      });
      nodeCountEl.textContent = nodes.length;
    }

    renderNodes();

    // Chart animation loop
    function animateChart() {
      ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
      const w = chartCanvas.width = chartCanvas.parentElement.offsetWidth;
      const h = chartCanvas.height = chartCanvas.parentElement.offsetHeight;

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let i = 0; i < h; i += 15) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }

      // Draw load curve
      ctx.beginPath();
      const step = w / (chartData.length - 1);
      
      chartData.forEach((val, index) => {
        const x = index * step;
        const y = h - (val / 100) * (h - 20) - 10;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = highLoadActive ? '#7c3aed' : '#00d4ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw gradient under curve
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, highLoadActive ? 'rgba(124, 58, 237, 0.15)' : 'rgba(0, 212, 255, 0.15)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Dot at latest value
      const lastX = w;
      const lastY = h - (chartData[chartData.length - 1] / 100) * (h - 20) - 10;
      ctx.beginPath();
      ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = highLoadActive ? '#a78bfa' : '#38bdf8';
      ctx.fill();

      requestAnimationFrame(animateChart);
    }
    requestAnimationFrame(animateChart);

    // Push values to chart data periodic
    setInterval(() => {
      let nextVal = 0;
      if (highLoadActive) {
        nextVal = 70 + Math.random() * 25; // 70-95% load
      } else {
        nextVal = 15 + Math.random() * 20; // 15-35% load
      }
      if (failoverActive) {
        nextVal += 15; // Spike slightly due to failover overhead
      }
      chartData.shift();
      chartData.push(nextVal);

      // Update indicators
      const baseRoutines = isScaled ? 32 : 24;
      const gRoutines = failoverActive 
        ? baseRoutines + Math.floor(Math.random() * 12) + 8
        : baseRoutines + Math.floor(Math.random() * 6) - 3;
      goroutinesEl.textContent = gRoutines;

      const baseReq = highLoadActive ? 920 : 140;
      const reqCount = baseReq + Math.floor(Math.random() * 60) - 30;
      reqSecEl.textContent = reqCount;
    }, 200);

    // Scale Mesh
    btnScale.addEventListener('click', () => {
      isScaled = !isScaled;
      if (isScaled) {
        btnScale.textContent = 'Shrink Mesh';
        nodes.push(
          { id: 'L-N10', port: 8010, status: 'active' },
          { id: 'L-N11', port: 8011, status: 'active' },
          { id: 'L-N12', port: 8012, status: 'active' }
        );
      } else {
        btnScale.textContent = 'Scale Mesh';
        nodes = nodes.slice(0, 9);
      }
      renderNodes();
    });

    // Failover
    btnFailover.addEventListener('click', () => {
      if (failoverActive) return;
      failoverActive = true;

      const targetIdx = 3;
      if (nodes[targetIdx]) {
        nodes[targetIdx].status = 'failed';
      }
      renderNodes();

      statusTag.textContent = 'FAILOVER';
      statusTag.style.color = '#ef4444';
      statusTag.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      statusTag.style.background = 'rgba(239, 68, 68, 0.1)';

      setTimeout(() => {
        if (nodes[targetIdx]) {
          nodes[targetIdx].status = 'active';
        }
        renderNodes();
        
        statusTag.textContent = 'STABLE';
        statusTag.style.color = '';
        statusTag.style.borderColor = '';
        statusTag.style.background = '';
        
        failoverActive = false;
      }, 3000);
    });

    // Inject Load
    btnInject.addEventListener('click', () => {
      if (highLoadActive) return;
      highLoadActive = true;
      
      window.systemLoadMultiplier = 3.5;

      statusTag.textContent = 'HIGH LOAD';
      statusTag.style.color = '#f59e0b';
      statusTag.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      statusTag.style.background = 'rgba(245, 158, 11, 0.1)';

      btnInject.textContent = 'System Spiked';
      btnInject.style.borderColor = 'var(--accent-cyan)';
      btnInject.style.color = 'var(--accent-cyan)';

      clearTimeout(highLoadTimeout);
      highLoadTimeout = setTimeout(() => {
        highLoadActive = false;
        window.systemLoadMultiplier = 1.0;
        
        statusTag.textContent = 'STABLE';
        statusTag.style.color = '';
        statusTag.style.borderColor = '';
        statusTag.style.background = '';
        
        btnInject.textContent = 'Inject Load';
        btnInject.style.borderColor = '';
        btnInject.style.color = '';
      }, 6000);
    });
  }

  // --- Initialize Everything ---
  document.addEventListener('DOMContentLoaded', () => {
    // Particle Network
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) new ParticleNetwork(heroCanvas);

    // About Flow
    const aboutCanvas = document.getElementById('aboutCanvas');
    if (aboutCanvas) new AboutFlow(aboutCanvas);

    // Skills Constellation
    const skillsCanvas = document.getElementById('skillsCanvas');
    if (skillsCanvas) new SkillsConstellation(skillsCanvas);

    // Architecture Diagram
    const archCanvas = document.getElementById('archCanvas');
    if (archCanvas) new ArchDiagram(archCanvas);

    // Typewriter
    const typeEl = document.getElementById('heroTypewriter');
    if (typeEl) {
      new Typewriter(typeEl, [
        'Backend Engineering',
        'Distributed Systems',
        'Go & Rust Development',
        'Event-Driven Architecture',
        'Real-time Data Pipelines',
        'Microservices at Scale',
        'Language Design & Compilers',
        'API Design & Infrastructure',
      ], 70);
    }

    initNav();
    initSmoothScroll();
    initScrollReveal();
    animateCounters();
    initTerminal();
    
    // Premium Interactive Scripts
    initCustomCursor();
    initScrollProgress();
    initCardTilt();
    initSystemMetrics();
    initClusterMonitor();
    initThoughtsBento();
    initProjectVisuals();
  });

  // --- Thoughts Bento Interactive Panels ---
  function initThoughtsBento() {
    // 1. Kafka Logger Simulator
    const logger = document.getElementById('bentoKafkaLogger');
    if (logger) {
      const logs = [
        'Ingesting stream partition=2 offset=14041',
        'Commit offset partition=2 offset=14041 success',
        'Payload decoded bytes=1042 latency=4ms',
        'Forwarding message to event bus...',
        'Db write transaction committed successfully',
        'Heartbeat broadcast group=systems host=n01',
        'Partition rebalance triggered by node join',
        'Rebalance complete: assigned partitions [0,1,2]',
        'Sync replica sync-pool-3 current-lag=0',
        'Memory buffer flushed to disk blocks=12'
      ];
      let logIndex = 0;
      
      function addLogLine() {
        const time = new Date().toTimeString().split(' ')[0];
        const log = logs[logIndex];
        logIndex = (logIndex + 1) % logs.length;
        
        let message = `[${time}] <span style="color:var(--accent-cyan)">[Ingestion]</span> ${log}`;
        if (Math.random() > 0.8) {
          message = `[${time}] <span style="color:#ef4444">[Warning]</span> Socket connection failure, auto-retrying...`;
          setTimeout(() => {
            const recoveryTime = new Date().toTimeString().split(' ')[0];
            const logDiv = document.createElement('div');
            logDiv.className = 'log-item';
            logDiv.innerHTML = `[${recoveryTime}] <span style="color:var(--accent-emerald)">[Healed]</span> Re-established socket broker connection. Ingesting active.`;
            logger.appendChild(logDiv);
            logger.scrollTop = logger.scrollHeight;
            if (logger.children.length > 7) logger.removeChild(logger.firstChild);
          }, 800);
        }
        
        const logDiv = document.createElement('div');
        logDiv.className = 'log-item';
        logDiv.innerHTML = message;
        logger.appendChild(logDiv);
        logger.scrollTop = logger.scrollHeight;
        
        if (logger.children.length > 7) {
          logger.removeChild(logger.firstChild);
        }
      }
      
      setInterval(addLogLine, 1800);
      for(let i=0; i<4; i++) addLogLine();
    }

    // 2. Goroutine Simulator
    const w1 = document.getElementById('gWorker1');
    const w2 = document.getElementById('gWorker2');
    const w3 = document.getElementById('gWorker3');
    const slots = document.querySelectorAll('#gQueueSlots .slot');
    
    if (w1 && w2 && w3) {
      const workers = [
        { el: w1, status: 'IDLE', timer: 0 },
        { el: w2, status: 'IDLE', timer: 0 },
        { el: w3, status: 'IDLE', timer: 0 }
      ];
      
      let slotIndex = 0;

      setInterval(() => {
        slots.forEach((s, idx) => {
          s.classList.toggle('active', idx === slotIndex);
        });
        slotIndex = (slotIndex + 1) % slots.length;

        workers.forEach(w => {
          if (w.timer <= 0) {
            if (Math.random() > 0.4) {
              w.status = 'WORKING';
              w.el.classList.add('working');
              w.el.querySelector('.status').textContent = 'ACTIVE';
              w.timer = Math.floor(Math.random() * 4) + 2;
            } else {
              w.status = 'IDLE';
              w.el.classList.remove('working');
              w.el.querySelector('.status').textContent = 'IDLE';
            }
          } else {
            w.timer--;
          }
        });
      }, 800);
    }

    // 3. Tools Switching Mockup
    const toolBtns = document.querySelectorAll('.tools-header .tool-btn');
    const previewEl = document.getElementById('toolCodePreview');
    if (toolBtns.length && previewEl) {
      const toolConfigs = {
        cachegate: {
          code: `$ cachegate --port=8080 --upstream=http://api.backend`,
          status: 'STATUS: Proxying cache layer... OK',
          color: 'var(--accent-emerald)'
        },
        quickforge: {
          code: `$ quickforge --spec=openapi.yaml --output=./main.go`,
          status: 'STATUS: Generated Gin scaffolding in 24ms',
          color: 'var(--accent-cyan)'
        }
      };

      toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          toolBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const config = toolConfigs[btn.getAttribute('data-tool')];
          if (config) {
            previewEl.innerHTML = `
              <code>${config.code}</code>
              <div class="tool-status" style="color:${config.color}">${config.status}</div>
            `;
          }
        });
      });
    }

    // 4. Traffic Slider Mockup
    const slider = document.getElementById('bentoSlider');
    const sliderVal = document.getElementById('bentoSliderVal');
    const latencyVal = document.getElementById('bentoLatencyVal');
    const dbConns = document.getElementById('bentoDbConns');
    const bufferRate = document.getElementById('bentoBufferRate');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        sliderVal.textContent = `${val.toFixed(1)}x`;
        
        const latency = Math.floor(12 + Math.pow(val, 2.3) * 2.2);
        latencyVal.textContent = `${latency}ms`;

        const conns = Math.floor(14 + val * 7.5);
        dbConns.textContent = `${conns}/100`;

        if (val < 4) {
          bufferRate.textContent = 'NORMAL';
          bufferRate.style.color = 'var(--accent-emerald)';
        } else if (val < 8) {
          bufferRate.textContent = 'WARNING: ELEVATED';
          bufferRate.style.color = 'var(--accent-amber)';
        } else {
          bufferRate.textContent = 'CRITICAL: BACKPRESSURE';
          bufferRate.style.color = '#ef4444';
        }
      });
    }
  }

  // --- Project Micro-Visualization Apps ---
  function initProjectVisuals() {
    // 1. CacheGate Live Hit Rate
    const cacheHit = document.getElementById('pCacheHit');
    const cacheFill = document.getElementById('pCacheFill');
    if (cacheHit && cacheFill) {
      setInterval(() => {
        const rate = (97.8 + Math.random() * 1.8).toFixed(2);
        cacheHit.textContent = `${rate}%`;
        cacheFill.style.width = `${rate}%`;
      }, 2000);
    }

    // 2. Byte Fortress Active Node Disk
    const nodeRoot = document.getElementById('nodeRoot');
    const nodeDb = document.getElementById('nodeDb');
    const nodeWal = document.getElementById('nodeWal');
    if (nodeRoot && nodeDb && nodeWal) {
      const nodes = [nodeRoot, nodeDb, nodeWal];
      let activeIndex = 0;
      setInterval(() => {
        nodes.forEach(n => n.classList.remove('active'));
        activeIndex = (activeIndex + 1) % nodes.length;
        nodes[activeIndex].classList.add('active');
      }, 1500);
    }

    // 3. Quick Forge REST API Tester Mockup
    const runBtn = document.getElementById('btnForgeRun');
    const respEl = document.getElementById('forgeResponse');
    if (runBtn && respEl) {
      runBtn.addEventListener('click', () => {
        respEl.textContent = 'loading connection...';
        setTimeout(() => {
          respEl.innerHTML = JSON.stringify({
            status: 200,
            data: { id: "user_491", name: "Sanket Patil", role: "admin" }
          }, null, 2);
        }, 300);
      });
    }

    // 4. Kriti Compiler Simulation Loop
    const progressFill = document.getElementById('compilerProgress');
    const compilerLbl = document.getElementById('compilerLbl');
    if (progressFill && compilerLbl) {
      const steps = [
        { label: 'LEXER STATUS: SCANNING...', pct: 15 },
        { label: 'PARSER STATUS: AST LOADED', pct: 45 },
        { label: 'COMPILER: TYPECHECKING...', pct: 75 },
        { label: 'RUNTIME: COMPILED SUCCESSFULLY', pct: 100 }
      ];
      let stepIndex = 0;
      setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        const current = steps[stepIndex];
        compilerLbl.textContent = current.label;
        progressFill.style.width = `${current.pct}%`;
        if (current.pct === 100) {
          compilerLbl.style.color = 'var(--accent-cyan)';
        } else {
          compilerLbl.style.color = '';
        }
      }, 2000);
    }

    // 5. LogPose Micro Mesh Node Monitor
    const n1 = document.getElementById('logposeN1');
    const n2 = document.getElementById('logposeN2');
    const n3 = document.getElementById('logposeN3');
    if (n1 && n2 && n3) {
      const nodes = [n1, n2, n3];
      setInterval(() => {
        const target = nodes[Math.floor(Math.random() * nodes.length)];
        if (target.classList.contains('healthy')) {
          target.className = 'm-node warning';
          setTimeout(() => {
            target.className = 'm-node healthy';
          }, 1200);
        }
      }, 2500);
    }
  }

})();
