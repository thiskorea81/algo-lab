<script setup>
import { ref } from 'vue'
import LessonHead from '../../components/LessonHead.vue'
import BoardShort from '../../components/BoardShort.vue'
import { SIEVE } from '../../shorts/sieve.js'
import SieveBoard from '../../components/SieveBoard.vue'
import PyLab from '../../components/PyLab.vue'
import Quiz from '../../components/Quiz.vue'
import { markDone } from '../../progress.js'

// 두 방법의 일의 양 비교(브라우저에서 직접 세어 봄)
const sizes = [1000, 10000, 100000, 1000000]
const rows = ref([])
const busy = ref(false)

function trial(N) {
  // 2부터 N까지 수마다 2, 3, 4, …로 √k까지 나누어 보기
  let ops = 0
  let count = 0
  for (let k = 2; k <= N; k++) {
    let prime = true
    for (let d = 2; d * d <= k; d++) {
      ops++
      if (k % d === 0) {
        prime = false
        break
      }
    }
    if (prime) count++
  }
  return { ops, count }
}

function sieve(N) {
  // 에라토스테네스의 체: p × p부터 p씩 건너뛰며 지우기
  const out = new Uint8Array(N + 1)
  let ops = 0
  for (let p = 2; p * p <= N; p++) {
    if (out[p]) continue
    for (let k = p * p; k <= N; k += p) {
      out[k] = 1
      ops++
    }
  }
  let count = 0
  for (let k = 2; k <= N; k++) if (!out[k]) count++
  return { ops, count }
}

function measure(fn, N) {
  const t = performance.now()
  const r = fn(N)
  return { ...r, ms: performance.now() - t }
}

async function compare() {
  busy.value = true
  rows.value = []
  for (const N of sizes) {
    await new Promise((r) => setTimeout(r, 20)) // 화면이 멈추지 않게 한 줄씩
    rows.value.push({ N, t: measure(trial, N), s: measure(sieve, N) })
  }
  busy.value = false
}
const fmt = (x) => Math.round(x).toLocaleString()

const STARTER1 = `def sieve(n):
    """n 이하의 소수를 작은 것부터 담은 리스트를 돌려준다."""
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            # p의 배수를 지우세요 (어디서부터, 얼마씩 건너뛸까요?)
            pass
        p += 1
    return [k for k in range(n + 1) if is_prime[k]]


print(sieve(30))
print(len(sieve(1000)))
`
const CHECK1 = `assert sieve(1) == [], "sieve(1)은 빈 리스트여야 해요."
assert sieve(2) == [2], "sieve(2)는 [2]여야 해요."
assert sieve(30) == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], f"sieve(30)이 {sieve(30)}이에요."
assert sieve(49)[-1] == 47, "49는 7 × 7이에요. 소수 목록에 들어가면 안 돼요."
assert len(sieve(100000)) == 9592, "10만 이하 소수는 9592개예요."`

const STARTER2 = `# 차가 2인 소수 쌍(쌍둥이 소수): (3, 5), (5, 7), (11, 13), ...
# 두 수가 모두 1000 이하인 쌍둥이 소수 쌍의 개수를 출력하세요.
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for k in range(p * p, n + 1, p):
                is_prime[k] = False
        p += 1
    return is_prime


is_prime = sieve(1000)
count = 0
# 여기를 채우세요

print(count)
`

const QUIZ = [
  {
    q: '안쪽 반복을 <code>range(p * p, n + 1, p)</code>처럼 <b>p × p부터</b> 시작해도 되는 이유는?',
    type: 'choice',
    options: [
      'p × 2, p × 3, …, p × (p−1)은 p보다 작은 소인수를 가져서 이미 지워졌기 때문',
      'p × p보다 작은 수는 모두 소수이기 때문',
      '속도를 위해 일부 합성수를 일부러 남기기 때문',
    ],
    answer: 0,
    hint: 'p × 6을 생각해 보세요. 이 수는 어느 소수의 배수로 이미 지워졌나요?',
    explain: 'p × k(k < p)는 k의 소인수(p보다 작음)의 배수를 지울 때 이미 지워졌어요. 결과는 같고 지우는 일만 줄어요.',
  },
  {
    q: '바깥 반복을 <code>while p * p <= n</code>에서 멈춰도 되는 이유와 같은 성질은?',
    type: 'choice',
    options: ['합성수 m은 √m 이하의 소인수를 반드시 가진다.', '모든 소수는 홀수다.', '소수는 무한히 많다.'],
    answer: 0,
    hint: 'm = a × b(a ≤ b)이면 a는 √m보다 클 수 있을까요?',
    explain: 'a ≤ b이면 a² ≤ ab = m이라 a ≤ √m이에요. √n보다 큰 p의 배수 가운데 n 이하인 합성수는 이미 더 작은 소인수로 지워졌어요.',
  },
  {
    q: '1부터 1000까지 소수는 몇 개일까요?',
    type: 'number',
    unit: '개',
    answer: 168,
    hint: '위의 sieve(1000)의 길이를 출력해 보세요.',
    explain: '168개예요. 10⁴까지 1229개, 10⁵까지 9592개, 10⁶까지 78498개로 점점 드물어져요.',
  },
  {
    q: '두 수가 모두 1000 이하인 쌍둥이 소수 쌍은 몇 개일까요?',
    type: 'number',
    unit: '쌍',
    answer: 35,
    hint: '두 번째 파이썬 실습으로 세어 보세요.',
    explain: '35쌍이에요. (3, 5), (5, 7), (11, 13), …, (881, 883)까지예요. 쌍둥이 소수가 무한히 많은지는 아직 아무도 증명하지 못한 문제예요.',
  },
  {
    q: '에라토스테네스의 체의 <b>약점</b>으로 알맞은 것은?',
    type: 'choice',
    options: ['n + 1칸의 표가 필요해서, n이 아주 크면 메모리를 많이 쓴다.', '가끔 합성수를 소수로 잘못 남긴다.', 'n이 커지면 하나씩 나누어 보기보다 느려진다.'],
    answer: 0,
    hint: '체는 결과가 정확하고 빨라요. 대신 무엇을 많이 쓸까요?',
    explain: '시간은 O(n log log n)으로 빠르지만 공간이 O(n) 필요해요. 그래서 아주 큰 범위는 구간을 나눠 거르는 방법(구간 체)을 써요.',
  },
]
</script>

