// 에라토스테네스의 체 판서 쇼츠(수준별 2편). 칠판 좌표 360 × 520, 항목 모양은 draw.js 참고.
const mid = (t, y, size = 30, c = 'y') => ({ t, x: 180, y, size, c, a: 'middle' })
const dot = (x, y) => ({ disc: [x - 8, y - 8, 16, 16], c: '#f5f3e8', dur: 0.08 })
const dots = (x, y, rows, cols, gap = 24) =>
  Array.from({ length: rows * cols }, (_, i) => dot(x + (i % cols) * gap, y + Math.floor(i / cols) * gap))

const G30 = { x: 30, y: 70, cols: 6, cell: 50, from: 1, to: 30, size: 26 }
const multiples = (p, max, from) => Array.from({ length: Math.floor(max / p) }, (_, i) => p * (i + 1)).filter((k) => k >= from)

const elementary = [
  {
    title: '소수가 뭘까?',
    steps: [
      { clear: true, say: '바둑돌 6개는 한 줄(1 × 6)로도, 2줄에 3개씩(2 × 3)으로도 놓을 수 있어요.', draw: [mid('바둑돌 6개', 45), ...dots(40, 90, 1, 6), { t: '1 × 6', x: 40, y: 135, size: 24 }, ...dots(230, 90, 2, 3), { t: '2 × 3', x: 230, y: 160, size: 24 }] },
      { say: '7개는 어떨까요? 아무리 해도 한 줄(1 × 7)뿐이에요.', draw: [mid('바둑돌 7개', 215), ...dots(40, 250, 1, 7), { t: '1 × 7 뿐!', x: 220, y: 258, size: 28, c: 'p' }] },
      { say: '1보다 큰 수 가운데 1과 자기 자신으로만 나누어떨어지는 수를 소수라고 해요.', draw: [{ t: '소수', x: 20, y: 345, size: 46, c: 'p' }, { t: '1과 자기 자신으로만', x: 110, y: 330, size: 26 }, { t: '나누어떨어지는 수', x: 110, y: 365, size: 26 }] },
      { say: '2, 3, 5, 7, 11, 13 … 이 소수예요.', draw: [mid('2, 3, 5, 7, 11, 13 …', 425, 32, 'g')] },
      { say: '1은 소수도 합성수도 아니에요. 소수는 1보다 큰 수에서 찾아요.', draw: [mid('1은 소수가 아니에요!', 485, 30, 'o')] },
    ],
  },
  {
    title: '체로 소수 거르기 (1~30)',
    steps: [
      { clear: true, say: '1부터 30까지 적어요. 1은 소수가 아니라 빼 두어요.', draw: [mid('1부터 30까지', 45), { grid: G30 }] },
      { say: '남은 수 중 가장 작은 2에 ○ — 소수예요! 2보다 큰 2의 배수를 모두 지워요.', draw: [{ ring: [G30, 2], c: 'y' }, ...multiples(2, 30, 4).map((k) => ({ strike: [G30, k], c: 'y' }))] },
      { say: '다음으로 남은 가장 작은 수 3에 ○. 3의 배수를 지워요. 6, 12, 18 …은 이미 지워져 있어요.', draw: [{ ring: [G30, 3], c: 'b' }, ...[9, 15, 21, 27].map((k) => ({ strike: [G30, k], c: 'b' }))] },
      { say: '5에 ○. 5의 배수 중 새로 지울 수는 25뿐이에요.', draw: [{ ring: [G30, 5], c: 'g' }, { strike: [G30, 25], c: 'g' }] },
      { say: '다음은 7. 그런데 7 × 7 = 49는 30보다 커요. 30 이하의 7의 배수는 이미 다 지워졌어요.', draw: [mid('7 × 7 = 49 > 30', 375, 30, 'w')] },
      { say: '그래서 남은 수는 모두 소수! 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 — 10개예요.', draw: [...[7, 11, 13, 17, 19, 23, 29].map((k) => ({ ring: [G30, k], c: 'p' })), mid('소수 10개!', 440, 38, 'p')] },
    ],
  },
]

