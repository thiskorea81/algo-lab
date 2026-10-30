<script setup>
import LessonHead from '../../components/LessonHead.vue'
import HanoiPuzzle from '../../components/HanoiPuzzle.vue'
import PyLab from '../../components/PyLab.vue'
import Quiz from '../../components/Quiz.vue'
import { markDone } from '../../progress.js'

const STARTER1 = `def hanoi(n, start, via, end):
    if n == 1:
        print(start, "->", end)
        return
    # ① 위의 n-1개를 via 기둥으로
    hanoi(n - 1, start, end, via)
    # ② 가장 큰 원판을 end 기둥으로
    print(start, "->", end)
    # ③ via 기둥의 n-1개를 end 기둥으로 (빈칸을 채우세요)
    hanoi(n - 1, ___, ___, ___)


n = int(input())
hanoi(n, "A", "B", "C")
`
const TESTS1 = [
  { input: '1', output: 'A -> C' },
  { input: '2', output: 'A -> B\nA -> C\nB -> C' },
  { input: '3', output: 'A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C' },
]

const STARTER2 = `def count(n):
    """원판 n개를 옮기는 가장 적은 횟수를 재귀로 구한다."""
    if n == 1:
        return 1
    return ___


for n in range(1, 11):
    print(n, count(n))
`
const CHECK2 = `for k in range(1, 21):
    assert count(k) == 2 ** k - 1, f"count({k})가 {count(k)}예요. 2^{k}-1 = {2 ** k - 1}이어야 해요."`

const STARTER3 = `def moves(n, start="A", via="B", end="C"):
    """원판 n개를 옮기는 순서를 (원판 번호, 출발, 도착) 목록으로 돌려준다.
    원판 번호는 가장 작은 것이 1, 가장 큰 것이 n."""
    if n == 0:
        return []
    # 여기를 채우세요: 작은 탑, 가장 큰 원판, 다시 작은 탑을 이어 붙이기
    return []


m = moves(3)
print(len(m))
print(m[:4])
`
const CHECK3 = `def _ok(n):
    pegs = {"A": list(range(n, 0, -1)), "B": [], "C": []}
    for d, a, b in moves(n):
        assert pegs[a] and pegs[a][-1] == d, f"{a} 기둥 맨 위에 원판 {d}가 없어요."
        assert not pegs[b] or pegs[b][-1] > d, f"원판 {d}를 더 작은 원판 위에 놓았어요."
        pegs[b].append(pegs[a].pop())
    assert pegs["C"] == list(range(n, 0, -1)), "마지막에 모든 원판이 C에 있지 않아요."
    assert len(moves(n)) == 2 ** n - 1, "가장 적은 횟수가 아니에요."
for n in range(0, 9):
    _ok(n)`

const QUIZ = [
  {
    q: '위의 <code>hanoi(10, "A", "B", "C")</code>는 몇 줄을 출력할까요?',
    type: 'number',
    unit: '줄',
    answer: 1023,
    hint: '한 줄 = 원판 한 번 이동. T(n) = 2ⁿ − 1',
    explain: '2¹⁰ − 1 = 1023줄이에요. 이 코드에서는 함수 호출 횟수도 1023번이에요(n == 1에서 한 번 옮기고 멈추므로).',
  },
  {
    q: '원판 10개를 옮길 때 <b>가장 작은 원판</b>은 모두 몇 번 움직일까요?',
    type: 'number',
    unit: '번',
    answer: 512,
    hint: '가장 큰 원판은 1번, 그다음 원판은 2번, 그다음은 4번 … 작은 원판으로 갈수록 두 배씩 늘어요.',
    explain: '원판 k(작은 것이 1)는 2ⁿ⁻ᵏ번 움직여요. 가장 작은 원판은 2⁹ = 512번, 전체의 절반쯤이에요. 그래서 자동 풀이에서 홀수 번째 이동은 늘 가장 작은 원판이에요.',
  },
  {
    q: '<code>hanoi(20, ...)</code>을 실행할 때, 함수 호출이 동시에 가장 깊이 쌓이는 수(재귀 깊이)는?',
    type: 'choice',
    options: ['20', '2²⁰ − 1', '20 × 20'],
    answer: 0,
    hint: '한 번 부를 때마다 n이 1씩 줄어들고, n == 1에서 멈춰요.',
    explain: 'n, n−1, …, 1까지 20단이 쌓였다가 돌아와요. 호출 <b>횟수</b>는 많아도 동시에 쌓이는 <b>깊이</b>는 n이에요.',
  },
  {
    q: '수학적 귀납법으로 T(n) = 2ⁿ − 1을 증명할 때, T(k) = 2ᵏ − 1이라고 가정하면 T(k+1)은?',
    type: 'choice',
    options: ['T(k+1) = 2T(k) + 1 = 2(2ᵏ − 1) + 1 = 2ᵏ⁺¹ − 1', 'T(k+1) = T(k) + 2 = 2ᵏ + 1', 'T(k+1) = 2T(k) = 2ᵏ⁺¹ − 2'],
    answer: 0,
    hint: '점화식 T(n) = 2T(n−1) + 1에 가정을 넣어요.',
    explain: 'T(1) = 1 = 2¹ − 1이 성립하고, T(k)에서 T(k+1)도 성립하므로 모든 자연수 n에 대해 T(n) = 2ⁿ − 1이에요.',
  },
  {
    q: '원판 수 n에 대한 하노이의 탑 알고리즘의 시간 복잡도는?',
    type: 'choice',
    options: ['O(n)', 'O(n²)', 'O(2ⁿ)'],
    answer: 2,
    hint: '이동 횟수가 2ⁿ − 1이에요.',
    explain: '이동 횟수가 2ⁿ − 1이라 O(2ⁿ)이에요. 이 문제는 이보다 빠른 방법이 없어요(가장 적은 횟수 자체가 2ⁿ − 1이므로).',
  },
]
</script>

