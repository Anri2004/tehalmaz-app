import React from 'react';
import { SvgXml } from 'react-native-svg';

// ── Навигационные иконки (точно как в макете) ─────────────────────────────────

export const IconHome = ({ color, size = 24 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`} />
);

export const IconServices = ({ color, size = 24 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="6" x2="21" y2="6" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  </svg>`} />
);

export const IconCalc = ({ color, size = 24 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="${color}" stroke-width="1.8"/>
    <rect x="7" y="5" width="10" height="4" rx="1" stroke="${color}" stroke-width="1.5"/>
    <circle cx="8" cy="14" r="1" fill="${color}"/>
    <circle cx="12" cy="14" r="1" fill="${color}"/>
    <circle cx="16" cy="14" r="1" fill="${color}"/>
    <circle cx="8" cy="18" r="1" fill="${color}"/>
    <circle cx="12" cy="18" r="1" fill="${color}"/>
    <circle cx="16" cy="18" r="1" fill="${color}"/>
  </svg>`} />
);

export const IconOrder = ({ color, size = 24 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V7L14 2Z" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M14 2V7H19" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="8" y1="17" x2="16" y2="17" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="8" y1="9" x2="11" y2="9" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`} />
);

export const IconPhone = ({ color = '#fff', size = 22 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.5523 15.51 21 15.9577 21 16.51V20C21 20.5523 20.5523 21 20 21C10.61 21 3 13.39 3 4C3 3.44772 3.44772 3 4 3H7.5C8.05228 3 8.5 3.44772 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
  </svg>`} />
);

export const IconMoon = ({ color, size = 18 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`} />
);

