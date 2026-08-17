/** Inline SVG scenes — one visual per SOLID principle. */
export const principleIllustrations: Record<string, { label: string; svg: string }> = {
  'single-responsibility': {
    label: 'Restaurant — waiter, chef, cashier each have one job',
    svg: `<svg viewBox="0 0 200 120" class="w-full h-auto" aria-hidden="true">
  <defs>
    <linearGradient id="bg-srp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c2d12"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
  </defs>
  <rect width="200" height="120" fill="url(#bg-srp)" rx="8"/>
  <text x="100" y="14" text-anchor="middle" fill="#ffedd5" font-size="9" font-family="system-ui" font-weight="600">One job each</text>
  <rect x="18" y="36" width="48" height="52" rx="5" fill="#1e1b4b" stroke="#a5b4fc"/>
  <text x="42" y="58" text-anchor="middle" fill="#c7d2fe" font-size="7" font-family="system-ui">Waiter</text>
  <text x="42" y="72" text-anchor="middle" fill="#94a3b8" font-size="6" font-family="system-ui">orders</text>
  <rect x="76" y="36" width="48" height="52" rx="5" fill="#1e1b4b" stroke="#22c55e"/>
  <text x="100" y="58" text-anchor="middle" fill="#bbf7d0" font-size="7" font-family="system-ui">Chef</text>
  <text x="100" y="72" text-anchor="middle" fill="#94a3b8" font-size="6" font-family="system-ui">cooks</text>
  <rect x="134" y="36" width="48" height="52" rx="5" fill="#1e1b4b" stroke="#f59e0b"/>
  <text x="158" y="58" text-anchor="middle" fill="#fde68a" font-size="7" font-family="system-ui">Cashier</text>
  <text x="158" y="72" text-anchor="middle" fill="#94a3b8" font-size="6" font-family="system-ui">bills</text>
  <path d="M66 62 L76 62 M124 62 L134 62" stroke="#fdba74" stroke-width="2" marker-end="url(#none)"/>
</svg>`,
  },
  'open-closed': {
    label: 'Shipping promos — plug in new rule cards',
    svg: `<svg viewBox="0 0 200 120" class="w-full h-auto" aria-hidden="true">
  <defs>
    <linearGradient id="bg-ocp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="200" height="120" fill="url(#bg-ocp)" rx="8"/>
  <text x="100" y="14" text-anchor="middle" fill="#cffafe" font-size="9" font-family="system-ui" font-weight="600">Plug-in rules</text>
  <rect x="60" y="32" width="80" height="40" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="100" y="56" text-anchor="middle" fill="#bae6fd" font-size="8" font-family="system-ui">Calculator</text>
  <rect x="24" y="82" width="40" height="24" rx="3" fill="#22c55e"/>
  <rect x="80" y="82" width="40" height="24" rx="3" fill="#6366f1"/>
  <rect x="136" y="82" width="40" height="24" rx="3" fill="#f59e0b"/>
  <text x="44" y="97" text-anchor="middle" fill="#fff" font-size="6" font-family="system-ui">flat</text>
  <text x="100" y="97" text-anchor="middle" fill="#fff" font-size="6" font-family="system-ui">free</text>
  <text x="156" y="97" text-anchor="middle" fill="#fff" font-size="6" font-family="system-ui">10%</text>
  <path d="M44 82 L80 72 M100 82 L100 72 M156 82 L120 72" stroke="#67e8f9" stroke-width="1.2"/>
</svg>`,
  },
  'liskov-substitution': {
    label: 'Rental counter — any car drives; only gas refuels',
    svg: `<svg viewBox="0 0 200 120" class="w-full h-auto" aria-hidden="true">
  <defs>
    <linearGradient id="bg-lsp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#134e4a"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <rect width="200" height="120" fill="url(#bg-lsp)" rx="8"/>
  <text x="100" y="14" text-anchor="middle" fill="#ccfbf1" font-size="9" font-family="system-ui" font-weight="600">Car rental</text>
  <rect x="20" y="70" width="56" height="22" rx="4" fill="#0f766e"/>
  <rect x="124" y="70" width="56" height="22" rx="4" fill="#6366f1"/>
  <circle cx="32" cy="94" r="5" fill="#1e293b"/><circle cx="64" cy="94" r="5" fill="#1e293b"/>
  <circle cx="136" cy="94" r="5" fill="#1e293b"/><circle cx="168" cy="94" r="5" fill="#1e293b"/>
  <text x="48" y="84" text-anchor="middle" fill="#fff" font-size="7" font-family="system-ui">gas</text>
  <text x="152" y="84" text-anchor="middle" fill="#fff" font-size="7" font-family="system-ui">EV</text>
  <rect x="70" y="34" width="60" height="28" rx="4" fill="#1e1b4b" stroke="#5eead4"/>
  <text x="100" y="52" text-anchor="middle" fill="#99f6e4" font-size="8" font-family="system-ui">drive()</text>
</svg>`,
  },
  'interface-segregation': {
    label: 'Phone calls only — copier prints and faxes',
    svg: `<svg viewBox="0 0 200 120" class="w-full h-auto" aria-hidden="true">
  <defs>
    <linearGradient id="bg-isp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4c1d95"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="200" height="120" fill="url(#bg-isp)" rx="8"/>
  <text x="100" y="14" text-anchor="middle" fill="#f3e8ff" font-size="9" font-family="system-ui" font-weight="600">Skinny interfaces</text>
  <rect x="28" y="40" width="36" height="58" rx="6" fill="#1e1b4b" stroke="#c4b5fd"/>
  <text x="46" y="72" text-anchor="middle" fill="#e9d5ff" font-size="12" font-family="system-ui">📱</text>
  <text x="46" y="88" text-anchor="middle" fill="#c4b5fd" font-size="6" font-family="system-ui">call</text>
  <rect x="120" y="32" width="56" height="66" rx="5" fill="#312e81" stroke="#22c55e"/>
  <text x="148" y="52" text-anchor="middle" fill="#bbf7d0" font-size="7" font-family="system-ui">print</text>
  <text x="148" y="68" text-anchor="middle" fill="#bbf7d0" font-size="7" font-family="system-ui">fax</text>
  <text x="148" y="84" text-anchor="middle" fill="#bbf7d0" font-size="7" font-family="system-ui">scan</text>
</svg>`,
  },
  'dependency-inversion': {
    label: 'Light switch wired to standard outlet — any bulb',
    svg: `<svg viewBox="0 0 200 120" class="w-full h-auto" aria-hidden="true">
  <defs>
    <linearGradient id="bg-dip" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
  </defs>
  <rect width="200" height="120" fill="url(#bg-dip)" rx="8"/>
  <text x="100" y="14" text-anchor="middle" fill="#fef3c7" font-size="9" font-family="system-ui" font-weight="600">Inject Light</text>
  <rect x="24" y="44" width="28" height="36" rx="4" fill="#1e1b4b" stroke="#a5b4fc"/>
  <text x="38" y="66" text-anchor="middle" fill="#fde68a" font-size="10" font-family="system-ui">⏻</text>
  <path d="M52 62 L88 62" stroke="#fcd34d" stroke-width="2"/>
  <rect x="88" y="50" width="24" height="24" rx="3" fill="#0f172a" stroke="#38bdf8"/>
  <text x="100" y="66" text-anchor="middle" fill="#7dd3fc" font-size="7" font-family="system-ui">Light</text>
  <circle cx="148" cy="62" r="14" fill="#fef08a" stroke="#f59e0b"/>
  <circle cx="176" cy="62" r="10" fill="#e0e7ff" stroke="#6366f1"/>
  <text x="148" y="66" text-anchor="middle" fill="#78350f" font-size="6" font-family="system-ui">LED</text>
  <text x="176" y="66" text-anchor="middle" fill="#312e81" font-size="6" font-family="system-ui">P</text>
</svg>`,
  },
};

export function getIllustration(slug: string, fallbackIcon: string): { label: string; svg: string } {
  const illo = principleIllustrations[slug];
  if (illo) return illo;
  return {
    label: fallbackIcon,
    svg: `<svg viewBox="0 0 64 64" class="w-full h-auto" aria-hidden="true"><text x="32" y="40" text-anchor="middle" font-size="28">${fallbackIcon}</text></svg>`,
  };
}

/** @deprecated */
export const patternIllustrations = principleIllustrations;
