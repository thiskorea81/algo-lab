<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="top">
    <RouterLink to="/" class="brand">🧪 알고리즘 체험실</RouterLink>
    <nav>
      <RouterLink to="/">주제 고르기</RouterLink>
      <RouterLink to="/about">만든 과정</RouterLink>
    </nav>
  </header>
  <main class="wrap">
    <RouterView />
  </main>
  <footer class="foot wrap">
    <p>
      글·문제·프로그램은 생성형 AI(Anthropic Claude)의 도움을 받아 새로 만들고 선생님이 검토했어요.
      AI도 틀릴 수 있으니 이상한 곳을 찾으면 알려 주세요.
    </p>
    <p>글·그림 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ko" target="_blank" rel="noopener">CC BY-SA 4.0</a> · 코드 MIT · 로그인 없음, 이 브라우저에만 진행 상황을 저장해요.</p>
  </footer>
</template>
