<script setup>
// 하노이의 탑 한 장면(움직이지 않는 그림). pegs: 기둥별 원판(아래부터, 큰 수가 큰 원판), arrow: [from, to]
const props = defineProps({
  pegs: { type: Array, required: true },
  arrow: { type: Array, default: null },
  caption: { type: String, default: '' },
  n: { type: Number, default: 3 },
})
const X = [40, 110, 180]
const w = (d) => 14 + (d / props.n) * 40
</script>

<template>
  <figure class="mini">
    <svg viewBox="0 0 220 112" role="img" :aria-label="caption">
      <rect x="8" y="92" width="204" height="6" rx="3" fill="#9aa7ad" />
      <rect v-for="x in X" :key="x" :x="x - 3" y="34" width="6" height="58" rx="3" fill="#9aa7ad" />
      <template v-for="(peg, i) in pegs" :key="i">
        <rect
          v-for="(d, k) in peg"
          :key="d"
          :x="X[i] - w(d) / 2"
          :y="80 - k * 13"
          :width="w(d)"
          height="11"
          rx="5.5"
          :fill="`var(--disc-${((d - 1) % 6) + 1})`"
        />
      </template>
      <template v-if="arrow">
        <path
          :d="`M${X[arrow[0]]} 28 Q${(X[arrow[0]] + X[arrow[1]]) / 2} ${8 - Math.abs(arrow[1] - arrow[0]) * 4} ${X[arrow[1]]} 28`"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
        />
        <path :d="`M${X[arrow[1]] - 6} 21 L${X[arrow[1]]} 29 L${X[arrow[1]] + 4} 20`" fill="none" stroke="currentColor" stroke-width="2.4" />
      </template>
      <text v-for="(x, i) in X" :key="`t${i}`" :x="x" y="110" text-anchor="middle" font-size="11" fill="currentColor">{{ ['가', '나', '다'][i] }}</text>
    </svg>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.mini {
  margin: 0;
  text-align: center;
  color: var(--accent);
}

.mini svg {
  width: 100%;
  max-width: 240px;
}

figcaption {
  font-size: 15px;
  color: var(--text);
}
</style>
