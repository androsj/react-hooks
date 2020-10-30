// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useLocalStorageState} from '../utils'

// function getInitialSquares() {
//   return Array(9).fill(null)
// }

function Board({squares, onClick}) {
  // function Board() {
  // const [squares, setSquares] = React.useState(getInitialSquares)
  // const [squares, setSquares] = useLocalStorageState(
  //   'ticTacToeSquares',
  //   getInitialSquares,
  // )

  // const nextValue = calculateNextValue(squares)
  // const winner = calculateWinner(squares)
  // const status = calculateStatus(winner, squares, nextValue)

  // function selectSquare(square) {
  //   if (winner || squares[square]) return

  //   const newSquares = [...squares]
  //   newSquares[square] = nextValue
  //   setSquares(newSquares)
  // }

  // function restart() {
  //   setSquares(getInitialSquares())
  // }

  function renderSquare(i) {
    return (
      // <button className="square" onClick={() => selectSquare(i)}>
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* <div className="status">{status}</div> */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {/* <button className="restart" onClick={restart}>
        restart
      </button> */}
    </div>
  )
}

// function Game() {
//   return (
//     <div className="game">
//       <div className="game-board">
//         <Board />
//       </div>
//     </div>
//   )
// }

// extra 3
function useTicTacToeMeta(squares) {
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)
  return {nextValue, winner, status}
}

function getInitialGameHistory() {
  return [Array(9).fill(null)]
}

function Game() {
  const [gameHistory, setGameHistory] = useLocalStorageState(
    'tic-tac-toe:history',
    getInitialGameHistory,
  )
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    0,
  )
  const currentSquares = gameHistory[currentStep]
  const {winner, status, nextValue} = useTicTacToeMeta(currentSquares)

  function selectSquare(square) {
    if (winner || currentSquares[square]) return

    const newSquares = [...currentSquares]
    newSquares[square] = nextValue

    const nextStep = currentStep + 1
    // Remove any obsolete moves
    // NOTE: slice returns a new array (easier than using splice)
    const newGameHistory = gameHistory.slice(0, nextStep)
    // Save move
    newGameHistory[nextStep] = newSquares
    setGameHistory(newGameHistory)
    setCurrentStep(prev => prev + 1)
  }

  function restart() {
    setGameHistory(getInitialGameHistory())
    setCurrentStep(0)
  }

  const moves = gameHistory.map((_, step) => {
    const text = step ? `Go to move #${step}` : 'Go to game start'
    const isCurrentStep = step === currentStep
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {text} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
