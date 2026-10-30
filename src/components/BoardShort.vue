<script setup>
// 판서 쇼츠: 소리 없이 칠판에 한 줄씩 써 나가는 세로형 짧은 강의.
// short = { title, steps: [{ say, draw: [항목], clear?, wait? }] }
//   say: 아래 자막, draw: 이 단계에서 새로 쓰는 것(차례로 써짐), clear: 이 단계 전에 칠판 지우기, wait: 다 쓴 뒤 머무는 초
// 칠판 좌표는 360 × 520. 항목 모양은 src/shorts/draw.js 참고(text, line, path, circle, rect, box 등).
import { computed, onUnmounted, ref, watch } from 'vue'
import { expand } from '../shorts/draw.js'

const props = defineProps({ short: { type: Object, required: true } })

const step = ref(-1) // -1: 표지
const playing = ref(false)
const progress = ref(0) // 지금 단계 진행(0~1), 진행 막대용
let timer = null
let tick = null
let started = 0

const steps = computed(() => props.short.steps)

// 각 단계의 항목을 기본 도형으로 펼치고, 쓰는 데 걸리는 시간(초)을 붙인다
const plan = computed(() =>
  steps.value.map((s) => {
    let t = 0
    const items = expand(s.draw ?? []).map((it) => {
      const item = { ...it, delay: t }
      t += it.dur
      return item
    })
    return { ...s, items, writeTime: t, total: t + (s.wait ?? Math.max(2.2, (s.say ?? '').length * 0.075)) }
  }),
)

// 화면에 보일 항목: 마지막으로 지운 단계부터 지금 단계까지. 지난 단계 것은 바로 보이고 지금 단계 것만 써진다
const visible = computed(() => {
  if (step.value < 0) return []
  let from = 0
  for (let i = 0; i <= step.value; i++) if (plan.value[i].clear) from = i
  const out = []
  for (let i = from; i <= step.value; i++) {
    for (const [k, it] of plan.value[i].items.entries()) out.push({ ...it, key: `${i}-${k}`, now: i === step.value })
  }
  return out
})

const caption = computed(() => (step.value >= 0 ? plan.value[step.value].say : ''))

function clearTimers() {
  clearTimeout(timer)
  clearInterval(tick)
}

function schedule() {
  clearTimers()
  progress.value = 0
  if (!playing.value || step.value < 0) return
  const total = plan.value[step.value].total
  started = performance.now()
  tick = setInterval(() => (progress.value = Math.min(1, (performance.now() - started) / 1000 / total)), 100)
  timer = setTimeout(() => {
    if (step.value < steps.value.length - 1) step.value += 1
    else {
      playing.value = false
      progress.value = 1
      clearTimers()
    }
  }, total * 1000)
}
watch(step, schedule)

function play() {
  if (step.value >= steps.value.length - 1 && !playing.value && step.value >= 0) step.value = -1
  playing.value = true
  if (step.value < 0) step.value = 0
  else schedule()
}

function pause() {
  playing.value = false
  clearTimers()
}

function next() {
  if (step.value < steps.value.length - 1) step.value += 1
}

function prev() {
  if (step.value > 0) step.value -= 1
}

// 화면 왼쪽 1/3을 누르면 이전, 나머지는 다음(쇼츠처럼)
function tapBoard(e) {
  if (step.value < 0) return play()
  const r = e.currentTarget.getBoundingClientRect()
  if (e.clientX - r.left < r.width / 3) prev()
  else next()
}

onUnmounted(clearTimers)

const done = (i) => i < step.value || (i === step.value && !playing.value && step.value === steps.value.length - 1)
</script>

