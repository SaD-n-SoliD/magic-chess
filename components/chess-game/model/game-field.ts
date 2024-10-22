import { FIELD_LENGTH, MOVE_ORDER, TCellId, TSide } from "../constants";
import { TCellFlags } from "../utils";
import { Cell } from "./cell";

export class GameField {
	public cells: Cell[]
	public setGameField: Function
	public currentMove: TSide = MOVE_ORDER[0]
	public selectedCellId?: TCellId | null
	public availableMoves: TCellFlags = {}

	constructor(cells: Cell[], setGameField: Function) {
		this.cells = cells
		this.setGameField = setGameField
		for (const cell of cells) {
			cell.piece?.saveCells(cells)
		}
	}

	update() {
		const newGameField = new GameField(this.cells, this.setGameField)
		this.setGameField(Object.assign(newGameField, this))
	}

	handleCellClick(id: TCellId) {
		// Если ячейка не была выделена до этого, выделяем её
		if (!Number.isInteger(this.selectedCellId)) {
			this.selectCell(id)
		}
		// Если кликнули в ту же ячейку, сбрасываем выделение
		else if (this.selectedCellId === id) {
			this.resetSelection()
		}
		// При потытке сделать невозможный ход выделяем новую ячейку
		else if (!this.availableMoves[id]) {
			this.resetSelection()
			this.selectCell(id)
		}
		// Если ход возможен, делаем его
		else {
			this.movePieceTo(id)
			this.resetSelection()
		}

		this.update()
	}

	selectCell(id: TCellId) {
		this.selectedCellId = id
		if (this.cellContainsAllyPiece(id)) this.setAvailableMoves(id)
	}

	setAvailableMoves(id: TCellId) {
		const piece = this.cells[id].piece
		if (!piece) return
		this.availableMoves = Object.entries(piece.getValidMoves())
			.map(([cellId, v]) => v && !this.cellContainsAllyPiece(+cellId))
	}

	resetSelection() {
		this.selectedCellId = null
		this.availableMoves = {}
	}

	cellContainsAllyPiece(id: TCellId) {
		return this.cells[id].containsPieceOf(this.currentMove)
	}

	movePieceTo(destination: TCellId) {
		if (!Number.isInteger(this.selectedCellId)) return
		const selectedCell = this.cells[this.selectedCellId as TCellId]
		if (!selectedCell.piece) return

		const piece = selectedCell.piece
		selectedCell.piece = null
		this.cells[destination].piece = piece

		piece.saveCellId(destination)
	}
}