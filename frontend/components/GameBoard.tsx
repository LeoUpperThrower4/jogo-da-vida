import React from "react"

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
    ['INICIO', 'VOLTA 1', 'AVANCA 5', '', 'VOLTA 2'],
    ['', 'SORTE OU REVÉS', 'VOLTA 10', '', 'AVANCA 1'],
    ['', '', 'SORTE OU REVÉS', 'AVANCA 1', ''],
    ['VOLTA 1', 'AVANCA 2', '', 'SORTE OU REVÉS', 'SORTE OU REVÉS'],
    ['', '', 'AVANCA 1', 'VOLTA 10', 'FIM'],
  ]

  return (
    <div className="grid grid-cols-5 grid-rows-5 h-full w-full">
      {boardData.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <div 
              key={cellIndex}
              className="flex justify-center items-center border border-gray-500 gap-2 text-center p-2"
            >
              {playersPositions.map((player, playerIndex) => {
                if (player.x === cellIndex && player.y === rowIndex) {
                  return (
                    <div
                      key={playerIndex}
                      className={`w-2 h-2 rounded-full ${paintPlayer(
                        playerIndex
                      )}`}
                    />
                  )
                }
                return null; // Add a return statement for non-matching conditions
              })}
              {cell}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}
