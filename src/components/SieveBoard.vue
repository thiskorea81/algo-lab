<script setup>
// 에라토스테네스의 체 수판.
// mode 'hand': 학생이 직접 남은 가장 작은 수에 ○ 하고, 그 배수를 하나씩 눌러 지운다(틀리게 누르면 알려 줌).
// mode 'step': '다음 단계'를 누르면 컴퓨터가 소수 하나와 그 배수를 한꺼번에 지운다. fromSquare면 p×p부터 지운다.
import { computed, ref, watch } from 'vue'
import { eun } from '../josa.js'

const props = defineProps({
  max: { type: Number, default: 50 },
  cols: { type: Number, default: 10 },
  mode: { type: String, default: 'hand' },
  fromSquare: { type: Boolean, default: false },
  clickInfo: { type: Boolean, default: false }, // 수를 누르면 이유를 알려 주는지(부모가 @pick으로 설명)
})
const emit = defineEmits(['done', 'pick'])

const PRIME_COLORS = ['var(--disc-3)', 'var(--disc-2)', 'var(--disc-1)', 'var(--disc-4)', 'var(--disc-5)', 'var(--disc-6)']

const state = ref({}) // 수 → 'prime' | 'out'
const outBy = ref({}) // 지운 수 → 처음 지운 소수
const primesFound = ref([])
const p = ref(null) // 지금 배수를 지우는 소수
const phase = ref('pick') // pick: 다음 소수 고르기, cross: 배수 지우기, finish: 남은 수 모두 소수, done
const msg = ref('')
const crossTries = ref(0) // 지우기 동작 수(이미 지운 수를 다시 지운 것도 셈)

const numbers = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))
const smallestLeft = computed(() => numbers.value.find((k) => k >= 2 && !state.value[k]))
const multiplesLeft = computed(() =>
  p.value ? numbers.value.filter((k) => k > p.value && k % p.value === 0 && state.value[k] !== 'out') : [],
)
const primeCount = computed(() => Object.values(state.value).filter((s) => s === 'prime').length)

function reset() {
  state.value = {}
  outBy.value = {}
  primesFound.value = []
  p.value = null
  phase.value = 'pick'
  msg.value = ''
  crossTries.value = 0
}
watch(() => props.max, reset)

function color(prime) {
  const i = primesFound.value.indexOf(prime)
  return PRIME_COLORS[i % PRIME_COLORS.length]
}

function circle(k) {
  state.value[k] = 'prime'
  primesFound.value.push(k)
  p.value = k
  if (k * k > props.max) {
    phase.value = 'finish'
    msg.value = `${k} × ${k} = ${eun(k * k)} ${props.max}보다 커요. ${k}의 배수 가운데 지울 수는 이미 모두 지워졌어요!`
  } else {
    phase.value = 'cross'
    msg.value = ''
  }
}

function cross(k, by) {
  crossTries.value += 1
  if (state.value[k] === 'out') return
  state.value[k] = 'out'
  outBy.value[k] = by
}

function crossAll() {
  const start = props.fromSquare ? p.value * p.value : p.value * 2
  for (let k = start; k <= props.max; k += p.value) cross(k, p.value)
  phase.value = 'pick'
}

function finish() {
  for (const k of numbers.value) if (k >= 2 && !state.value[k]) {
    state.value[k] = 'prime'
    primesFound.value.push(k)
  }
  p.value = null
  phase.value = 'done'
  msg.value = ''
  emit('done', { primes: primeCount.value, tries: crossTries.value })
}

function tapHand(k) {
  msg.value = ''
  if (k === 1) {
    msg.value = '1은 소수도 아니고 합성수도 아니에요. 처음부터 빼 두어요.'
    return
  }
  if (phase.value === 'pick') {
    if (k !== smallestLeft.value) {
      msg.value = state.value[k] ? '이미 표시한 수예요.' : `지워지지 않고 남은 수 가운데 가장 작은 수를 찾아 눌러요.`
      return
    }
    circle(k)
  } else if (phase.value === 'cross') {
    if (state.value[k] === 'out') {
      msg.value = `${eun(k)} 이미 지웠어요. 지운 수는 그대로 두어요.`
    } else if (k === p.value || k % p.value !== 0) {
      msg.value = `${eun(k)} ${p.value}의 배수가 아니에요. ${p.value}, ${p.value * 2}, ${p.value * 3}, …처럼 ${p.value}씩 커지는 수를 찾아요.`
    } else {
      cross(k, p.value)
      if (!multiplesLeft.value.length) phase.value = 'pick'
    }
  }
}

