<script setup>
import { computed, ref } from 'vue'
import LessonHead from '../../components/LessonHead.vue'
import HanoiPuzzle from '../../components/HanoiPuzzle.vue'
import Quiz from '../../components/Quiz.vue'
import { markDone } from '../../progress.js'

// 표 채우기: T(1)~T(6)
const table = ref(['1', '', '', '', '', ''])
const expect = [1, 3, 7, 15, 31, 63]
const tableOk = computed(() => table.value.every((v, i) => Number(v) === expect[i]))

// 원판이 많아지면? n개를 1초에 한 번씩 옮길 때 걸리는 시간
const n = ref(20)
const moves = computed(() => 2n ** BigInt(n.value) - 1n)
const fmt = (b) => b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const YEAR = 365.25 * 24 * 3600
const timeText = computed(() => {
  const s = Number(moves.value)
  if (s < 60) return `${s}초`
  if (s < 3600) return `약 ${Math.round(s / 60)}분`
  if (s < 86400) return `약 ${(s / 3600).toFixed(1)}시간`
  if (s < YEAR) return `약 ${Math.round(s / 86400)}일`
  const y = s / YEAR
  if (y < 1e4) return `약 ${Math.round(y).toLocaleString()}년`
  if (y < 1e8) return `약 ${Math.round(y / 1e4).toLocaleString()}만 년`
  return `약 ${Math.round(y / 1e8).toLocaleString()}억 년`
})

const QUIZ = [
  {
    q: '원판 n개를 옮기는 가장 적은 횟수를 T(n)이라고 할 때, 맞는 식은?',
    type: 'choice',
    options: ['T(n) = T(n−1) + 2', 'T(n) = 2 × T(n−1) + 1', 'T(n) = 2 × T(n−1)'],
    answer: 1,
    hint: '작은 탑(n−1개)을 몇 번 옮기고, 가장 큰 원판은 몇 번 옮기나요?',
    explain: '작은 탑을 두 번(비켜 두기, 다시 올리기) 옮기고 큰 원판을 한 번 옮기므로 T(n) = 2T(n−1) + 1이에요.',
  },
  {
    q: 'T(n) + 1의 값을 차례로 쓰면 2, 4, 8, 16, …이에요. T(10)은 얼마일까요?',
    type: 'number',
    answer: 1023,
    hint: 'T(n) + 1 = 2ⁿ이에요. 2¹⁰은 얼마일까요?',
    explain: '2¹⁰ = 1024이므로 T(10) = 1024 − 1 = 1023이에요.',
  },
  {
    q: '원판 4개를 자동으로 풀면, <b>가장 큰 원판(4번)</b>은 몇 번째 이동에서 움직일까요?',
    type: 'number',
    unit: '번째',
    answer: 8,
    hint: '가장 큰 원판은 위의 원판 3개(작은 탑)를 모두 비켜 둔 바로 다음에 움직여요. 작은 탑 옮기기는 몇 번일까요?',
    explain: '원판 3개 옮기기 7번이 끝난 바로 다음, 8번째 이동이에요. 위의 자동 풀이로 확인해 보세요.',
  },
  {
    q: '의사코드 <code>옮기기(n, 출발, 거쳐, 도착)</code>에서 <b>멈추는 조건</b>이 없으면 어떻게 될까요?',
    type: 'choice',
    options: ['원판 1개일 때도 바로 옮기지 않고 계속 더 작은 일을 맡기려 해서 끝나지 않아요.', '가장 큰 원판만 옮기고 끝나요.', '아무 차이가 없어요.'],
    answer: 0,
    hint: '원판 1개 문제는 원판 0개, −1개 문제에게 또 맡길 수 있을까요?',
    explain: '재귀에는 더 맡기지 않고 바로 푸는 가장 작은 경우(멈추는 조건)가 꼭 있어야 해요. 없으면 컴퓨터에서는 오류가 나요.',
  },
]
</script>

