// 판서 쇼츠의 칠판 항목을 기본 도형(text, stroke)으로 펼친다. 좌표계는 360 × 520.
// 쓰는 법(한 항목에 키 하나):
//   { t: '글', x, y, size?, c?, a? }           글씨(a: 'start' | 'middle' | 'end')
//   { line: [x1, y1, x2, y2], c?, w? }         선      { arrow: [x1, y1, x2, y2] }  화살표
//   { curve: [x1, y1, x2, y2, 높이] }          굽은 화살표
//   { circle: [cx, cy, r] }  { box: [x, y, w, h] }  { disc: [x, y, w, h] }(색칠한 둥근 막대)
//   { hanoi: { x, y, w, pegs, n, names? } }    하노이 장면(기둥 3개 + 원판)
//   { grid: G }  { ring: [G, k] }  { strike: [G, k] }   수판, 수에 ○, 수에 /
//     G = { x, y, cols, cell, from, to }
export const C = { w: '#f5f3e8', y: '#f6d76b', p: '#f4a6b8', b: '#9fd3f0', g: '#a8e6a1', o: '#f2b06b' }
const DISC = ['#c8b6f2', '#9fe0d6', '#f6d08a', '#f4a6a0', '#a9c8f0', '#cfe39a']

const color = (c) => C[c] ?? c ?? C.w
const textDur = (s) => Math.max(0.35, Math.min(2.4, [...s].length * 0.06))

function text(s, x, y, size = 26, c = 'w', a = 'start', dur) {
  return { kind: 'text', s, x, y, size, color: color(c), anchor: a, dur: dur ?? textDur(s) }
}

function stroke(d, c = 'w', width = 3, dur = 0.45, fill) {
  return { kind: 'stroke', d, color: color(c), width, dur, fill }
}

const rr = (x, y, w, h, r) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`

function arrowHead(x1, y1, x2, y2) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const h = 9
  const p = (da) => `${x2 - h * Math.cos(a + da)} ${y2 - h * Math.sin(a + da)}`
  return `M${p(0.5)}L${x2} ${y2}L${p(-0.5)}`
}

export function cellCenter(G, k) {
  const i = k - G.from
  return [G.x + (i % G.cols) * G.cell + G.cell / 2, G.y + Math.floor(i / G.cols) * G.cell + G.cell / 2]
}

function hanoi({ x, y, w, pegs, n = 3, names }) {
  const out = []
  const px = [x + w / 6, x + w / 2, x + (5 * w) / 6]
  const ph = 26 + n * 14
  out.push(stroke(`M${x} ${y}H${x + w}`, 'w', 4, 0.3))
  for (const p of px) out.push(stroke(`M${p} ${y}V${y - ph}`, 'w', 3, 0.2))
  pegs.forEach((peg, i) =>
    peg.forEach((d, k) => {
      const dw = 14 + (d / n) * (w / 3 - 22)
      out.push(stroke(rr(px[i] - dw / 2, y - 13 * (k + 1), dw, 11, 5), DISC[(d - 1) % 6], 2, 0.2, DISC[(d - 1) % 6]))
    }),
  )
  if (names) names.forEach((s, i) => out.push(text(s, px[i], y + 22, 20, 'w', 'middle', 0.2)))
  return out
}

export function expand(items) {
  const out = []
  for (const it of items) {
    if (it.t !== undefined) out.push(text(it.t, it.x, it.y, it.size, it.c, it.a, it.dur))
    else if (it.line) {
      const [a, b, c, d] = it.line
      out.push(stroke(`M${a} ${b}L${c} ${d}`, it.c, it.w ?? 3, it.dur))
    } else if (it.arrow) {
      const [a, b, c, d] = it.arrow
      out.push(stroke(`M${a} ${b}L${c} ${d}${arrowHead(a, b, c, d)}`, it.c ?? 'y', it.w ?? 3, it.dur))
    } else if (it.curve) {
      const [a, b, c, d, h = 30] = it.curve
      const mx = (a + c) / 2
      const my = Math.min(b, d) - h
      out.push(stroke(`M${a} ${b}Q${mx} ${my} ${c} ${d}${arrowHead(mx, my, c, d)}`, it.c ?? 'y', it.w ?? 3, it.dur ?? 0.6))
    } else if (it.circle) {
      const [cx, cy, r] = it.circle
      out.push(stroke(`M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx + r - 0.01} ${cy - 0.5}`, it.c ?? 'y', it.w ?? 3, it.dur ?? 0.35))
    } else if (it.box) {
      const [x, y, w, h] = it.box
      out.push(stroke(rr(x, y, w, h, 8), it.c, it.w ?? 2.5, it.dur ?? 0.5))
    } else if (it.disc) {
      const [x, y, w, h] = it.disc
      const fill = color(it.c ?? DISC[0])
      out.push(stroke(rr(x, y, w, h, h / 2), fill, 2, it.dur ?? 0.3, fill))
    } else if (it.hanoi) out.push(...hanoi(it.hanoi))
    else if (it.grid) {
      const G = it.grid
      for (let k = G.from; k <= G.to; k++) {
        const [cx, cy] = cellCenter(G, k)
        out.push(text(String(k), cx, cy + 8, G.size ?? 22, k === 1 ? '#9fb3a6' : 'w', 'middle', 0.04))
      }
    } else if (it.ring) {
      const [G, k] = it.ring
      const [cx, cy] = cellCenter(G, k)
      const r = G.cell * 0.42
      out.push(stroke(`M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx + r - 0.01} ${cy - 0.5}`, it.c ?? 'y', 2.5, it.dur ?? 0.25))
    } else if (it.strike) {
      const [G, k] = it.strike
      const [cx, cy] = cellCenter(G, k)
      const r = G.cell * 0.36
      out.push(stroke(`M${cx - r} ${cy + r}L${cx + r} ${cy - r}`, it.c ?? 'p', 3, it.dur ?? 0.12))
    }
  }
  return out
}
