// 주제와 수준. 첫 화면의 고르기 카드와 각 페이지의 위쪽 길잡이가 함께 쓴다.
export const LEVELS = [
  { key: 'elementary', name: '초등', who: '곱셈구구를 알고, 퍼즐을 좋아하는 친구', color: 'var(--lv-e)' },
  { key: 'middle', name: '중등', who: '거듭제곱·소인수분해를 배웠거나 배우는 중인 친구', color: 'var(--lv-m)' },
  { key: 'high', name: '고등', who: '파이썬으로 함수와 반복문을 써 본 친구', color: 'var(--lv-h)' },
]

export const TOPICS = [
  {
    key: 'hanoi',
    icon: '🗼',
    title: '하노이의 탑',
    tag: '재귀',
    summary: '큰 문제를 똑같은 모양의 작은 문제로 나누어 푸는 방법',
    levels: {
      elementary: '원판을 직접 옮기며 "작은 탑에게 맡기는" 방법을 찾아요',
      middle: '옮기는 횟수의 규칙을 식으로 쓰고, 재귀가 일하는 모습을 한 단계씩 봐요',
      high: '파이썬 재귀 함수로 풀고, 횟수가 2ⁿ−1임을 증명해요',
    },
  },
  {
    key: 'sieve',
    icon: '🧮',
    title: '에라토스테네스의 체',
    tag: '소수 찾기',
    summary: '배수를 지워 가며 소수만 남기는 2,200년 된 알고리즘',
    levels: {
      elementary: '수판에서 배수를 직접 지우며 소수를 찾아요',
      middle: '1부터 100까지 체로 거르고, 언제 멈춰도 되는지 알아봐요',
      high: '파이썬으로 체를 만들고, 하나씩 나누어 보는 방법과 빠르기를 비교해요',
    },
  },
]

export const levelName = (key) => LEVELS.find((l) => l.key === key)?.name ?? ''
