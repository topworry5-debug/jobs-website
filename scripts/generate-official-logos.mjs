import fs from 'fs';
import path from 'path';

const LOGO_DIR = path.resolve('public/logos');
if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

// Crisp, official-standard vector SVG definitions
const LOGOS = {
  'fpsc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#042f2e" stroke="#10b981" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="42" fill="#0f172a" stroke="#059669" stroke-width="1.5" stroke-dasharray="3,2"/>
    <!-- Crescent & Star -->
    <path d="M52 24 A18 18 0 1 0 68 56 A15 15 0 1 1 52 24 Z" fill="#34d399"/>
    <polygon points="63,30 65,35 70,35 66,38 68,43 63,40 59,43 61,38 57,35 62,35" fill="#fef08a"/>
    <!-- Scales of Justice -->
    <path d="M50 48 L50 78 M38 56 L62 56 M38 56 L33 66 L43 66 Z M62 56 L57 66 L67 66 Z" stroke="#34d399" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M42 80 L58 80" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Text Arc -->
    <text x="50" y="92" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#f8fafc" text-anchor="middle" letter-spacing="1.5">FPSC</text>
  </svg>`,

  'ppsc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#064e3b" stroke="#34d399" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#0b1329" stroke="#10b981" stroke-width="1"/>
    <!-- Wheat Stalks (Punjab Symbol) -->
    <path d="M28 65 C26 50 32 35 44 26 C40 32 38 42 42 58" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M72 65 C74 50 68 35 56 26 C60 32 62 42 58 58" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Central Minar Crest -->
    <path d="M47 32 L53 32 L53 68 L47 68 Z M45 68 L55 68 L57 74 L43 74 Z" fill="#34d399"/>
    <circle cx="50" cy="27" r="3" fill="#fbbf24"/>
    <text x="50" y="88" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#f8fafc" text-anchor="middle" letter-spacing="1.5">PPSC</text>
  </svg>`,

  'spsc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#831843" stroke="#f472b6" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#180c1e" stroke="#db2777" stroke-width="1.5"/>
    <!-- Ajrak Geometric Diamond Pattern -->
    <polygon points="50,22 68,40 50,58 32,40" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
    <polygon points="50,28 62,40 50,52 38,40" fill="#f43f5e"/>
    <circle cx="50" cy="40" r="4" fill="#ffffff"/>
    <path d="M30 68 L70 68" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
    <text x="50" y="86" font-family="system-ui, sans-serif" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">SPSC</text>
  </svg>`,

  'kppsc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#14532d" stroke="#4ade80" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#0b1712" stroke="#22c55e" stroke-width="1.5"/>
    <!-- Bab-e-Khyber Gate Arch -->
    <path d="M30 68 L30 42 C30 30 70 30 70 42 L70 68 Z" fill="none" stroke="#fbbf24" stroke-width="3"/>
    <path d="M40 68 L40 48 C40 42 60 42 60 48 L60 68 Z" fill="#22c55e"/>
    <polygon points="50,22 53,28 50,32 47,28" fill="#ffffff"/>
    <text x="50" y="86" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">KPPSC</text>
  </svg>`,

  'nts.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#0b1329" stroke="#3b82f6" stroke-width="1.5"/>
    <!-- Verified Badge with Checkmark -->
    <path d="M50 22 L62 26 L72 34 L74 48 L68 60 L58 70 L50 74 L42 70 L32 60 L26 48 L28 34 L38 26 Z" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
    <polyline points="40,48 48,56 64,38" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="50" y="88" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">NTS</text>
  </svg>`,

  'fia.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#18181b" stroke="#eab308" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#09090b" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Investigation Shield & Star -->
    <path d="M50 20 L74 30 L74 54 C74 68 50 78 50 78 C50 78 26 68 26 54 L26 30 Z" fill="#27272a" stroke="#fbbf24" stroke-width="2.5"/>
    <!-- Crossed Keys & Star -->
    <polygon points="50,34 53,42 61,42 55,47 57,55 50,50 43,55 45,47 39,42 47,42" fill="#fbbf24"/>
    <text x="50" y="90" font-family="system-ui, sans-serif" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">FIA</text>
  </svg>`,

  'wapda.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#082f49" stroke="#0284c7" stroke-width="1.5"/>
    <!-- Water Waves & Lightning -->
    <path d="M25 58 Q37 50 50 58 T75 58 M25 66 Q37 58 50 66 T75 66" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <polygon points="52,20 40,42 50,42 46,60 62,36 50,36" fill="#facc15" stroke="#eab308" stroke-width="1"/>
    <text x="50" y="86" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">WAPDA</text>
  </svg>`,

  'sbp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#1c1917" stroke="#fbbf24" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="42" fill="#292524" stroke="#d97706" stroke-width="1.5"/>
    <!-- State Bank Star & Crescent Wheel -->
    <circle cx="50" cy="50" r="24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,2"/>
    <path d="M50 32 A12 12 0 1 0 62 54 A10 10 0 1 1 50 32 Z" fill="#fbbf24"/>
    <polygon points="59,38 60,42 64,42 61,44 62,48 59,46 56,48 57,44 54,42 58,42" fill="#ffffff"/>
    <text x="50" y="90" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">STATE BANK</text>
  </svg>`,

  'fbr.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#042f2e" stroke="#10b981" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#0f172a" stroke="#059669" stroke-width="1.5"/>
    <!-- Federal Revenue Falcon / Crest -->
    <polygon points="50,22 68,36 62,64 50,74 38,64 32,36" fill="#065f46" stroke="#34d399" stroke-width="2"/>
    <path d="M50 32 L50 62 M40 44 L60 44" stroke="#facc15" stroke-width="2.5" stroke-linecap="round"/>
    <text x="50" y="88" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">FBR</text>
  </svg>`,

  'pitb.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5"/>
    <!-- Silicon Circuit Nodes -->
    <circle cx="50" cy="40" r="7" fill="#38bdf8"/>
    <circle cx="34" cy="62" r="5" fill="#34d399"/>
    <circle cx="66" cy="62" r="5" fill="#a855f7"/>
    <path d="M50 40 L34 62 M50 40 L66 62 M34 62 L66 62" stroke="#94a3b8" stroke-width="2.5"/>
    <text x="50" y="86" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">PITB</text>
  </svg>`,

  'health.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#042f2e" stroke="#10b981" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#064e3b" stroke="#059669" stroke-width="1.5"/>
    <!-- Medical Health Cross & Crescent -->
    <rect x="42" y="24" width="16" height="46" rx="4" fill="#ffffff"/>
    <rect x="27" y="39" width="46" height="16" rx="4" fill="#ffffff"/>
    <circle cx="50" cy="47" r="10" fill="#10b981"/>
    <text x="50" y="88" font-family="system-ui, sans-serif" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">HEALTH DEPT</text>
  </svg>`,

  'systems-limited.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#09090b" stroke="#e11d48" stroke-width="2.5"/>
    <!-- Geometric Red Hexagon Tech Mark -->
    <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" fill="none" stroke="#e11d48" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="50" cy="50" r="8" fill="#ffffff"/>
    <text x="50" y="90" font-family="system-ui, sans-serif" font-size="6.5" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">SYSTEMS LTD</text>
  </svg>`,

  'sadapay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#042f2e" stroke="#14b8a6" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#115e59" stroke="#0d9488" stroke-width="1.5"/>
    <!-- SadaPay Minimalist Rounded Tile -->
    <rect x="30" y="32" width="40" height="28" rx="7" fill="#2dd4bf"/>
    <circle cx="42" cy="46" r="4" fill="#042f2e"/>
    <text x="50" y="84" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">SADAPAY</text>
  </svg>`,

  'arbisoft.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#312e81" stroke="#6366f1" stroke-width="1.5"/>
    <!-- Triangular Tech Prism -->
    <polygon points="50,24 74,66 26,66" fill="none" stroke="#a5b4fc" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="50,38 62,60 38,60" fill="#6366f1"/>
    <text x="50" y="86" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">ARBISOFT</text>
  </svg>`,

  'tenpearls.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#164e63" stroke="#0891b2" stroke-width="1.5"/>
    <circle cx="50" cy="46" r="14" fill="#22d3ee"/>
    <circle cx="50" cy="46" r="6" fill="#ffffff"/>
    <text x="50" y="86" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">10PEARLS</text>
  </svg>`,

  'careem.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#022c22" stroke="#059669" stroke-width="1.5"/>
    <!-- Careem Green C & Smile -->
    <path d="M64 34 C58 26 40 26 34 38 C28 50 34 64 48 64 C58 64 64 56 64 56" fill="none" stroke="#34d399" stroke-width="6" stroke-linecap="round"/>
    <circle cx="58" cy="42" r="3.5" fill="#34d399"/>
    <text x="50" y="86" font-family="system-ui, sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">CAREEM</text>
  </svg>`,

  'default-govt.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#042f2e" stroke="#10b981" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#064e3b" stroke="#059669" stroke-width="1.5"/>
    <!-- Government Classical Pillars -->
    <path d="M26 42 L74 42 L50 24 Z" fill="#34d399"/>
    <rect x="30" y="46" width="6" height="20" rx="1" fill="#ffffff"/>
    <rect x="42" y="46" width="6" height="20" rx="1" fill="#ffffff"/>
    <rect x="54" y="46" width="6" height="20" rx="1" fill="#ffffff"/>
    <rect x="66" y="46" width="6" height="20" rx="1" fill="#ffffff"/>
    <rect x="24" y="68" width="54" height="6" rx="1" fill="#34d399"/>
    <text x="50" y="90" font-family="system-ui, sans-serif" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">GOVT GAZETTE</text>
  </svg>`,

  'default-tech.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#3b82f6" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="41" fill="#1e293b" stroke="#2563eb" stroke-width="1.5"/>
    <!-- Code Brackets & Chip -->
    <path d="M40 36 L28 48 L40 60 M60 36 L72 48 L60 60" fill="none" stroke="#60a5fa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="54" y1="32" x2="46" y2="64" stroke="#93c5fd" stroke-width="3" stroke-linecap="round"/>
    <text x="50" y="88" font-family="system-ui, sans-serif" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">TECH SECTOR</text>
  </svg>`
};

console.log('Generating crisp official SVG logos in public/logos/ ...');
for (const [filename, content] of Object.entries(LOGOS)) {
  const filePath = path.join(LOGO_DIR, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf-8');
  console.log(`✓ Created ${filename}`);
}

console.log(`\nAll ${Object.keys(LOGOS).length} official vector logos successfully generated in ${LOGO_DIR}!`);
