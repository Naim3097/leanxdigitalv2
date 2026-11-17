// Progressive enhancements. Every page is complete and usable without this file: it only adds
// momentum scrolling, the live scroll position, nav colour changes, menu behaviour, heading colour
// waves, blocks rising in, cursor and hover details, carousel dragging, tabs and count-ups. Nothing here
// runs when it isn't needed. Wherever text is split into letters for an effect, the letters are hidden
// from assistive technology and a plain copy of the words is kept for it.
import Lenis from 'lenis';

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const wide = () => innerWidth >= 768;

/* ---------- Momentum scrolling ----------
   Wheel and trackpad input is eased so the page glides to a stop instead of halting. Touch screens
   keep their own native momentum. Off when the visitor prefers reduced motion. Scroll-linked CSS
   animations follow the eased position, so every scene moves with the same glide. */
// Apple trackpads and mice send finer wheel steps, so they get slightly less easing, as on the reference.
const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
const lenis = reduceMotion
  ? undefined
  : new Lenis({
      lerp: isMac ? 0.1 : 0.08,
      smoothWheel: true,
      autoRaf: true,
      anchors: { duration: 1.2, easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      prevent: (node) => Boolean(node.closest?.('.menu-panel, [data-lenis-prevent]')),
    });

/* ---------- Pause animations (footer) ----------
   Stops everything that loops on its own, site-wide, and remembers the choice on this device. The hero
   video listens for the same choice (scripts/hero.ts). */
const motionToggle = document.querySelector<HTMLButtonElement>('.motion-toggle');
if (motionToggle && !reduceMotion) {
  const read = () => {
    try {
      return localStorage.getItem('lxd-motion') === 'paused';
    } catch {
      return false;
    }
  };
  const apply = (paused: boolean) => {
    root.classList.toggle('motion-paused', paused);
    motionToggle.textContent = paused ? 'Play animations' : 'Pause animations';
  };
  motionToggle.hidden = false;
  apply(read());
  motionToggle.addEventListener('click', () => {
    const paused = !root.classList.contains('motion-paused');
    try {
      if (paused) localStorage.setItem('lxd-motion', 'paused');
      else localStorage.removeItem('lxd-motion');
    } catch {
      /* storage unavailable: the choice lasts for this visit only */
    }
    apply(paused);
    // Only a click tells the hero; on load it reads the stored choice itself.
    document.dispatchEvent(new CustomEvent('lxd:motion', { detail: { paused } }));
  });
}

/* ---------- Nav pill: scroll progress and colour over dark surfaces ---------- */
const pill = document.querySelector<HTMLElement>('.navpill');
const progress = pill?.querySelector<HTMLElement>('.navpill-progress');

if (pill && progress) {
  let queued = false;
  const paint = () => {
    queued = false;
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? Math.round(Math.min(1, Math.max(0, scrollY / max)) * 100) : 0;
    const text = `${p}%`;
    if (progress.textContent !== text) progress.textContent = text;
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(paint);
    }
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  paint();

  // A one-pixel point at the pill's centre: the pill turns white while a dark surface covers that point,
  // unless a light surface inside it covers the point too (the light panels of the homepage's path section).
  // A point, not a line, so dark cards beside the pill don't count, and panels that slide sideways switch
  // the pill exactly as their edge passes its centre.
  const dark = new Set<Element>();
  const light = new Set<Element>();
  let observer: IntersectionObserver | undefined;
  const watch = () => {
    observer?.disconnect();
    dark.clear();
    light.clear();
    const r = pill.getBoundingClientRect();
    // One pixel right of the pill's centre. IntersectionObserver also counts a box that only touches the
    // root, so a point exactly on the seam between two panels (every two-panel hold of the path scene when
    // the window width is even, as on a Mac or iPad) touched both and the light one always won. Off the
    // seam, the incoming right-hand panel decides at every width.
    const x = Math.round(r.left + r.width / 2) + 1;
    const y = Math.round(r.top + r.height / 2);
    // clientWidth leaves out the scrollbar, which the observer's viewport doesn't include either
    const right = Math.max(0, root.clientWidth - x - 1);
    const bottom = Math.max(0, innerHeight - y - 1);
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const set = (e.target as HTMLElement).dataset.surface === 'light' ? light : dark;
          if (e.isIntersecting) set.add(e.target);
          else set.delete(e.target);
        }
        pill.classList.toggle('is-inverted', dark.size > 0 && light.size === 0);
      },
      { rootMargin: `-${y}px -${right}px -${bottom}px -${x}px` },
    );
    document.querySelectorAll('[data-surface]').forEach((el) => observer!.observe(el));
  };
  watch();
  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(watch, 200);
  });
}

