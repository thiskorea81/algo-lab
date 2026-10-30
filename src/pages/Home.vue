<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { LEVELS, TOPICS } from '../topics.js'
import { done } from '../progress.js'

// 나에게 맞는 수준 찾기: '예'가 처음으로 '아니요'가 되기 전까지 올라간다
const CHECKS = [
  { q: '곱셈구구를 막힘없이 할 수 있나요?', level: 'elementary' },
  { q: '2⁵ 같은 거듭제곱이나 소인수분해를 배웠나요?', level: 'middle' },
  { q: '파이썬으로 함수(def)와 반복문(for)을 써 본 적이 있나요?', level: 'high' },
]
const answers = ref([null, null, null])
const recommend = computed(() => {
  if (answers.value.some((a) => a === null)) return null
  let lv = 'elementary'
  for (const [i, c] of CHECKS.entries()) {
    if (!answers.value[i]) break
    lv = c.level
  }
  return LEVELS.find((l) => l.key === lv)
})
</script>

<template>
  <section class="hero">
    <h1>알고리즘, 직접 해 보며 배워요</h1>
    <p>
      주제를 고르고, <b>내 실력에 맞는 수준</b>을 골라 시작하세요. 같은 주제를 초등·중등·고등 수준으로 나눠 두었어요.
      쉬운 수준부터 차례로 올라가도 좋아요. 모두 이 화면에서 직접 눌러 보고, 풀어 보고, 실행해 보는 체험이에요.
    </p>
  </section>

  <section class="card finder">
    <h2>🧭 나에게 맞는 수준 찾기</h2>
    <div v-for="(c, i) in CHECKS" :key="i" class="check">
      <span>{{ c.q }}</span>
      <div class="row">
        <button class="btn" :class="{ primary: answers[i] === true }" @click="answers[i] = true">예</button>
        <button class="btn" :class="{ primary: answers[i] === false }" @click="answers[i] = false">아니요</button>
      </div>
    </div>
    <p v-if="recommend" class="rec">
      추천 수준: <b :style="{ color: recommend.color }">{{ recommend.name }}</b> — 아래 주제에서
      <b>{{ recommend.name }}</b> 단추를 눌러 시작하세요. 어렵거나 쉬우면 언제든 다른 수준으로 바꿀 수 있어요.
    </p>
  </section>

  <section v-for="t in TOPICS" :key="t.key" class="card topic">
    <h2>{{ t.icon }} {{ t.title }} <span class="tag">{{ t.tag }}</span></h2>
    <p class="dim">{{ t.summary }}</p>
    <div class="levels">
      <RouterLink
        v-for="l in LEVELS"
        :key="l.key"
        :to="`/${t.key}/${l.key}`"
        class="lv"
        :class="{ rec: recommend?.key === l.key }"
        :style="{ '--c': l.color }"
      >
        <strong>{{ l.name }} <span v-if="done.has(`${t.key}/${l.key}`)" class="good">✔</span></strong>
        <span>{{ t.levels[l.key] }}</span>
        <span class="who">{{ l.who }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.hero p {
  max-width: 760px;
}

.finder h2,
.topic h2 {
  margin-top: 0;
}

.check {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px 16px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border);
}

.rec {
  margin-bottom: 0;
}

.tag {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-bg);
  padding: 2px 10px;
  border-radius: 999px;
  vertical-align: middle;
}

.levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 10px;
}

.lv {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  color: var(--text);
  border: 2px solid var(--border);
  border-top: 6px solid var(--c);
  border-radius: 12px;
  padding: 12px 14px;
}

.lv strong {
  color: var(--c);
  font-size: 19px;
}

.lv.rec {
  border-color: var(--c);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent);
}

.who {
  font-size: 14px;
  color: var(--text-dim);
}
</style>