export const IconSun = ({ color, size = 18 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke="${color}" stroke-width="2"/>
    <path d="M12 2V4M12 20V22M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2 12H4M20 12H22M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  </svg>`} />
);

export const IconWhatsApp = ({ color = '#fff', size = 22 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.96 1.36-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.14-.2-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.02-2.42.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.82 2.04.89 2.19.07.15.12.32.02.51-.09.2-.14.32-.29.49-.14.17-.3.39-.43.52-.14.14-.29.3-.12.59.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.2.73-.85.92-1.14.19-.29.39-.24.66-.14.27.1 1.71.81 2 .96.29.14.49.22.56.34.07.12.07.71-.17 1.39z"/>
  </svg>`} />
);

export const IconMail = ({ color, size = 20 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="${color}" stroke-width="1.8"/>
    <path d="M4 7L12 12.5L20 7" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`} />
);

// Пин в стиле Яндекс.Карт (фирменный красный)
export const IconYandexPin = ({ size = 20 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s7-6 7-12A7 7 0 1 0 5 10c0 6 7 12 7 12Z" fill="#FF3333"/>
    <circle cx="12" cy="10" r="2.6" fill="#fff"/>
  </svg>`} />
);

// Логотип Avito (четыре фирменных круга)
export const IconAvito = ({ size = 22 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7" r="4.2" fill="#00C8B4"/>
    <circle cx="17" cy="8" r="3.2" fill="#0098EE"/>
    <circle cx="7" cy="16.5" r="3.2" fill="#965EEB"/>
    <circle cx="16.5" cy="16.5" r="4.2" fill="#FF4053"/>
  </svg>`} />
);

export const IconAbout = ({ color, size = 24 }) => (
  <SvgXml width={size} height={size} xml={`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3" stroke="${color}" stroke-width="1.7"/>
    <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" stroke="${color}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M16 5.6a3 3 0 0 1 0 5.4M17.5 20c0-2.6-1-4.2-3-4.8" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`} />
);

// ── Полный логотип с обводкой (точно по SVG-файлу) ────────────────────────────
export const LogoFull = ({ width = 200, height = 160 }) => (
  <SvgXml width={width} height={height} xml={`<svg viewBox="0 0 3014 2403" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M1506.96 2397.44L3008.96 910.442H1995.96L1506.96 2397.44ZM1815.96 1928.44L2745.96 1022.44H2081.96L1815.96 1928.44Z" fill="#D3D3D3"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.96216 910.442L1506.96 2397.44L1007.96 910.442H4.96216ZM1207.96 1928.44L277.962 1022.44H941.962L1207.96 1928.44Z" fill="#D3D3D3"/>
    <path d="M1118.96 910.442H1007.96L1506.96 2397.44L1995.96 910.442H1894.96L1506.96 2033.44L1118.96 910.442Z" fill="#D32F2F"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M518.962 396.442L4.96216 910.442H1007.96H1118.96H1894.96H1995.96H3008.96L2494.96 396.442H518.962ZM562.962 513.442L277.962 793.442H838.962L562.962 513.442ZM708.962 513.442L1007.96 828.442L1316.96 513.442H708.962ZM1207.96 793.442L1506.96 478.442L1815.96 793.442H1207.96ZM1696.96 513.442L1995.96 828.442L2304.96 513.442H1696.96ZM2450.96 513.442L2165.96 793.442H2726.96L2450.96 513.442Z" fill="#D32F2F"/>
    <path d="M1506.96 2397.44L3008.96 910.442L2494.96 396.442H518.962L4.96216 910.442L1506.96 2397.44ZM4.96216 910.442H3008.96M4.96216 910.442H1007.96M3008.96 910.442H1995.96M1506.96 2397.44L1995.96 910.442M1506.96 2397.44L1007.96 910.442M1894.96 910.442L1506.96 2033.44L1118.96 910.442M1894.96 910.442H1118.96M1894.96 910.442H1995.96M1118.96 910.442H1007.96M1995.96 910.442H1007.96M277.962 793.442L562.962 513.442L838.962 793.442H277.962ZM1007.96 828.442L708.962 513.442H1316.96L1007.96 828.442ZM1506.96 478.442L1207.96 793.442H1815.96L1506.96 478.442ZM1995.96 828.442L1696.96 513.442H2304.96L1995.96 828.442ZM2165.96 793.442L2450.96 513.442L2726.96 793.442H2165.96ZM277.962 1022.44L1207.96 1928.44L941.962 1022.44H277.962ZM2745.96 1022.44L1815.96 1928.44L2081.96 1022.44H2745.96Z" stroke="#1C1C1E" stroke-width="7"/>
    <path d="M2486.02 140.432C2497.35 144.25 2505.79 150.53 2511.33 159.273C2516.87 167.893 2519.64 188.212 2519.64 220.23C2519.64 243.997 2516.93 262.468 2511.52 275.645C2506.1 288.698 2496.74 298.673 2483.44 305.569C2470.14 312.342 2453.08 315.728 2432.27 315.728C2408.63 315.728 2390.03 311.788 2376.49 303.906C2363.07 295.902 2354.2 286.174 2349.89 274.721C2345.7 263.146 2343.61 243.135 2343.61 214.688V191.045H2418.23V239.625C2418.23 252.555 2418.97 260.806 2420.45 264.377C2422.05 267.825 2425.5 269.549 2430.79 269.549C2436.58 269.549 2440.4 267.333 2442.25 262.899C2444.09 258.466 2445.02 246.891 2445.02 228.173V207.484C2445.02 196.032 2443.72 187.658 2441.14 182.363C2438.55 177.068 2434.74 173.62 2429.69 172.019C2424.64 170.295 2414.85 169.309 2400.32 169.063V125.655C2418.05 125.655 2429.01 124.977 2433.2 123.623C2437.38 122.268 2440.4 119.313 2442.25 114.756C2444.09 110.2 2445.02 103.058 2445.02 93.3293V76.7048C2445.02 66.2375 2443.91 59.3414 2441.69 56.0165C2439.6 52.6916 2436.27 51.0292 2431.72 51.0292C2426.55 51.0292 2422.97 52.8148 2421 56.386C2419.16 59.834 2418.23 67.2843 2418.23 78.7367V103.304H2343.61V77.8131C2343.61 49.2436 2350.13 29.9715 2363.19 19.9968C2376.24 9.8989 2396.99 4.84998 2425.44 4.84998C2461.03 4.84998 2485.16 11.8076 2497.85 25.723C2510.53 39.6383 2516.87 58.972 2516.87 83.724C2516.87 100.472 2514.59 112.601 2510.04 120.113C2505.48 127.502 2497.48 134.275 2486.02 140.432Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
    <path d="M2224.02 10.7609L2268.54 309.817H2188.93L2185.05 256.065H2157.16L2152.54 309.817H2072L2111.53 10.7609H2224.02ZM2182.83 203.051C2178.89 169.186 2174.95 127.379 2171.01 77.6284C2163.13 134.767 2158.2 176.575 2156.23 203.051H2182.83Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
    <path d="M1992.31 10.7609V309.817H1924.34V107.922L1897.18 309.817H1848.97L1820.34 112.54V309.817H1752.37V10.7609H1853.04C1855.99 28.74 1859.13 49.9209 1862.46 74.3035L1873.17 150.407L1890.9 10.7609H1992.31Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
    <path d="M1655.13 309.817H1577.18V70.4244H1554.46V239.81C1554.46 262.099 1551.57 278.108 1545.78 287.836C1540.11 297.565 1531.43 303.66 1519.73 306.123C1508.04 308.586 1489.38 309.817 1463.77 309.817H1451.57V258.281C1461.06 258.281 1467.58 257.112 1471.15 254.772C1474.73 252.432 1476.51 244.428 1476.51 230.759V10.5762H1655.13V309.817Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
    <path d="M1341.22 10.7609L1385.74 309.817H1306.13L1302.25 256.065H1274.36L1269.74 309.817H1189.2L1228.73 10.7609H1341.22ZM1300.03 203.051C1296.09 169.186 1292.15 127.379 1288.21 77.6284C1280.33 134.767 1275.4 176.575 1273.43 203.051H1300.03Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
    <path d="M1115.8 10.7609L1088.64 143.018L1129.65 309.817H1057.61C1048.99 280.016 1041.11 243.75 1033.97 201.019C1032 219.86 1029.29 239.871 1025.84 261.052L1018.45 309.817H942.716L970.793 143.018L942.716 10.7609H1017.9C1019.25 19.0116 1021.96 32.7422 1026.02 51.9528C1029.23 66.607 1031.87 80.0297 1033.97 92.221L1050.59 10.7609H1115.8Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
    <path d="M734.651 10.7609H864.322V70.6092H812.417V127.317H860.997V184.21H812.417V249.969H869.494V309.817H734.651V10.7609Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
    <path d="M650.716 10.7609V70.6092H604.537V309.817H526.771V70.6092H480.776V10.7609H650.716Z" fill="#D3D3D3" stroke="#1C1C1E" stroke-width="9.7"/>
  </svg>`} />
);