/* ---------- Menu: Escape, tap outside, close on link, focus, closing animation ---------- */
const menu = document.querySelector<HTMLDetailsElement>('.navpill-menu');
if (menu) {
  const summary = menu.querySelector('summary')!;
  const panel = menu.querySelector<HTMLElement>('.menu-panel')!;
  let closing = false;

  // Closing is one motion: the items fade, the panel folds down into the pill, and the backdrop, the X
  // and the label change back at the same time (html.menu-closing), instead of one after another.
  const close = (restoreFocus = true) => {
    if (!menu.open || closing) return;
    if (reduceMotion) {
      menu.open = false;
    } else {
      closing = true;
      root.classList.add('menu-closing');
      const items = Array.from(panel.children).map((el) =>
        (el as HTMLElement).animate(
          [
            { opacity: 1, transform: 'none' },
            { opacity: 0, transform: 'translateY(8px)' },
          ],
          { duration: 150, easing: 'cubic-bezier(0.32, 0, 0.67, 0)', fill: 'forwards' },
        ),
      );
      const fold = panel.animate(
        [
          { opacity: 1, clipPath: 'inset(-2rem -4.5rem -4.5rem round 32px)' },
          { opacity: 0, clipPath: 'inset(100% -4.5rem 0 round 32px)' },
        ],
        { duration: 300, delay: 70, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', fill: 'forwards' },
      );
      fold.onfinish = () => {
        menu.open = false;
        closing = false;
        root.classList.remove('menu-closing');
        for (const a of [...items, fold]) a.cancel();
      };
    }
    if (restoreFocus) summary.focus();
  };

  summary.addEventListener('click', (e) => {
    if (menu.open) {
      e.preventDefault();
      close(false);
    }
  });
  menu.addEventListener('toggle', () => {
    root.classList.toggle('menu-open', menu.open);
    if (menu.open) lenis?.stop();
    else lenis?.start();
    if (menu.open) panel.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) close();
  });
  document.querySelector('.menu-backdrop')?.addEventListener('click', () => close(false));
  panel.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) close(false);
  });
  // The open menu covers the page, so focus stays with it: tabbing past its last link (or back past the
  // pill's first one) closes it, and focus carries on to content that can be seen.
  const pillEl = menu.closest('.navpill');
  pillEl?.addEventListener('focusout', (e) => {
    const to = (e as FocusEvent).relatedTarget as Node | null;
    if (menu.open && to && !pillEl.contains(to)) close(false);
  });
}