function tap(k) {
  if (props.mode === 'hand') tapHand(k)
  else emit('pick', { k, state: state.value[k], by: outBy.value[k] })
}

function stepAuto() {
  if (phase.value === 'done') return
  if (phase.value === 'finish') return finish()
  circle(smallestLeft.value)
  if (phase.value === 'cross') crossAll()
}

function runAll() {
  while (phase.value !== 'done') stepAuto()
}

defineExpose({ reset })
</script>

<template>
  <div class="sieve card">
    <div class="guide">
      <template v-if="mode === 'hand'">
        <p v-if="phase === 'pick'">
          <b>①</b> 지워지지 않고 남은 수 가운데 <b>가장 작은 수</b>를 눌러 ○ 하세요. 그 수는 소수예요.
        </p>
        <p v-else-if="phase === 'cross'">
          <b>②</b> <b class="pnum" :style="{ color: color(p) }">{{ p }}</b>의 배수를 모두 눌러 지우세요.
          남은 배수 <b>{{ multiplesLeft.length }}</b>개
        </p>
      </template>
      <p v-else-if="phase !== 'done'" class="dim">
        '다음 단계'를 누르면 컴퓨터가 체를 한 번 흔들어요.<template v-if="clickInfo"> 수를 누르면 그 수가 왜 지워졌는지 알려 줘요.</template>
      </p>
      <p v-if="phase === 'finish'"><b>③</b> 남은 수는 모두 소수예요. ○ 해 볼까요?</p>
      <p v-if="phase === 'done'" class="good">
        끝! 1부터 {{ max }}까지 소수는 모두 {{ primeCount }}개예요.
      </p>
    </div>

    <div class="board" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }">
      <button
        v-for="k in numbers"
        :key="k"
        class="cell"
        :class="[state[k] ?? '', { one: k === 1, now: k === p }]"
        :style="state[k] === 'prime' ? { borderColor: color(k), color: color(k) } : state[k] === 'out' ? { '--by': color(outBy[k]) } : {}"
        @click="tap(k)"
      >{{ k }}</button>
    </div>

    <p v-if="msg" :class="phase === 'finish' ? 'good' : 'bad'">{{ msg }}</p>

    <div class="row">
      <template v-if="mode === 'hand'">
        <button v-if="phase === 'cross'" class="btn" @click="crossAll">{{ p }}의 배수 한꺼번에 지우기</button>
        <button v-if="phase === 'finish'" class="btn primary" @click="finish">남은 수에 모두 ○ 하기</button>
      </template>
      <template v-else>
        <button class="btn primary" :disabled="phase === 'done'" @click="stepAuto">다음 단계 ▶</button>
        <button class="btn" :disabled="phase === 'done'" @click="runAll">끝까지 ▶▶</button>
      </template>
      <button class="btn" @click="reset">처음부터</button>
    </div>

    <p v-if="primesFound.length" class="found">
      찾은 소수: <span v-for="q in primesFound" :key="q" :style="{ color: color(q) }">{{ q }} </span>
    </p>
    <p v-if="mode === 'step' && crossTries" class="dim">지우기 동작 {{ crossTries }}번 (이미 지운 수를 또 지운 것도 셈)</p>
  </div>
</template>

<style scoped>
.guide p {
  margin: 0 0 8px;
}

.board {
  display: grid;
  gap: 4px;
  margin: 10px 0;
}

.cell {
  position: relative;
  aspect-ratio: 1;
  min-width: 0;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  font: inherit;
  font-weight: 700;
  font-size: clamp(12px, 2.6vw, 17px);
  cursor: pointer;
  padding: 0;
}

.cell.one {
  color: var(--text-dim);
  background: var(--bg-soft);
}

.cell.prime {
  border-width: 3px;
  border-radius: 50%;
  background: var(--card);
}

.cell.out {
  color: var(--text-dim);
  background: var(--bg-soft);
  opacity: 0.75;
}

.cell.out::after {
  content: '';
  position: absolute;
  left: 12%;
  right: 12%;
  top: 50%;
  height: 3px;
  background: var(--by, var(--text-dim));
  transform: rotate(-35deg);
  border-radius: 2px;
}

.cell.now {
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.pnum {
  font-size: 1.15em;
}

.found {
  font-weight: 700;
  margin: 10px 0 0;
}
</style>
