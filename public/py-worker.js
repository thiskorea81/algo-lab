// 브라우저 안 파이썬(Pyodide) 실행 워커. 무한 반복에 걸려도 화면이 멈추지 않게 페이지와 따로 돌고,
// 시간이 넘으면 페이지 쪽(src/pyrun.js)이 워커를 통째로 끄고 새로 만든다.
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/'
importScripts(PYODIDE_URL + 'pyodide.js')
const ready = loadPyodide({ indexURL: PYODIDE_URL })

self.onmessage = async ({ data }) => {
  const { id, code, stdin = '' } = data
  const out = []
  try {
    const py = await ready
    py.setStdout({ batched: (s) => out.push(s) })
    py.setStderr({ batched: (s) => out.push(s) })
    py.globals.set('__stdin_text', stdin)
    // input()은 입력 칸 내용을 한 줄씩 읽는다. 실행마다 새 이름공간을 쓴다.
    py.runPython(`
import sys, io, builtins
sys.stdin = io.StringIO(__stdin_text)
def __input(prompt=''):
    line = sys.stdin.readline()
    if line == '':
        raise EOFError('입력 칸에 넣은 값이 모자라요.')
    return line.rstrip('\\n')
builtins.input = __input
sys.setrecursionlimit(3000)
`)
    await py.runPythonAsync(code, { globals: py.toPy({ __name__: '__main__' }) })
    self.postMessage({ id, ok: true, out: out.join('\n') })
  } catch (err) {
    // 파이썬 오류는 마지막 몇 줄(오류 이름과 줄 번호)만 보여 준다
    const lines = String(err.message ?? err).trim().split('\n')
    const start = lines.findIndex((l) => l.includes('File "<exec>"'))
    self.postMessage({ id, ok: false, out: out.join('\n'), error: lines.slice(start >= 0 ? start : -3).join('\n') })
  }
}