/* ---------- Colour-wave headings: split into words and characters ---------- */
const spectrum = [
  [143, 230, 244],
  [91, 124, 240],
  [153, 62, 255],
  [241, 60, 164],
];
const accentAt = (t: number) => {
  const seg = Math.min(2.999, Math.max(0, t) * 3);
  const i = Math.floor(seg);
  const f = seg - i;
  const [a, b] = [spectrum[i], spectrum[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(' ')})`;
};

const canScrollTimeline = CSS.supports('animation-timeline: view()');
// A view timeline follows the nearest scroll container. If a heading sits inside an element with
// overflow hidden, auto or scroll, its timeline would never move and the letters could stay hidden,
// so such headings are left as plain text.
const insideScroller = (el: HTMLElement) => {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const s = getComputedStyle(p);
    if (!/^(visible|clip)$/.test(s.overflowX) || !/^(visible|clip)$/.test(s.overflowY)) return true;
  }
  return false;
};
// A heading inside a pinned (sticky) stage barely moves while the page scrolls under it, so a
// scroll-linked reveal would crawl or stop half done. Those play once in time, like the first screen.
const insideSticky = (el: HTMLElement) => {
  for (let p: HTMLElement | null = el; p && p !== document.body; p = p.parentElement) {
    if (getComputedStyle(p).position === 'sticky') return true;
  }
  return false;
};
// The visible letters are aria-hidden; this plain copy is what screen readers and the heading's
// accessible name use.
const readable = (text: string) => {
  const copy = document.createElement('span');
  copy.className = 'visually-hidden';
  copy.textContent = text;
  return copy;
};
const timed: HTMLElement[] = [];
if (!reduceMotion && canScrollTimeline) {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((heading) => {
    if (insideScroller(heading)) return;
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    const total = nodes.reduce((n, t) => n + (t.data.replace(/\s/g, '').length || 0), 0);
    if (!total || total > 220) return;
    let index = 0;
    for (const node of nodes) {
      const frag = document.createDocumentFragment();
      for (const part of node.data.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.append(document.createTextNode(part));
          continue;
        }
        const word = document.createElement('span');
        word.className = 'word';
        for (const ch of Array.from(part)) {
          const span = document.createElement('span');
          span.className = 'ch';
          span.textContent = ch;
          span.style.setProperty('--i', String(index));
          span.style.setProperty('--accent', accentAt(index / Math.max(1, total - 1)));
          index++;
          word.append(span);
        }
        frag.append(word);
      }
      const visual = document.createElement('span');
      visual.setAttribute('aria-hidden', 'true');
      visual.append(frag);
      node.replaceWith(readable(node.data), visual);
    }
    heading.style.setProperty('--n', String(total));
    // Scroll-linked when the reveal can complete as the visitor scrolls. A heading already on the first
    // screen, or too close to the end of a short page to reach mid-screen, plays once in time instead,
    // so no letter can be left waiting for scroll that will never come.
    const top = heading.getBoundingClientRect().top + scrollY;
    const reachable = top - innerHeight * 0.45 <= root.scrollHeight - innerHeight;
    if (top < innerHeight * 0.9 || !reachable || insideSticky(heading)) timed.push(heading);
    else heading.classList.add('split-ready');
  });
  if (timed.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const h of timed) {
      h.classList.add('split-time');
      io.observe(h);
    }
  }
}

/* ---------- Blocks rise into place ----------
   Played once, in time, as each block comes into view, so nothing waits half-faded for more scrolling.
   Blocks that enter together follow each other by 80 ms. */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const risers = document.querySelectorAll<HTMLElement>('[data-rise]');
  if (risers.length) {
    root.classList.add('rise-ready');
    const io = new IntersectionObserver(
      (entries) => {
        let k = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty('--rise-delay', `${Math.min(k++, 4) * 80}ms`);
          el.classList.add('is-in');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    risers.forEach((el) => io.observe(el));
  }
}

/* ---------- Bracket cursor ---------- */
if (finePointer && !reduceMotion && wide()) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span>[</span><span>]</span>';
  document.body.append(cursor);
  let x = -100;
  let y = -100;
  let cx = x;
  let cy = y;
  let raf = 0;
  const loop = () => {
    cx += (x - cx) * 0.28;
    cy += (y - cy) * 0.28;
    cursor.style.transform = `translate3d(${cx - 24}px, ${cy - 10}px, 0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
  };
  const interactive = 'a, button, summary, input, select, textarea, label, [data-no-cursor], [data-carousel]';
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      const over = (e.target as Element).closest?.(interactive);
      if (!over && !cursor.classList.contains('is-on')) {
        cx = x;
        cy = y;
      }
      cursor.classList.toggle('is-on', !over);
      if (!raf) raf = requestAnimationFrame(loop);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
}

