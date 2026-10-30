<script setup>
import { computed, ref } from 'vue'
import LessonHead from '../../components/LessonHead.vue'
import SieveBoard from '../../components/SieveBoard.vue'
import Quiz from '../../components/Quiz.vue'
import { markDone } from '../../progress.js'
import { eun } from '../../josa.js'

// 수판에서 누른 수의 설명
const info = ref('')
function explain({ k, state }) {
  if (k === 1) info.value = '1은 소수도 합성수도 아니에요.'
  else if (state === 'prime') info.value = `${eun(k)} 소수예요. 1과 ${k}로만 나누어떨어져요.`
  else if (state === 'out') {
    const p = smallestFactor(k)
    info.value = `${k} = ${p} × ${k / p}. 가장 작은 소인수 ${p}의 배수를 지울 때 지워졌어요.`
  } else info.value = `${eun(k)} 아직 체에 남아 있어요.`
}

function smallestFactor(k) {
  for (let d = 2; d * d <= k; d++) if (k % d === 0) return d
  return k
}

// 소인수분해 도우미: 가장 작은 소수로 계속 나누기
const num = ref(360)
const steps = computed(() => {
  let k = Math.floor(Number(num.value))
  if (!(k >= 2 && k <= 1000000)) return []
  const out = []
  while (k > 1) {
    const p = smallestFactor(k)
    out.push([k, p])
    k /= p
  }
  return out
})
const factored = computed(() => {
  const count = {}
  for (const [, p] of steps.value) count[p] = (count[p] ?? 0) + 1
  return Object.entries(count)
    .map(([p, e]) => (e > 1 ? `${p}<sup>${e}</sup>` : p))
    .join(' × ')
})

const QUIZ = [
  {
    q: '1부터 100까지 소수는 모두 몇 개일까요?',
    type: 'number',
    unit: '개',
    answer: 25,
    hint: '위 수판을 끝까지 돌려 보세요.',
    explain: '25개예요. 100까지는 2, 3, 5, 7의 배수만 지우면 돼요.',
  },
  {
    q: '7의 배수를 지울 때, <b>처음으로 새로 지워지는</b> 수는?',
    type: 'number',
    answer: 49,
    hint: '14, 21, 28, 35, 42는 이미 2, 3, 5의 배수로 지워졌어요.',
    explain: '7 × 2 ~ 7 × 6은 더 작은 소수의 배수라 이미 지워졌어요. 처음 새로 지워지는 수는 7 × 7 = 49예요. 그래서 p의 배수는 p × p부터 지우면 돼요.',
  },
  {
    q: '1부터 200까지 체로 거를 때, 배수를 지워야 하는 <b>가장 큰 소수</b>는?',
    type: 'number',
    answer: 13,
    hint: 'p × p가 200보다 작거나 같은 가장 큰 소수 p를 찾아요.',
    explain: '13 × 13 = 169 ≤ 200이고 17 × 17 = 289 > 200이에요. 그래서 2, 3, 5, 7, 11, 13의 배수까지만 지우면 돼요.',
  },
  {
    q: '91은 소수일까요?',
    type: 'choice',
    options: ['소수예요.', '소수가 아니에요.'],
    answer: 1,
    hint: '91을 7로 나누어 보세요.',
    explain: '91 = 7 × 13이에요. 겉보기에 소수 같아도 체를 쓰면 정확히 걸러져요.',
  },
  {
    q: '360을 소인수분해한 것은?',
    type: 'choice',
    options: ['2³ × 3² × 5', '2² × 3³ × 5', '2³ × 45'],
    answer: 0,
    hint: '위의 소인수분해 도우미에 360을 넣어 보세요.',
    explain: '360 = 2 × 2 × 2 × 3 × 3 × 5 = 2³ × 3² × 5예요. 45는 소수가 아니라서 세 번째는 소인수분해가 아니에요.',
  },
]
</script>

<template>
  <LessonHead topic="sieve" level="middle" />

  <div class="key">
    <b>소수</b>: 1보다 큰 자연수 중 1과 자기 자신만을 약수로 가지는 수. <b>합성수</b>: 1보다 큰 자연수 중 소수가 아닌 수.
    에라토스테네스(기원전 3세기 그리스의 학자)의 체는 <b>배수를 지워서</b> 소수만 남기는 방법이에요.
  </div>

  <h2>1. 1부터 100까지 거르기</h2>
  <p>
    '다음 단계'를 누를 때마다 남은 수 중 가장 작은 수 p에 ○ 하고, p의 배수를 지워요.
    색깔은 <b>어느 소수의 배수로 지워졌는지</b>를 나타내요. 지워진 수를 누르면 이유를 알려 줘요.
  </p>
  <SieveBoard :max="100" mode="step" from-square click-info @pick="explain" />
  <p v-if="info" class="key">{{ info }}</p>

  <h2>2. 언제 멈춰도 될까?</h2>
  <p>
    100까지는 2, 3, 5, 7의 배수만 지우면 끝나요. 11의 배수는 왜 안 지워도 될까요?
    11의 배수 가운데 100 이하인 수는 11 × 2, …, 11 × 9인데, 이 수들은 모두 <b>11보다 작은 소인수</b>(2, 3, 5, 7)를 가지고 있어서 이미 지워졌어요.
  </p>
  <div class="key">
    합성수 m을 m = a × b(a ≤ b)로 나타내면 a × a ≤ a × b = m이에요. 그러니 m 이하의 합성수는 반드시 <b>a × a ≤ m인 약수 a</b>를 가져요.
    → <b>p × p가 N보다 커지는 소수 p가 나오면 멈춰도 돼요.</b> 남은 수는 모두 소수예요. (√N까지만 확인하면 돼요.)
  </div>

  <h2>3. 체가 알려 주는 소인수분해</h2>
  <p>
    체에서 어떤 수를 처음 지운 소수는 그 수의 <b>가장 작은 소인수</b>예요. 가장 작은 소인수로 계속 나누면 소인수분해가 돼요.
  </p>
  <div class="card">
    <label class="row">자연수 <input v-model="num" class="num-in" type="number" min="2" max="1000000" /></label>
    <div v-if="steps.length" class="div">
      <div v-for="([k, p], i) in steps" :key="i" class="divrow">
        <span class="p">{{ p }}</span><span class="k">{{ k }}</span>
      </div>
      <div class="divrow"><span class="p"></span><span class="k">1</span></div>
    </div>
    <p v-if="steps.length">
      {{ num }} = <b v-html="factored"></b>
      <span v-if="steps.length === 1" class="good"> → 소수예요!</span>
    </p>
    <p v-else class="dim">2부터 1,000,000 사이의 수를 넣어 보세요.</p>
  </div>

  <h2>📝 확인 문제</h2>
  <Quiz :items="QUIZ" @complete="markDone('sieve/middle')" />

  <div class="tip">🎓 <b>더 알아보기</b> — 고등 수준에서는 체를 파이썬으로 만들고, 수를 하나씩 나누어 보는 방법보다 얼마나 빠른지 재 봐요.</div>
</template>

<style scoped>
.div {
  display: inline-flex;
  flex-direction: column;
  margin: 10px 0;
  font-family: var(--mono);
  font-size: 18px;
}

.divrow {
  display: flex;
}

.divrow .p {
  width: 48px;
  text-align: right;
  padding-right: 8px;
  color: var(--accent);
  font-weight: 700;
}

.divrow .k {
  min-width: 80px;
  padding-left: 8px;
  border-left: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
}

.divrow:last-child .k {
  border: none;
}
</style>
