import { NPCDialogBox } from 'forafolio';

// Inline pixel-art avatar so the card is self-contained (the app serves a PNG
// at runtime). 16-bit face: purple ground, two eyes, a mouth.
const avatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect width='160' height='160' fill='%237c3aed'/%3E%3Crect x='40' y='52' width='22' height='22' fill='%23fff'/%3E%3Crect x='98' y='52' width='22' height='22' fill='%23fff'/%3E%3Crect x='52' y='104' width='56' height='14' fill='%23fff'/%3E%3C/svg%3E";

// Full dialog box with avatar — the hero composition used on the landing page.
export const WithAvatar = () => (
  <div style={{ padding: 24, background: '#0a0a0f' }}>
    <NPCDialogBox
      avatarSrc={avatar}
      dialogs={[
        'Welcome, traveler! I am the guide to this portfolio.',
        'Click to continue through the story.',
      ]}
    />
  </div>
);

// Compact variant — no avatar, tighter borders. Used in dense layouts.
export const Compact = () => (
  <div style={{ padding: 24, background: '#0a0a0f' }}>
    <NPCDialogBox
      compact
      dialogs={[
        'Each project is a level in the journey.',
        'Press onward to see the work.',
      ]}
    />
  </div>
);
