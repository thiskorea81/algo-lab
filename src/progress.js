// 학습 진행 표시: 확인 문제를 다 푼 페이지를 이 브라우저에만 기록한다(로그인·서버 저장 없음)
import { reactive } from 'vue'

const KEY = 'algo-lab:done'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export const done = reactive(new Set(read()))

export function markDone(path) {
  done.add(path)
  try {
    localStorage.setItem(KEY, JSON.stringify([...done]))
  } catch {
    // 시크릿 창 등: 화면에서만 표시
  }
}
