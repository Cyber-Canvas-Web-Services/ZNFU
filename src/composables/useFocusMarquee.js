import { onBeforeUnmount, onMounted } from "vue";

/**
 * A continuously sliding strip whose centred item takes focus: each item gets
 * a `--focus` custom property (1 at the centre, 0 away from it) that CSS can
 * use for colour, opacity and scale. The track's children must be two
 * identical sets, so the wrap-around is seamless. Pauses on hover; with
 * reduced motion it does not move and every item is fully in focus.
 */
export function useFocusMarquee(boxRef, trackRef, { speed = 45 } = {}) {
  let frame = 0;
  let offset = 0;
  let last = 0;
  let paused = false;
  const onEnter = () => (paused = true);
  const onLeave = () => (paused = false);

  function render() {
    const box = boxRef.value;
    const list = trackRef.value;
    if (!box || !list) return 0;
    const setWidth = list.scrollWidth / 2;
    const center = box.clientWidth / 2;
    list.style.transform = `translate3d(${-offset}px,0,0)`;
    for (const el of list.children) {
      const x = el.offsetLeft + el.offsetWidth / 2 - offset;
      const focus = Math.max(0, 1 - Math.abs(x - center) / (el.offsetWidth * 1.25));
      el.style.setProperty("--focus", focus.toFixed(3));
    }
    return setWidth;
  }

  function tick(now) {
    const dt = Math.min(now - last, 64) / 1000;
    last = now;
    const setWidth = render();
    if (!paused && setWidth) offset = (offset + speed * dt) % setWidth;
    frame = requestAnimationFrame(tick);
  }

  onMounted(() => {
    const list = trackRef.value;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of list?.children ?? []) el.style.setProperty("--focus", "1");
      return;
    }
    boxRef.value.addEventListener("pointerenter", onEnter);
    boxRef.value.addEventListener("pointerleave", onLeave);
    last = performance.now();
    frame = requestAnimationFrame(tick);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    boxRef.value?.removeEventListener("pointerenter", onEnter);
    boxRef.value?.removeEventListener("pointerleave", onLeave);
  });
}
