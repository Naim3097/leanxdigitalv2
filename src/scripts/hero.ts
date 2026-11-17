// Homepage hero: the background video, the pause button, where the hero holds while the page rises over
// it, and the scroll fade where browsers can't run it in CSS. Without this file the hero still works: the
// poster (the video's first frame) shows, and the page slides over it as before.
//
// Looping: the file is seamless by itself (its last second dissolves into its first frame). On top of that,
// two <video> elements take turns, so the browser never has to jump back to the start on screen, which is
// where a plain loop attribute can stall or flash. The waiting copy sits paused on its first frame and fades
// in over the last frames of the playing one.

const hero = document.querySelector<HTMLElement>('.hero');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

if (hero) {
  const frame = hero.querySelector<HTMLElement>('.hero-frame');
  const inner = hero.querySelector<HTMLElement>('.hero-inner');
  const toggle = hero.querySelector<HTMLButtonElement>('.hero-toggle');

  /* ---------- Where the hero holds ----------
     A hero taller than the screen (small phones) scrolls until its end is in view, then holds while the
     page rises over it. --hero-over is that extra height; the CSS fade starts after it too. */
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
  document.body.append(probe);
  let over = 0;
  let screenH = probe.offsetHeight;
  const actions = hero.querySelector<HTMLElement>('.actions');
  const measure = () => {
    screenH = probe.offsetHeight;
    over = Math.max(0, Math.round(hero.offsetHeight - screenH));
    hero.style.setProperty('--hero-over', `${over}px`);
    // On phones whose hero is taller than the screen, the CSS lifts the scene by --frame-lift so it sits
    // at the bottom of the first screen rather than below it. It rises at most that far, and never so far
    // that the people (from 62% of the drawn video downwards) come within 12 px of the hero buttons.
    if (frame && inner && actions) {
      hero.style.setProperty('--frame-lift', '0px');
      const base = parseFloat(getComputedStyle(frame).bottom) || 0;
      const drawn = Math.max(frame.offsetHeight, (frame.offsetWidth * 9) / 16);
      const buttonsEnd = inner.offsetTop + actions.offsetTop + actions.offsetHeight;
      const room = hero.offsetHeight - base - 0.38 * drawn - buttonsEnd - 12;
      hero.style.setProperty('--frame-lift', `${Math.max(0, Math.round(Math.min(over, room)))}px`);
    }
  };
  measure();
  new ResizeObserver(measure).observe(hero);
  addEventListener('resize', measure, { passive: true });

  // Keyboard focus on a hero control while the page covers the hero brings the hero back into view, far
  // enough that the control itself shows (the pause button sits near the hero's top on small phones).
  hero.addEventListener('focusin', (e) => {
    const r = (e.target as HTMLElement).getBoundingClientRect();
    const target = Math.min(over, Math.max(0, Math.round(r.top - hero.getBoundingClientRect().top - 12)));
    if (scrollY > target + 1) scrollTo(0, target);
  });

  /* ---------- Scroll fade, for browsers without scroll-driven CSS animations ----------
     Same curve as the CSS: the content drifts up and fades over the first 60% of a screen of scrolling;
     the video eases in a little and fades between 10% and 100%. */
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  const jsFade = !reduce.matches && !CSS.supports('animation-timeline: scroll()');
  const fade = (s: number) => {
    if (!inner || !frame) return;
    const vh = innerHeight;
    const p1 = clamp(s / (vh * 0.6));
    const o1 = p1 < 0.45 ? 1 - (p1 / 0.45) * 0.22 : 0.78 * (1 - (p1 - 0.45) / 0.55);
    // The text and the pause button only fade (never visibility: hidden), so they stay reachable by
    // Shift+Tab; .is-faded (set in onScroll) stops them taking clicks while they can't be seen.
    inner.style.opacity = `${o1}`;
    inner.style.transform = p1 ? `translate3d(0, ${(-7 * p1).toFixed(3)}vh, 0) scale(${1 - 0.035 * p1})` : '';
    const p2 = clamp((s - vh * 0.1) / (vh * 0.9));
    frame.style.opacity = `${1 - p2}`;
    frame.style.transform = p2 ? `scale(${1 + 0.06 * p2})` : '';
    frame.style.visibility = p2 >= 1 ? 'hidden' : '';
    if (toggle) toggle.style.opacity = `${1 - p1}`;
  };

  // The video only plays while some of the hero can still be seen.
  let inView = true;
  let onViewChange: (() => void) | undefined;
  let queued = false;
  const onScroll = () => {
    queued = false;
    const s = scrollY - over;
    if (jsFade) fade(s);
    // The fade (CSS or the one above) has taken the text fully out by 60% of a screen.
    hero.classList.toggle('is-faded', !reduce.matches && s >= innerHeight * 0.6);
    const visible = s < screenH;
    if (visible !== inView) {
      inView = visible;
      onViewChange?.();
    }
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(onScroll);
    }
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  onScroll();

  /* ---------- Pause button ----------
     Stops the hero's own motion, the video and the rotating messages (WCAG 2.2.2). Shown whenever that
     motion runs; the choice is remembered on this device. */
  const KEY = 'lxd-hero-video';
  const stored = () => {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  };
  const store = (value: string | null) => {
    try {
      if (value) localStorage.setItem(KEY, value);
      else localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable: the choice lasts for this visit only */
    }
  };
  // Paused if this button was used before, or if 'Pause animations' (footer) is on.
  const motionPaused = () => {
    try {
      return localStorage.getItem('lxd-motion') === 'paused';
    } catch {
      return false;
    }
  };
  let still = stored() === 'paused' || motionPaused();
  let onStill: (() => void) | undefined;
  const applyStill = () => {
    hero.classList.toggle('is-still', still);
    if (!toggle) return;
    toggle.classList.toggle('is-paused', still);
    toggle.setAttribute('aria-label', still ? 'Play the animation' : 'Pause the animation');
    onStill?.();
  };
  if (toggle && !reduce.matches) {
    toggle.hidden = false;
    applyStill();
    toggle.addEventListener('click', () => {
      still = !still;
      store(still ? 'paused' : null);
      applyStill();
    });
    reduce.addEventListener('change', () => {
      if (reduce.matches) toggle.hidden = true;
    });
    // The footer's 'Pause animations' pauses (and resumes) the hero too, and becomes this button's
    // remembered choice, so the two controls agree after a reload.
    document.addEventListener('lxd:motion', (e) => {
      still = (e as CustomEvent<{ paused: boolean }>).detail.paused;
      store(still ? 'paused' : null);
      applyStill();
    });
  }

  /* ---------- Background video ---------- */
  type Connection = { saveData?: boolean; effectiveType?: string };
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  const lowData =
    Boolean(connection?.saveData) ||
    /(^|-)2g$/.test(connection?.effectiveType ?? '') ||
    matchMedia('(prefers-reduced-data: reduce)').matches;
  const videos = [...(frame?.querySelectorAll<HTMLVideoElement>('.hero-video') ?? [])];

  if (frame && videos.length === 2 && !reduce.matches && !lowData) {
    const start = async () => {
      const src = await pickSource(frame, videos[0], connection);
      if (src) play(src, videos as [HTMLVideoElement, HTMLVideoElement]);
    };
    const idle = () =>
      'requestIdleCallback' in window ? requestIdleCallback(() => void start(), { timeout: 1500 }) : setTimeout(start, 200);
    // After the page has loaded, so the video never competes with the page itself.
    if (document.readyState === 'complete') idle();
    else addEventListener('load', idle, { once: true });
  }

  /* ---------- Which file to play ----------
     Size: 1080p when the video is drawn taller than about 820 device pixels (pixel ratio counted up to 2),
     otherwise 720p; on a 3G connection always 720p. Codec: AV1 (smallest), then VP9, then H.264. Where the
     browser can say so (Media Capabilities), a codec it decodes smoothly and power-efficiently wins, so a phone
     without an AV1 decoder plays VP9 or H.264 in hardware instead of decoding AV1 in software. */
  type Source = { res: number; codec: string; src: string; type: string; kbps: number };
  async function pickSource(el: HTMLElement, probeVideo: HTMLVideoElement, conn?: Connection) {
    let sources: Source[] = [];
    try {
      sources = JSON.parse(el.dataset.sources || '[]');
    } catch {
      return undefined;
    }
    const box = el.getBoundingClientRect();
    const drawnHeight = Math.max((box.width * 9) / 16, box.height) * Math.min(devicePixelRatio || 1, 2);
    const slow = /(^|-)3g$/.test(conn?.effectiveType ?? '');
    const res = !slow && drawnHeight > 820 ? 1080 : 720;
    const candidates = sources.filter((s) => s.res === res);
    const media = (navigator as Navigator & { mediaCapabilities?: MediaCapabilities }).mediaCapabilities;
    if (media?.decodingInfo) {
      const infos = await Promise.all(
        candidates.map((c) =>
          media
            .decodingInfo({
              type: 'file',
              video: { contentType: c.type, width: (res * 16) / 9, height: res, bitrate: c.kbps * 1000, framerate: 24 },
            })
            .catch(() => undefined),
        ),
      );
      const smooth = candidates.filter((_, i) => infos[i]?.supported && infos[i]?.smooth);
      const efficient = candidates.find((_, i) => infos[i]?.supported && infos[i]?.smooth && infos[i]?.powerEfficient);
      const chosen = efficient ?? smooth[0];
      if (chosen) return chosen.src;
    }
    return (
      candidates.find((c) => probeVideo.canPlayType(c.type) === 'probably') ??
      candidates.find((c) => probeVideo.canPlayType(c.type) !== '')
    )?.src;
  }

  function play(src: string, [first, second]: [HTMLVideoElement, HTMLVideoElement]) {
    const LEAD = 0.1; // seconds before the end when the waiting copy starts
    const FADE = 320; // ms, the same as .hero-video.is-front in CSS

    let front = first;
    let back = second;
    let started = false;
    let gen = 0;
    const frameCallbacks = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;

    for (const v of [first, second]) {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.src = src;
      // Safety net: if the frame watch ever misses the end, swap as soon as it ends.
      v.addEventListener('ended', () => {
        if (v === front) swap();
      });
    }

    const shouldPlay = () => inView && !still && !document.hidden && !reduce.matches;

    // Check every presented frame of the playing copy; start the other one just before the end.
    const watch = () => {
      const g = ++gen;
      const v = front;
      const tick = (_now?: number, meta?: VideoFrameCallbackMetadata) => {
        if (g !== gen) return;
        const t = meta ? meta.mediaTime : v.currentTime;
        if (v.duration && t >= v.duration - LEAD) return swap();
        if (frameCallbacks) v.requestVideoFrameCallback(tick);
        else requestAnimationFrame(() => tick());
      };
      if (frameCallbacks) v.requestVideoFrameCallback(tick);
      else requestAnimationFrame(() => tick());
    };

    const swap = () => {
      gen++;
      const prev = front;
      const next = back;
      front = next;
      back = prev;
      if (next.currentTime !== 0) next.currentTime = 0;
      next.play().then(
        () => {
          // The new copy fades in on top; the old one holds its last frames underneath, then resets.
          next.classList.add('is-front', 'is-on');
          prev.classList.remove('is-front');
          setTimeout(() => {
            if (front !== next) return;
            prev.classList.remove('is-on');
            prev.pause();
            prev.currentTime = 0;
          }, FADE + 60);
          if (shouldPlay()) watch();
          else next.pause();
        },
        () => {
          // Playback refused: stay on the current picture and offer the play button.
          front = prev;
          back = next;
          still = true;
          applyStill();
        },
      );
    };

    const sync = () => {
      if (!started) return;
      if (shouldPlay()) {
        if (front.paused) {
          front.play().then(
            () => {
              front.classList.add('is-front', 'is-on');
              watch();
            },
            () => {
              // Autoplay refused (for example a battery saver): the button starts it instead.
              still = true;
              applyStill();
            },
          );
        }
      } else {
        gen++;
        front.pause();
        back.pause();
      }
    };

    onStill = sync;
    onViewChange = sync;
    document.addEventListener('visibilitychange', sync);
    reduce.addEventListener('change', () => {
      if (!reduce.matches) return;
      gen++;
      for (const v of [first, second]) {
        v.pause();
        v.classList.remove('is-front', 'is-on');
      }
    });

    // Both copies wait on their first frame; the first one then fades in over the poster (the same frame).
    let ready = 0;
    const onReady = () => {
      if (++ready < 2) return;
      started = true;
      sync();
    };
    for (const v of [first, second]) {
      if (v.readyState >= 2) onReady();
      else v.addEventListener('loadeddata', onReady, { once: true });
    }
  }
}
