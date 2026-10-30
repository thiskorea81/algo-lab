<script setup>
// 하노이의 탑 퍼즐. 직접 옮기기(기둥을 눌러 집고, 다른 기둥을 눌러 놓기)와
// 자동 풀이(재귀가 만든 순서를 한 단계씩 재생, 맡긴 일 목록 = 호출 스택 표시)를 함께 쓴다.
import { computed, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  discs: { type: Number, default: 3 },
  choices: { type: Array, default: () => [3, 4] }, // 고를 수 있는 원판 수
  names: { type: Array, default: () => ['가', '나', '다'] },
  auto: { type: Boolean, default: false }, // 자동 풀이 단추를 보일지
  showStack: { type: Boolean, default: false }, // 자동 풀이 때 '맡긴 일' 목록을 보일지
})
const emit = defineEmits(['solved'])

const n = ref(props.discs)
const pegs = ref([])
const picked = ref(null)
const moves = ref(0)
const history = ref([])
const msg = ref('')
const best = computed(() => 2 ** n.value - 1)
const solved = computed(() => pegs.value[2]?.length === n.value)

// 자동 풀이
const plan = ref([])
const step = ref(0)
let timer = null
const playing = ref(false)
const current = computed(() => plan.value[step.value - 1])

function reset(count = n.value) {
  stop()
  n.value = count
  pegs.value = [Array.from({ length: count }, (_, i) => count - i), [], []]
  picked.value = null
  moves.value = 0
  history.value = []
  msg.value = ''
  plan.value = []
  step.value = 0
}
reset()
watch(() => props.discs, (v) => reset(v))

function top(i) {
  const p = pegs.value[i]
  return p[p.length - 1]
}

function move(from, to) {
  pegs.value[to].push(pegs.value[from].pop())
  moves.value += 1
  history.value.push([from, to])
  if (solved.value) emit('solved', { discs: n.value, moves: moves.value })
}

function tap(i) {
  if (plan.value.length || solved.value) return
  msg.value = ''
  if (picked.value === null) {
    if (pegs.value[i].length) picked.value = i
    else msg.value = '빈 기둥이에요. 원판이 있는 기둥을 먼저 눌러요.'
    return
  }
  const from = picked.value
  picked.value = null
  if (from === i) return // 같은 기둥을 다시 누르면 내려놓기 취소
  if (pegs.value[i].length && top(i) < top(from)) {
    msg.value = '큰 원판을 작은 원판 위에 놓을 수 없어요.'
    return
  }
  move(from, i)
}

function undo() {
  const last = history.value.pop()
  if (!last) return
  pegs.value[last[0]].push(pegs.value[last[1]].pop())
  moves.value -= 1
  msg.value = ''
}

// 재귀로 옮기는 순서를 만든다. stack: 지금 이 한 번의 이동이 어떤 '맡긴 일' 안에서 일어나는지
function makePlan(k, a, b, c, stack, out) {
  const here = [...stack, { k, from: a, to: c }]
  if (k === 1) {
    out.push({ from: a, to: c, disc: 1, stack: here })
    return
  }
  makePlan(k - 1, a, c, b, here, out)
  out.push({ from: a, to: c, disc: k, stack: here })
  makePlan(k - 1, b, a, c, here, out)
}

function startAuto() {
  reset()
  const out = []
  makePlan(n.value, 0, 1, 2, [], out)
  plan.value = out
}

function next() {
  if (!plan.value.length) startAuto()
  const m = plan.value[step.value]
  if (!m) return stop()
  step.value += 1
  move(m.from, m.to)
  if (step.value >= plan.value.length) stop()
}

function play() {
  if (playing.value) return stop()
  if (!plan.value.length || step.value >= plan.value.length) startAuto()
  playing.value = true
  timer = setInterval(next, n.value > 4 ? 350 : 750)
}

function stop() {
  playing.value = false
  clearInterval(timer)
}
onUnmounted(stop)

const width = (d) => `${26 + (d / n.value) * 66}%`
const discColor = (d) => `var(--disc-${((d - 1) % 6) + 1})`
</script>

