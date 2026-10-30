<script setup>
import LessonHead from '../../components/LessonHead.vue'
import BoardShort from '../../components/BoardShort.vue'
import { SIEVE } from '../../shorts/sieve.js'
import DotRect from '../../components/DotRect.vue'
import SieveBoard from '../../components/SieveBoard.vue'
import Quiz from '../../components/Quiz.vue'
import { markDone } from '../../progress.js'

const QUIZ = [
  {
    q: '다음 중 소수는 어느 것일까요?',
    type: 'choice',
    options: ['9', '15', '13'],
    answer: 2,
    hint: '바둑돌을 한 줄 말고 직사각형으로 놓을 수 있는지 생각해 봐요. 9 = 3 × 3이에요.',
    explain: '13은 1 × 13으로만 놓을 수 있어요. 9 = 3 × 3, 15 = 3 × 5라서 소수가 아니에요.',
  },
  {
    q: '1은 소수일까요?',
    type: 'choice',
    options: ['소수예요.', '소수가 아니에요.'],
    answer: 1,
    hint: '소수는 1보다 큰 수 가운데에서 찾아요.',
    explain: '소수는 1보다 큰 수 중에서 1과 자기 자신으로만 나누어떨어지는 수예요. 1은 소수도 합성수도 아니에요.',
  },
  {
    q: '체에서 2의 배수를 지울 때, <b>2</b>는 어떻게 할까요?',
    type: 'choice',
    options: ['2도 2의 배수니까 지워요.', '2는 ○ 하고 남겨요. 2보다 큰 2의 배수만 지워요.'],
    answer: 1,
    hint: '2를 나누어떨어지게 하는 수는 1과 2뿐이에요.',
    explain: '2는 소수라서 남기고, 4, 6, 8, …처럼 2보다 큰 2의 배수만 지워요. 2는 짝수 가운데 유일한 소수예요.',
  },
  {
    q: '1부터 50까지 소수는 모두 몇 개일까요? (수판으로 확인해 보세요)',
    type: 'number',
    unit: '개',
    answer: 15,
    hint: '수판에서 ○ 한 수를 세어 봐요.',
    explain: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47로 15개예요.',
  },
  {
    q: '1부터 50까지의 수판에서 <b>49</b>는 몇의 배수를 지울 때 처음 지워질까요?',
    type: 'number',
    answer: 7,
    hint: '49 = ? × ?',
    explain: '49 = 7 × 7이라서 2, 3, 5의 배수가 아니고, 7의 배수를 지울 때 처음 지워져요. 그래서 50까지는 7의 배수까지 지워야 해요.',
  },
]
</script>

<template>
  <LessonHead topic="sieve" level="elementary" />

  <h2>🟤 바둑돌로 알아보는 소수</h2>
  <p>
    바둑돌 12개는 3줄 4개씩, 2줄 6개씩처럼 여러 가지 직사각형으로 놓을 수 있어요. 그런데 7개는 어떨까요?
    한 줄로 늘어놓는 방법(1 × 7)밖에 없어요. 수를 바꿔 보세요.
  </p>
  <BoardShort :short="SIEVE.elementary[0]" />
  <DotRect />
  <div class="key">
    1보다 큰 수 가운데 <b>1과 자기 자신으로만 나누어떨어지는 수</b>를 <b>소수</b>라고 해요.
    바둑돌로 말하면 한 줄로만 놓을 수 있는 수예요. 2, 3, 5, 7, 11, …이 소수예요.
  </div>

  <h2>🧮 체로 소수 거르기</h2>
  <p>
    아주 옛날 그리스의 학자 <b>에라토스테네스</b>는 소수를 빠짐없이 찾는 방법을 생각했어요.
    체로 모래를 거르듯 <b>배수를 지워 나가면</b> 소수만 남아요. 순서는 이래요.
  </p>
  <ol>
    <li>1은 빼 두어요.</li>
    <li>지워지지 않은 수 가운데 <b>가장 작은 수</b>에 ○ 해요. 그 수는 소수예요.</li>
    <li>○ 한 수의 <b>배수</b>(그 수보다 큰 것)를 모두 지워요.</li>
    <li>2번으로 돌아가 되풀이해요.</li>
  </ol>
  <p>직접 해 보세요. 배수를 하나씩 눌러 지우다가, 익숙해지면 '한꺼번에 지우기'를 눌러도 돼요.</p>
  <BoardShort :short="SIEVE.elementary[1]" />
  <SieveBoard :max="50" mode="hand" />
  <p class="tip">
    💡 7의 배수를 지우고 나면 컴퓨터가 "남은 수는 모두 소수예요"라고 알려 줘요. 왜 11의 배수는 지우지 않아도 될까요?
    11 × 2 = 22, 11 × 3 = 33, 11 × 4 = 44는 이미 2나 3의 배수로 지워졌고, 11 × 5 = 55는 50보다 크거든요.
  </p>

  <h2>📝 확인 문제</h2>
  <Quiz :items="QUIZ" @complete="markDone('sieve/elementary')" />

  <div class="tip">🎓 <b>더 알아보기</b> — 중등 수준에서는 1부터 100까지 거르고, 어디에서 멈춰도 되는지 규칙을 찾아요.</div>
</template>
