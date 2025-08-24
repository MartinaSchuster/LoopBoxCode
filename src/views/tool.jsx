import React, { useState, useEffect } from 'react'

import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import './tool.css'

// ======================= SVG-IMPORTS =======================

import iconUpdate from "../assets/svgs/btn-aktualisieren.svg";

// Fadenlauf – Toolbox
import iconIL from "../assets/svgs/fadenlauf/toolbox/nadelanordnung/F_IL.svg";
import iconLL from "../assets/svgs/fadenlauf/toolbox/nadelanordnung/F_LL.svg";
import iconRL from "../assets/svgs/fadenlauf/toolbox/nadelanordnung/F_RL.svg";
import iconRR from "../assets/svgs/fadenlauf/toolbox/nadelanordnung/F_RR.svg";

import iconFrontSr from "../assets/svgs/fadenlauf/toolbox/vorderes nadelbett/F_Sr.svg";
import iconFrontFr from "../assets/svgs/fadenlauf/toolbox/vorderes nadelbett/F_Fr.svg";
import iconFrontNr from "../assets/svgs/fadenlauf/toolbox/vorderes nadelbett/F_Nr.svg";
import iconBackSl  from "../assets/svgs/fadenlauf/toolbox/hinteres nadelbett/F_Sl.svg";
import iconBackFl  from "../assets/svgs/fadenlauf/toolbox/hinteres nadelbett/F_Fl.svg";
import iconBackNl  from "../assets/svgs/fadenlauf/toolbox/hinteres nadelbett/F_Nl.svg";

// Maschenbild – Toolbox
import mbIconIL from "../assets/svgs/maschenbild/toolbox/grundbindung/M_IL.svg";
import mbIconLL from "../assets/svgs/maschenbild/toolbox/grundbindung/M_LL.svg";
import mbIconRL from "../assets/svgs/maschenbild/toolbox/grundbindung/M_RL.svg";
import mbIconRR from "../assets/svgs/maschenbild/toolbox/grundbindung/M_RR.svg";

import mbRightSr from "../assets/svgs/maschenbild/toolbox/rechte elemente/M_Sr.svg";
import mbRightFr from "../assets/svgs/maschenbild/toolbox/rechte elemente/M_Fr.svg";
import mbRightNr from "../assets/svgs/maschenbild/toolbox/rechte elemente/M_Nr.svg";
import mbLeftSl  from "../assets/svgs/maschenbild/toolbox/linke elemente/M_Sl.svg";
import mbLeftFl  from "../assets/svgs/maschenbild/toolbox/linke elemente/M_Fl.svg";
import mbLeftNl  from "../assets/svgs/maschenbild/toolbox/linke elemente/M_Nl.svg";

// Maschenbild – RR-Variante der Tool-Icons
import mbRightRR_Sr from "../assets/svgs/maschenbild/toolbox/rechte elemente/M_RR_Sr.svg";
import mbRightRR_Fr from "../assets/svgs/maschenbild/toolbox/rechte elemente/M_RR_Fr.svg";
import mbRightRR_Nr from "../assets/svgs/maschenbild/toolbox/rechte elemente/M_RR_Nr.svg";
import mbLeftRR_Sl  from "../assets/svgs/maschenbild/toolbox/linke elemente/M_RR_Sl.svg";
import mbLeftRR_Fl  from "../assets/svgs/maschenbild/toolbox/linke elemente/M_RR_Fl.svg";
import mbLeftRR_Nl  from "../assets/svgs/maschenbild/toolbox/linke elemente/M_RR_Nl.svg";


// Platzhalter für IL SVGs:
// import mbRightIL_Sr from "../assets/svgs/maschenbild/toolbox/rechte elemente/M_IL_Sr.svg";
// import mbLeftIL_Sl  from "../assets/svgs/maschenbild/toolbox/linke elemente/M_IL_Sl.svg";
const mbRightIL_Sr = mbRightSr; // Platzhalter
const mbLeftIL_Sl  = mbLeftSl;  // Platzhalter

// ==================== SVG-SOURCES & MAPS ====================

// --- Maschenbild (RL) ---
const mbRlSvgRaw = import.meta.glob(
  '../assets/svgs/maschenbild/raster/RL/*.svg',
  { query: '?raw', import: 'default', eager: true }
);
const mbRlByBase = Object.fromEntries(
  Object.entries(mbRlSvgRaw).map(([p, v]) => [p.split('/').pop(), v])
);
const __MB_RL_KEYS__ = Object.keys(mbRlByBase);

// Debug: Anzahl geladener Maschenbild-SVGs (nur DEV)
if (import.meta?.env?.DEV) {
  console.log('[MB RL] geladen:', __MB_RL_KEYS__.length, 'Dateien');
  if (__MB_RL_KEYS__.length === 0) {
    console.warn('[MB RL] Achtung: Keine Dateien unter ../assets/svgs/maschenbild/raster/RL/*.svg gefunden. Pfad/Dateinamen prüfen.');
  }
}

// --- Fadenlauf (RL | RR | LL) ---
const rlSvgRaw = import.meta.glob(
  '../assets/svgs/fadenlauf/raster/RL/*.svg',
  { query: '?raw', import: 'default', eager: true }
);
const rrSvgRaw = import.meta.glob(
  '../assets/svgs/fadenlauf/raster/RR/*.svg',
  { query: '?raw', import: 'default', eager: true }
);
const llSvgRaw = import.meta.glob(
  '../assets/svgs/fadenlauf/raster/LL/*.svg',
  { query: '?raw', import: 'default', eager: true }
);
const rlByBase = Object.fromEntries(Object.entries(rlSvgRaw).map(([p, v]) => [p.split('/').pop(), v]));
const rrByBase = Object.fromEntries(Object.entries(rrSvgRaw).map(([p, v]) => [p.split('/').pop(), v]));
const llByBase = Object.fromEntries(Object.entries(llSvgRaw).map(([p, v]) => [p.split('/').pop(), v]));

// ==================== FETCH HELPERS (Fadenlauf) ====================
// RL-Dateiname → SVG
function getRLSvg(selfAlt, dx, neighborAlt) {
  const filename = `F_RL_${selfAlt}_x+${dx}${neighborAlt}.svg`;
  return rlByBase[filename] || null;
}

// RR/LL/IL generisch: baut Dateinamen und greift passende Map
function getRasterSvgDyn(nadel, selfAlt, dx, neighborAlt) {
  const filename = `F_${nadel}_${selfAlt}_x+${dx}${neighborAlt}.svg`;
  if (nadel === 'RR') return rrByBase[filename] || null; // strikt RR
  if (nadel === 'LL') return llByBase[filename] || null; // strikt LL
  if (nadel === 'IL') {
    // IL nutzt LL-Dateien (Downstream-Logik behält 'IL')
    const llFilename = `F_LL_${selfAlt}_x+${dx}${neighborAlt}.svg`;
    return llByBase[llFilename] || null;
  }
  return null;
}
// ==================== GENERISCHE SVG-UTILS ====================

