<script setup>
// 확인 문제. 처음 틀리면 힌트를 보여 주고 한 번 더, 두 번째도 틀리면 정답과 풀이를 보여 준다.
// items: [{ q, type: 'choice' | 'number' | 'text', options?, answer, hint, explain }]
//   choice: answer는 options의 번호(0부터), number: 수, text: 맞는 답 글자 목록(빈칸·대소문자 무시)
import { computed, ref } from 'vue'

const props = defineProps({ items: { type: Array, required: true } })
const emit = defineEmits(['complete'])

const st = ref(props.items.map(() => ({ pick: null, input: '', tries: 0, result: '' })))
const finished = computed(() => st.value.filter((s) => s.result === 'right' || s.result === 'wrong').length)
const right = computed(() => st.value.filter((s) => s.result === 'right').length)

const norm = (v) => String(v).replace(/\s+/g, '').toLowerCase()

function isRight(item, s) {
  if (item.type === 'choice') return s.pick === item.answer
  if (item.type === 'number') return s.input !== '' && Number(s.input) === item.answer
  return item.answer.some((a) => norm(a) === norm(s.input))
}

function check(i) {
  const item = props.items[i]
  const s = st.value[i]
  s.tries += 1
  if (isRight(item, s)) s.result = 'right'
  else s.result = s.tries === 1 ? 'hint' : 'wrong'
  if (finished.value === props.items.length) emit('complete', { right: right.value, total: props.items.length })
}

const ready = (item, s) => (item.type === 'choice' ? s.pick !== null : String(s.input).trim() !== '')
const closed = (s) => s.result === 'right' || s.result === 'wrong'
const answerText = (item) =>
  item.type === 'choice' ? `${item.answer + 1}. ${item.options[item.answer]}` : item.type === 'number' ? item.answer : item.answer[0]
</script>

<template>
  <div class="quiz">
    <div v-for="(item, i) in items" :key="i" class="card q">
      <p class="qt"><b>{{ i + 1 }}.</b> <span v-html="item.q"></span></p>
      <div v-if="item.type === 'choice'" class="opts">
        <button
          v-for="(o, k) in item.options"
          :key="k"
          class="btn opt"
          :class="{ primary: st[i].pick === k }"
          :disabled="closed(st[i])"
          @click="st[i].pick = k"
        >{{ k + 1 }}. {{ o }}</button>
      </div>
      <div v-else class="row">
        <input
          v-model="st[i].input"
          class="num-in"
          :class="{ wide: item.type === 'text' }"
          :type="item.type === 'number' ? 'number' : 'text'"
          :inputmode="item.type === 'number' ? 'numeric' : 'text'"
          :disabled="closed(st[i])"
          @keyup.enter="ready(item, st[i]) && !closed(st[i]) && check(i)"
        />
        <span v-if="item.unit">{{ item.unit }}</span>
      </div>
      <div class="row act">
        <button class="btn primary" :disabled="!ready(item, st[i]) || closed(st[i])" @click="check(i)">확인</button>
      </div>
      <p v-if="st[i].result === 'right'" class="good">정답이에요! {{ st[i].tries > 1 ? '(힌트를 보고 맞혔어요)' : '⭐' }}</p>
      <p v-if="st[i].result === 'hint'" class="bad">한 번 더 생각해 볼까요? 💡 {{ item.hint }}</p>
      <p v-if="st[i].result === 'wrong'" class="bad">괜찮아요. 정답은 <b>{{ answerText(item) }}</b>이에요.</p>
      <p v-if="closed(st[i])" class="tip" v-html="item.explain"></p>
    </div>
    <p v-if="finished === items.length" class="good">확인 문제 {{ items.length }}개 중 {{ right }}개를 맞혔어요.</p>
  </div>
</template>

<style scoped>
.qt {
  margin-top: 0;
}

.opts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opt {
  text-align: left;
}

.act {
  margin-top: 10px;
}

.num-in.wide {
  width: min(320px, 100%);
}
</style>
