<script setup>
// 파이썬 직접 해 보기: 코드를 고쳐 실행하고 채점한다(브라우저 안에서만 실행, 서버로 보내지 않음).
// tests: [{ input, output }] 입력을 주고 출력 전체를 비교(줄 끝 빈칸 무시)
// check: 학생 코드 뒤에 붙여 실행할 검사 코드(assert). 오류 없이 끝나면 통과
import { onMounted, ref, watch } from 'vue'
import { runPython } from '../pyrun.js'

const props = defineProps({
  id: { type: String, required: true }, // 이 브라우저에 코드를 저장할 이름
  task: { type: String, default: '' },
  starter: { type: String, default: '' },
  stdin: { type: String, default: '' },
  tests: { type: Array, default: () => [] },
  check: { type: String, default: '' },
  hints: { type: Array, default: () => [] },
})

const key = `code:${props.id}`
const code = ref(props.starter)
const input = ref(props.stdin)
const busy = ref(false)
const result = ref(null) // { kind: 'run' | 'grade', ok, text }
const shown = ref(0)
const done = ref(false)

onMounted(() => {
  try {
    code.value = localStorage.getItem(key) ?? props.starter
    done.value = localStorage.getItem(`done:${props.id}`) === '1'
  } catch {
    // 저장소를 못 쓰면 처음 코드로
  }
})
watch(code, (v) => {
  try {
    localStorage.setItem(key, v)
  } catch {
    // 무시
  }
})

const normalize = (s) => String(s ?? '').replace(/\r/g, '').split('\n').map((l) => l.trimEnd()).join('\n').trim()

async function run() {
  busy.value = true
  result.value = { kind: 'run', ok: true, text: '실행 중… (처음에는 파이썬을 받느라 10초쯤 걸려요)' }
  const r = await runPython(code.value, input.value)
  result.value = { kind: 'run', ok: r.ok, text: [r.out, r.error].filter(Boolean).join('\n') || '(출력 없음)' }
  busy.value = false
}

async function grade() {
  busy.value = true
  result.value = { kind: 'grade', ok: true, text: '채점 중…' }
  let fail = ''
  if (props.check) {
    const r = await runPython(`${code.value}\n\n${props.check}`)
    if (!r.ok) fail = r.error.includes('AssertionError') ? `확인: ${r.error.split('AssertionError:').pop().trim() || '결과가 맞지 않아요.'}` : r.error
  }
  for (const [i, t] of props.tests.entries()) {
    if (fail) break
    const r = await runPython(code.value, t.input ?? '')
    if (!r.ok) fail = `테스트 ${i + 1}에서 오류:\n${r.error}`
    else if (normalize(r.out) !== normalize(t.output)) {
      fail = `테스트 ${i + 1}\n입력: ${t.input || '(없음)'}\n기대한 출력:\n${normalize(t.output)}\n내 출력:\n${normalize(r.out) || '(없음)'}`
    }
  }
  result.value = { kind: 'grade', ok: !fail, text: fail || '모두 통과했어요! 🎉' }
  if (!fail) {
    done.value = true
    try {
      localStorage.setItem(`done:${props.id}`, '1')
    } catch {
      // 무시
    }
  }
  busy.value = false
}

function reset() {
  code.value = props.starter
  result.value = null
}

// 탭 키는 칸 이동 대신 빈칸 4개
function onTab(e) {
  const el = e.target
  const { selectionStart: a, selectionEnd: b } = el
  code.value = code.value.slice(0, a) + '    ' + code.value.slice(b)
  requestAnimationFrame(() => (el.selectionStart = el.selectionEnd = a + 4))
}
</script>

<template>
  <div class="card lab" :class="{ done }">
    <p class="badge">🐍 파이썬 직접 해 보기 <span v-if="done" class="good">✔ 해결</span></p>
    <p v-if="task" class="task" v-html="task"></p>
    <textarea
      v-model="code"
      class="editor"
      spellcheck="false"
      autocapitalize="off"
      :rows="Math.max(6, code.split('\n').length + 1)"
      @keydown.tab.prevent="onTab"
    ></textarea>
    <details v-if="!tests.length && !check" class="stdin">
      <summary>입력 칸 (input()이 한 줄씩 읽어요)</summary>
      <textarea v-model="input" rows="2" class="editor"></textarea>
    </details>
    <div class="row">
      <button class="btn" @click="reset">처음 코드로</button>
      <button class="btn" :disabled="busy" @click="run">▶ 실행</button>
      <button v-if="tests.length || check" class="btn primary" :disabled="busy" @click="grade">채점</button>
    </div>
    <pre v-if="result" class="out" :class="{ bad: !result.ok, ok: result.kind === 'grade' && result.ok }">{{ result.text }}</pre>
    <div v-if="hints.length" class="hints">
      <ol v-if="shown">
        <li v-for="h in hints.slice(0, shown)" :key="h" v-html="h"></li>
      </ol>
      <button v-if="shown < hints.length" class="btn" @click="shown++">💡 힌트 {{ shown + 1 }} 보기</button>
    </div>
  </div>
</template>

<style scoped>
.lab.done {
  border-color: var(--good);
}

.badge {
  font-weight: 700;
  margin: 0 0 6px;
}

.task {
  margin-top: 0;
}

.editor {
  width: 100%;
  font-family: var(--mono);
  font-size: 15px;
  line-height: 1.55;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text);
  tab-size: 4;
  resize: vertical;
}

.stdin {
  margin: 6px 0;
  font-size: 15px;
}

.row {
  margin-top: 8px;
}

.out {
  margin-top: 10px;
  white-space: pre-wrap;
  border-left: 4px solid var(--accent);
}

.out.bad {
  border-left-color: var(--bad);
  font-weight: 400;
}

.out.ok {
  border-left-color: var(--good);
}

.hints {
  margin-top: 10px;
}
</style>