/* ---------- Magnetic buttons ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      btn.style.setProperty('--mx', `${(dx * 10).toFixed(1)}px`);
      btn.style.setProperty('--my', `${(dy * 8).toFixed(1)}px`);
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}

/* ---------- Rolling link hover: letters roll up to a copy of themselves ----------
   Each word rolls on its own, so long labels still wrap between words. The copy under each letter is
   drawn by CSS from data-c, so the words are not repeated in the page. The current page's link keeps its
   plain label: the rolling letters are inline blocks, which its underline would not reach. */
if (finePointer && !reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-roll]:not([aria-current])').forEach((link) => {
    const label = link.firstChild;
    if (!label || label.nodeType !== Node.TEXT_NODE) return;
    const text = (label.textContent || '').trim();
    if (!text) return;
    const visual = document.createElement('span');
    visual.className = 'roll-wrap';
    visual.setAttribute('aria-hidden', 'true');
    let i = 0;
    text.split(/\s+/).forEach((word, w) => {
      if (w) visual.append(' ');
      const roll = document.createElement('span');
      roll.className = 'roll';
      const line = document.createElement('span');
      line.className = 'roll-line';
      for (const c of Array.from(word)) {
        const letter = document.createElement('span');
        letter.textContent = c;
        letter.dataset.c = c;
        letter.style.setProperty('--i', String(i++));
        line.append(letter);
      }
      roll.append(line);
      visual.append(roll);
    });
    label.replaceWith(readable(text), visual);
  });
}

