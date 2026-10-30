// 수 뒤에 붙는 조사: 끝자리를 우리말로 읽었을 때 받침이 있으면 앞 것(은·을·이), 없으면 뒤 것(는·를·가)
// 0(영·십·백…)·1(일)·3(삼)·6(육)·7(칠)·8(팔)은 받침이 있고, 2(이)·4(사)·5(오)·9(구)는 없다.
export function josa(n, withFinal, without) {
  const last = Math.abs(n) % 10
  return `${n}${[2, 4, 5, 9].includes(last) ? without : withFinal}`
}
export const eun = (n) => josa(n, '은', '는')
export const eul = (n) => josa(n, '을', '를')
