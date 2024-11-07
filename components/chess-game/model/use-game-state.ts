import { useEffect, useState } from "react"
import { INITIAL_CELLS, INITIAL_HIGHLIGHTED_CELLS, MOVE_ORDER, SIDES, TCellId, TSide } from "../constants"
import { GameField } from "./game-field"


type params = null | {

}

export function useGameState(_: params) {

	const [gameField, setGameField] = useState<GameField>()

	// Инициализация и установка игрового поля
	useEffect(() => {
		const gameField = new GameField(INITIAL_CELLS, setGameField)
		gameField.init()
		setGameField(gameField)
	}, [])

	return {
		currentMove: gameField?.getCurrentMove(),
		cells: gameField?.cells || [],
		availableMoves: gameField?.availableMoves || [],
		highlightedCells: gameField?.highlightedCells || [],
		isCheck: gameField?.isCheck,
		isCheckmate: gameField?.isCheckmate,
		onClickGameField,
		onBlur,
	} as const


	function onClickGameField(e: React.MouseEvent) {
		if (!(e.target instanceof HTMLElement)) return
		const cellId = Number((e.target.closest('.GameCell') as HTMLElement)?.dataset?.id) as TCellId
		if (Number.isNaN(cellId)) return

		gameField?.handleCellClick(cellId)
	}

	// todo Включить
	function onBlur(e: React.FocusEvent) {
		// if (e.currentTarget.contains(e.relatedTarget)) return
		// gameField?.resetSelection()
		// gameField?.update()
	}
}