/* ---------- Carousels: arc transforms, momentum drag, gliding buttons, DRAG badge ---------- */
document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((wrap) => {
  const track = wrap.querySelector<HTMLElement>('.carousel-track');
  if (!track) return;
  // The previous and next buttons only show once they work (without this script the strip still scrolls)
  wrap.classList.add('carousel-ready');
  const cards = Array.from(track.children) as HTMLElement[];
  let queued = false;
  const arc = () => {
    queued = false;
    // From layout, not the transformed boxes, so the tilt and dip follow the cards exactly.
    const mid = track.scrollLeft + track.clientWidth / 2;
    for (const card of cards) {
      const d = (card.offsetLeft + card.offsetWidth / 2 - mid) / card.offsetWidth;
      card.style.setProperty('--d', d.toFixed(3));
      card.style.setProperty('--ad', Math.abs(d).toFixed(3));
    }
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(arc);
    }
  };
  if (!reduceMotion) {
    wrap.classList.add('is-arc');
    track.addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue, { passive: true });
    arc();
  }

  // Glide: ease-out-quart to a card's centre, 280 to 460 ms depending on distance. Snapping is
  // suspended while the track moves, so the glide is never cut short.
  let glideRaf = 0;
  const centreOf = (c: HTMLElement) => c.offsetLeft + c.offsetWidth / 2 - track.clientWidth / 2;
  const nearest = (x: number) =>
    cards.reduce((best, c) => (Math.abs(centreOf(c) - x) < Math.abs(centreOf(best) - x) ? c : best), cards[0]);
  const glideTo = (x: number) => {
    cancelAnimationFrame(glideRaf);
    const from = track.scrollLeft;
    const to = Math.max(0, Math.min(x, track.scrollWidth - track.clientWidth));
    if (Math.abs(to - from) < 1) return;
    if (reduceMotion) {
      track.scrollLeft = to;
      return;
    }
    const duration = Math.min(460, Math.max(280, Math.abs(to - from) * 0.55));
    const t0 = performance.now();
    track.classList.add('is-gliding');
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      track.scrollLeft = from + (to - from) * (1 - Math.pow(1 - t, 4));
      if (t < 1) glideRaf = requestAnimationFrame(step);
      else track.classList.remove('is-gliding');
    };
    glideRaf = requestAnimationFrame(step);
  };
  const current = () => cards.indexOf(nearest(track.scrollLeft));
  wrap.querySelector('[data-prev]')?.addEventListener('click', () => glideTo(centreOf(cards[Math.max(0, current() - 1)])));
  wrap.querySelector('[data-next]')?.addEventListener('click', () => glideTo(centreOf(cards[Math.min(cards.length - 1, current() + 1)])));
  // A card reached with the keyboard glides to the centre, fully in view.
  track.addEventListener('focusin', (e) => {
    const card = (e.target as Element).closest<HTMLElement>('.carousel-card');
    if (card) glideTo(centreOf(card));
  });

  if (!finePointer) return;
  const badge = wrap.querySelector<HTMLElement>('.drag-badge');
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    cancelAnimationFrame(glideRaf);
    down = true;
    moved = false;
    startX = lastX = e.clientX;
    startLeft = track.scrollLeft;
    lastT = performance.now();
    velocity = 0;
    track.classList.add('is-dragging');
  });
  addEventListener('pointermove', (e) => {
    if (badge) {
      const r = wrap.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      // Not over the previous and next buttons, which the badge would cover
      const onNav = (e.target as Element | null)?.closest?.('.carousel-nav');
      const on = inside && e.pointerType === 'mouse' && !onNav;
      const place = () =>
        (badge.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0) translate(-50%, -50%) scale(${down ? 0.88 : 1})`);
      if (on && !badge.classList.contains('is-on')) {
        // Jump to the pointer without the follow transition, then fade in there.
        badge.style.transition = 'opacity 0.2s';
        place();
        void badge.offsetWidth;
        badge.style.removeProperty('transition');
      } else if (inside) place();
      badge.classList.toggle('is-on', on);
    }
    if (!down) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    velocity = velocity * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
    lastX = e.clientX;
    lastT = now;
    if (Math.abs(e.clientX - startX) > 4) moved = true;
    track.scrollLeft = startLeft - (e.clientX - startX);
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    track.classList.remove('is-dragging');
    // Momentum: keep travelling in the flick's direction, then settle on the nearest card.
    glideTo(centreOf(nearest(track.scrollLeft - velocity * 220)));
  });
  track.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );
});

/* ---------- Tabs (Nexova stage): real tabs with arrow keys; a pill slides under the active tab ---------- */
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((wrap) => {
  const list = wrap.querySelector<HTMLElement>('[role="tablist"]');
  const tabs = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(wrap.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  const blob = wrap.querySelector<HTMLElement>('.tab-blob');
  if (!list || !tabs.length) return;
  wrap.classList.add('tabs-ready');
  const select = (i: number, focus = false) => {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    wrap.style.setProperty('--tab', String(i));
    if (blob) {
      const t = tabs[i];
      blob.style.width = `${t.offsetWidth}px`;
      blob.style.transform = `translateX(${t.offsetLeft}px)`;
    }
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowLeft' || k === 'Home' || k === 'End') {
        e.preventDefault();
        const n = tabs.length;
        const next = k === 'Home' ? 0 : k === 'End' ? n - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + n) % n;
        select(next, true);
      }
    });
  });
  select(0);
  addEventListener('resize', () => select(Number(wrap.style.getPropertyValue('--tab')) || 0), { passive: true });
});

/* ---------- Count-up: real numbers already in the text count up once ---------- */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const final = el.dataset.final || el.textContent || '';
        const m = final.match(/(\d[\d,]*(?:\.\d+)?)/);
        if (!m) continue;
        const target = Number(m[1].replace(/,/g, ''));
        const decimals = (m[1].split('.')[1] || '').length;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 2000);
          const v = target * (1 - (1 - t) * (1 - t));
          el.textContent = final.replace(
            m[1],
            v.toLocaleString('en-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
          );
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = final;
        };
        requestAnimationFrame(tick);
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  counters.forEach((c) => {
    // These figures are decorative copies (the real values are in the text), so showing 0 is safe.
    const text = c.textContent || '';
    const m = text.match(/(\d[\d,]*(?:\.\d+)?)/);
    if (m) {
      const decimals = (m[1].split('.')[1] || '').length;
      c.dataset.final = text;
      c.textContent = text.replace(m[1], (0).toLocaleString('en-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
    }
    io.observe(c);
  });
  // A printout shows every figure at its real value, not the 0 it waits at until it scrolls into view
  addEventListener('beforeprint', () =>
    counters.forEach((c) => {
      io.unobserve(c);
      if (c.dataset.final) c.textContent = c.dataset.final;
    }),
  );
}
