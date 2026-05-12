export const Glyph = {
  Air: (props) => (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 32c0-7 6-12 13-12s13 5 13 12-6 11-12 11-9-3-9-7 3-7 7-7 6 2 6 5" />
      <path d="M10 22c4-3 9-3 13 0" opacity=".55" />
      <path d="M9 42c5 2 11 2 16 0" opacity=".4" />
    </svg>
  ),

  Water: (props) => (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M28 8c-7 8-12 14-12 22a12 12 0 0 0 24 0c0-8-5-14-12-22z" />
      <path d="M22 30c1 4 5 6 9 5" opacity=".55" />
      <circle cx="33" cy="22" r="1.6" fill="currentColor" stroke="none" opacity=".7" />
    </svg>
  ),

  Earth: (props) => (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 42 24 18l8 12 5-7 11 19z" />
      <path d="M8 42h44" />
      <path d="M22 42v-8M34 42v-6" opacity=".4" />
    </svg>
  ),

  Fire: (props) => (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M28 8c2 8 10 11 10 22a10 10 0 0 1-20 0c0-5 3-7 5-9-1 5 1 8 4 8s4-3 4-7c0-6-3-10-3-14z" />
      <path d="M24 36c1 3 5 4 8 2" opacity=".55" />
    </svg>
  ),
};

const EL_MAP = { air: 'Air', water: 'Water', earth: 'Earth', fire: 'Fire' };

export function ElementBadge({ el, size = 22 }) {
  const G = Glyph[EL_MAP[el]];
  if (!G) return null;
  return (
    <span
      className="bay-glyph"
      style={{ width: size, height: size, color: `var(--${el})` }}
    >
      <G width={size} height={size} />
    </span>
  );
}