<template>
  <LessonHead topic="hanoi" level="high" />

  <div class="key">
    <b>핵심</b> — 원판 n개 옮기기 = ① n−1개를 보조 기둥으로 ② 가장 큰 원판을 목표 기둥으로 ③ n−1개를 목표 기둥으로.
    ①③은 원판이 하나 적은 <b>같은 문제</b>라서 함수가 자기 자신을 다시 부르면(재귀 호출) 돼요. n == 1이 <b>멈추는 조건(기저 사례)</b>예요.
  </div>
  <p>퍼즐로 먼저 감을 잡고 싶으면 아래에서 자동 풀이를 돌려 보세요(맡긴 일 = 호출 스택).</p>
  <HanoiPuzzle :discs="3" :choices="[3, 4, 5, 6]" :names="['A', 'B', 'C']" auto show-stack />

  <h2>1. 재귀 함수 완성하기</h2>
  <PyLab
    id="hanoi-high-1"
    task="③의 빈칸 세 개를 채워 완성하세요. 입력 n을 받아 A 기둥의 원판 n개를 C로 옮기는 순서를 출력해요."
    :starter="STARTER1"
    :tests="TESTS1"
    :hints="['③에서는 원판들이 지금 via 기둥에 있어요. 출발은 via예요.', '③은 via에서 end로 옮기고, 그동안 start 기둥을 보조로 써요.', '<code>hanoi(n - 1, via, start, end)</code>']"
  />

  <h2>2. 횟수를 재귀로 세기</h2>
  <PyLab
    id="hanoi-high-2"
    task="count(n)이 원판 n개를 옮기는 가장 적은 횟수를 돌려주도록 빈칸을 채우세요. 채점은 n = 1~20에서 2ⁿ − 1과 같은지 확인해요."
    :starter="STARTER2"
    :check="CHECK2"
    :hints="['작은 탑 두 번 + 큰 원판 한 번', '<code>2 * count(n - 1) + 1</code>']"
  />

  <h2>3. 도전: 이동 목록 만들기</h2>
  <PyLab
    id="hanoi-high-3"
    task="moves(n)이 (원판 번호, 출발, 도착) 튜플의 목록을 돌려주도록 완성하세요. 채점 프로그램이 n = 0~8에서 규칙을 지키는지, 가장 적은 횟수인지 직접 시뮬레이션해 확인해요."
    :starter="STARTER3"
    :check="CHECK3"
    :hints="['출력 대신 목록을 돌려줘요. 리스트끼리는 + 로 이어 붙일 수 있어요.', '가운데에는 [(n, start, end)] 하나가 들어가요.', '<code>return moves(n - 1, start, end, via) + [(n, start, end)] + moves(n - 1, via, start, end)</code>']"
  />

  <h2>4. 왜 2ⁿ − 1번이 가장 적을까?</h2>
  <ul>
    <li><b>이 방법의 횟수</b>: T(1) = 1, T(n) = 2T(n−1) + 1. 수학적 귀납법으로 T(n) = 2ⁿ − 1.</li>
    <li>
      <b>이보다 적을 수 없는 이유</b>: 가장 큰 원판이 처음 움직이려면 나머지 n−1개가 모두 세 번째 기둥에 모여 있어야 해요
      (출발 기둥에서는 큰 원판 위에 있으면 안 되고, 도착 기둥에 있으면 큰 원판을 놓을 수 없으니까요).
      그 상태를 만드는 데 적어도 T(n−1)번, 큰 원판이 도착 기둥에 놓인 뒤 n−1개를 그 위로 다시 쌓는 데 적어도 T(n−1)번,
      큰 원판 1번. 그래서 어떤 방법이든 적어도 2T(n−1) + 1번이에요.
    </li>
  </ul>

  <h2>📝 확인 문제</h2>
  <Quiz :items="QUIZ" @complete="markDone('hanoi/high')" />

  <div class="tip">
    🎓 <b>더 알아보기</b> — 기둥이 4개라면 횟수가 크게 줄어요. 이 문제는 '프레임–스튜어트 알고리즘'으로 알려져 있고,
    가장 적은 횟수인지는 오랫동안 증명되지 않은 어려운 문제였어요. 기둥 4개, 원판 4개일 때 9번이면 된다는 것을 직접 찾아보세요.
  </div>
</template>
