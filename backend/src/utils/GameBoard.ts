// Variável que representa o tabuleiro
const boardData = [
  ['INICIO', 'VOLTA_1', 'AVANCA_5', '', 'VOLTA_2'],
  ['', 'VOLTA_3', 'VOLTA_10', '', 'AVANCA_1'],
  ['', '', 'AVANCA_5', 'AVANCA_1', ''],
  ['VOLTA_1', 'AVANCA_2', '', 'AVANCA_2', 'VOLTA_2'],
  ['', '', 'AVANCA_1', 'VOLTA_10', 'FIM'],
]

// Funções usadas para calcular as novas posições após lançamentos de dados e ou alterações no tabuleiro
function getSum(actionValue: string, x: number, y: number) {
  let outX = x + parseInt(actionValue)
  let outY = y
  while (outX > 4) {
    outY = outY + 1
    outX = outX - 5
  }
  return { outX, outY }
}

function getSub(actionValue: string, x: number, y: number) {
  let outX = x - parseInt(actionValue)
  let outY = y
  while (outX < 0) {
    outY = outY - 1
    outX = outX + 5
  }
  return { outX, outY }
}

function rollDice(x: number, y: number, diceValue: number) {
  let newX = x + diceValue
  let newY = y
  while (newX > 4) {
    newY = newY + 1
    if (newY > 4) return { newX: 4, newY: 4 }
    newX = newX - 5
  }
  return { newX, newY }
}

export function getNewXY(
  x: number,
  y: number,
  diceValue: number,
): { outX: number; outY: number } {
  const { newX, newY } = rollDice(x, y, diceValue)
  if (newX === 4 && newY === 4) return { outX: 4, outY: 4 }
  console.log(
    `\n-------------------------\n\nPosição atual: ${x} ${y}\nRolagem do dado: ${diceValue}`,
  )
  const action = boardData[newY][newX]
  const splittedAction = action.split('_')
  const actionType = splittedAction[0]
  const actionValue = splittedAction[1]
  console.log(
    `\nNova posição: ${newX} ${newY}\nAção: ${actionType} ${actionValue}\n\n`,
  )
  let resultXY
  switch (actionType) {
    case 'AVANCA':
      console.log('Avança')
      resultXY = getSum(actionValue, newX, newY)
      break
    case 'VOLTA':
      console.log('Volta')
      resultXY = getSub(actionValue, newX, newY)
      break
    default:
      resultXY = { outX: newX, outY: newY }
      break
  }
  resultXY.outX = resultXY.outX < 0 ? 0 : resultXY.outX
  resultXY.outY = resultXY.outY < 0 ? 0 : resultXY.outY
  console.log(`Posição final: ${resultXY.outX} ${resultXY.outY}`)
  return resultXY
}