<template>
  <LessonHead topic="sieve" level="high" />

  <div class="key">
    <b>에라토스테네스의 체</b>: 2부터 n까지 적고, 남은 수 중 가장 작은 수 p는 소수로 확정한 뒤 p × p, p × p + p, … 를 지운다.
    p × p &gt; n이 되면 멈추고, 남은 수가 n 이하의 모든 소수다.
  </div>
  <p>먼저 1부터 120까지 거르는 모습을 보세요. 지우기 동작 수도 세어 줘요.</p>
  <SieveBoard :max="120" :cols="12" mode="step" from-square />

  <h2>1. 파이썬으로 체 만들기</h2>
  <BoardShort :short="SIEVE.high[0]" />
  <PyLab
    id="sieve-high-1"
    task="빈칸(pass)을 채워 sieve(n)을 완성하세요. 채점은 여러 n에서 결과를 확인하고, 10만 이하 소수 개수(9592개)까지 맞는지 봐요."
    :starter="STARTER1"
    :check="CHECK1"
    :hints="['p의 배수는 p × p부터 n까지 p씩 건너뛰며 지워요.', '<code>for k in range(p * p, n + 1, p):</code> 안에서 <code>is_prime[k] = False</code>']"
  />

  <h2>2. 두 방법 빠르기 비교</h2>
  <BoardShort :short="SIEVE.high[1]" />
  <p>
    <b>하나씩 나누어 보기</b>: 2부터 n까지 수 k마다 2, 3, 4, …, √k로 나누어 떨어지는지 확인해요.
    <b>체</b>: 소수 p마다 p × p부터 배수만 지워요. 이 브라우저에서 직접 세고 재 볼게요.
  </p>
  <button class="btn primary" :disabled="busy" @click="compare">{{ busy ? '재는 중…' : '비교 시작' }}</button>
  <div v-if="rows.length" class="table-scroll">
    <table>
      <tr><th rowspan="2">n</th><th rowspan="2">소수 개수</th><th colspan="2">하나씩 나누어 보기</th><th colspan="2">에라토스테네스의 체</th></tr>
      <tr><th>나눗셈 수</th><th>시간(ms)</th><th>지우기 수</th><th>시간(ms)</th></tr>
      <tr v-for="r in rows" :key="r.N">
        <td>{{ fmt(r.N) }}</td><td>{{ fmt(r.s.count) }}</td>
        <td>{{ fmt(r.t.ops) }}</td><td>{{ r.t.ms.toFixed(1) }}</td>
        <td>{{ fmt(r.s.ops) }}</td><td>{{ r.s.ms.toFixed(1) }}</td>
      </tr>
    </table>
  </div>
  <p class="dim">시간은 컴퓨터마다 달라요. 일의 양(나눗셈·지우기 수)을 비교해 보세요.</p>
  <div class="key">
    체에서 지우는 횟수는 n/2 + n/3 + n/5 + n/7 + …(√n 이하의 소수 p에 대해 n/p)쯤이고, 이 합은 약 <b>n log log n</b>으로 커져요.
    log log n은 아주 천천히 커져서(n = 10⁶이어도 3도 안 돼요) 체는 거의 n에 비례하는 일만 해요.
    하나씩 나누어 보기는 소수 하나를 확인하는 데만 √k번 가까이 나누니 n이 커질수록 차이가 벌어져요.
  </div>

  <h2>3. 도전: 쌍둥이 소수</h2>
  <PyLab
    id="sieve-high-2"
    task="체로 만든 is_prime 표를 써서 두 수가 모두 1000 이하인 쌍둥이 소수(차가 2인 소수 쌍)의 개수를 출력하세요. 답은 아래 확인 문제에 넣어요."
    :starter="STARTER2"
    :hints="['p와 p + 2가 모두 소수인 p를 세요. p + 2 ≤ 1000이어야 해요.', '<code>for p in range(2, 999):</code> 안에서 <code>if is_prime[p] and is_prime[p + 2]: count += 1</code>']"
  />

  <h2>📝 확인 문제</h2>
  <Quiz :items="QUIZ" @complete="markDone('sieve/high')" />

  <div class="tip">
    🎓 <b>더 알아보기</b> — 큰 수 하나가 소수인지만 알고 싶을 때는 체 대신 확률적 소수 판정(밀러–라빈 등)을 써요.
    인터넷 보안(RSA 암호)에는 수백 자리 소수가 필요하거든요.
  </div>
</template>
