<script setup>
// 바둑돌 직사각형: 수를 고르면 그 개수의 돌로 만들 수 있는 직사각형(곱셈 짝)을 모두 보여 준다.
// 한 줄(1 × n) 말고는 만들 수 없으면 소수.
import { computed, ref } from 'vue'

const n = ref(12)
const pairs = computed(() => {
  const out = []
  for (let r = 1; r <= n.value; r++) if (n.value % r === 0 && r <= n.value / r) out.push([r, n.value / r])
  return out
})
const isPrime = computed(() => n.value > 1 && pairs.value.length === 1)
</script>

<template>
  <div class="card">
    <div class="row">
      <span>바둑돌</span>
      <button class="btn" :disabled="n <= 1" @click="n--">−</button>
      <b class="n">{{ n }}</b>
      <button class="btn" :disabled="n >= 30" @click="n++">+</button>
      <span>개</span>
    </div>
    <div class="rects">
      <figure v-for="[r, c] in pairs" :key="r">
        <div class="grid" :style="{ gridTemplateColumns: `repeat(${c}, 12px)` }">
          <span v-for="i in r * c" :key="i" class="dot"></span>
        </div>
        <figcaption>{{ r }} × {{ c }}</figcaption>
      </figure>
    </div>
    <p v-if="n === 1" class="dim">1개로는 1 × 1 하나뿐이에요. 1은 소수가 아니에요(소수도 합성수도 아닌 특별한 수).</p>
    <p v-else-if="isPrime" class="good">{{ n }}개는 한 줄(1 × {{ n }})로만 놓을 수 있어요. 그래서 {{ n }}은 소수예요!</p>
    <p v-else class="dim">{{ n }}개는 한 줄 말고도 직사각형을 만들 수 있어요. 소수가 아니에요(합성수).</p>
  </div>
</template>

<style scoped>
.n {
  font-size: 22px;
  min-width: 32px;
  text-align: center;
}

.rects {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: flex-end;
  margin: 12px 0;
}

figure {
  margin: 0;
  text-align: center;
}

.grid {
  display: grid;
  gap: 3px;
  justify-content: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text);
}

figcaption {
  font-size: 14px;
  color: var(--text-dim);
}
</style>
