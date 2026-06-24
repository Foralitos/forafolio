import { ScrollDownIndicator } from 'forafolio';

// Pinned to the viewport bottom (position: fixed); rendered on a dark panel so
// the white-on-transparent "Scroll" cue and animated chevron read clearly.
export const Default = () => (
  <div style={{ position: 'relative', height: 200, background: '#0a0a0f', borderRadius: 8 }}>
    <ScrollDownIndicator targetSection="#about" />
  </div>
);