// Farben (stroke/fill) & optional stroke-width ersetzen
function colorizeSvg(svgRaw, colorHex, px) {
  if (!svgRaw) return svgRaw;
  let out = svgRaw;
  if (colorHex) {
    out = out
      // Attributfarben
      .replace(/stroke="#[0-9a-fA-F]{3,8}"/g, `stroke="${colorHex}"`)
      .replace(/stroke='#[0-9a-fA-F]{3,8}'/g, `stroke='${colorHex}'`)
      .replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${colorHex}"`)
      .replace(/fill='#[0-9a-fA-F]{3,8}'/g, `fill='${colorHex}'`)
      // Inline-Styles
      .replace(/stroke:\s*#[0-9a-fA-F]{3,8}/g, `stroke:${colorHex}`)
      .replace(/fill:\s*#[0-9a-fA-F]{3,8}/g, `fill:${colorHex}`);
  }
  if (px !== undefined && px !== null && `${px}` !== "") {
    const width = String(px);
    out = out
      .replace(/stroke-width="[^"]*"/g, `stroke-width="${width}"`)
      .replace(/stroke-width='[^']*'/g, `stroke-width='${width}'`)
      .replace(/stroke-width:\s*[^;"']*/g, `stroke-width:${width}`);
  }

  return out;
}
// ==================== Overlay Fadenlauf ====================

// X- & Y-Spiegelung (horizontal+vertikal)
function mirrorSvgXY(svgRaw) {
  if (!svgRaw) return null;
  try {
    let w = 100, h = 80;
    const vb = svgRaw.match(/viewBox\s*=\s*"\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*"/i);
    if (vb) { w = parseFloat(vb[1]); h = parseFloat(vb[2]); }
    else {
      const wm = svgRaw.match(/width="(\d+(?:\.\d+)?)"/i);
      const hm = svgRaw.match(/height="(\d+(?:\.\d+)?)"/i);
      if (wm) w = parseFloat(wm[1]);
      if (hm) h = parseFloat(hm[1]);
    }
    const open = svgRaw.match(/<svg[^>]*>/i);
    if (!open) return svgRaw;
    const start = open[0];
    const body = svgRaw.replace(/<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
    return `${start}<g transform="translate(${w},${h}) scale(-1,-1)">${body}</g></svg>`;
  } catch {
    return svgRaw;
  }
}

// Y-Spiegelung (horizontal kippen)
function mirrorSvgY(svgRaw) {
  if (!svgRaw) return null;
  try {
    let w = 100;
    const vb = svgRaw.match(/viewBox\s*=\s*"\s*0\s+0\s+(\d+(?:\.\d+)?)\s+\d+(?:\.\d+)?\s*"/i);
    if (vb) { w = parseFloat(vb[1]); }
    else {
      const wm = svgRaw.match(/width="(\d+(?:\.\d+)?)"/i);
      if (wm) w = parseFloat(wm[1]);
    }
    const open = svgRaw.match(/<svg[^>]*>/i);
    if (!open) return svgRaw;
    const start = open[0];
    const body = svgRaw.replace(/<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
    return `${start}<g transform="translate(${w},0) scale(-1,1)">${body}</g></svg>`;
  } catch {
    return svgRaw;
  }
}

// Alt in Buchstabe (S/F/N) + Seite (r/l) splitten
function splitAlt(alt) {
  if (!alt || alt.length < 2) return { letter: alt || '', side: '' };
  return { letter: alt[0], side: alt.slice(1) };
}

// Aus RECHTS-Dateiname das Overlay-Paar (self/neighbor) bilden
function buildOverlayAltsFromRight(selfAltRight, neighborAltRight) {
  const A = splitAlt(selfAltRight || '');
  const B = splitAlt(neighborAltRight || '');
  return {
    selfAlt: (B.letter || '') + (A.side || ''),
    neighborAlt: (A.letter || '') + (B.side || '')
  };
}

// Finalisieren Button Fadenlauf==========================================================================
// RR: Prioritätenfolge
function prioritiesRR(rowName, maxDx) {
  const list = [];
  if (rowName === 'unten') {
    list.push({ dx: 0, row: 'oben' });
    for (let d = 1; d <= maxDx; d++) {
      list.push({ dx: d, row: 'unten' });
      list.push({ dx: d, row: 'oben' });
    }
  } else { // oben
    for (let d = 1; d <= maxDx; d++) {
      list.push({ dx: d, row: 'unten' });
      list.push({ dx: d, row: 'oben' });
    }
  }
  return list;
}

// LL: Prioritätenfolge
function prioritiesLL(rowName, maxDx) {
  const list = [];
  if (rowName === 'unten') {
    for (let d = 1; d <= maxDx; d++) {
      list.push({ dx: d, row: 'oben' });
      list.push({ dx: d, row: 'unten' });
    }
  } else { // oben
    for (let d = 1; d <= maxDx; d++) {
      list.push({ dx: d, row: 'unten' });
      list.push({ dx: d, row: 'oben' });
    }
  }
  return list;
}

// DX-Dateinamen-Mapping

function mapDxForFilename(mode, fromRow, toRow, dx) {
  if (mode === 'RR') {
    // Asymmetrisches Mapping für RR:
    // unten → oben: Dateinamen verwenden dx+1 (dx=0 → 1, dx=1 → 2, ...)
    // oben → unten (und gleiche Reihe): unverändert dx
    if (fromRow === 'unten' && toRow === 'oben') {
      return dx + 1;
    }
    return dx;
  }
  // LL (und weitere Modi): kein besonderes Mapping
  return dx;
}

// ====================================================================
// MASCHENBILD – FINALISIEREN (RL)
// ====================================================================

// ==================== Normalisierung ====================
// Sr/Sl -> S, Fr/Fl -> F, Nr/Nl -> N
function normalizeAltForRule(alt) {
  if (!alt) return '';
  const letter = alt[0];
  if (letter === 'S') return 'S';
  if (letter === 'F') return 'F';
  if (letter === 'N') return 'N';
  return alt; // fallback
}

// ==================== Nachbar-Logik ====================
// Liefert spezifisch (Sr/Sl/Fr/Fl/Nr/Nl) + generisch (S/F/N)
function getNeighborTokensAt(mbPlacements, layerKey, row, col) {
  const cell = mbPlacements?.[layerKey]?.[`${row}-${col}`];
  if (!cell || !cell.alt) return null;
  const specific = cell.alt;
  const generic  = normalizeAltForRule(cell.alt);
  return { specific, generic };
}

// Hilfsfunktion: baut Klauselstring "x+1Sr", "y+2F" usw.
function makeClause(axis, token) {
  return `${axis}${token}`;
}

// Mathematisches Modulo (korrekt auch für negative Zahlen)
const mod = (i, n) => ((i % n) + n) % n;

// ==================== Klausel-Sammlung ====================
// Sammelt Nachbar-Klauseln (wrap-around in X und Y)
function collectSatisfiedClauses(mbPlacements, layerKey, row, col, maxCols, maxRows, maxRadius = 3) {
  const collected = [];

  // Lokaler Helper
  const neighborAt = (r, c, dr, dc) => {
    if (!Number.isFinite(maxRows) || !Number.isFinite(maxCols) || maxRows <= 0 || maxCols <= 0) return null;
    const rr = mod(r + dr, maxRows);
    const cc = mod(c + dc, maxCols);
    const cell = mbPlacements?.[layerKey]?.[`${rr}-${cc}`];
    if (!cell || !cell.alt) return null;
    return { specific: cell.alt, generic: normalizeAltForRule(cell.alt) };
  };

  const pushNeighbor = (axis, r, c, dr, dc) => {
    const t = neighborAt(r, c, dr, dc);
    if (!t) return false;
    collected.push({
      axis,
      specific: `${axis}${t.specific}`,
      generic:  `${axis}${t.generic}`,
    });
    return true;
  };

// Reihenfolge: links, rechts, unten, oben (Distanz aufsteigend)
for (let d = 1; d <= maxRadius; d++) {
  pushNeighbor(`x-${d}`, row, col, 0, -d); // links
  pushNeighbor(`x+${d}`, row, col, 0, +d); // rechts
  pushNeighbor(`y+${d}`, row, col, +d, 0); // unten
  pushNeighbor(`y-${d}`, row, col, -d, 0); // oben
}

  return collected;
}

// ==================== Kandidaten-Generierung ====================
// Baut ALLE möglichen Kombinationen aus Nachbar-Klauseln
function* buildRuleCandidates(selfAlt, clauseObjs) {
  if (!clauseObjs || clauseObjs.length === 0) {
    yield `M_RL_${selfAlt}.svg`;
    return;
  }

  const MAX_LEN = 4;

  // Hilfsfunktion: alle Kombis bis Länge MAX_LEN
  function* combine(list, start = 0, acc = []) {
    if (acc.length > 0) yield acc;
    if (acc.length >= 4) return; // Begrenzung: max 4 Klauseln
    for (let i = start; i < list.length; i++) {
      yield* combine(list, i + 1, [...acc, list[i]]);
    }
  }

  // alle Kombinationen aus Klauseln erzeugen
  for (const combo of combine(clauseObjs)) {
    // Spezifität: erst alle spezifisch, dann gemischt
    const maxMask = (1 << combo.length) - 1;
    for (let mask = maxMask; mask >= 0; mask--) {
      const parts = [];
      for (let i = 0; i < combo.length; i++) {
        const useSpecific = ((mask >> i) & 1) === 1;
        parts.push(useSpecific ? combo[i].specific : combo[i].generic);
      }
      yield `M_RL_${selfAlt}_${parts.join('_')}.svg`;
    }
  }

  // Fallback
  yield `M_RL_${selfAlt}.svg`;
}

// ==================== Beste Regel finden ====================
// Wählt längste Regel → lädt passendes SVG
function findBestMbRlSvg(mbPlacements, layerKey, row, col, maxCols, maxRows) {
  const self = mbPlacements?.[layerKey]?.[`${row}-${col}`];
  if (!self || !self.alt) return null;

  const selfAlt = self.alt;
  const clauseObjs = collectSatisfiedClauses(mbPlacements, layerKey, row, col, maxCols, maxRows, 4);

  let best = null;
  let bestLen = -1;
  let bestName = null;

  for (const fname of buildRuleCandidates(selfAlt, clauseObjs)) {
    const hit = mbRlByBase[fname];
    if (hit) {
      const parts = fname.split('_');
      const ruleLen = parts.length - 3; // nur Klauseln nach M, RL, selfAlt zählen
      if (ruleLen > bestLen) {
        best = hit;
        bestLen = ruleLen;
        bestName = fname;
      }
    }
  }

  if (best) {
    console.log('[MB RL] Bester Treffer', { pos: `${row}-${col}`, selfAlt, bestName, bestLen });
    return best;
  }

  console.log('[MB RL] Kein Treffer', { pos: `${row}-${col}`, selfAlt, clauseCount: clauseObjs.length });
  return null;
}

// ====================================================================
// MASCHENBILD – HILFSFUNKTIONEN FÜR OFFSETS & INDEX-MAPPING
// ====================================================================

// Berechnet zentrierte Startspalten für Vorder-/Rückseite
function getMbOffsets(msCols, mrCols) {
  const maxCols = Math.max(msCols || 0, mrCols || 0);
  const offFront = Math.floor((maxCols - (msCols || 0)) / 2);
  const offBack  = Math.floor((maxCols - (mrCols || 0)) / 2);
  return { maxCols, offFront, offBack };
}

// Liefert 1-basierte gridColumn für ein Element
function centeredColStart(idx, len, maxLen) {
  const offset = Math.floor((maxLen - (len || 0)) / 2);
  return offset + idx + 1;
}

// Mappt lokalen Index auf gemeinsame Weltspalte
function idxToWorld(row, idx, offsets) {
  return (row === 'front' ? offsets.offFront : offsets.offBack) + idx;
}

// Mappt Weltspalte zurück auf lokalen Index
function worldToIdx(row, worldCol, len, offsets) {
  const off = row === 'front' ? offsets.offFront : offsets.offBack;
  const idx = worldCol - off;
  return idx >= 0 && idx < len ? idx : null;
}
  // ----------------------------------------------------------------------



  // Status beim Öffnen ==================================================================================================
  const Tool = (props) => {
  const [aktiveEbeneVorderseite, setAktiveEbeneVorderseite] = useState(null);
  const [aktiveEbeneRueckseite, setAktiveEbeneRueckseite] = useState(null);
  const iconMap = { IL: iconIL, LL: iconLL, RL: iconRL, RR: iconRR };
  const mbIconMap = { IL: mbIconIL, LL: mbIconLL, RL: mbIconRL, RR: mbIconRR };

  const mbRightIconMap = (isRR) => isRR
    ? { Sr: mbRightRR_Sr, Fr: mbRightRR_Fr, Nr: mbRightRR_Nr }
    : { Sr: mbRightSr,    Fr: mbRightFr,    Nr: mbRightNr };

  const mbLeftIconMap = (isRR) => isRR
    ? { Sl: mbLeftRR_Sl, Fl: mbLeftRR_Fl, Nl: mbLeftRR_Nl }
    : { Sl: mbLeftSl,    Fl: mbLeftFl,    Nl: mbLeftNl };
  
  // Garn-----------------------------------------------------
  const [garne, setGarne] = useState([
    { id: 1, name: "Garn1", px: "7", hauptfarbe: "#91C77C", plattierfarbe: "#FD744F", plattieren: false }
  ])
  const [aktivesGarn, setAktivesGarn] = useState(0)
  const [garneSichtbar, setGarneSichtbar] = useState(true)


  // Fadenlauf------------------------------------------------
  const [reihen, setReihen] = useState([{
    id: 1,
    bausteinAnzahl: "4",
    nadelanordnung: "RL",
    placements: {}, // key -> { src, alt, side }
    raster: Array.from({ length: 4 }, (_, i) => ({
      key: i,
      y: 0,
      xOffset: 0
    }))
  }])
  useEffect(() => {
    setReihen(prev => prev.map(r => {
      const count = parseInt(r.bausteinAnzahl, 10) || 0;
      const hasAny = r.placements && Object.keys(r.placements).length > 0;
      if (hasAny) return r;
      return { ...r, placements: buildDefaultPlacements(r.nadelanordnung, count) };
    }));
  }, []);

  const [aktiveReihe, setAktiveReihe] = useState(1)
  const [bausteinInput, setBausteinInput] = useState({})

  useEffect(() => {
    const inputState = {}
    reihen.forEach(r => {
      inputState[r.id] = r.bausteinAnzahl
    })
    setBausteinInput(inputState)
  }, [reihen])

  const [fadenlaufSichtbar, setFadenlaufSichtbar] = useState(true)

  // Auswahl-Status für Platzieren im Fadenlauf
  const [ausgewaehltesElement, setAusgewaehltesElement] = useState(null); // {src, alt, side}
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Default-Platzierung: Untere Reihe -> F_Nr (front), Obere Reihe -> F_Nl (back)
  function buildDefaultPlacements(nadelanordnung, count) {
  const placements = {};
  const c = parseInt(count, 10) || 0;
  if (c <= 0) return placements;

  if (nadelanordnung === 'RL') {
  for (let i = 0; i < c; i++) {
    placements[`rl-${i}`] = { src: iconFrontNr, alt: 'Nr', side: 'front' };
  }
  } else if (nadelanordnung === 'RR') {
  const obereReihe = Math.ceil(c / 2);
  const untereReihe = Math.floor(c / 2);
  for (let i = 0; i < obereReihe; i++) {
    placements[`unten-${i}`] = { src: iconFrontNr, alt: 'Nr', side: 'front' };
  }
  for (let i = 0; i < untereReihe; i++) {
    placements[`oben-${i}`] = { src: iconBackNl, alt: 'Nl', side: 'back' };
  }
  } else if (nadelanordnung === 'LL') {
  const obereReihe = Math.ceil(c / 2);
  const untereReihe = Math.floor(c / 2);
  for (let i = 0; i < obereReihe; i++) {
    placements[`oben-${i}`] = { src: iconBackNl, alt: 'Nl', side: 'back' };
  }
  for (let i = 0; i < untereReihe; i++) {
    placements[`unten-${i}`] = { src: iconFrontNr, alt: 'Nr', side: 'front' };
  }
  } else if (nadelanordnung === 'IL') {
  const obereReihe = Math.ceil(c / 2);
  const untereReihe = Math.floor(c / 2);
  for (let i = 0; i < obereReihe; i++) {
    placements[`oben-${i}`] = { src: iconBackNl, alt: 'Nl', side: 'back' };
  }
  for (let i = 0; i < untereReihe; i++) {
    placements[`unten-${i}`] = { src: iconFrontNr, alt: 'Nr', side: 'front' };
  }
  }
  return placements;
  }

  // Maschenbild--------------------------------------------------
  const [grundbindung, setGrundbindung] = useState("RL")
  const [msInput, setMSInput] = useState("4")
  const [mrInput, setMRInput] = useState("4")
  const [ms, setMS] = useState(4)
  const [mr, setMR] = useState(4)

  const handleMaschenbildAktualisieren = () => {
    let msVal = Math.min(parseInt(msInput) || 0, 10);
    // Bei RR: nur gerade Werte zulassen, ggf. nach unten korrigieren
    if (grundbindung === "RR" && msVal % 2 === 1) msVal = msVal - 1;
    const mrVal = Math.min(parseInt(mrInput) || 0, 10);
    setMS(msVal);
    setMR(mrVal);
    setMSInput(msVal.toString());
    setMRInput(mrVal.toString());
    seedMbPlaceholders(grundbindung, msVal, mrVal);
  };

  // Maschenbild: Finalisieren je Seite (front/back) ---------------------------------------------
  const finalizeMbLayer = (layerKey /* 'front' | 'back' */) => {
  console.log('[MB RL] finalize start', { layerKey, grundbindung, ms, mr });
  if (grundbindung !== 'RL') {
    console.warn('[MB RL] Abbruch: grundbindung ist nicht RL →', grundbindung);
    return; // aktuell nur RL unterstützt
  }
  const cols = ms, rows = mr;
  let matchedCount = 0;

  if (layerKey === 'front') {
    for (let rIdx = rows - 1; rIdx >= 0; rIdx--) {
      for (let cIdx = 0; cIdx < cols; cIdx++) {
        const sel = mbPlacements?.[layerKey]?.[`${rIdx}-${cIdx}`];
        if (!sel) continue;
        const svgRaw = findBestMbRlSvg(mbPlacements, layerKey, rIdx, cIdx, cols, rows);
        if (svgRaw) {
          setMbSvgAt(layerKey, null, rIdx, cIdx, svgRaw, 'RL', rows);
          matchedCount++;
        }
      }
    }
  } else {
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      for (let cIdx = 0; cIdx < cols; cIdx++) {
        const sel = mbPlacements?.[layerKey]?.[`${rIdx}-${cIdx}`];
        if (!sel) continue;
        const svgRaw = findBestMbRlSvg(mbPlacements, layerKey, rIdx, cIdx, cols, rows);
        if (svgRaw) {
          setMbSvgAt(layerKey, null, rIdx, cIdx, svgRaw, 'RL');
          matchedCount++;
        }
      }
    }
  }

  console.log('[MB RL] finalize done', { layerKey, matched: matchedCount, total: rows * cols, rlFiles: __MB_RL_KEYS__?.length });
  if (matchedCount === 0 && (__MB_RL_KEYS__?.length || 0) === 0) {
    console.error('[MB RL] Es wurden 0 Zellen gematcht und es sind 0 RL-Dateien geladen. Prüfe den Glob-Pfad ../assets/svgs/maschenbild/raster/RL/*.svg und die Dateinamen (z. B. M_RL_Sr_...).');
  }
  };
  const finalizeMbFront = () => finalizeMbLayer('front');
  const finalizeMbBack  = () => finalizeMbLayer('back');

  // Optional: global machen, um manuell auslösbar zu sein (Konsole/anderer Code)
  useEffect(() => {
    window.__mbFinalizeFront = finalizeMbFront;
    window.__mbFinalizeBack  = finalizeMbBack;
    return () => {
      delete window.__mbFinalizeFront;
      delete window.__mbFinalizeBack;
    };
  }, [finalizeMbFront, finalizeMbBack]);

  useEffect(() => {
    const frontBtn = document.getElementById('btn-vorderseite-finalisieren');
    const backBtn  = document.getElementById('btn-rueckseite-finalisieren');
    const onFront = () => finalizeMbFront();
    const onBack  = () => finalizeMbBack();

    if (frontBtn) frontBtn.addEventListener('click', onFront);
    if (backBtn)  backBtn.addEventListener('click', onBack);

    return () => {
      if (frontBtn) frontBtn.removeEventListener('click', onFront);
      if (backBtn)  backBtn.removeEventListener('click', onBack);
    };
  }, []);

  const [maschenbildSichtbar, setMaschenbildSichtbar] = useState(true)

  // Maschenbild – Auswahl & Platzierung
  const [ausgewaehltesMbElement, setAusgewaehltesMbElement] = useState(null); // { src, alt, hand: 'r'|'l' }
  useEffect(() => {
    if (!ausgewaehltesElement && !aktivesGarn && !ausgewaehltesMbElement) return;
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setAusgewaehltesElement(null);
        setAusgewaehltesMbElement(null);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [ausgewaehltesElement, aktivesGarn, ausgewaehltesMbElement]);
  const isRightAlt = (alt) => /r$/.test(alt || '');
  const isLeftAlt  = (alt) => /l$/.test(alt || '');
  // Hook-Instanz für Maschenbild-Platzierungen
  const { mbPlacements, setAt: setMbAt, setSvgAt: setMbSvgAt, getAt: getMbAt, onCellClick: onMbCellClick, clear: clearMb, seedMbPlaceholders } =
  useMbPlacement(ausgewaehltesMbElement, grundbindung);
  useEffect(() => {
    seedMbPlaceholders(grundbindung, ms, mr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Platzierungsregel gem. Vorgabe (Maschenbild) 
  // Signaturen:
  //   canPlaceMb(grund, layer, alt)                   // Fallback (front=oben, back=unten)
  //   canPlaceMb(grund, layer, posObenUnten, alt)     // Bevorzugt (pos: 'oben'|'unten')
  function canPlaceMb(grund, layer /* 'front'|'back' */, posOrAlt, maybeAlt) {
  let pos = null;
  let alt = null;
  if (maybeAlt === undefined) {
    // Aufruf: (grund, layer, alt)
    alt = posOrAlt;
  } else {
    // Aufruf: (grund, layer, pos, alt)
    pos = posOrAlt; // 'oben' | 'unten'
    alt = maybeAlt;
  }

  if (!alt) return false;

  // LL: überall erlaubt
  if (grund === 'LL') return true;

  // RL: Vorderseite nur rechte, Rückseite nur linke
  if (grund === 'RL') {
    if (layer === 'front') return isRightAlt(alt);
    if (layer === 'back')  return isLeftAlt(alt);
    return false;
  }

  // RR & IL: oben nur rechte, unten nur linke – auf beiden Seiten gleich
  if (pos === 'oben')  return isRightAlt(alt);
  if (pos === 'unten') return isLeftAlt(alt);

  // Fallback (ohne pos): front => oben, back => unten
  if (layer === 'front') return isRightAlt(alt);
  if (layer === 'back')  return isLeftAlt(alt);
  return false;
  }

  // Komfort-Wrapper für Maschenbild (explizite Ebenen je Seite)
  const canPlaceFrontOben  = (alt) => canPlaceMb(grundbindung, 'front', 'oben',  alt);
  const canPlaceFrontUnten = (alt) => canPlaceMb(grundbindung, 'front', 'unten', alt);
  const canPlaceBackOben   = (alt) => canPlaceMb(grundbindung, 'back',  'oben',  alt);
  const canPlaceBackUnten  = (alt) => canPlaceMb(grundbindung, 'back',  'unten', alt);

  // Hook: Maschenbild-Platzierung (4 Ebenen)
  function useMbPlacement(ausgewaehltes, grund) {
  // 1) Extend the initial Maschenbild state to support single-layer modes (RL/LL)
  const [mbPlacements, setMbPlacements] = useState(() => ({
    'front': {},
    'back': {},
    'front-oben': {},
    'front-unten': {},
    'back-oben': {},
    'back-unten': {},
  }));

  // 2) setAt uses single-layer keys when no pos is provided
  const setAt = (layer, pos, row, col, sel) => {
    console.log('[MB] setAt', { layer, pos, row, col, sel });
    const key = pos ? `${layer}-${pos}` : `${layer}`; // RL/LL: single layer (no pos)
    const cellKey = `${row}-${col}`;
    setMbPlacements(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [cellKey]: {
          // Platzieren soll NUR alt/src/hand setzen – svg wird bewusst NICHT übernommen
          alt: sel.alt,
          src: sel.src,
          hand: sel.hand
        }
      }
    }));
  };

const setSvgAt = (layer, pos, row, col, svgRaw, mode, rowMax) => {
  const key = pos ? `${layer}-${pos}` : `${layer}`;
  const cellKey = `${row}-${col}`;
  const zIndex = layer.startsWith('front')
    ? (rowMax - row)   // Vorderseite: oben höchste Ebene
    : (row + 1);       // Rückseite: unten höchste Ebene
  setMbPlacements(prev => ({
    ...prev,
    [key]: {
      ...prev[key],
      [cellKey]: {
        ...prev[key]?.[cellKey],
        svg: svgRaw,
        lastMode: mode ?? prev[key]?.[cellKey]?.lastMode,
        zIndex
      }
    }
  }));
};

  // 3) getAt uses single-layer keys when no pos is provided
  const getAt = (layer, pos, row, col) => {
    const key = pos ? `${layer}-${pos}` : `${layer}`;
    const cellKey = `${row}-${col}`;
    return (mbPlacements?.[key]?.[cellKey] || null);
  };

  // 6) onCellClick: no change needed
  const onCellClick = (layer, pos, row, col) => {
    console.log('[MB] click', { layer, pos, row, col, ausgewaehltes });
    if (!ausgewaehltes) { console.log('[MB] abort: no selection'); return; }
    const alt = ausgewaehltes.alt;
    const allowed = canPlaceMb(grund, layer, pos, alt);
    console.log('[MB] canPlace?', { grund, layer, pos, alt, allowed });
    if (!allowed) { console.log('[MB] abort: not allowed here'); return; }
    setAt(layer, pos, row, col, ausgewaehltes);
    console.log('[MB] placed');
  };

  // 4) Clear all keys (single-layer + two-layer)
  const clear = () => setMbPlacements({
    'front': {}, 'back': {},
    'front-oben': {}, 'front-unten': {}, 'back-oben': {}, 'back-unten': {}
  });

  // 5) Seed placeholders: use single-layer for RL/LL; two-layer for RR (IL unchanged for now if present elsewhere)
  function seedMbPlaceholders(grund, msNum, mrNum) {
    // 2D-Helfer: legt für jede Zelle (row-col) einen Eintrag an
    const fill2D = (cols, rows, sel) => {
      const map = {};
      const C = Math.max(0, cols || 0);
      const R = Math.max(0, rows || 0);
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          map[`${r}-${c}`] = sel;
        }
      }
      return map;
    };

    // Vorbereiten: sowohl 1‑Layer (front/back) als auch 2‑Layer Keys leeren
    const next = {
      'front': {}, 'back': {},
      'front-oben': {}, 'front-unten': {}, 'back-oben': {}, 'back-unten': {}
    };

    if (grund === 'RR') {
      // Zwei Ebenen je Seite (RR)
      const topCols = Math.ceil((msNum || 0) / 2);
      const botCols = Math.floor((msNum || 0) / 2);
      next['front-oben']  = fill2D(topCols, mrNum, { src: mbRightRR_Sr, alt: 'Sr', hand: 'r' });
      next['front-unten'] = fill2D(botCols, mrNum, { src: mbLeftRR_Sl,  alt: 'Sl', hand: 'l' });
      next['back-oben']   = fill2D(topCols, mrNum, { src: mbRightRR_Sr, alt: 'Sr', hand: 'r' });
      next['back-unten']  = fill2D(botCols, mrNum, { src: mbLeftRR_Sl,  alt: 'Sl', hand: 'l' });
    } else if (grund === 'IL') {
      // Zwei Ebenen je Seite (IL) – eigene Icons (aktuell Aliase)
      const topCols = Math.ceil((msNum || 0) / 2);
      const botCols = Math.floor((msNum || 0) / 2);
      next['front-oben']  = fill2D(topCols, mrNum, { src: mbRightIL_Sr, alt: 'Sr', hand: 'r' });
      next['front-unten'] = fill2D(botCols, mrNum, { src: mbLeftIL_Sl,  alt: 'Sl', hand: 'l' });
      next['back-oben']   = fill2D(topCols, mrNum, { src: mbRightIL_Sr, alt: 'Sr', hand: 'r' });
      next['back-unten']  = fill2D(botCols, mrNum, { src: mbLeftIL_Sl,  alt: 'Sl', hand: 'l' });
    } else {
      // RL & LL: eine Ebene je Seite
      next['front'] = fill2D(msNum, mrNum, { src: mbRightSr, alt: 'Sr', hand: 'r' });
      next['back']  = fill2D(msNum, mrNum, { src: mbLeftSl,  alt: 'Sl', hand: 'l' });
    }

    setMbPlacements(next);
  }
  return { mbPlacements, setAt, setSvgAt, getAt, onCellClick, clear, seedMbPlaceholders };
  }

  // Seitenaufbau =========================================================================================================
  return (
    <div className="tool-container10">
      <Helmet>
        <title>tool - LoopBox</title>
        <meta property="og:title" content="tool - LoopBox" />
      </Helmet>

  {/*-- Toolbox Tool -----------------------------------------------------------------------------------------------------*/}
      <header id="cnt-topbar-elemente" className="cnt-topbar-elemente">     

  {/*---- Toolbox Fadenlauf -----------------------------------------------------------------------------------------------*/}
        <div
          id="cnt-topbar-fadenlauf"
          className={`cnt-topbar-fadenlauf 
            ${!fadenlaufSichtbar ? 'cnt-topbar-fadenlauf-ausgeblendet' : ''} 
            ${!maschenbildSichtbar ? 'cnt-topbar-fadenlauf-topbar-maschenbild-ausgeblendet' : ''}`}
        >
          
          <div id="cnt-head-fadenlauf" className="cnt-head">
            <button
              id="btn-fadenlauf"
              type="button"
              className={`fnt-ButtonHead btn-head${!fadenlaufSichtbar ? ' selected' : ''}`}
            onClick={() => setFadenlaufSichtbar(!fadenlaufSichtbar)}
            >
              {fadenlaufSichtbar ? "Fadenlauf" : "F"}
            </button>
            {fadenlaufSichtbar && (
              <button
                id="btn-fadenlauf-zurueck"
                type="button"
                className="fnt-ButtonPlusMinus btn-vorzurueck"
              >
                &lt;
              </button>
            )}
            {fadenlaufSichtbar && (
              <button
                id="btn-fadenlauf-vorwaerts"
                type="button"
                className="fnt-ButtonPlusMinus btn-vorzurueck"
              >
                &gt;
              </button>
            )}
          </div>
          {fadenlaufSichtbar && (
            <div id="cnt-toolbox-fadenlauf" className="cnt-toolbox-fadenlauf">
              
              <div id="cnt-toolbox-reihen" className="cnt-toolbox-reihen">
              <span id="txt-raster-fadenlauf" className="fnt-Toolbox txt-raster">
                Raster
              </span>
              <div id="cnt-nadelanordnung" className="cnt-raster">
                {["RL", "RR", "LL", "IL"].map((typ) => (
                  <div className="tooltip-container" key={typ}>
                    <div
                      className={`btn-nadelanordnung${reihen[0].nadelanordnung === typ ? " selected" : ""}`}
                      onClick={() => {
                        setAktivesGarn(0);
                        const neueReihen = reihen.map((r) => {
                          const seeded = buildDefaultPlacements(typ, r.bausteinAnzahl);
                          return { ...r, nadelanordnung: typ, placements: { ...seeded } };
                        });
                        setAusgewaehltesElement(null);
                        setReihen(neueReihen);
                      }}
                    >
                      <img
                        src={iconMap[typ]}
                        alt={typ}
                        style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
                      />
                    </div>
                    <div className="tooltip-text">
                      {typ === "RL" ? "RL" : typ === "RR" ? "RR" : typ === "LL" ? "LL" : "Interlock"}
                    </div>
                  </div>
                ))}
              </div>

              <div id="cnt-nadelzahl" className="cnt-raster">
                <div className="tooltip-container">
                  <input
                    type="text"
                    value={bausteinInput[reihen[0]?.id] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d{0,2}$/.test(val)) {
                        let num = Math.min(Number(val), 20);

                        const neueInputs = {};
                        reihen.forEach(r => {
                          neueInputs[r.id] = num.toString();
                        });
                        setBausteinInput(neueInputs);
                      }
                    }}
                    onMouseDown={(e) => {
                      if (e.target === e.currentTarget) {
                        e.preventDefault();
                        e.target.select();
                      }
                    }}
                    className="fnt-Toolbox inp-nadelzahl"
                  />
                  <div className="tooltip-text">Nadelanzahl</div>
                </div>

                <button
                  type="button"
                  className="fnt-ButtonPlusMinus btn-reihe-aktualisieren"
                  aria-label="Aktualisieren"
                  title="Aktualisieren"
                  onClick={() => {
                    const neueReihen = reihen.map((r) => {
                      let val = parseInt(bausteinInput[r.id], 10);
                      if (isNaN(val)) val = 4;
                      val = Math.min(val, 20);

                      // --- nur für RR, LL, IL gerade machen ---
                      if (["RR", "LL", "IL"].includes(r.nadelanordnung)) {
                        if (val % 2 === 1) val = val - 1;
                        if (val < 2) val = 2;
                      }

                      const seeded = buildDefaultPlacements(r.nadelanordnung, val);
                      return {
                        ...r,
                        bausteinAnzahl: val.toString(),
                        placements: { ...seeded },
                        raster: [...Array(val)].map((_, i) => ({
                          key: i,
                          y: 0,
                          xOffset: 0
                        }))
                      };
                    });
                    setReihen(neueReihen);
                  }}
                  >
                  <img
                    src={iconUpdate}
                    alt="Aktualisieren"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none"
                    }}
                  />
                </button>
              </div>
            </div>
              
              <div id="cnt-toolbox-vorne" className="cnt-toolbox-elemente">
                <span id="txt-vorne" className="fnt-Toolbox txt-elemente">
                  Vorderes Nadelbett
                </span>
                <div id="cnt-vorne-elemente" className="cnt-elemente">
                  <div className="tooltip-container">
                    <div
                      id="btn-vorne-a"
                      className={`btn-element${ausgewaehltesElement?.toolId === 'front-sr' ? ' selected' : ''}`}
                      onClick={() => {
                        const next = ausgewaehltesElement?.toolId === 'front-sr'
                          ? null
                          : { src: iconFrontSr, alt: 'Sr', side: 'front', toolId: 'front-sr' };
                        setAktivesGarn(0);
                        setAusgewaehltesMbElement(null);
                        setAusgewaehltesElement(next);
                      }}
                    >
                      <img src={iconFrontSr} alt="Sr" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                    </div>
                    <div className="tooltip-text">stricken</div>
                  </div>
                  <div className="tooltip-container">
                    <div
                      id="btn-vorne-b"
                      className={`btn-element${ausgewaehltesElement?.toolId === 'front-fr' ? ' selected' : ''}`}
                      onClick={() => {
                        const next = ausgewaehltesElement?.toolId === 'front-fr'
                          ? null
                          : { src: iconFrontFr, alt: 'Fr', side: 'front', toolId: 'front-fr' };
                        setAktivesGarn(0);
                        setAusgewaehltesMbElement(null);
                        setAusgewaehltesElement(next);
                      }}
                    >
                      <img src={iconFrontFr} alt="Fr" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                    </div>
                    <div className="tooltip-text">fangen</div>
                  </div>
                  <div className="tooltip-container">
                    <div
                      id="btn-vorne-c"
                      className={`btn-element${ausgewaehltesElement?.toolId === 'front-nr' ? ' selected' : ''}`}
                      onClick={() => {
                        const next = ausgewaehltesElement?.toolId === 'front-nr'
                          ? null
                          : { src: iconFrontNr, alt: 'Nr', side: 'front', toolId: 'front-nr' };
                        setAktivesGarn(0);
                        setAusgewaehltesMbElement(null);
                        setAusgewaehltesElement(next);
                      }}
                    >
                      <img src={iconFrontNr} alt="Nr" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                    </div>
                    <div className="tooltip-text">nicht stricken</div>
                  </div>
                </div>
              </div>

                <div id="cnt-toolbox-hinten" className="cnt-toolbox-elemente">
                  <span id="txt-hinten" className="fnt-Toolbox txt-elemente">
                    Hinteres Nadelbett
                  </span>
                  <div id="cnt-hinten-elemente" className="cnt-elemente">
                    <div className="tooltip-container">
                    <div
                      id="btn-hinten-a"
                      className={`btn-element${ausgewaehltesElement?.toolId === 'back-sl' ? ' selected' : ''}`}
                      onClick={() => {
                        if (reihen[0]?.nadelanordnung === 'RL') return;
                        const next = ausgewaehltesElement?.toolId === 'back-sl'
                          ? null
                          : { src: iconBackSl, alt: 'Sl', side: 'back', toolId: 'back-sl' };
                        setAktivesGarn(0);
                        setAusgewaehltesMbElement(null);
                        setAusgewaehltesElement(next);
                      }}
                    >
                        <img src={iconBackSl} alt="Sl" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                      </div>
                      <div className="tooltip-text">stricken</div>
                    </div>
                    <div className="tooltip-container">
                    <div
                      id="btn-hinten-b"
                      className={`btn-element${ausgewaehltesElement?.toolId === 'back-fl' ? ' selected' : ''}`}
                      onClick={() => {
                        if (reihen[0]?.nadelanordnung === 'RL') return;
                        const next = ausgewaehltesElement?.toolId === 'back-fl'
                          ? null
                          : { src: iconBackFl, alt: 'Fl', side: 'back', toolId: 'back-fl' };
                        setAktivesGarn(0);
                        setAusgewaehltesMbElement(null);
                        setAusgewaehltesElement(next);
                      }}
                    >
                        <img src={iconBackFl} alt="Fl" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                      </div>
                      <div className="tooltip-text">fangen</div>
                    </div>
                    <div className="tooltip-container">
                    <div
                      id="btn-hinten-c"
                      className={`btn-element${ausgewaehltesElement?.toolId === 'back-nl' ? ' selected' : ''}`}
                      onClick={() => {
                        if (reihen[0]?.nadelanordnung === 'RL') return;
                        const next = ausgewaehltesElement?.toolId === 'back-nl'
                          ? null
                          : { src: iconBackNl, alt: 'Nl', side: 'back', toolId: 'back-nl' };
                        setAktivesGarn(0);
                        setAusgewaehltesMbElement(null);
                        setAusgewaehltesElement(next);
                      }}
                    >
                        <img src={iconBackNl} alt="Nl" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                      </div>
                      <div className="tooltip-text">nicht stricken</div>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </div>

  {/*---- Toolbox Maschenbild ---------------------------------------------------------------------------*/}
        <div 
          id="cnt-topbar-maschenbild" 
          className={`cnt-topbar-maschenbild 
            ${!maschenbildSichtbar ? 'cnt-topbar-maschenbild-ausgeblendet' : ''}`}
        > 

          <div id="cnt-head-maschenbild" className="cnt-head">
            <button
              id="btn-maschenbild"
              type="button"
              className={`fnt-ButtonHead btn-head${!maschenbildSichtbar ? ' selected' : ''}`}
              onClick={() => setMaschenbildSichtbar(!maschenbildSichtbar)}
            >
              {maschenbildSichtbar ? "Maschenbild" : "M"}
            </button>
            {maschenbildSichtbar && (
              <button
                id="btn-maschenbild-zurueck"
                type="button"
                className="fnt-ButtonPlusMinus btn-vorzurueck"
              >
                &lt;
              </button>
            )}
            {maschenbildSichtbar && (
              <button
                id="btn-maschenbild-vorwaerts"
                type="button"
                className="fnt-ButtonPlusMinus btn-vorzurueck"
              >
                &gt;
              </button>
            )}
          </div>
          {maschenbildSichtbar && (
            <>
            <div id="cnt-toolbox-maschenbild" className="cnt-toolbox-maschenbild">
          
            <div id="cnt-toolbox-seiten" className="cnt-toolbox-seiten">
              <span id="txt-raster-maschenbild" className="fnt-Toolbox txt-raster">
                  Raster
              </span>
              
              <div id="cnt-grundbindung" className="cnt-raster">
                {["RL", "RR"].map((typ) => ( // "IL" und "LL" wieder reinschreiben!!!
                  <div className="tooltip-container" key={typ}>
                    <button
                      id={`btn-seite-${typ.toLowerCase()}`}
                      type="button"
                      className={`btn-grundbindung${grundbindung === typ ? " selected" : ""}`}
                      onClick={() => {
                        setAktivesGarn(0);
                        // Auswahl (Fadenlauf + Maschenbild) zurücksetzen
                        setAusgewaehltesElement(null);
                        setAusgewaehltesMbElement(null);
                        // Grundbindung wechseln und Platzhalter neu seed’en
                        setGrundbindung(typ);
                        seedMbPlaceholders(typ, ms, mr);
                      }}
                      aria-label={typ === "IL" ? "Interlock" : typ}
                      title={typ === "IL" ? "Interlock" : typ}
                    >
                      <img
                        src={mbIconMap[typ]}
                        alt={typ}
                        style={{ width: "160%", height: "160%", objectFit: "contain", pointerEvents: "none" }}
                      />
                    </button>
                    <div className="tooltip-text">{typ === "IL" ? "Interlock" : typ}</div>
                  </div>
                ))}
              </div>
              
              <div id="cnt-maschenzahl" className="cnt-raster">
                <div className="tooltip-container">
                 <input
                   type="text"
                   inputMode="numeric"
                   pattern="[0-9]*"
                   id="inp-seite-ms"
                   placeholder="MS"
                   value={msInput}
                   onChange={(e) => {
                     const val = e.target.value;
                     // Roh-Eingabe zulassen (max. 2 Ziffern), keine Sofort-Korrektur
                     if (/^\d{0,2}$/.test(val)) {
                       setMSInput(val);
                     }
                   }}
                   onBlur={(e) => {
                     // Korrigieren erst beim Verlassen des Feldes
                     let n = parseInt(e.target.value, 10);
                     if (isNaN(n)) {
                       setMSInput("");
                       return;
                     }
                     n = Math.min(n, 10); // Obergrenze
                     if (grundbindung === "RR") {
                       // Bei RR nur gerade Werte
                       n = n - (n % 2);
                     }
                     setMSInput(n.toString());
                   }}
                   onMouseDown={(e) => {
                     if (e.target === e.currentTarget) {
                       e.preventDefault();
                       e.target.select();
                     }
                   }}
                   className="fnt-Toolbox inp-seite-ms inp-maschenzahl fnt-ButtonText"
                 />
                  <div className="tooltip-text">MS</div>
                </div>
                <div className="tooltip-container">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="inp-seite-mr"
                    placeholder="MR"
                    value={mrInput}
                    onChange={(e) => {
                      const val = e.target.value
                      if (/^\d{0,2}$/.test(val)) {
                        setMRInput(Math.min(Number(val), 10).toString())
                      }
                    }}
                    onMouseDown={(e) => {
                      if (e.target === e.currentTarget) {
                        e.preventDefault()
                        e.target.select()
                      }
                    }}
                    className="fnt-Toolbox inp-seite-mr inp-maschenzahl"
                  />
                  <div className="tooltip-text">MR</div>
                </div>
                <button
                  id="btn-seite-aktualisieren"
                  type="button"
                  className="fnt-ButtonPlusMinus btn-reihe-aktualisieren"
                  aria-label="Aktualisieren"
                  title="Aktualisieren"
                  onClick={handleMaschenbildAktualisieren}
                >
                  <img src={iconUpdate} alt="Aktualisieren" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                </button>
              </div>
            </div>

          {/*Toolbox ausblenden bei RR, LL und IL*/}
            {!["RR", "LL", "IL"].includes(grundbindung) && (
            <>
            <div id="cnt-toolbox-rechts" className="cnt-toolbox-elemente">
              <span id="txt-rechts" className="fnt-Toolbox txt-elemente">
                Rechte Elemente
              </span>
              <div id="cnt-rechts-elemente" className="cnt-elemente">
                {(() => {
                  const isRR = grundbindung === 'RR';
                  const R = mbRightIconMap(isRR);
                  return (
                    <>
                      <div className="tooltip-container">
                        <div
                          id="btn-rechts-a"
                          className={`btn-element${ausgewaehltesMbElement?.hand === 'r' && ausgewaehltesMbElement?.alt === 'Sr' ? ' selected' : ''}`}
                          onClick={() => {
                            setAktivesGarn(0);
                            setAusgewaehltesElement(null);
                            const isRR = grundbindung === 'RR';
                            const R = mbRightIconMap(isRR);
                            if (ausgewaehltesMbElement?.hand === 'r' && ausgewaehltesMbElement?.alt === 'Sr') {
                              setAusgewaehltesMbElement(null);
                            } else {
                              setAusgewaehltesMbElement({ src: R.Sr, alt: 'Sr', hand: 'r' });
                            }
                          }}
                        >
                          <img src={R.Sr} alt="Sr" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                        </div>
                        <div className="tooltip-text">stricken</div>
                      </div>
                      <div className="tooltip-container">
                        <div
                          id="btn-rechts-b"
                          className={`btn-element${ausgewaehltesMbElement?.hand === 'r' && ausgewaehltesMbElement?.alt === 'Fr' ? ' selected' : ''}`}
                          onClick={() => {
                            setAktivesGarn(0);
                            setAusgewaehltesElement(null);
                            const isRR = grundbindung === 'RR';
                            const R = mbRightIconMap(isRR);
                            if (ausgewaehltesMbElement?.hand === 'r' && ausgewaehltesMbElement?.alt === 'Fr') {
                              setAusgewaehltesMbElement(null);
                            } else {
                              setAusgewaehltesMbElement({ src: R.Fr, alt: 'Fr', hand: 'r' });
                            }
                          }}
                        >
                          <img src={R.Fr} alt="Fr" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                        </div>
                        <div className="tooltip-text">fangen</div>
                      </div>
                      <div className="tooltip-container">
                        <div
                          id="btn-rechts-c"
                          className={`btn-element${ausgewaehltesMbElement?.hand === 'r' && ausgewaehltesMbElement?.alt === 'Nr' ? ' selected' : ''}`}
                          onClick={() => {
                            setAktivesGarn(0);
                            setAusgewaehltesElement(null);
                            const isRR = grundbindung === 'RR';
                            const R = mbRightIconMap(isRR);
                            if (ausgewaehltesMbElement?.hand === 'r' && ausgewaehltesMbElement?.alt === 'Nr') {
                              setAusgewaehltesMbElement(null);
                            } else {
                              setAusgewaehltesMbElement({ src: R.Nr, alt: 'Nr', hand: 'r' });
                            }
                          }}
                        >
                          <img src={R.Nr} alt="Nr" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                        </div>
                        <div className="tooltip-text">nicht stricken</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            <div id="cnt-toolbox-links" className="cnt-toolbox-elemente">
              <span id="txt-links" className="fnt-Toolbox txt-elemente">
                Linke Elemente
              </span>
              <div id="cnt-links-elemente" className="cnt-elemente">
                {(() => {
                  const isRR = grundbindung === 'RR';
                  const L = mbLeftIconMap(isRR);
                  return (
                    <>
                      <div className="tooltip-container">
                        <div
                          id="btn-links-a"
                          className={`btn-element${ausgewaehltesMbElement?.hand === 'l' && ausgewaehltesMbElement?.alt === 'Sl' ? ' selected' : ''}`}
                          onClick={() => {
                            setAktivesGarn(0);
                            setAusgewaehltesElement(null);
                            const isRR = grundbindung === 'RR';
                            const L = mbLeftIconMap(isRR);
                            if (ausgewaehltesMbElement?.hand === 'l' && ausgewaehltesMbElement?.alt === 'Sl') {
                              setAusgewaehltesMbElement(null);
                            } else {
                              setAusgewaehltesMbElement({ src: L.Sl, alt: 'Sl', hand: 'l' });
                            }
                          }}
                        >
                          <img src={L.Sl} alt="Sl" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                        </div>
                        <div className="tooltip-text">stricken</div>
                      </div>
                      <div className="tooltip-container">
                        <div
                          id="btn-links-b"
                          className={`btn-element${ausgewaehltesMbElement?.hand === 'l' && ausgewaehltesMbElement?.alt === 'Fl' ? ' selected' : ''}`}
                          onClick={() => {
                            setAktivesGarn(0);
                            setAusgewaehltesElement(null);
                            const isRR = grundbindung === 'RR';
                            const L = mbLeftIconMap(isRR);
                            if (ausgewaehltesMbElement?.hand === 'l' && ausgewaehltesMbElement?.alt === 'Fl') {
                              setAusgewaehltesMbElement(null);
                            } else {
                              setAusgewaehltesMbElement({ src: L.Fl, alt: 'Fl', hand: 'l' });
                            }
                          }}
                        >
                          <img src={L.Fl} alt="Fl" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                        </div>
                        <div className="tooltip-text">fangen</div>
                      </div>
                      <div className="tooltip-container">
                        <div
                          id="btn-links-c"
                          className={`btn-element${ausgewaehltesMbElement?.hand === 'l' && ausgewaehltesMbElement?.alt === 'Nl' ? ' selected' : ''}`}
                          onClick={() => {
                            setAktivesGarn(0);
                            setAusgewaehltesElement(null);
                            const isRR = grundbindung === 'RR';
                            const L = mbLeftIconMap(isRR);
                            if (ausgewaehltesMbElement?.hand === 'l' && ausgewaehltesMbElement?.alt === 'Nl') {
                              setAusgewaehltesMbElement(null);
                            } else {
                              setAusgewaehltesMbElement({ src: L.Nl, alt: 'Nl', hand: 'l' });
                            }
                          }}
                        >
                          <img src={L.Nl} alt="Nl" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                        </div>
                        <div className="tooltip-text">nicht stricken</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            </>
            )}
            </div>
              {ausgewaehltesMbElement && (
                <img
                  src={ausgewaehltesMbElement.src}
                  alt=""
                  style={{
                    position: 'fixed',
                    left: cursorPos.x + 8,
                    top: cursorPos.y + 8,
                    width: 50,
                    height: 40,
                    pointerEvents: 'none',
                    opacity: 0.9,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                  }}
                />
              )}

            </>
          )}
        </div>
      </header>

  {/*-- Main Tool ------------------------------------------------------------------------------------*/}
      <div id="cnt-main" 
        className={`cnt-main
        ${!fadenlaufSichtbar ? 'cnt-main-ausgeblendet-column' : ''} 
        ${!maschenbildSichtbar ? 'cnt-main-ausgeblendet-column' : ''}
        ${!garneSichtbar ? 'cnt-main-toolbox-garne-ausgeblendet' : ''}`}
      >

  {/*---- Tool Fadenlauf ------------------------------------------------------------------------------*/}
        {fadenlaufSichtbar && (
          <div
            id="cnt-tool-fadenlauf"
            className={`cnt-tool-fadenlauf ${maschenbildSichtbar ? '' : 'cnt-tool-fadenlauf-vollbreite'}`}
          >

            <div id="cnt-fadenlauf" className="cnt-fadenlauf">
              <div id="cnt-fadenlauf-plusminus" className="cnt-fadenlauf-plusminus">
                <button
                  id="btn-fadenlauf-minus"
                  type="button"
                  className="fnt-ButtonPlusMinus btn-plusminus"
                  onClick={() => {
                    const index = reihen.findIndex((r) => r.id === aktiveReihe)
                    const reihenNummer = reihen.length - index
                    const bestaetigt = window.confirm(`Reihe ${reihenNummer} löschen?`)
                    if (!bestaetigt) return

                    if (reihen.length > 1) {
                      setReihen(reihen.filter((r) => r.id !== aktiveReihe))
                      setAktiveReihe((prev) => {
                        const remaining = reihen.filter((r) => r.id !== prev)
                        return remaining.length > 0 ? remaining[0].id : null
                      })
                    }
                  }}
                >
                  -
                </button>
                <button
                  id="button-fadenlauf-minus"
                  name="btn-fadenlauf-plus"
                  type="button"
                  className="fnt-ButtonPlusMinus btn-plusminus"
                  onClick={() => {
                    const newId = reihen.length > 0 ? Math.max(...reihen.map(r => r.id)) + 1 : 1;
                    const aktive = reihen.find((r) => r.id === aktiveReihe);
                    if (!aktive) return;

                    const count = parseInt(aktive.bausteinAnzahl, 10) || 0;
                    const seeded = buildDefaultPlacements(aktive.nadelanordnung, count);
                    const neueReihe = {
                      id: newId,
                      bausteinAnzahl: aktive.bausteinAnzahl,
                      nadelanordnung: aktive.nadelanordnung,
                      placements: { ...seeded },
                      raster: [...Array(count)].map((_, i) => ({ key: i, y: 0, xOffset: 0 }))
                    };

                    const index = reihen.findIndex(r => r.id === aktiveReihe);
                    const neueReihen = [...reihen];
                    neueReihen.splice(index, 0, neueReihe);

                    setReihen(neueReihen);
                    setAktiveReihe(newId);
                  }}
                >
                  +
                </button>
              </div>
  {/*-------- Fadenlauf Reihen -----------------------------------------------------------*/}
              {reihen.map((reihe, index) => (
                <div key={reihe.id} className="cnt-fadenlauf-reihe">

                  <div
                    className={`cnt-reihe-raster ${reihe.nadelanordnung.toLowerCase()}-mode`}
                  >
                    {reihe.nadelanordnung === "RL" ? (
                      (() => {
                        const count = parseInt(reihe.bausteinAnzahl, 10) || 0;
                        const placedLast = (reihe.placements || {})[`rl-${count - 1}`];
                        return [...Array(count)].map((_, i) => {
                          const cellKey = `rl-${i}`;
                          const placed = (reihe.placements || {})[cellKey];
                          const src = placed?.src || "https://play.teleporthq.io/static/svg/default-img.svg";
                          return (
                            <div key={`rl-wrap-${reihe.id}-${i}`} style={{ position: 'relative' }}>
                              {placed?.svg ? (
                                <div
                                  className={`raster-svg ${ausgewaehltesElement ? 'placing' : ''}`}
                                  onClick={() => {
                                    if (ausgewaehltesElement) {
                                      if (ausgewaehltesElement.side !== 'front') return;
                                      setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                        ...r,
                                        placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                      } : r));
                                      return;
                                    }
                                    if (aktivesGarn) {
                                      const y = garne.find(g => g.id === aktivesGarn);
                                      if (!y) return;
                                      setReihen(prev => prev.map(r => {
                                        if (r.id !== reihe.id) return r;
                                        const updated = { ...(r.placements || {}) };
                                        Object.keys(updated).forEach(k => {
                                          const p = updated[k];
                                          if (p && p.svg) {
                                            updated[k] = {
                                              ...p,
                                              svg: colorizeSvg(p.svg, y.hauptfarbe, y.px),
                                              overlaySvg: p.overlaySvg ? colorizeSvg(p.overlaySvg, y.hauptfarbe, y.px) : p.overlaySvg
                                            };
                                          }
                                        });
                                        return { ...r, placements: updated };
                                      }));
                                    }
                                  }}
                                  dangerouslySetInnerHTML={{ __html: placed.svg }}
                                />
                              ) : (
                                <img
                                  alt={placed?.alt || 'image'}
                                  src={src}
                                  className="img-fadenlauf-baustein"
                                  onClick={() => {
                                    if (!ausgewaehltesElement) return;
                                    if (ausgewaehltesElement.side !== 'front') return;
                                    setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                      ...r,
                                      placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                    } : r));
                                  }}
                                />
                              )}
                              {placed?.overlaySvg ? (
                                <div
                                  className="raster-svg overlay"
                                  style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
                                  dangerouslySetInnerHTML={{ __html: placed.overlaySvg }}
                                />
                              ) : null}
                            </div>
                          );
                        });
                      })()
                    ) : reihe.nadelanordnung === "RR" ? (
                      (() => {
                        const obereReihe = Math.ceil(parseInt(reihe.bausteinAnzahl, 10) / 2)
                        const untereReihe = Math.floor(parseInt(reihe.bausteinAnzahl, 10) / 2)
                        return (
                          <>
                            {[...Array(obereReihe)].map((_, i) => {
                              const cellKey = `unten-${i}`;
                              const placed = (reihe.placements || {})[cellKey];
                              const src = placed?.src || "https://play.teleporthq.io/static/svg/default-img.svg";
                              return (
                                // RR top row: wrapper with overlay
                                <div
                                  key={`rr-oben-wrap-${reihe.id}-${i}`}
                                  style={{ gridRow: 2, gridColumn: i + 1, transform: "translateX(-50px)", position: 'relative', cursor: ausgewaehltesElement ? 'none' : 'default' }}
                                >
                                  {placed?.svg ? (
                                    <div
                                      className="raster-svg"
                                      onClick={() => {
                                        if (ausgewaehltesElement) {
                                          if (ausgewaehltesElement.side !== 'front') return;
                                          setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                            ...r,
                                            placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                          } : r));
                                          return;
                                        }
                                        if (aktivesGarn) {
                                          const y = garne.find(g => g.id === aktivesGarn);
                                          if (!y) return;
                                          setReihen(prev => prev.map(r => {
                                            if (r.id !== reihe.id) return r;
                                            const updated = { ...(r.placements || {}) };
                                            Object.keys(updated).forEach(k => {
                                              const p = updated[k];
                                              if (p && p.svg) {
                                                updated[k] = {
                                                  ...p,
                                                  svg: colorizeSvg(p.svg, y.hauptfarbe, y.px),
                                                  overlaySvg: p.overlaySvg ? colorizeSvg(p.overlaySvg, y.hauptfarbe, y.px) : p.overlaySvg
                                                };
                                              }
                                            });
                                            return { ...r, placements: updated };
                                          }));
                                        }
                                      }}
                                      dangerouslySetInnerHTML={{ __html: placed.svg }}
                                    />
                                  ) : (
                                    <img
                                      alt={placed?.alt || "image"}
                                      src={src}
                                      className="img-fadenlauf-baustein"
                                      onClick={() => {
                                        if (!ausgewaehltesElement) return;
                                        if (ausgewaehltesElement.side !== 'front') return;
                                        setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                          ...r,
                                          placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                        } : r));
                                      }}
                                    />
                                  )}
                                  {placed?.overlaySvg && (
                                    <div className="raster-svg overlay" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: placed.overlaySvg }} />
                                  )}
                                </div>
                              );
                            })}
                            {[...Array(untereReihe)].map((_, i) => {
                              const cellKey = `oben-${i}`;
                              const placed = (reihe.placements || {})[cellKey];
                              const src = placed?.src || "https://play.teleporthq.io/static/svg/default-img.svg";
                              return (
                                // RR bottom row: wrapper with overlay
                                <div
                                  key={`rr-unten-wrap-${reihe.id}-${i}`}
                                  style={{ gridRow: 1, gridColumn: i + 1, position: 'relative', cursor: ausgewaehltesElement ? 'none' : 'default' }}
                                >
                                  {placed?.svg ? (
                                    <div
                                      className="raster-svg"
                                      onClick={() => {
                                        if (ausgewaehltesElement) {
                                          if (ausgewaehltesElement.side !== 'back') return;
                                          setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                            ...r,
                                            placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                          } : r));
                                          return;
                                        }
                                        if (aktivesGarn) {
                                          const y = garne.find(g => g.id === aktivesGarn);
                                          if (!y) return;
                                          setReihen(prev => prev.map(r => {
                                            if (r.id !== reihe.id) return r;
                                            const updated = { ...(r.placements || {}) };
                                            Object.keys(updated).forEach(k => {
                                              const p = updated[k];
                                              if (p && p.svg) {
                                                updated[k] = {
                                                  ...p,
                                                  svg: colorizeSvg(p.svg, y.hauptfarbe, y.px),
                                                  overlaySvg: p.overlaySvg ? colorizeSvg(p.overlaySvg, y.hauptfarbe, y.px) : p.overlaySvg
                                                };
                                              }
                                            });
                                            return { ...r, placements: updated };
                                          }));
                                        }
                                      }}
                                      dangerouslySetInnerHTML={{ __html: placed.svg }}
                                    />
                                  ) : (
                                    <img
                                      alt={placed?.alt || "image"}
                                      src={src}
                                      className="img-fadenlauf-baustein"
                                      onClick={() => {
                                        if (!ausgewaehltesElement) return;
                                        if (ausgewaehltesElement.side !== 'back') return;
                                        setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                          ...r,
                                          placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                        } : r));
                                      }}
                                    />
                                  )}
                                  {placed?.overlaySvg && (
                                    <div className="raster-svg overlay" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: placed.overlaySvg }} />
                                  )}
                                </div>
                              );
                            })}
                          </>
                        )
                      })()
                    ) : (
                      (() => {
                        const obereReihe = Math.ceil(parseInt(reihe.bausteinAnzahl, 10) / 2)
                        const untereReihe = Math.floor(parseInt(reihe.bausteinAnzahl, 10) / 2)
                        return (
                          <>
                            {[...Array(obereReihe)].map((_, i) => {
                              const cellKey = `oben-${i}`;
                              const placed = (reihe.placements || {})[cellKey];
                              const src = placed?.src || "https://play.teleporthq.io/static/svg/default-img.svg";
                              return (
                                // LL top row: wrapper with overlay
                                <div
                                  key={`ll-oben-wrap-${reihe.id}-${i}`}
                                  style={{ gridRow: 1, gridColumn: i + 1, position: 'relative', cursor: ausgewaehltesElement ? 'none' : 'default' }}
                                >
                                  {placed?.svg ? (
                                    <div
                                      className="raster-svg"
                                      onClick={() => {
                                        if (ausgewaehltesElement) {
                                          if (ausgewaehltesElement.side !== 'back') return;
                                          setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                            ...r,
                                            placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                          } : r));
                                          return;
                                        }
                                        if (aktivesGarn) {
                                          const y = garne.find(g => g.id === aktivesGarn);
                                          if (!y) return;
                                          setReihen(prev => prev.map(r => {
                                            if (r.id !== reihe.id) return r;
                                            const updated = { ...(r.placements || {}) };
                                            Object.keys(updated).forEach(k => {
                                              const p = updated[k];
                                              if (p && p.svg) {
                                                updated[k] = {
                                                  ...p,
                                                  svg: colorizeSvg(p.svg, y.hauptfarbe, y.px),
                                                  overlaySvg: p.overlaySvg ? colorizeSvg(p.overlaySvg, y.hauptfarbe, y.px) : p.overlaySvg
                                                };
                                              }
                                            });
                                            return { ...r, placements: updated };
                                          }));
                                        }
                                      }}
                                      dangerouslySetInnerHTML={{ __html: placed.svg }}
                                    />
                                  ) : (
                                    <img
                                      alt={placed?.alt || "image"}
                                      src={src}
                                      className="img-fadenlauf-baustein"
                                      onClick={() => {
                                        if (!ausgewaehltesElement) return;
                                        if (ausgewaehltesElement.side !== 'back') return;
                                        setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                          ...r,
                                          placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                        } : r));
                                      }}
                                    />
                                  )}
                                  {placed?.overlaySvg && (
                                    <div className="raster-svg overlay" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: placed.overlaySvg }} />
                                  )}
                                </div>
                              );
                            })}
                            {[...Array(untereReihe)].map((_, i) => {
                              const cellKey = `unten-${i}`;
                              const placed = (reihe.placements || {})[cellKey];
                              const src = placed?.src || "https://play.teleporthq.io/static/svg/default-img.svg";
                              return (
                                // LL bottom row: wrapper with overlay
                                <div
                                  key={`ll-unten-wrap-${reihe.id}-${i}`}
                                  style={{ gridRow: 2, gridColumn: i + 1, position: 'relative', cursor: ausgewaehltesElement ? 'none' : 'default' }}
                                >
                                  {placed?.svg ? (
                                    <div
                                      className="raster-svg"
                                      onClick={() => {
                                        if (ausgewaehltesElement) {
                                          if (ausgewaehltesElement.side !== 'front') return;
                                          setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                            ...r,
                                            placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                          } : r));
                                          return;
                                        }
                                        if (aktivesGarn) {
                                          const y = garne.find(g => g.id === aktivesGarn);
                                          if (!y) return;
                                          setReihen(prev => prev.map(r => {
                                            if (r.id !== reihe.id) return r;
                                            const updated = { ...(r.placements || {}) };
                                            Object.keys(updated).forEach(k => {
                                              const p = updated[k];
                                              if (p && p.svg) {
                                                updated[k] = {
                                                  ...p,
                                                  svg: colorizeSvg(p.svg, y.hauptfarbe, y.px),
                                                  overlaySvg: p.overlaySvg ? colorizeSvg(p.overlaySvg, y.hauptfarbe, y.px) : p.overlaySvg
                                                };
                                              }
                                            });
                                            return { ...r, placements: updated };
                                          }));
                                        }
                                      }}
                                      dangerouslySetInnerHTML={{ __html: placed.svg }}
                                    />
                                  ) : (
                                    <img
                                      alt={placed?.alt || "image"}
                                      src={src}
                                      className="img-fadenlauf-baustein"
                                      onClick={() => {
                                        if (!ausgewaehltesElement) return;
                                        if (ausgewaehltesElement.side !== 'front') return;
                                        setReihen(prev => prev.map(r => r.id === reihe.id ? {
                                          ...r,
                                          placements: { ...(r.placements || {}), [cellKey]: { ...ausgewaehltesElement } }
                                        } : r));
                                      }}
                                    />
                                  )}
                                  {placed?.overlaySvg && (
                                    <div className="raster-svg overlay" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: placed.overlaySvg }} />
                                  )}
                                </div>
                              );
                            })}
                          </>
                        )
                      })()
                    )}
                  </div>
                    <button
                      type="button"
                      className={`fnt-ButtonHead btn-reihe-nummer${reihe.id === aktiveReihe ? " selected" : ""}`}
                      onClick={() => {
                        setAktiveReihe(reihe.id);
                      }}
                    >
                      {reihen.length - index}
                    </button>

                  <div className="cnt-reihe-final">
                    <button
                      type="button"
                      className={`fnt-ButtonText btn-reihe-finalisieren${reihe.id === aktiveReihe ? " selected" : ""}`}
                      onClick={() => {
                        setAktiveReihe(reihe.id);
                        setAusgewaehltesElement(null);
                        const count = parseInt(reihe.bausteinAnzahl, 10) || 0;

                        setReihen(prev => prev.map(r => {
                          if (r.id !== reihe.id) return r;
                          const count = parseInt(r.bausteinAnzahl, 10) || 0;

                // Frischer Start: bestehende Platzierungen kopieren, aber svg/Locks entfernen
                          const nextPlacements = {};
                          Object.entries(r.placements || {}).forEach(([k, p]) => {
                            if (!p) return;
                            nextPlacements[k] = {
                              src: p.src,
                              alt: p.alt,
                              side: p.side
                              // kein svg, kein lockedByPass1
                            };
                          });

                // Gemeinsame Zwei-Pass-Logik als Hilfsfunktion für 2-Reihen-Modi (RR/LL)
                          const applyTwoRowUnified = (mode) => {
                            const topLen = Math.ceil(count / 2);
                            const botLen = Math.floor(count / 2);
                            const usedNeighbors = new Set();

                            // Pass 1: S/F bevorzugt S/F-Nachbarn, sonst N
                            const processRow = (rowName, rowLen) => {
                              const otherRow = rowName === 'oben' ? 'unten' : 'oben';
                              const otherLen = otherRow === 'oben' ? topLen : botLen;
                              const maxDx = Math.max(rowLen, otherLen);
                              const prio = mode === 'RR' ? prioritiesRR(rowName, maxDx) : prioritiesLL(rowName, maxDx);

                              for (let i = 0; i < rowLen; i++) {
                                const key = `${rowName}-${i}`;
                                const self = nextPlacements[key];
                                if (!self || !self.alt) continue;
                                const selfAlt = self.alt;
                                const isN = selfAlt.startsWith('N');
                                if (isN) continue; // N macht Pass 2

                                let chosenKey = null;
                                let chosenAlt = null;
                                let chosenDx = null;

                                // Phase A: nur S/F-Nachbarn zulassen
                                for (const { dx, row } of prio) {
                                  const len = row === 'oben' ? topLen : botLen;
                                  if (len <= 0) continue;
                                  const idx = (i + dx) % len;
                                  const nKey = `${row}-${idx}`;
                                  if (usedNeighbors.has(nKey)) continue;
                                  const nAlt = nextPlacements[nKey]?.alt || null;
                                  if (!nAlt) continue;
                                  if (nAlt.startsWith('N')) continue; // Phase A ignoriert N
                                  const mappedDx = mapDxForFilename(mode, rowName, row, dx);
                                  const svgRaw = getRasterSvgDyn(mode, selfAlt, mappedDx, nAlt);
                                  if (svgRaw) {
                                    chosenKey = nKey;
                                    chosenAlt = nAlt;
                                    chosenDx = mappedDx;
                                    nextPlacements[key] = {
                                      ...self,
                                      svg: svgRaw,
                                      lockedByPass1: true,
                                      lastMode: mode,
                                      lastDx: mappedDx,
                                      lastSelfAlt: selfAlt,
                                      lastNeighborAlt: nAlt
                                    };
                                    usedNeighbors.add(nKey); // Sofort als benutzt markieren, damit Pass 2 ihn nicht mehr verwenden kann
                                    break;
                                  }
                                }

                                // Phase B: kein S/F gefunden → N als Nachbar zulassen
                                if (!chosenKey) {
                                  for (const { dx, row } of prio) {
                                    const len = row === 'oben' ? topLen : botLen;
                                    if (len <= 0) continue;
                                    const idx = (i + dx) % len;
                                    const nKey = `${row}-${idx}`;
                                    if (usedNeighbors.has(nKey)) continue;
                                    const nAlt = nextPlacements[nKey]?.alt || null;
                                    if (!nAlt || !nAlt.startsWith('N')) continue;
                                    const mappedDx = mapDxForFilename(mode, rowName, row, dx);
                                    const svgRaw = getRasterSvgDyn(mode, selfAlt, mappedDx, nAlt);
                                    if (svgRaw) {
                                      chosenKey = nKey;
                                      chosenAlt = nAlt;
                                      chosenDx = mappedDx;
                                      nextPlacements[key] = {
                                        ...self,
                                        svg: svgRaw,
                                        lockedByPass1: true,
                                        lastMode: mode,
                                        lastDx: mappedDx,
                                        lastSelfAlt: selfAlt,
                                        lastNeighborAlt: nAlt
                                      };
                                      usedNeighbors.add(nKey); // Sofort als benutzt markieren
                                      break;
                                    }
                                  }
                                }
                              }
                            };

                            processRow('oben', topLen);
                            processRow('unten', botLen);

                            // Pass 2: N schaut NUR in der eigenen Reihe nach dem nächstgelegenen F
                            // nur S/F in gleicher Reihe; Pass 3 folgt danach für N-N-Ketten
                            const processRowPass2 = (rowName, rowLen) => {
                              const otherRow = rowName === 'oben' ? 'unten' : 'oben';
                              const otherLen = otherRow === 'oben' ? topLen : botLen;
                              const maxDx = Math.max(rowLen, otherLen);
                              // Nur Einträge der eigenen Reihe
                              const prioSameRow = (mode === 'RR' ? prioritiesRR(rowName, maxDx) : prioritiesLL(rowName, maxDx))
                                .filter(p => p.row === rowName);

                              for (let i = 0; i < rowLen; i++) {
                                const key = `${rowName}-${i}`;
                                const self = nextPlacements[key];
                                if (!self || !self.alt) continue;
                                if (self.lockedByPass1) continue; // in Pass 1 festgeschriebene Elemente bleiben unangetastet
                                const selfAlt = self.alt;
                                if (!selfAlt.startsWith('N')) continue; // nur N in Pass 2

                                for (const { dx, row } of prioSameRow) {
                                  const len = row === 'oben' ? topLen : botLen; // == rowLen
                                  if (len <= 0) continue;
                                  const idx = (i + dx) % len;
                                  const nKey = `${row}-${idx}`;
                                  if (usedNeighbors.has(nKey)) continue; // Nachbar bereits von jemandem verbraucht
                                  const nAlt = nextPlacements[nKey]?.alt || null;
                                  if (!nAlt) continue;
                                  if (nAlt.startsWith('N')) continue; // Phase 2: F sucht bevorzugt S/F – F-Nachbarn hier ignorieren

                                  const mappedDx = mapDxForFilename(mode, rowName, row, dx);
                                  const svgRaw = getRasterSvgDyn(mode, selfAlt, mappedDx, nAlt);
                                  if (svgRaw) {
                                    nextPlacements[key] = {
                                      ...self,
                                      svg: svgRaw,
                                      lastMode: mode,
                                      lastDx: mappedDx,
                                      lastSelfAlt: selfAlt,
                                      lastNeighborAlt: nAlt
                                    };
                                    usedNeighbors.add(nKey);
                                    break; // nächster N
                                  }
                                }
                              }
                            };
                            processRowPass2('oben', topLen);
                            processRowPass2('unten', botLen);

                            // Pass 3 (iterativ):
                            // N ohne svg darf in derselben Reihe x+1 nehmen, wenn dort N bereits ein svg hat.
                            // Wiederhole, bis kein neues svg mehr gesetzt wird.
                            const propagateFPass3 = (rowName, rowLen) => {
                              if (rowLen <= 0) return;
                              let changed = true;
                              // Sicherheitskappe: max. rowLen Iterationen reichen für Ketten nach links
                              for (let loop = 0; loop < rowLen && changed; loop++) {
                                changed = false;
                                for (let i = 0; i < rowLen; i++) {
                                  const key = `${rowName}-${i}`;
                                  const self = nextPlacements[key];
                                  if (!self || !self.alt) continue;
                                  if (self.lockedByPass1) continue;     // Pass 1 bleibt unangetastet
                                  if (!self.alt.startsWith('N')) continue; // nur N
                                  if (self.svg) continue;               // Pass 2 Ergebnis nicht überschreiben

                                  const len = rowLen;
                                  const nbIdx = (i + 1) % len;
                                  const nKey = `${rowName}-${nbIdx}`;
                                  if (usedNeighbors.has(nKey)) continue;

                                  const nAlt = nextPlacements[nKey]?.alt || null;
                                  const nSvg = nextPlacements[nKey]?.svg || null;
                                  if (!nAlt || !nAlt.startsWith('N')) continue; // nur N-Nachbar erlaubt
                                  if (!nSvg) continue;                           // und dieser muss bereits ein svg haben

                                  // dx = 1 in derselben Reihe
                                  const mappedDx = mapDxForFilename(mode, rowName, rowName, 1);
                                  const svgRaw = getRasterSvgDyn(mode, self.alt, mappedDx, nAlt);
                                  if (svgRaw) {
                                    nextPlacements[key] = {
                                      ...self,
                                      svg: svgRaw,
                                      lastMode: mode,
                                      lastDx: mappedDx,
                                      lastSelfAlt: self.alt,
                                      lastNeighborAlt: nAlt
                                    };
                                    usedNeighbors.add(nKey);
                                    changed = true;
                                  }
                                }
                              }
                            };

                            propagateFPass3('oben', topLen);
                            propagateFPass3('unten', botLen); 
                          };

                // RL: Einreihig, immer +1 in derselben Reihe; nur Vorderbett
                          const applyRLUnified = () => {
                            const usedNeighbors = new Set();
                            // Pass 1: S/F → bevorzugt S/F (hier nur derselbe Reihen-Nachbar +1)
                            for (let i = 0; i < count; i++) {
                              const key = `rl-${i}`;
                              const self = nextPlacements[key];
                              if (!self || !self.alt) continue;
                              const selfAlt = self.alt;
                              const isN = selfAlt.startsWith('N');
                              if (isN) continue;
                              const nbIdx = (i + 1) % count;
                              const nbKey = `rl-${nbIdx}`;
                              if (usedNeighbors.has(nbKey)) continue;
                              const nbAlt = nextPlacements[nbKey]?.alt || null;
                              if (!nbAlt) continue;
                              // Phase A: S/F-only
                              if (!nbAlt.startsWith('N')) {
                                const svgRaw = getRLSvg(selfAlt, 1, nbAlt);
                                if (svgRaw) {
                                  nextPlacements[key] = {
                                    ...self,
                                    svg: svgRaw,
                                    lockedByPass1: true,
                                    lastMode: 'RL',
                                    lastDx: 1,
                                    lastSelfAlt: selfAlt,
                                    lastNeighborAlt: nbAlt
                                  };
                                  usedNeighbors.add(nbKey);
                                  continue;
                                }
                              }
                              // Phase B: N-Fallback
                              if (nbAlt && nbAlt.startsWith('N')) {
                                const svgRaw = getRLSvg(selfAlt, 1, nbAlt);
                                if (svgRaw) {
                                  nextPlacements[key] = {
                                    ...self,
                                    svg: svgRaw,
                                    lockedByPass1: true,
                                    lastMode: 'RL',
                                    lastDx: 1,
                                    lastSelfAlt: selfAlt,
                                    lastNeighborAlt: nbAlt
                                  };
                                  usedNeighbors.add(nbKey);
                                }
                              }
                            }
                            // Pass 2 (RL): N sucht in derselben Reihe nach nächstem S/F (dx = 1,2,3,...) und nutzt ihn, wenn er nicht used ist
                            for (let i = 0; i < count; i++) {
                              const key = `rl-${i}`;
                              const self = nextPlacements[key];
                              if (!self || !self.alt) continue;
                              if (self.lockedByPass1) continue; // in Pass 1 gelockte bleiben
                              const selfAlt = self.alt;
                              if (!selfAlt.startsWith('N')) continue; // nur N in Pass 2

                              for (let dx = 1; dx < count; dx++) {
                                const nbIdx = (i + dx) % count;
                                const nbKey = `rl-${nbIdx}`;
                                if (usedNeighbors.has(nbKey)) continue;
                                const nbAlt = nextPlacements[nbKey]?.alt || null;
                                if (!nbAlt) continue;
                                if (nbAlt.startsWith('N')) continue; // bevorzugt S/F

                                const svgRaw = getRLSvg(selfAlt, dx, nbAlt);
                                if (svgRaw) {
                                  nextPlacements[key] = {
                                    ...self,
                                    svg: svgRaw,
                                    lastMode: 'RL',
                                    lastDx: dx,
                                    lastSelfAlt: selfAlt,
                                    lastNeighborAlt: nbAlt
                                  };
                                  usedNeighbors.add(nbKey);
                                  break; // nächster N
                                }
                              }
                            }
                            // Pass 3 (RL, iterativ):
                            // N ohne svg darf x+1 nehmen, wenn dort N bereits ein svg hat. Wiederholen bis stabil.
                            (() => {
                              if (count <= 0) return;
                              let changed = true;
                              // Sicherheitskappe: maximal 'count' Iterationen reichen für Ketten nach links
                              for (let loop = 0; loop < count && changed; loop++) {
                                changed = false;
                                for (let i = 0; i < count; i++) {
                                  const key = `rl-${i}`;
                                  const self = nextPlacements[key];
                                  if (!self || !self.alt) continue;
                                  if (self.lockedByPass1) continue;       // Pass 1 bleibt unangetastet
                                  if (!self.alt.startsWith('N')) continue; // nur N
                                  if (self.svg) continue;                 // nichts überschreiben

                                  const nbIdx = (i + 1) % count;          // nur x+1 in derselben Reihe
                                  const nKey = `rl-${nbIdx}`;
                                  if (usedNeighbors.has(nKey)) continue;

                                  const nAlt = nextPlacements[nKey]?.alt || null;
                                  const nSvg = nextPlacements[nKey]?.svg || null;
                                  if (!nAlt || !nAlt.startsWith('N')) continue; // Nachbar muss N sein
                                  if (!nSvg) continue;                           // und bereits ein svg haben

                                  const svgRaw = getRLSvg(self.alt, 1, nAlt);
                                  if (svgRaw) {
                                    nextPlacements[key] = {
                                      ...self,
                                      svg: svgRaw,
                                      lastMode: 'RL',
                                      lastDx: 1,
                                      lastSelfAlt: self.alt,
                                      lastNeighborAlt: nAlt
                                    };
                                    usedNeighbors.add(nKey);
                                    changed = true;
                                  }
                                }
                              }
                            })();
                          };

                          if (r.nadelanordnung === 'RR') applyTwoRowUnified('RR');
                          else if (r.nadelanordnung === 'LL') applyTwoRowUnified('LL');
                          else if (r.nadelanordnung === 'IL') applyTwoRowUnified('IL');
                          else if (r.nadelanordnung === 'RL') applyRLUnified();
                          
                          // Rapport-Overlay Regeln:
                          // - Rechts: erstes fertiges SVG (egal ob S/F/N)
                          // - Links: erstes fertiges SVG (egal ob S/F/N)
                          // - Overlay-Name: Self/Neighbor im Dateinamen tauschen, r/l je Token beibehalten:
                          // - neuesSelfAlt = Buchstabe(rechts) + Seite(links)
                          // - neuesNeighborAlt = Buchstabe(links) + Seite(rechts)
                          // - Modus und x+N vom rechten Element übernehmen.
                          // - Spiegeln: gleiche Reihe → Y, unterschiedliche Reihen → XY.
                          // - Platzierung: overlaySvg auf die links gefundene Zelle, linkes Original bleibt unverändert.
                          (() => {
                            // vorhandene Overlays entfernen
                            Object.keys(nextPlacements).forEach(k => { if (nextPlacements[k]) delete nextPlacements[k].overlaySvg; });
                          
                            const hasFinished = (p) => !!(p && p.svg);
                          
                            // Hilfsfunktionen für 1-reihige Scans
                            const firstLeftFinishedKey1Row = (keys) => {
                              for (let i = 0; i < keys.length; i++) {
                                const k = keys[i];
                                if (hasFinished(nextPlacements[k])) return k;
                              }
                              return null;
                            };
                            const firstRightFinishedKey1Row = (keys) => {
                              for (let i = keys.length - 1; i >= 0; i--) {
                                const k = keys[i];
                                if (hasFinished(nextPlacements[k])) return k;
                              }
                              return null;
                            };
                          
                            // Einreihige Modi: RL
                            if (r.nadelanordnung === 'RL') {
                              const keys = [...Array(count)].map((_, i) => `rl-${i}`);
                              const leftKey = firstLeftFinishedKey1Row(keys);
                              const rightKey = firstRightFinishedKey1Row(keys);
                              if (!leftKey || !rightKey || leftKey === rightKey) return;
                          
                              const leftP = nextPlacements[leftKey];
                              const rightP = nextPlacements[rightKey];
                          
                              if (!rightP.lastMode || rightP.lastDx == null) {
                                nextPlacements[leftKey].overlaySvg = mirrorSvgY(rightP.svg);
                                return;
                              }
                          
                              const rightSelfAlt = rightP.lastSelfAlt || rightP.alt;
                              const rightNeighborAlt = rightP.lastNeighborAlt || 'Nr';
                              const { selfAlt, neighborAlt } = buildOverlayAltsFromRight(rightSelfAlt, rightNeighborAlt);
                          
                              const baseSvg = getRLSvg(selfAlt, rightP.lastDx, neighborAlt);
                              if (!baseSvg) return;
                          
                              // gleiche Reihe → nur Y-Spiegeln
                              nextPlacements[leftKey].overlaySvg = mirrorSvgY(baseSvg);
                              return;
                            }
                          
                            // Zweireihige Modi: RR, LL, IL (IL nutzt LL-Dateien im Getter)
                            if (r.nadelanordnung === 'RR' || r.nadelanordnung === 'LL' || r.nadelanordnung === 'IL') {
                              const topLen = Math.ceil(count / 2);
                              const botLen = Math.floor(count / 2);

                              const topKeys = [...Array(topLen)].map((_, i) => `oben-${i}`);
                              const botKeys = [...Array(botLen)].map((_, i) => `unten-${i}`);

                              // Links: spaltenweise von links; je Spalte zuerst UNTEN, dann OBEN
                              const firstFinishedLeft2Row = () => {
                                const maxCol = Math.max(topLen, botLen);
                                for (let i = 0; i < maxCol; i++) {
                                  const botKey = `unten-${i}`;
                                  if (hasFinished(nextPlacements[botKey])) return botKey;
                                  const topKey = `oben-${i}`;
                                  if (hasFinished(nextPlacements[topKey])) return topKey;
                                }
                                return null;
                              };

                              // Rechts: spaltenweise von rechts; je Spalte zuerst OBEN, dann UNTEN
                              const firstFinishedRight2Row = () => {
                                const maxCol = Math.max(topLen, botLen);
                                for (let i = maxCol - 1; i >= 0; i--) {
                                  const topKey = `oben-${i}`;
                                  if (hasFinished(nextPlacements[topKey])) return topKey;
                                  const botKey = `unten-${i}`;
                                  if (hasFinished(nextPlacements[botKey])) return botKey;
                                }
                                return null;
                              };

                              const rightKey = firstFinishedRight2Row();
                              const leftKey = firstFinishedLeft2Row();

                              if (!leftKey || !rightKey || leftKey === rightKey) return;

                              const leftP = nextPlacements[leftKey];
                              const rightP = nextPlacements[rightKey];
                              if (!rightP || !rightP.svg) return;

                              const sameRow =
                                (leftKey.startsWith('oben-') && rightKey.startsWith('oben-')) ||
                                (leftKey.startsWith('unten-') && rightKey.startsWith('unten-'));

                              // Fallback, falls keine Meta-Infos vorhanden
                              if (!rightP.lastMode || rightP.lastDx == null) {
                                nextPlacements[leftKey].overlaySvg = sameRow ? mirrorSvgY(rightP.svg) : mirrorSvgXY(rightP.svg);
                                return;
                              }

                              // Overlay-Alts aus dem RECHTEN Dateinamen bilden
                              const rightSelfAlt = rightP.lastSelfAlt || rightP.alt;
                              const rightNeighborAlt = rightP.lastNeighborAlt || (rightKey.startsWith('oben-') ? 'Nl' : 'Nr');
                              const { selfAlt, neighborAlt } = buildOverlayAltsFromRight(rightSelfAlt, rightNeighborAlt);

                              // Modus und dx vom rechten übernehmen
                              const mode = rightP.lastMode; // 'RR' | 'LL' | 'IL'
                              const dx = rightP.lastDx;

                              let baseSvg = getRasterSvgDyn(mode, selfAlt, dx, neighborAlt);
                              if (!baseSvg) {
                                // harter Fallback: rechtes fertiges SVG spiegeln
                                nextPlacements[leftKey].overlaySvg = sameRow ? mirrorSvgY(rightP.svg) : mirrorSvgXY(rightP.svg);
                                return;
                              }

                              // Spiegelung abhängig von Reihenlage
                              nextPlacements[leftKey].overlaySvg = sameRow ? mirrorSvgY(baseSvg) : mirrorSvgXY(baseSvg);
                              return;
                            }
                          })();
                          
                          return { ...r, placements: nextPlacements };
                        }))
                      }}
                    >
                      finalisieren
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {maschenbildSichtbar && (
              <button
                id="btn-maschenbild-generieren"
                type="button"
                className="fnt-ButtonGenerieren btn-generieren"
              >
                Maschenbild generieren
              </button>
            )}
          </div>
        )}


  {/*---- Tool Maschenbild -----------------------------------------------------------*/}
        {maschenbildSichtbar && (
          <div 
            id="cnt-tool-maschenbild" 
            className={`cnt-tool-maschenbild ${fadenlaufSichtbar ? '' : 'cnt-tool-maschenbild-vollbreite'}`}
          >


  {/*------ Maschenbild Vorderseite -----------------------------------------------------------*/}
          <div
            id="cnt-maschenbild-vorderseite"
            className="cnt-maschenbild-seite"
          >
            <div id="cnt-top-vorderseite" className="cnt-top-seite">
              <button
                id="btn-vorderseite"
                type="button"
                className="fnt-ButtonText btn-seite"
              >
                Vorderseite
              </button>

              {["RR", "IL"].includes(grundbindung) && (
                <div id="cnt-vorderseite-ebenen" className="cnt-ebenen">
                   <button
                    id="btn-vorderseite-ebene-oben"
                    type="button"
                    className={`fnt-ButtonText btn-ebene${aktiveEbeneVorderseite === 2 ? " selected" : ""}`}
                    onClick={() => setAktiveEbeneVorderseite(prev => prev === 2 ? null : 2)}
                  >
                    Oben
                  </button>
                  <button
                    id="btn-vorderseite-ebene-unten"
                    type="button"
                    className={`fnt-ButtonText btn-ebene${aktiveEbeneVorderseite === 1 ? " selected" : ""}`}
                    onClick={() => setAktiveEbeneVorderseite(prev => prev === 1 ? null : 1)}
                  >
                    Unten
                  </button>
                </div>
              )}
            </div>
            
  {/*-------- Raster Vorderseite -----------------------------------------------------------*/}
            <div
              id="cnt-vorderseite-raster"
              className="cnt-maschenbild-raster"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${grundbindung === "RR" ? Math.ceil(ms / 2) : ms}, 100px)`,
                gridTemplateRows: `repeat(${mr}, 80px)`,
                position: "relative"
              }}
            >
            {(grundbindung === "RL" || grundbindung === "LL") && (
              [...Array(mr + 1)].flatMap((_, row) =>
                [...Array(ms)].map((_, col) => {
                  const isTopExtraRow = row === 0;

                  // richtige Quelle bestimmen
                  const sel = isTopExtraRow
                    ? getMbAt('front', null, mr - 1, col) // unterste Reihe nach oben
                    : getMbAt('front', null, row - 1, col); // normale Reihen

                  // Prüfen, ob in dieser Spalte irgendwo "Fr" vorkommt
                  const hasFrInColumn = [...Array(mr)].some((_, r) => {
                    const cell = getMbAt('front', null, r, col);
                    return cell?.alt?.includes("Fr") || cell?.svg?.includes("Fr");
                  });

                  return (
                    <div key={`v-${row}-${col}`} style={{ position: "relative" }}>
                      {sel?.svg ? (
                        <div
                          className="raster-svg"
                          onClick={() =>
                            !isTopExtraRow && onMbCellClick('front', null, row - 1, col)
                          }
                          dangerouslySetInnerHTML={{ __html: sel.svg }}
                          style={{
                            cursor: isTopExtraRow
                              ? 'default'
                              : (ausgewaehltesMbElement ? 'none' : 'pointer'),
                              zIndex: (() => {
                                if (isTopExtraRow) {
                                  return (mr * 2) + 1;   // garantiert oberhalb aller echten Reihen
                                }
                                let base = mr - (row - 1); // normale Stapelung
                                if (!hasFrInColumn) base += mr; // Spalten ohne Fr hochschieben
                                return base;
                              })()
                          }}
                        />
                      ) : (
                        <img
                          alt={sel?.alt || 'image'}
                          src={sel?.src || 'https://play.teleporthq.io/static/svg/default-img.svg'}
                          onClick={() =>
                            !isTopExtraRow && onMbCellClick('front', null, row - 1, col)
                          }
                          style={{
                            cursor: isTopExtraRow
                              ? 'default'
                              : (ausgewaehltesMbElement ? 'none' : 'pointer')
                          }}
                        />
                      )}
                    </div>
                  );
                })
              )
            )}
              {grundbindung === "IL" && (
                <div
                  className="raster-zentriert-IL"
                  style={{
                    width: `${ms * 100}px`,
                    height: `${mr * 80}px`,
                    position: "relative"
                  }}
                >
                  {/* Obere Ebene → rechte Elemente (M_Sr) */}
                  {[...Array(mr)].map((_, row) =>
                    [...Array(ms)].map((_, col) => {
                      const style = {
                        position: "absolute",
                        top: `${row * 80}px`,
                        left: `${col * 100}px`,
                        zIndex: 2,
                        opacity: aktiveEbeneVorderseite === 1 || aktiveEbeneVorderseite === null ? 1 : 0
                      };
                      return (
                        <img
                          key={`v1-${row}-${col}`}
                          src={mbRightSr}
                          alt="M_Sr"
                          className="img-maschenbild-baustein"
                          style={style}
                          onClick={() => onMbCellClick("front", "oben", row, col)}
                        />
                      );
                    })
                  )}

                  {/* Untere Ebene → linke Elemente (M_Sl) */}
                  {[...Array(mr)].map((_, row) =>
                    [...Array(ms)].map((_, col) => {
                      const style = {
                        position: "absolute",
                        top: `${row * 80}px`,
                        left: `${col * 100}px`,
                        zIndex: 1,
                        opacity: aktiveEbeneVorderseite === 2 || aktiveEbeneVorderseite === null ? 1 : 0
                      };
                      return (
                        <img
                          key={`v2-${row}-${col}`}
                          src={mbLeftSl}
                          alt="M_Sl"
                          className="img-maschenbild-baustein"
                          style={style}
                          onClick={() => onMbCellClick("front", "unten", row, col)}
                        />
                      );
                    })
                  )}
                </div>
              )}
              {grundbindung === "RR" && (
                <>
                  {[...Array(mr)].map((_, row) =>
                    [...Array(Math.floor(ms / 2))].map((_, col) => (
                      (() => {
                        const sel = getMbAt('front', 'oben', row, col);
                        const style = {
                          gridRow: row + 1,
                          gridColumn: centeredColStart(col, Math.floor(ms / 2), Math.ceil(ms / 2)),
                          transform: "translateX(-25px)",
                          zIndex: 2,
                          opacity: aktiveEbeneVorderseite === 1 || aktiveEbeneVorderseite === null ? 1 : 0,
                          cursor: ausgewaehltesMbElement ? 'none' : 'pointer'
                        };
                        return (
                          sel?.svg ? (
                            <div
                              key={`v1-${row}-${col}`}
                              className="raster-svg"
                              onClick={() => onMbCellClick('front', 'oben', row, col)}
                              dangerouslySetInnerHTML={{ __html: sel.svg }}
                              style={style}
                            />
                          ) : (
                            <img
                              key={`v1-${row}-${col}`}
                              alt={sel?.alt || 'image'}
                              src={sel?.src || 'https://play.teleporthq.io/static/svg/default-img.svg'}
                              onClick={() => onMbCellClick('front', 'oben', row, col)}
                              style={style}
                            />
                          )
                        );
                      })()
                    ))
                  )}
                  {[...Array(mr)].map((_, row) =>
                    [...Array(Math.ceil(ms / 2))].map((_, col) => (
                      (() => {
                        const sel = getMbAt('front', 'unten', row, col);
                        const style = {
                          gridRow: row + 1,
                          gridColumn: centeredColStart(col, Math.ceil(ms / 2), Math.ceil(ms / 2)),
                          transform: "translateX(25px)",
                          zIndex: 1,
                          opacity: aktiveEbeneVorderseite === 2 || aktiveEbeneVorderseite === null ? 1 : 0,
                          cursor: ausgewaehltesMbElement ? 'none' : 'pointer'
                        };
                        return (
                          sel?.svg ? (
                            <div
                              key={`v2-${row}-${col}`}
                              className="raster-svg"
                              onClick={() => onMbCellClick('front', 'unten', row, col)}
                              dangerouslySetInnerHTML={{ __html: sel.svg }}
                              style={style}
                            />
                          ) : (
                            <img
                              key={`v2-${row}-${col}`}
                              alt={sel?.alt || 'image'}
                              src={sel?.src || 'https://play.teleporthq.io/static/svg/default-img.svg'}
                              onClick={() => onMbCellClick('front', 'unten', row, col)}
                              style={style}
                            />
                          )
                        );
                      })()
                    ))
                  )}
                </>
              )}
            </div>

            <button
                id="btn-vorderseite-finalisieren"
                type="button"
                className="fnt-ButtonText btn-maschenbild-finalisieren"
                onClick={finalizeMbFront}
              >
                Finalisieren
              </button>

          </div>
  {/*------ Maschenbild Rückseite -----------------------------------------------------------*/}
          <div
            id="cnt-maschenbild-rueckseite"
            className="cnt-maschenbild-seite"
          >
            <div id="cnt-top-rueckseite" className="cnt-top-seite">
              <button
                id="btn-rueckseite"
                type="button"
                className="fnt-ButtonText btn-seite"
              >
                RÜckseite
              </button>

              {["RR", "IL"].includes(grundbindung) && (
                <div id="cnt-rueckseite-ebenen" className="cnt-ebenen">
                  <button
                    id="btn-rueckseite-ebene-oben"
                    type="button"
                    className={`fnt-ButtonText btn-ebene${aktiveEbeneRueckseite === 2 ? " selected" : ""}`}
                    onClick={() => setAktiveEbeneRueckseite(prev => prev === 2 ? null : 2)}
                  >
                    Oben
                  </button>
                  <button
                    id="btn-rueckseite-ebene-unten"
                    type="button"
                    className={`fnt-ButtonText btn-ebene${aktiveEbeneRueckseite === 1 ? " selected" : ""}`}
                    onClick={() => setAktiveEbeneRueckseite(prev => prev === 1 ? null : 1)}
                  >
                    Unten
                  </button>

                </div>
              )}
            </div>
            
  {/*-------- Raster Rückseite -----------------------------------------------------------*/}
            <div
              id="cnt-rueckseite-raster"
              className="cnt-maschenbild-raster"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${grundbindung === "RR" ? Math.ceil(ms / 2) : ms}, 100px)`,
                gridTemplateRows: `repeat(${mr}, 80px)`,
                position: "relative"
              }}
            >
            {(grundbindung === "RL" || grundbindung === "LL") && (
              [...Array(mr + 1)].flatMap((_, row) =>
                [...Array(ms)].map((_, col) => {
                  const isTopExtraRow = row === 0;

                  // richtige Quelle bestimmen
                  const sel = isTopExtraRow
                    ? getMbAt('back', null, mr - 1, col) // unterste Reihe kopieren (Overlay oben)
                    : getMbAt('back', null, row - 1, col); // normale Reihen

                  return (
                    <div key={`b-${row}-${col}`} style={{ position: "relative" }}>
                      {sel?.svg ? (
                        <div
                          className="raster-svg"
                          onClick={() =>
                            !isTopExtraRow && onMbCellClick('back', null, row - 1, col)
                          }
                          dangerouslySetInnerHTML={{ __html: sel.svg }}
                          style={{
                            cursor: isTopExtraRow
                              ? 'default'
                              : (ausgewaehltesMbElement ? 'none' : 'pointer'),
                            // Kopie bekommt zIndex 0, echte Reihen starten bei 1
                            zIndex: isTopExtraRow ? 0 : row
                          }}
                        />
                      ) : (
                        <img
                          alt={sel?.alt || 'image'}
                          src={sel?.src || 'https://play.teleporthq.io/static/svg/default-img.svg'}
                          onClick={() =>
                            !isTopExtraRow && onMbCellClick('back', null, row - 1, col)
                          }
                          style={{
                            cursor: isTopExtraRow
                              ? 'default'
                              : (ausgewaehltesMbElement ? 'none' : 'pointer')
                          }}
                        />
                      )}
                    </div>
                  );
                })
              )
            )}

              {grundbindung === "IL" && (
                <div
                  className="raster-zentriert-IL"
                  style={{
                    width: `${ms * 100}px`,
                    height: `${mr * 80}px`,
                    position: "relative"
                  }}
                >
                  {/* Obere Ebene → rechte Elemente (M_Sr) */}
                  {[...Array(mr)].map((_, row) =>
                    [...Array(ms)].map((_, col) => {
                      const style = {
                        position: "absolute",
                        top: `${row * 80}px`,
                        left: `${col * 100}px`,
                        zIndex: 2,
                        opacity: aktiveEbeneRueckseite === 1 || aktiveEbeneRueckseite === null ? 1 : 0
                      };
                      return (
                        <img
                          key={`b1-${row}-${col}`}
                          src={mbRightSr}
                          alt="M_Sr"
                          className="img-maschenbild-baustein"
                          style={style}
                          onClick={() => onMbCellClick("back", "oben", row, col)}
                        />
                      );
                    })
                  )}

                  {/* Untere Ebene → linke Elemente (M_Sl) */}
                  {[...Array(mr)].map((_, row) =>
                    [...Array(ms)].map((_, col) => {
                      const style = {
                        position: "absolute",
                        top: `${row * 80}px`,
                        left: `${col * 100}px`,
                        zIndex: 1,
                        opacity: aktiveEbeneRueckseite === 2 || aktiveEbeneRueckseite === null ? 1 : 0
                      };
                      return (
                        <img
                          key={`b2-${row}-${col}`}
                          src={mbLeftSl}
                          alt="M_Sl"
                          className="img-maschenbild-baustein"
                          style={style}
                          onClick={() => onMbCellClick("back", "unten", row, col)}
                        />
                      );
                    })
                  )}
                </div>
              )}

              {grundbindung === "RR" && (
                <>
                  {[...Array(mr)].map((_, row) =>
                    [...Array(Math.floor(ms / 2))].map((_, col) => {
                      const sel = getMbAt("back", "oben", row, col);
                      const style = {
                        gridRow: row + 1,
                        gridColumn: centeredColStart(col, Math.floor(ms / 2), Math.ceil(ms / 2)),
                        transform: "translateX(-25px)",
                        zIndex: 2,
                        opacity: aktiveEbeneRueckseite === 1 || aktiveEbeneRueckseite === null ? 1 : 0,
                        cursor: ausgewaehltesMbElement ? "none" : "pointer"
                      };
                      return sel?.svg ? (
                        <div
                          key={`h1-${row}-${col}`}
                          className="raster-svg"
                          onClick={() => onMbCellClick("back", "oben", row, col)}
                          dangerouslySetInnerHTML={{ __html: sel.svg }}
                          style={style}
                        />
                      ) : (
                        <img
                          key={`h1-${row}-${col}`}
                          alt={sel?.alt || "image"}
                          src={sel?.src || "https://play.teleporthq.io/static/svg/default-img.svg"}
                          onClick={() => onMbCellClick("back", "oben", row, col)}
                          style={style}
                        />
                      );
                    })
                  )}
                  {[...Array(mr)].map((_, row) =>
                    [...Array(Math.ceil(ms / 2))].map((_, col) => {
                      const sel = getMbAt("back", "unten", row, col);
                      const style = {
                        gridRow: row + 1,
                        gridColumn: centeredColStart(col, Math.ceil(ms / 2), Math.ceil(ms / 2)),
                        transform: "translateX(25px)",
                        zIndex: 1,
                        opacity: aktiveEbeneRueckseite === 2 || aktiveEbeneRueckseite === null ? 1 : 0,
                        cursor: ausgewaehltesMbElement ? "none" : "pointer"
                      };
                      return sel?.svg ? (
                        <div
                          key={`h2-${row}-${col}`}
                          className="raster-svg"
                          onClick={() => onMbCellClick("back", "unten", row, col)}
                          dangerouslySetInnerHTML={{ __html: sel.svg }}
                          style={style}
                        />
                      ) : (
                        <img
                          key={`h2-${row}-${col}`}
                          alt={sel?.alt || "image"}
                          src={sel?.src || "https://play.teleporthq.io/static/svg/default-img.svg"}
                          onClick={() => onMbCellClick("back", "unten", row, col)}
                          style={style}
                        />
                      );
                    })
                  )}
                </>
              )}
            </div>

            <button
              id="btn-rueckseite-finalisieren"
              type="button"
              className="fnt-ButtonText btn-maschenbild-finalisieren"
              onClick={finalizeMbBack}
            >
              Finalisieren
            </button>
          </div>
          {fadenlaufSichtbar && (
            <button
              id="btn-fadenlauf-generieren"
              type="button"
              className="fnt-ButtonGenerieren btn-generieren"
            >
              Fadenlauf generieren
            </button>
          )}
        </div>
        )}
      </div>

  {/*-- Toolbox Garne -----------------------------------------------------------------------*/}
      
      {/* Floating yarn color swatch preview at cursor when yarn active and no element in hand */}
      {!ausgewaehltesElement && aktivesGarn ? (() => {
        const y = garne.find(g => g.id === aktivesGarn);
        if (!y) return null;
        const size = 18;
        const bw = Math.max(1, parseFloat(y.px || 0));
        return (
          <div
            id="cursor-garn-preview"
            style={{
              position: 'fixed',
              left: cursorPos.x + 0,
              top: cursorPos.y + 15,
              width: 40,
              height: Math.max(2, parseFloat(y.px || 0)),
              backgroundColor: y.hauptfarbe || '#000',
              borderRadius: 2,
              transform: 'rotate(-45deg)',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
        );
      })() : null}

<header 
  id="cnt-toolbox-garn" 
  className={`cnt-toolbox-garn ${!garneSichtbar ? 'cnt-toolbox-garn-ausgeblendet' : ''}`}
>

        <button
          id="btn-head-garne"
          type="button"
          className={`fnt-ButtonHead btn-head${!garneSichtbar ? ' selected' : ''}`}
          onClick={() => setGarneSichtbar(!garneSichtbar)}
        >
          {garneSichtbar ? "Garne" : "G"}
        </button>

        {garneSichtbar && (
          <div id="cnt-garn-plusminus" className="cnt-garn-plusminus">
            <button
              id="btn-garn-minus"
              type="button"
              className="fnt-ButtonPlusMinus btn-plusminus"
              onClick={() => {
                const aktuellesGarn = garne.find(g => g.id === aktivesGarn)
                if (!aktuellesGarn) return
                const bestaetigt = window.confirm(`"${aktuellesGarn.name}" löschen?`)
                if (!bestaetigt) return
                if (garne.length > 1) {
                  setGarne(garne.filter((g) => g.id !== aktivesGarn))
                  setAktivesGarn((prev) => {
                    const remaining = garne.filter((g) => g.id !== prev)
                    return remaining.length > 0 ? remaining[0].id : null
                  })
                }
              }}
            >
              -
            </button>
            <button
              id="btn-garn-plus"
              type="button"
              className="fnt-ButtonPlusMinus btn-plusminus"
              onClick={() => {
                const newId = garne.length > 0 ? Math.max(...garne.map(g => g.id)) + 1 : 1
                setGarne([
                  ...garne,
                  {
                    id: newId,
                    name: `Garn${garne.length + 1}`,
                    px: "7",
                    hauptfarbe: "#91C77C",
                    plattierfarbe: "#FD744F",
                    plattieren: false
                  }
                ])
                setAktivesGarn(newId)
              }}
            >
              +
            </button>
          </div>
        )}

        {garneSichtbar && (
          <div id="cnt-garne" className="cnt-garne">
            {garne.map((garn, index) => (
              <div key={garn.id} className="cnt-garn">
                <div className="cnt-garn-top">
                  <button
                    type="button"
                    className={`btn-garn-nummer${garn.id === aktivesGarn ? " selected" : ""}`}
                    onClick={() => {
                      setAktivesGarn(prev => (prev === garn.id ? 0 : garn.id));
                      setAusgewaehltesElement(null);
                    }}
                  >
                    {index + 1}
                  </button>
                  <input
                    type="text"
                    value={garn.name}
                    placeholder="Garnbezeichnung"
                    className="inp-garn-name"
                    onChange={(e) => {
                      const newGarne = [...garne]
                      newGarne[index].name = e.target.value
                      setGarne(newGarne)
                    }}
                  />
                  
                  <div className="tooltip-container">
                    <input
                      type="text"
                      value={garn.px}
                      placeholder="px"
                      className="fnt-Toolbox inp-garn-px"
                      onChange={(e) => {
                        const val = e.target.value
                        const begrenzt = Number(val) > 12 ? "12" : val
                        const newGarne = [...garne]
                        newGarne[index].px = begrenzt
                        setGarne(newGarne)
                      }}
                      onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                          e.preventDefault()
                          e.target.select()
                        }
                      }}
                    />
                    <div className="tooltip-text">Linienstärke in px</div>
                  </div>
                </div>

                <div className="cnt-garn-bottom">
                  <label
                    className="btn-garn-hauptfarbe"
                    style={{ backgroundColor: garn.hauptfarbe }}
                  >
                    <input
                      type="color"
                      value={garn.hauptfarbe}
                      onChange={(e) => {
                        const newGarne = [...garne]
                        newGarne[index].hauptfarbe = e.target.value
                        setGarne(newGarne)
                      }}
                      className="input-color-hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={garn.hauptfarbe}
                    onChange={(e) => {
                      const newGarne = [...garne]
                      newGarne[index].hauptfarbe = e.target.value
                      setGarne(newGarne)
                    }}
                    placeholder="Hex #"
                    className="fnt-Toolbox inp-garn-hauptfarbe"
                  />
                  {garn.plattieren && (
                    <>
                      <label
                        className="btn-garn-plattierfarbe"
                        style={{ backgroundColor: garn.plattierfarbe }}
                      >
                        <input
                          type="color"
                          value={garn.plattierfarbe}
                          onChange={(e) => {
                            const newGarne = [...garne]
                            newGarne[index].plattierfarbe = e.target.value
                            setGarne(newGarne)
                          }}
                          className="input-color-hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={garn.plattierfarbe}
                        onChange={(e) => {
                          const newGarne = [...garne]
                          newGarne[index].plattierfarbe = e.target.value
                          setGarne(newGarne)
                        }}
                        placeholder="Hex #"
                        className="fnt-Toolbox inp-garn-plattierfarbe"
                      />
                    </>
                  )}
                  <div className="tooltip-container">
                    <input
                      type="checkbox"
                      checked={garn.plattieren}
                      onChange={() => {
                        const newGarne = [...garne]
                        newGarne[index].plattieren = !newGarne[index].plattieren
                        setGarne(newGarne)
                      }}
                      className="cb-garn-plattieren"
                    />
                    <div className="tooltip-text">Plattiergarn</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

  {/*--- Footer -----------------------------------------------------------*/}
      <div id="cnt-footer" className="cnt-footer">
        <span
          id="txt-footer-dateiname"
          className="fnt-ButtonText txt-footer-dateiname"
        >
          #Dateiname
        </span>
        <span
          id="txt-footer-entwickler"
          className="fnt-ButtonText txt-footer-entwickler"
        >
          © 2025 Martina Schuster
        </span>
      </div>


  {/*--- Header -----------------------------------------------------------*/}
      <header id="cnt-topbar" className="cnt-topbar">
        <Link to="/" id="txt-topbar-logo" className="txt-topbar-logo fnt-Logo">
          Loopbox
        </Link>
        <div id="cnt-topbar-buttons" className="cnt-topbar-buttons">
          <Link
            to="/"
            id="btn-topbar-startseite"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Startseite
          </Link>
          <button
            id="btn-topbar-speichern"
            type="button"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Speichern
          </button>
          <button
            id="btn-topbar-export"
            type="button"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Export
          </button>
          <button
            id="btn-topbar-hilfe"
            type="button"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Hilfe
          </button>
        </div>
      </header>
    {ausgewaehltesElement && (
      <img
        src={ausgewaehltesElement.src}
        alt="preview"
        style={{
          position: 'fixed',
          left: cursorPos.x + 8,
          top: cursorPos.y + 8,
          width: '50px',
          height: '40px',
          opacity: 0.85,
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
    )}
    </div>
  )
} 

export default Tool
