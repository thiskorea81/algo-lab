<script setup>
import LessonHead from '../../components/LessonHead.vue'
import HanoiPuzzle from '../../components/HanoiPuzzle.vue'
import HanoiMini from '../../components/HanoiMini.vue'
import Quiz from '../../components/Quiz.vue'
import { markDone } from '../../progress.js'

const QUIZ = [
  {
    q: '하노이의 탑 규칙이 <b>아닌</b> 것은 어느 것일까요?',
    type: 'choice',
    options: ['한 번에 원판을 1개만 옮겨요.', '큰 원판을 작은 원판 위에 놓을 수 없어요.', '가운데 나 기둥에는 원판을 놓을 수 없어요.'],
    answer: 2,
    hint: '나 기둥은 무엇을 하는 곳이었나요?',
    explain: '나 기둥은 잠깐 쉬어 가는 곳이라 원판을 놓아도 돼요.',
  },
  {
    q: '원판 2개를 가 기둥에서 다 기둥으로 옮길 때, 가장 적게 몇 번 옮겨야 할까요?',
    type: 'number',
    unit: '번',
    answer: 3,
    hint: '작은 원판을 비켜 두고, 큰 원판을 옮기고, 작은 원판을 다시 올려요.',
    explain: '작은 것 가→나, 큰 것 가→다, 작은 것 나→다. 모두 3번이에요.',
  },
  {
    q: '원판 3개는 가장 적게 몇 번 옮겨야 할까요?',
    type: 'number',
    unit: '번',
    answer: 7,
    hint: '작은 탑(2개) 옮기기는 3번이에요. 작은 탑을 두 번 옮기고 큰 원판을 한 번 옮겨요.',
    explain: '3 + 1 + 3 = 7번이에요.',
  },
  {
    q: '원판 3개를 옮길 때 <b>가장 먼저</b> 해야 할 큰 일은 무엇일까요?',
    type: 'choice',
    options: ['가장 큰 원판을 다 기둥으로 옮겨요.', '위에 있는 작은 탑(2개)을 나 기둥으로 비켜 두어요.', '가장 작은 원판을 다 기둥으로 옮겨요.'],
    answer: 1,
    hint: '가장 큰 원판 위에 다른 원판이 있으면 옮길 수 있을까요?',
    explain: '큰 원판을 옮기려면 그 위의 작은 탑부터 비켜 두어야 해요. 가장 작은 원판을 맨 처음 다 기둥으로 옮기는 것은 작은 탑을 옮기는 과정의 한 부분이에요.',
  },
  {
    q: '원판 4개는 15번 옮겨야 해요. 원판 5개는 가장 적게 몇 번일까요?',
    type: 'number',
    unit: '번',
    answer: 31,
    hint: '원판 4개 옮기기를 두 번 하고, 가장 큰 원판을 한 번 옮겨요.',
    explain: '15 + 1 + 15 = 31번이에요. 원판이 하나 늘면 횟수는 <b>두 배보다 1 많아져요</b>.',
  },
]
</script>

<template>
  <LessonHead topic="hanoi" level="elementary" />

  <h2>🗼 어떤 퍼즐일까요?</h2>
  <p>
    기둥이 세 개 있어요. 왼쪽 <b>가</b> 기둥에 크기가 다른 원판이 큰 것부터 쌓여 있어요.
    이 원판을 모두 오른쪽 <b>다</b> 기둥으로 옮기면 성공이에요. 가운데 <b>나</b> 기둥은 잠깐 쉬어 가는 곳이에요.
  </p>
  <div class="rules">
    <div class="card"><b>규칙 1</b><br />한 번에 원판을 1개만 옮겨요.</div>
    <div class="card"><b>규칙 2</b><br />맨 위에 있는 원판만 옮길 수 있어요.</div>
    <div class="card"><b>규칙 3</b><br />큰 원판을 작은 원판 위에 놓을 수 없어요.</div>
  </div>

  <h2>✋ 해 보기 1: 원판 2개부터</h2>
  <p>먼저 원판 2개로 해 보세요. 3번 만에 할 수 있나요? 그다음 3개, 4개에 도전해요.</p>
  <HanoiPuzzle :discs="2" :choices="[2, 3, 4]" />

  <h2>🔍 큰 탑을 옮기는 비밀</h2>
  <p>원판 3개를 옮길 때, 위의 원판 2개를 <b>작은 탑 하나</b>라고 생각해 보세요. 그러면 할 일은 딱 세 가지예요.</p>
  <div class="steps">
    <HanoiMini :pegs="[[3], [2, 1], []]" :arrow="[0, 1]" caption="① 작은 탑을 나로 비켜 두기" />
    <HanoiMini :pegs="[[], [2, 1], [3]]" :arrow="[0, 2]" caption="② 가장 큰 원판을 다로" />
    <HanoiMini :pegs="[[], [], [3, 2, 1]]" :arrow="[1, 2]" caption="③ 작은 탑을 다 위로" />
  </div>
  <p>
    그런데 작은 탑은 원판이 2개라 한 번에 못 옮기잖아요? 괜찮아요. 원판 2개 옮기는 방법은 해 보기 1에서 벌써 알아냈어요.
    <b>똑같은 방법을 한 번 더</b> 쓰면 돼요.
  </p>
  <div class="key">
    큰 문제 안에 <b>똑같은 모양의 작은 문제</b>가 들어 있을 때, 작은 문제에게 맡겨서 푸는 방법을 <b>재귀</b>라고 해요.
    원판 3개 문제는 원판 2개 문제에게, 원판 2개 문제는 원판 1개 문제에게 맡겨요. 원판 1개는 바로 옮기면 끝이에요.
  </div>
  <p class="tip">
    🪆 인형 안에 더 작은 인형이 들어 있는 마트료시카를 떠올려 보세요. 열어도 열어도 같은 모양이 나오다가,
    가장 작은 인형이 나오면 끝나요. 재귀도 <b>가장 작은 문제에서 꼭 멈춰요.</b>
  </p>

  <h2>✋ 해 보기 2: 비밀대로 원판 4개 옮기기</h2>
  <p>
    원판 4개를 골라 보세요. 위의 3개를 작은 탑이라고 생각하고, ① 작은 탑을 나로 → ② 큰 원판을 다로 → ③ 작은 탑을 다 위로.
    15번 만에 성공하면 재귀를 몸으로 익힌 거예요!
  </p>
  <HanoiPuzzle :discs="4" :choices="[3, 4]" />

  <h2>📝 확인 문제</h2>
  <Quiz :items="QUIZ" @complete="markDone('hanoi/elementary')" />

  <div class="tip">
    🎓 <b>더 알아보기</b> — 원판이 1, 2, 3, 4, 5개일 때 횟수는 1, 3, 7, 15, 31이에요. 규칙이 보이나요?
    중등 수준에서는 이 규칙을 식으로 쓰고, 컴퓨터가 재귀로 푸는 모습을 한 단계씩 봐요.
  </div>
</template>

<style scoped>
.rules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.rules .card {
  margin: 0;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}
</style>