const middle = [
  {
    title: '왜 √N에서 멈춰도 될까?',
    steps: [
      { clear: true, say: '합성수 m을 두 수의 곱 a × b로 나타내요. a가 작은 쪽이라고 해요.', draw: [mid('합성수 m = a × b', 55, 34), mid('(a ≤ b)', 95, 26, 'w')] },
      { say: 'a ≤ b이니까 a × a ≤ a × b = m이에요.', draw: [mid('a × a ≤ a × b = m', 155, 32, 'w')] },
      { say: '그래서 합성수 m은 반드시 √m 이하의 약수를 가져요. 그 약수의 소인수로 이미 지워져요.', draw: [{ t: '→ √m 이하의 약수가 꼭 있다', x: 20, y: 210, size: 26, c: 'g' }] },
      { say: '예를 들어 100까지는 √100 = 10 이하의 소수 2, 3, 5, 7의 배수만 지우면 돼요.', draw: [{ t: 'N = 100', x: 20, y: 280, size: 30, c: 'y' }, { t: '√100 = 10', x: 20, y: 320, size: 28 }, { t: '→ 2, 3, 5, 7까지만!', x: 20, y: 360, size: 28, c: 'g' }] },
      { say: '77처럼 11의 배수도 더 작은 소인수 7로 이미 지워졌어요.', draw: [{ t: '77 = 7 × 11', x: 20, y: 420, size: 28, c: 'b' }, { t: '→ 7에서 이미 지움', x: 190, y: 420, size: 24, c: 'b' }] },
      { say: '규칙: 소수 p에서 p × p가 N보다 커지면 멈춰요. 남은 수는 모두 소수예요.', draw: [mid('p × p > N 이면 멈춤!', 490, 32, 'p')] },
    ],
  },
  {
    title: 'p의 배수는 p × p부터',
    steps: [
      {
        clear: true,
        say: '7의 배수를 지울 차례예요. 14, 21, 28, 35, 42 …',
        draw: [mid('7의 배수를 지울 차례', 45), ...['14 = 2 × 7', '21 = 3 × 7', '28 = 4 × 7', '35 = 5 × 7', '42 = 6 × 7'].map((t, i) => ({ t, x: 30, y: 100 + i * 40, size: 28 }))],
      },
      {
        say: '그런데 이 수들은 7보다 작은 소인수 2, 3, 5를 가져서 이미 지워졌어요.',
        draw: ['← 2에서 지움', '← 3에서 지움', '← 2에서 지움', '← 5에서 지움', '← 2에서 지움'].map((t, i) => ({ t, x: 190, y: 100 + i * 40, size: 24, c: 'p' })),
      },
      { say: '처음으로 새로 지워지는 수는 7 × 7 = 49예요.', draw: [{ t: '49 = 7 × 7', x: 30, y: 330, size: 32, c: 'y' }, { t: '← 처음 새로!', x: 190, y: 330, size: 26, c: 'g' }] },
      { say: '그래서 p의 배수는 p × p부터 p씩 건너뛰며 지우면 충분해요. 일이 줄어들어요!', draw: [mid('p의 배수는 p × p부터', 410, 32, 'p'), mid('p×p, p×p+p, p×p+2p …', 455, 26, 'w')] },
    ],
  },
]

// is_prime 칸(0~11)
const CELL = { x: 20, y: 70, w: 26, gap: 1 }
const cx = (k) => CELL.x + k * (CELL.w + CELL.gap) + CELL.w / 2
const cells = () =>
  Array.from({ length: 12 }, (_, k) => [
    { box: [CELL.x + k * (CELL.w + CELL.gap), CELL.y, CELL.w, 34], c: '#9fb3a6', w: 1.5, dur: 0.05 },
    { t: k < 2 ? 'F' : 'T', x: cx(k), y: CELL.y + 25, size: 22, c: k < 2 ? 'p' : 'w', a: 'middle', dur: 0.05 },
    { t: String(k), x: cx(k), y: CELL.y + 56, size: 18, c: '#9fb3a6', a: 'middle', dur: 0.05 },
  ]).flat()
