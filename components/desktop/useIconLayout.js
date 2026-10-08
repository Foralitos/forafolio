"use client";

import { useSyncExternalStore } from "react";
import { APPS } from "./apps";

// Dónde está cada ícono del escritorio. Las posiciones son celdas de una
// cuadrícula (como "Ajustar a cuadrícula" en Mac): { anchor, col, row }, con la
// columna contada desde SU borde. Así, si la ventana del navegador cambia de
// ancho, lo que estaba pegado a la derecha sigue a la derecha.
//
// Cada visitante guarda su acomodo en su propio navegador (localStorage); en
// el servidor y en el primer render siempre salen los defaults.

export const CELL_W = 104;
export const CELL_H = 112;
export const MARGIN = 12;

const KEY = "forafolio:desktop-icons:v1";

const DEFAULTS = Object.fromEntries(
  ["left", "right"].flatMap((anchor) =>
    APPS.filter((app) => app.side === anchor).map((app, row) => [app.id, { anchor, col: 0, row }])
  )
);

function valida(celda) {
  return (
    celda &&
    (celda.anchor === "left" || celda.anchor === "right") &&
    Number.isInteger(celda.col) &&
    celda.col >= 0 &&
    Number.isInteger(celda.row) &&
    celda.row >= 0
  );
}

// ── Store en memoria + localStorage (useSyncExternalStore) ──────────────────
let estado = null;
const oyentes = new Set();

function snapshot() {
  if (estado === null) {
    let guardado = {};
    try {
      guardado = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
      guardado = {};
    }
    estado = { ...DEFAULTS };
    for (const id of Object.keys(DEFAULTS)) {
      if (valida(guardado[id])) estado[id] = guardado[id];
    }
  }
  return estado;
}

function suscribir(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

function publicar(nuevo) {
  estado = nuevo;
  try {
    localStorage.setItem(KEY, JSON.stringify(nuevo));
  } catch {
    // Navegación privada o storage bloqueado: el acomodo vive solo en memoria.
  }
  oyentes.forEach((o) => o());
}

export function useIconLayout() {
  return useSyncExternalStore(suscribir, snapshot, () => DEFAULTS);
}

// ── Geometría ───────────────────────────────────────────────────────────────

// Esquina superior izquierda de una celda, en px relativos al área útil.
export function pixelDe(celda, ancho) {
  const x =
    celda.anchor === "left"
      ? MARGIN + celda.col * CELL_W
      : ancho - MARGIN - CELL_W - celda.col * CELL_W;
  return { x, y: celda.row * CELL_H };
}

function limites(ancho, alto) {
  return {
    maxCol: Math.max(0, Math.floor((ancho / 2 - MARGIN) / CELL_W) - 1),
    maxRow: Math.max(0, Math.floor((alto - CELL_H) / CELL_H)),
  };
}

// La celda más cercana a un ícono cuya esquina quedó en (x, y). El lado
// (izquierda/derecha) lo decide en qué mitad de la pantalla cae su centro.
export function celdaMasCercana(x, y, ancho, alto) {
  const { maxCol, maxRow } = limites(ancho, alto);
  const anchor = x + CELL_W / 2 < ancho / 2 ? "left" : "right";
  const desdeBorde = anchor === "left" ? x - MARGIN : ancho - MARGIN - CELL_W - x;
  return {
    anchor,
    col: Math.min(maxCol, Math.max(0, Math.round(desdeBorde / CELL_W))),
    row: Math.min(maxRow, Math.max(0, Math.round(y / CELL_H))),
  };
}

// Dos celdas chocan si sus cajas se enciman (sirve aunque una esté anclada a
// la izquierda y otra a la derecha en una pantalla angosta).
function chocan(a, b, ancho) {
  const pa = pixelDe(a, ancho);
  const pb = pixelDe(b, ancho);
  return Math.abs(pa.x - pb.x) < CELL_W * 0.75 && pa.y === pb.y;
}

// Si la celda ya está ocupada, busca en espiral la libre más cercana.
export function primeraLibre(celda, ocupadas, ancho, alto) {
  const { maxCol, maxRow } = limites(ancho, alto);
  const libre = (c) => !ocupadas.some((o) => chocan(c, o, ancho));
  if (libre(celda)) return celda;
  for (let r = 1; r <= maxCol + maxRow + 2; r++) {
    for (let dc = -r; dc <= r; dc++) {
      for (let dr = -r; dr <= r; dr++) {
        if (Math.max(Math.abs(dc), Math.abs(dr)) !== r) continue;
        const c = { anchor: celda.anchor, col: celda.col + dc, row: celda.row + dr };
        if (c.col < 0 || c.row < 0 || c.col > maxCol || c.row > maxRow) continue;
        if (libre(c)) return c;
      }
    }
  }
  return celda; // escritorio lleno: se encima antes que perderse
}

// ── Acciones ────────────────────────────────────────────────────────────────

// Mueve `ids` desplazados (dx, dy) px desde donde están y los alinea a la
// cuadrícula, sin encimarse con los demás.
export function moverIconos(ids, dx, dy, ancho, alto) {
  const actual = snapshot();
  const nuevo = { ...actual };
  const ocupadas = Object.entries(actual)
    .filter(([id]) => !ids.includes(id))
    .map(([, celda]) => celda);
  for (const id of ids) {
    const { x, y } = pixelDe(actual[id], ancho);
    const destino = primeraLibre(celdaMasCercana(x + dx, y + dy, ancho, alto), ocupadas, ancho, alto);
    nuevo[id] = destino;
    ocupadas.push(destino);
  }
  publicar(nuevo);
}

// "Clean Up": todos (o solo `ids`) de regreso a su lugar original.
export function limpiar(ids, ancho, alto) {
  if (!ids) {
    publicar({ ...DEFAULTS });
    return;
  }
  const actual = snapshot();
  const nuevo = { ...actual };
  const ocupadas = Object.entries(actual)
    .filter(([id]) => !ids.includes(id))
    .map(([, celda]) => celda);
  for (const id of ids) {
    const destino = primeraLibre(DEFAULTS[id], ocupadas, ancho, alto);
    nuevo[id] = destino;
    ocupadas.push(destino);
  }
  publicar(nuevo);
}