<template>
  <LessonHead topic="hanoi" level="middle" />

  <div class="key">
    <b>복습</b> — 원판 n개를 옮기려면 ① 위의 n−1개(작은 탑)를 가운데로 비켜 두고 ② 가장 큰 원판을 옮기고
    ③ 작은 탑을 다시 그 위로 옮겨요. 큰 문제를 <b>똑같은 모양의 작은 문제</b>에게 맡기는 이 방법이 <b>재귀</b>예요.
  </div>

  <h2>1. 재귀가 일하는 모습 한 단계씩 보기</h2>
  <p>
    원판 수를 고르고 <b>한 단계씩 ▶</b>을 눌러 보세요. 아래 '맡긴 일' 목록은 지금 이동이 어떤 큰 일 안에서 일어나는지 보여 줘요.
    큰 일은 작은 일을 맡기고 기다렸다가, 작은 일이 끝나면 자기 일을 이어서 해요. 컴퓨터는 이 목록을 <b>스택</b>이라는 곳에 쌓아 기억해요.
  </p>
  <HanoiPuzzle :discs="3" :choices="[3, 4, 5]" auto show-stack />

  <h2>2. 컴퓨터에게 시킬 순서(의사코드)</h2>
  <pre>옮기기(n, 출발, 거쳐, 도착):
    만약 n = 1이면:
        출발 → 도착으로 원판 1개 옮기고 끝
    옮기기(n−1, 출발, 도착, 거쳐)   # ① 작은 탑 비켜 두기
    출발 → 도착으로 가장 큰 원판 옮기기   # ②
    옮기기(n−1, 거쳐, 출발, 도착)   # ③ 작은 탑 다시 올리기</pre>
  <p>
    <code>옮기기</code> 안에서 다시 <code>옮기기</code>를 불러요. 자기 자신을 부르는 이런 방법을 <b>재귀 호출</b>이라고 해요.
    ①에서는 '거쳐'와 '도착'의 자리가 바뀌는 것에 주의하세요. 작은 탑은 가운데 기둥으로 가야 하니까요.
  </p>

  <h2>3. 옮기는 횟수의 규칙 찾기</h2>
  <p>원판 n개를 옮기는 가장 적은 횟수를 T(n)이라고 해요. 위 퍼즐로 확인하며 표를 채워 보세요.</p>
  <div class="table-scroll">
    <table>
      <tr><th>원판 수 n</th><td v-for="i in 6" :key="i">{{ i }}</td></tr>
      <tr>
        <th>T(n)</th>
        <td v-for="(v, i) in table" :key="i"><input v-model="table[i]" class="cell-in" inputmode="numeric" :aria-label="`T(${i + 1})`" /></td>
      </tr>
    </table>
  </div>
  <p v-if="tableOk" class="good">맞았어요! 1, 3, 7, 15, 31, 63</p>
  <p v-else class="dim">힌트: 앞의 횟수 × 2 + 1</p>
  <div class="key">
    작은 탑을 두 번 옮기고 큰 원판을 한 번 옮기니까 <b>T(n) = 2 × T(n−1) + 1</b>이에요.<br />
    양쪽에 1을 더하면 T(n) + 1 = 2 × (T(n−1) + 1)이라서 T(n) + 1은 2, 4, 8, 16, …처럼 두 배씩 커져요.
    그래서 <b>T(n) = 2ⁿ − 1</b>이에요.
  </div>
  <p class="tip">
    🤔 <b>왜 이보다 적게는 안 될까요?</b> 가장 큰 원판이 움직이려면 그 위의 n−1개가 모두 다른 한 기둥에 모여 있어야 해요.
    그러니 큰 원판이 처음 움직이기 전에 n−1개를 옮기는 일(적어도 T(n−1)번)이 꼭 있고, 큰 원판이 도착한 뒤에도
    n−1개를 그 위로 다시 옮겨야(적어도 T(n−1)번) 해요. 큰 원판을 한 번 더하면 적어도 2T(n−1) + 1번이에요.
  </p>

  <h2>4. 원판이 많아지면?</h2>
  <p>1초에 한 번씩 쉬지 않고 옮긴다면 시간이 얼마나 걸릴까요? 원판 수를 바꿔 보세요.</p>
  <div class="card">
    <label class="row">원판 <input v-model.number="n" type="range" min="1" max="64" /> <b>{{ n }}</b>개</label>
    <p>옮기는 횟수: <b class="big">{{ fmt(moves) }}</b>번</p>
    <p>걸리는 시간: <b>{{ timeText }}</b></p>
    <p v-if="n === 64" class="tip">원판 64개면 약 5,845억 년! 우주의 나이(약 138억 년)의 40배가 넘어요. 원판이 1개 늘 때마다 시간이 두 배가 되기 때문이에요.</p>
  </div>

  <h2>📝 확인 문제</h2>
  <Quiz :items="QUIZ" @complete="markDone('hanoi/middle')" />

  <div class="tip">🎓 <b>더 알아보기</b> — 고등 수준에서는 이 의사코드를 파이썬 재귀 함수로 직접 만들고 실행해요.</div>
</template>

<style scoped>
.cell-in {
  width: 56px;
  font: inherit;
  text-align: center;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
}

.big {
  font-size: 20px;
  word-break: break-all;
}

input[type='range'] {
  flex: 1;
  min-width: 160px;
}
</style>