<template>
  <div class="hanoi card">
    <div class="row">
      <span class="dim">원판</span>
      <button v-for="c in choices" :key="c" class="btn" :class="{ primary: n === c }" @click="reset(c)">{{ c }}개</button>
      <button class="btn" :disabled="!history.length || plan.length > 0" @click="undo">↶ 되돌리기</button>
      <button class="btn" @click="reset()">처음부터</button>
    </div>

    <div class="board" :class="{ busy: plan.length }">
      <button
        v-for="(peg, i) in pegs"
        :key="i"
        class="peg"
        :class="{ picked: picked === i }"
        :aria-label="`${names[i]} 기둥`"
        @click="tap(i)"
      >
        <span class="pole"></span>
        <span
          v-for="(d, k) in peg"
          :key="d"
          class="disc"
          :class="{ lift: picked === i && k === peg.length - 1 }"
          :style="{ width: width(d), bottom: `${14 + k * 24}px`, background: discColor(d) }"
        >{{ d }}</span>
        <span class="base"></span>
        <span class="name">{{ names[i] }}</span>
      </button>
    </div>

    <p class="status">
      옮긴 횟수 <b>{{ moves }}</b>번 <span class="dim">(가장 적게는 {{ best }}번)</span>
    </p>
    <p v-if="msg" class="bad">{{ msg }}</p>
    <p v-if="solved" class="good">
      {{ plan.length ? '자동 풀이 끝!' : moves === best ? '성공! 가장 적은 횟수로 옮겼어요 🎉' : `성공! ${best}번에도 할 수 있어요. 다시 도전해 보세요.` }}
    </p>
    <p v-if="!plan.length && !solved" class="dim">옮길 원판이 있는 기둥을 누르고, 놓을 기둥을 눌러요.</p>

    <template v-if="auto">
      <div class="row auto">
        <button class="btn" :disabled="playing || (plan.length > 0 && step >= plan.length)" @click="next">한 단계씩 ▶</button>
        <button class="btn primary" @click="play">{{ playing ? '⏸ 멈추기' : '▶▶ 자동으로 풀기' }}</button>
      </div>
      <div v-if="current" class="now">
        <p>
          {{ step }}번째 이동: <b>{{ current.disc }}번 원판</b>을 {{ names[current.from] }} → {{ names[current.to] }}
        </p>
        <div v-if="showStack" class="stack">
          <p class="dim">지금 이 이동은 이런 '맡긴 일' 안에서 일어나요 (위가 큰 일, 아래가 작은 일)</p>
          <ol>
            <li v-for="(f, i) in current.stack" :key="i" :style="{ marginLeft: `${i * 18}px` }">
              원판 {{ f.k }}개를 {{ names[f.from] }} → {{ names[f.to] }}로 옮기기
              <span v-if="i === current.stack.length - 1" class="dim">← 지금</span>
            </li>
          </ol>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  gap: 6px;
  margin: 16px 0 8px;
}

.peg {
  flex: 1;
  position: relative;
  height: 200px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.busy .peg {
  cursor: default;
}

.peg.picked {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.pole {
  position: absolute;
  left: calc(50% - 4px);
  bottom: 12px;
  width: 8px;
  height: 160px;
  background: #9aa7ad;
  border-radius: 4px;
}

.base {
  position: absolute;
  left: 4%;
  right: 4%;
  bottom: 6px;
  height: 8px;
  border-radius: 4px;
  background: #9aa7ad;
}

.disc {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 22px;
  border-radius: 999px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  transition: bottom 0.15s;
  z-index: 1;
}

.disc.lift {
  transform: translate(-50%, -14px);
  outline: 3px solid var(--accent);
}

.name {
  position: absolute;
  bottom: -26px;
  left: 0;
  right: 0;
  color: var(--text-dim);
  font-weight: 700;
}

.status {
  margin: 30px 0 4px;
}

.auto {
  margin-top: 12px;
}

.now {
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--bg-soft);
}

.now p {
  margin: 0;
}

.stack ol {
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
  font-size: 15px;
}

.stack li {
  border-left: 3px solid var(--accent);
  padding-left: 8px;
  margin-bottom: 2px;
}

.stack li:last-child {
  font-weight: 700;
}
</style>
