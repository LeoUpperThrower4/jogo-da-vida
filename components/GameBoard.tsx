interface PlayerPosition {
  id: string
  x: number
  y: number
}

interface BoardProps {
  playersPositions: PlayerPosition[]
}

function paintPlayer(playerIndex: number) {
  if (playerIndex === 0) return 'bg-blue-500'
  if (playerIndex === 1) return 'bg-red-500'
  if (playerIndex === 2) return 'bg-green-500'
}

export default function Board({ playersPositions }: BoardProps) {
  const boardData = [
    ['INICIO', 'VOLTA_', '', '', 'VOLTA_2'],
    ['', 'SORTE_REVES', 'GANHA_100', '', 'AVANCA_1'],
    ['', '', 'SORTE_REVES', 'PERDE_100', ''],
    ['VOLTA_1', 'PERDE_100', '', 'SORTE_REVES', 'SORTE_REVES'],
    ['', '', 'PERDE_100', 'VOLTA_1', 'FIM'],
  ]

  return (
    <>
      <div className="grid grid-cols-5 h-full w-full">
        {boardData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-rows-5">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="flex items-center justify-center border">
                {playersPositions.map((playerPosition, playerIndex) => {
                  if (playerPosition.x === cellIndex && playerPosition.y === rowIndex) {
                    return (<div key={playerIndex} className={`w-2 h-2 rounded-full ${paintPlayer(playerIndex)}`} />)
                  }
                })
                }
                {boardData[rowIndex][cellIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
