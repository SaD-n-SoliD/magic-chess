import { CELL_POSITIONS, TCellId } from "../../constants";
import { mkId } from "../../utils";
import { Piece } from "../piece";


export class Pawn extends Piece {

	isValidMove(destination: TCellId): boolean {
		const [row, col] = CELL_POSITIONS[this.cellId]
		const [y, x] = CELL_POSITIONS[destination]
		const dCell = this.cells[destination]
		const vy = this.vy

		if (
			// 1 клетку вперёд
			(x === col && y === row + vy * 1 && dCell.isPassable) ||
			( // 2 клетки вперёд
				x === col && y === row + vy * 2 && this.isFirstMove &&
				dCell.isPassable && this.cells[mkId(y - vy, x)].isPassable
			) ||
			// Съесть налево/направо
			((x + 1 === col || x - 1 === col) && y === row + vy * 1 && dCell.isBeatable)
		) return true

		return false
	}

	// todo Сделать превращение
}
