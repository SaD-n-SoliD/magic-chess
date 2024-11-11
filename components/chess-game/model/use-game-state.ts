import { useEffect, useState } from "react"
import { INITIAL_CELLS, INITIAL_HIGHLIGHTED_CELLS, MOVE_ORDER, SIDES, TCellId, TSide } from "../constants"
import { GameField } from "./game-field"


type params = null | {}

type TGameState = {
	gameField: GameField
}

export function useGameState(_: params) {

	const [gameState, setGameState] = useState<TGameState>(initGameState)
	const { gameField } = gameState

	// Загружаем и устанавливаем данные с сервера
	// useEffect(() => {
	// 	const newState = ..
	// 	setGameState(newState)
	// }, [])

	const { currentMove, cells, availableMoves, highlightedCells, isCheck, isCheckmate } = gameField

	return {
		currentMove,
		cells,
		availableMoves,
		highlightedCells,
		isCheck,
		isCheckmate,
		onClickGameField,
		onBlur,
	} as const


	function initGameState() {
		return ({
			gameField: new GameField(INITIAL_CELLS, refreshGameState)
		})
	}

	function refreshGameState() {
		setGameState(state => ({ ...state }))
	}

	function onClickGameField(e: React.MouseEvent) {
		if (!(e.target instanceof HTMLElement)) return
		const cellId = Number((e.target.closest('.GameCell') as HTMLElement)?.dataset?.id) as TCellId
		if (Number.isNaN(cellId)) return

		gameField.handleCellClick(cellId)
	}

	function onBlur(e: React.FocusEvent) {
		// В dev моде эта функция мешает, т.к. при открытии chrome dev tools фокус пропадает с поля
		if (process.env.NODE_ENV === 'development') return

		if (e.currentTarget.contains(e.relatedTarget)) return
		gameField.resetSelection()
		gameField.update()
	}
}