const off = (k, c) => ({ line: [cx(k) - 10, CELL.y + 28, cx(k) + 10, CELL.y + 6], c, w: 3, dur: 0.15 })
const code = (t, y, c = 'w') => ({ t, x: 20, y, size: 22, c })

const high = [
  {
    title: '체를 코드로 옮기기',
    steps: [
      { clear: true, say: 'is_prime[k]는 k가 소수인지 적는 칸이에요. 처음엔 모두 True, 0과 1만 False.', draw: [{ t: 'is_prime', x: 20, y: 50, size: 28, c: 'y' }, ...cells()] },
      {
        say: '바깥 반복은 p × p ≤ n 동안, 안쪽 반복은 p × p부터 p씩 건너뛰며 False로 바꿔요.',
        draw: [code('p = 2', 170), code('while p * p <= n:', 202), code('    if is_prime[p]:', 234), code('        for k in range(p*p, n+1, p):', 266, 'y'), code('            is_prime[k] = False', 298, 'y'), code('    p += 1', 330)],
      },
      { say: 'n = 11일 때, p = 2: 4, 6, 8, 10을 False로.', draw: [{ t: 'p = 2', x: 230, y: 50, size: 26, c: 'p' }, ...[4, 6, 8, 10].map((k) => off(k, 'p'))] },
      { say: 'p = 3: 9를 False로. 다음 p = 4는 4 × 4 = 16 > 11이라 반복이 끝나요.', draw: [{ t: 'p = 3', x: 300, y: 50, size: 26, c: 'b' }, off(9, 'b')] },
      { say: '남은 True는 2, 3, 5, 7, 11 — 11 이하의 소수예요.', draw: [{ t: '남은 True: 2, 3, 5, 7, 11', x: 20, y: 390, size: 28, c: 'g' }] },
      { say: '시간은 O(n log log n), 대신 n + 1칸짜리 표가 필요해 공간은 O(n)이에요.', draw: [mid('시간 O(n log log n) · 공간 O(n)', 460, 26, 'p')] },
    ],
  },
  {
    title: '얼마나 빠를까? (n = 1,000,000)',
    steps: [
      { clear: true, say: '하나씩 나누기: 수 k마다 2, 3, 4, …, √k로 나누어 떨어지는지 확인해요.', draw: [{ t: '하나씩 나누기', x: 20, y: 55, size: 32, c: 'b' }, { t: 'k마다 2, 3, … √k로 나눔', x: 20, y: 98, size: 26 }] },
      { say: '100만까지 하면 나눗셈이 약 6,774만 번이에요(직접 센 값).', draw: [{ t: '나눗셈 약 6,774만 번', x: 20, y: 145, size: 30, c: 'b' }] },
      { say: '체: 소수 p마다 배수만 지워요. 지우는 횟수는 n/2 + n/3 + n/5 + … 쯤이에요.', draw: [{ t: '에라토스테네스의 체', x: 20, y: 225, size: 32, c: 'y' }, { t: 'n/2 + n/3 + n/5 + n/7 + …', x: 20, y: 268, size: 26 }] },
      { say: '100만까지 지우기는 약 212만 번이에요(p × p부터 지운 경우).', draw: [{ t: '지우기 약 212만 번', x: 20, y: 315, size: 30, c: 'y' }] },
      { say: '같은 답을 내는데 일이 약 32배나 적어요!', draw: [mid('약 32배 적은 일!', 390, 40, 'p')] },
      { say: '체의 일은 약 n log log n. log log n은 아주 천천히 커져서 n = 100만이어도 약 2.6이에요.', draw: [mid('log log 1,000,000 ≈ 2.6', 450, 28, 'g'), mid('→ 거의 n에 비례', 495, 28, 'g')] },
    ],
  },
]

export const SIEVE = { elementary, middle, high }