<template>
  <figure class="short">
    <div class="frame">
      <div class="bars">
        <span v-for="(s, i) in steps" :key="i" class="bar">
          <span class="fill" :style="{ width: done(i) ? '100%' : i === step ? `${(playing ? progress : 1) * 100}%` : '0%' }"></span>
        </span>
      </div>
      <p class="title">{{ short.title }}</p>
      <div class="board" role="button" tabindex="0" :aria-label="`${short.title} 판서 쇼츠`" @click="tapBoard" @keydown.right="next" @keydown.left="prev" @keydown.space.prevent="playing ? pause() : play()">
        <svg viewBox="0 0 360 520" class="chalk">
          <template v-for="it in visible" :key="it.key">
            <text
              v-if="it.kind === 'text'"
              :x="it.x"
              :y="it.y"
              :font-size="it.size"
              :text-anchor="it.anchor"
              :fill="it.color"
              :class="{ write: it.now }"
              :style="{ animationDelay: `${it.delay}s`, animationDuration: `${it.dur}s` }"
            >{{ it.s }}</text>
            <path
              v-else-if="it.kind === 'stroke'"
              :d="it.d"
              :stroke="it.color"
              :stroke-width="it.width"
              :fill="it.fill ?? 'none'"
              pathLength="1"
              :class="{ draw: it.now, filled: it.fill }"
              :style="{ animationDelay: `${it.delay}s`, animationDuration: `${it.dur}s` }"
            />
          </template>
        </svg>
        <div v-if="step < 0" class="cover">
          <span class="play">▶</span>
          <span>눌러서 판서 보기</span>
          <span class="small">소리 없음 · {{ steps.length }}장면 · 화면 왼쪽을 누르면 이전, 오른쪽은 다음</span>
        </div>
      </div>
      <p class="say">{{ caption || ' ' }}</p>
      <div class="ctrl">
        <button class="btn" :disabled="step <= 0" aria-label="이전 장면" @click="prev">◀</button>
        <button class="btn primary" @click="playing ? pause() : play()">
          {{ playing ? '⏸ 멈춤' : step >= steps.length - 1 && step >= 0 ? '↻ 다시 보기' : '▶ 재생' }}
        </button>
        <button class="btn" :disabled="step >= steps.length - 1" aria-label="다음 장면" @click="next">▶</button>
        <span class="count">{{ Math.max(step + 1, 0) }} / {{ steps.length }}</span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.short {
  margin: 18px auto;
  max-width: 400px;
}

.frame {
  background: #12241b;
  border-radius: 18px;
  padding: 10px 10px 12px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.25);
}

.bars {
  display: flex;
  gap: 3px;
  padding: 0 4px;
}

.bar {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.25);
  overflow: hidden;
}

.fill {
  display: block;
  height: 100%;
  background: #fff;
  transition: width 0.1s linear;
}

.title {
  color: #e9f2ec;
  font-weight: 700;
  font-size: 15px;
  margin: 6px 4px;
}

.board {
  position: relative;
  border: 6px solid #6b4a2b;
  border-radius: 8px;
  background:
    radial-gradient(ellipse at 30% 20%, rgb(255 255 255 / 0.06), transparent 60%),
    radial-gradient(ellipse at 70% 80%, rgb(255 255 255 / 0.04), transparent 55%),
    #1f3d2d;
  cursor: pointer;
  outline: none;
}

.board:focus-visible {
  box-shadow: 0 0 0 3px #f6d76b;
}

.chalk {
  display: block;
  width: 100%;
  font-family: 'Nanum Pen Script', 'Gaegu', cursive;
}

.chalk text {
  white-space: pre; /* 코드 들여쓰기 빈칸을 살린다 */
}

.write {
  clip-path: inset(-20% 100% -20% 0);
  animation-name: write;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes write {
  to {
    clip-path: inset(-20% 0 -20% 0);
  }
}

.chalk path {
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}

.draw {
  stroke-dashoffset: 1;
  animation-name: draw;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

.draw.filled {
  fill-opacity: 0;
  animation-name: draw, fillin;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fillin {
  to {
    fill-opacity: 1;
  }
}

.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #f5f3e8;
  background: rgb(0 0 0 / 0.25);
  font-weight: 700;
  text-align: center;
  padding: 16px;
}

.play {
  font-size: 42px;
  line-height: 1;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid #f5f3e8;
  display: grid;
  place-items: center;
  padding-left: 6px;
}

.cover .small {
  font-size: 13px;
  font-weight: 400;
  opacity: 0.85;
}

.say {
  color: #fff;
  background: rgb(0 0 0 / 0.35);
  border-radius: 8px;
  padding: 8px 10px;
  margin: 8px 0;
  min-height: 3.4em;
  font-size: 16px;
  line-height: 1.5;
}

.ctrl {
  display: flex;
  gap: 6px;
  align-items: center;
}

.ctrl .btn {
  min-height: 40px;
  padding: 4px 12px;
}

.count {
  margin-left: auto;
  color: #cfe0d6;
  font-size: 14px;
}

@media (prefers-reduced-motion: reduce) {
  .write,
  .draw {
    animation-duration: 0.01s !important;
    animation-delay: 0s !important;
  }
}
</style>
