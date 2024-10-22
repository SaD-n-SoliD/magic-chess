import { useEffect, useState } from "react"
import { INITIAL_CELLS, INITIAL_HIGHLIGHTED_CELLS, MOVE_ORDER, SIDES, TCellId, TSide } from "../constants"
import { GameField } from "./game-field"


type params = null | {

}

export function useGameState(_: params) {

	const [highlightedCells, setHighlightedCells] =
		useState<boolean[]>(INITIAL_HIGHLIGHTED_CELLS)

	// // Id ячейки, содержащей фигуру, которую выбрал пользователь для хода
	// const [selectedPiece, setSelectedPiece] = useState<TCellId | null>(null)

	const [gameField, setGameField] = useState<GameField>()

	// Инициализация и установка игрового поля
	useEffect(() => {
		const gameField = new GameField(INITIAL_CELLS, setGameField)
		setGameField(gameField)
	}, [])

	return {
		currentMove: gameField?.currentMove,
		cells: gameField?.cells || [],
		availableMoves: gameField?.availableMoves || [],
		highlightedCells,
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

