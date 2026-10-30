# 알고리즘 체험실

하노이의 탑(재귀)과 에라토스테네스의 체(소수)를 **초등·중등·고등** 수준에 맞춰 직접 해 보며 배우는 공개 학습 사이트.
로그인·서버 없이 동작하는 정적 사이트(Vue 3 + Vite)이고, 고등 수준의 파이썬 실습은 브라우저 안(Pyodide)에서 실행한다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 결과: dist/ (Netlify가 같은 명령으로 배포, netlify.toml)
```

## 구조

- `src/topics.js` 주제·수준 목록(첫 화면 카드와 페이지 위쪽 길잡이가 함께 씀). 새 주제는 여기와 `src/router.js`에 추가.
- `src/pages/<주제>/{Elementary,Middle,High}.vue` 수준별 학습 페이지.
- `src/components/` 체험 부품: `HanoiPuzzle`(직접 옮기기·자동 풀이·호출 스택), `HanoiMini`(정지 그림), `SieveBoard`(직접 지우기·단계별 체), `DotRect`(바둑돌 직사각형), `Quiz`(첫 오답에 힌트), `PyLab`(파이썬 실습·채점).
- `public/py-worker.js` + `src/pyrun.js` 파이썬 실행 워커(시간 초과 시 워커를 끄고 새로 만듦).
- 진행 상황(푼 페이지, 작성한 코드)은 브라우저 localStorage에만 저장.

## 원칙

- 교과서·문제집의 글·그림·문제를 가져오지 않고 새로 쓴다. 그림은 SVG·화면 요소로 직접 그린다.
- 정답·숫자는 프로그램을 실행해 확인한다(파이썬 실습은 모범 답안이 채점을 통과하고, 처음 코드는 통과하지 않는지 확인).
- 생성형 AI의 도움을 받아 만들었음을 모든 화면 아래에 밝힌다(인공지능기본법 제31조).

## 라이선스

글·그림 CC BY-SA 4.0, 코드 MIT.
