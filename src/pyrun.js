// 파이썬 실행: 워커 하나를 두고, 시간 초과(무한 반복 등)면 워커를 끄고 새로 만든다.
// 처음 실행은 파이썬(약 10MB)을 받느라 오래 걸릴 수 있어 시간을 넉넉히 준다.
let worker = null
let warm = false
let seq = 0

function getWorker() {
  if (!worker) worker = new Worker('/py-worker.js')
  return worker
}

export function runPython(code, stdin = '', limitSec = 10) {
  const w = getWorker()
  const id = ++seq
  const limit = (warm ? limitSec : 90) * 1000
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.terminate()
      worker = null
      warm = false
      resolve({ ok: false, out: '', error: `${limitSec}초 안에 끝나지 않아 멈췄어요. 끝나지 않는 반복이 있는지 확인해 보세요.` })
    }, limit)
    const onMsg = ({ data }) => {
      if (data.id !== id) return
      clearTimeout(timer)
      w.removeEventListener('message', onMsg)
      warm = true
      resolve(data)
    }
    w.addEventListener('message', onMsg)
    w.postMessage({ id, code, stdin })
  })
}
