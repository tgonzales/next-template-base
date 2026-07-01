"use client"

import { useEffect, useRef } from "react"

// ===== Config =====
const W = 60
const H = 30
const DURATION_MS = 90000 // 1.5 minutos para erguer o prédio uma vez
const FPS = 8 // animação de detalhes (janelas/guindaste)

const GROUND_ROW = 26
const TOP_FLOOR_ROW = 6
const BUILDING_LEFT = 18
const BUILDING_RIGHT = 41
const FLOOR_HEIGHT = 2
const MAX_FLOORS = Math.floor((GROUND_ROW - TOP_FLOOR_ROW) / FLOOR_HEIGHT) // 10

type Grid = string[][]

function blank(): Grid {
  const g: Grid = []
  for (let r = 0; r < H; r++) g.push(new Array<string>(W).fill(" "))
  return g
}

function put(g: Grid, r: number, c: number, ch: string) {
  if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = ch
}

function text(g: Grid, r: number, c: number, s: string) {
  for (let i = 0; i < s.length; i++) put(g, r, c + i, s[i]!)
}

function floorTop(n: number) {
  return GROUND_ROW - n * FLOOR_HEIGHT
}

function drawGround(g: Grid) {
  text(g, 2, 4, "~~~")
  text(g, 3, 48, "~~~~")
  for (let c = 0; c < W; c++) g[GROUND_ROW]![c] = "_"
  for (let r = GROUND_ROW + 1; r < H; r++) for (let c = 0; c < W; c++) g[r]![c] = (r + c) % 3 === 0 ? "." : " "
  for (let c = 0; c < W; c++) if (c % 4 === 0) put(g, H - 1, c, "=")
}

function drawBuilding(g: Grid, full: number, partial: number, frame: number) {
  for (let n = 1; n <= full; n++) {
    const top = floorTop(n)
    for (let r = top; r < top + FLOOR_HEIGHT; r++) {
      put(g, r, BUILDING_LEFT, "|")
      put(g, r, BUILDING_RIGHT, "|")
    }
    for (let c = BUILDING_LEFT; c <= BUILDING_RIGHT; c++) put(g, top, c, "=")
    const wr = top + 1
    for (let c = BUILDING_LEFT + 2; c < BUILDING_RIGHT - 1; c += 4) {
      const lit = (c + n + frame) % 3 === 0
      put(g, wr, c, "[")
      put(g, wr, c + 1, lit ? "#" : " ")
      put(g, wr, c + 2, "]")
    }
  }
  if (full < MAX_FLOORS && partial > 0) {
    const top = floorTop(full + 1)
    const span = BUILDING_RIGHT - BUILDING_LEFT
    const built = Math.floor(span * partial)
    for (let r = top; r < top + FLOOR_HEIGHT; r++) put(g, r, BUILDING_LEFT, "|")
    for (let c = BUILDING_LEFT; c <= BUILDING_LEFT + built; c++) put(g, top, c, "-")
    if (built >= span) put(g, top, BUILDING_RIGHT, "|")
    const scaff = Math.min(BUILDING_LEFT + built, BUILDING_RIGHT)
    put(g, top + 1, scaff, ":")
  }
}

function drawCrane(g: Grid, full: number, frame: number) {
  const mast = BUILDING_RIGHT + 4
  let craneTop = floorTop(full + 2)
  craneTop = Math.max(craneTop, TOP_FLOOR_ROW - 2)
  for (let r = craneTop; r < GROUND_ROW; r++) put(g, r, mast, "H")
  put(g, GROUND_ROW - 1, mast - 1, "/")
  put(g, GROUND_ROW - 1, mast + 1, "\\")
  const jib = craneTop
  for (let c = BUILDING_LEFT - 1; c < mast + 6; c++) put(g, jib, c, "-")
  put(g, jib, mast, "#")
  put(g, jib, mast + 5, "@")
  const range = BUILDING_RIGHT - BUILDING_LEFT - 6
  const loadC = BUILDING_LEFT + 3 + (frame % range)
  const targetTop = floorTop(full + 1)
  let drop = jib + 1 + (frame % 4)
  drop = Math.min(drop, targetTop - 1)
  for (let r = jib + 1; r < drop; r++) put(g, r, loadC, "|")
  put(g, drop, loadC, "[")
  put(g, drop, loadC + 1, "]")
}

function drawWorkers(g: Grid, full: number, frame: number) {
  const base = GROUND_ROW - 1
  const poses = ["o", "O"]
  const p = poses[frame % 2]!
  text(g, base, 5, "/" + p + "\\")
  const wc = 9 + (frame % 3)
  text(g, base, wc, "_" + poses[(frame + 1) % 2] + "_")
  if (full >= 1) {
    const top = floorTop(full) + 1
    const wc2 = BUILDING_LEFT + 2 + (frame % (BUILDING_RIGHT - BUILDING_LEFT - 4))
    put(g, top, wc2, poses[frame % 2]!)
  }
}

function render(progress: number, frame: number) {
  const g = blank()
  drawGround(g)
  const floorsF = MAX_FLOORS * progress
  let full = Math.floor(floorsF)
  const partial = floorsF - full
  full = Math.min(full, MAX_FLOORS)
  drawCrane(g, full, frame)
  drawBuilding(g, full, partial, frame)
  drawWorkers(g, full, frame)
  const pct = Math.min(100, Math.floor(progress * 100))
  const dots = ".".repeat(frame % 4)
  text(g, 0, 0, ("Ada Workers Building" + dots).padEnd(24))
  text(g, 0, W - 9, (pct + "%").padStart(8))
  return g.map((row) => row.join("")).join("\n")
}

export default function Web() {
  const screenRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const startTime = performance.now()
    let frame = 0
    let timer: ReturnType<typeof setTimeout>

    function loop() {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / DURATION_MS)
      if (screenRef.current) screenRef.current.textContent = render(progress, frame)
      frame++
      // após 100%, mantém o prédio pronto com as janelas piscando
      timer = setTimeout(loop, 1000 / FPS)
    }

    loop()
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex h-screen items-center justify-center bg-[#0a0a0a]">
      <pre
        ref={screenRef}
        className="text-[9px] leading-none whitespace-pre text-[#d6d6d6] select-none sm:text-base"
        style={{
          fontFamily: '"SF Mono", "Cascadia Code", Consolas, Menlo, monospace',
          letterSpacing: 0,
          textShadow: "0 0 2px rgba(255,255,255,0.08)",
        }}
      />
    </main>
  )
}
