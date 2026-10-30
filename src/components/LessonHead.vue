<script setup>
// 학습 페이지 위쪽: 주제·수준 표시와 같은 주제의 다른 수준으로 바로 가기
import { RouterLink } from 'vue-router'
import { LEVELS, TOPICS } from '../topics.js'

const props = defineProps({ topic: String, level: String })
const t = TOPICS.find((x) => x.key === props.topic)
const lv = LEVELS.find((x) => x.key === props.level)
</script>

<template>
  <div class="head">
    <p class="crumb"><RouterLink to="/">주제 고르기</RouterLink> › {{ t.icon }} {{ t.title }}</p>
    <div class="levels">
      <RouterLink
        v-for="l in LEVELS"
        :key="l.key"
        :to="`/${topic}/${l.key}`"
        class="lv"
        :class="{ on: l.key === level }"
        :style="{ '--c': l.color }"
      >{{ l.name }}</RouterLink>
    </div>
    <h1><span class="tag" :style="{ background: lv.color }">{{ lv.name }}</span> {{ t.title }}</h1>
    <p class="lead">{{ t.levels[level] }}</p>
  </div>
</template>

<style scoped>
.crumb {
  margin: 0;
  font-size: 15px;
}

.levels {
  display: flex;
  gap: 6px;
  margin: 10px 0 0;
}

.lv {
  text-decoration: none;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
  border: 2px solid var(--c);
  color: var(--c);
}

.lv.on {
  background: var(--c);
  color: #fff;
}

.tag {
  font-size: 15px;
  color: #fff;
  padding: 2px 10px;
  border-radius: 999px;
  vertical-align: middle;
}

.lead {
  color: var(--text-dim);
  margin-top: 0;
}
</style>
