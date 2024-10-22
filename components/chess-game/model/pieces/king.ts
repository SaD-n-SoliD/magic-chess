import { CELL_POSITIONS, TCellId } from "../../constants";
import { mkCellFlags, mkId, TCellFlags } from "../../utils";
import { Piece } from "../piece";


export class King extends Piece {

	isValidMove(destination: TCellId): boolean {
		return this.getValidMoves()[destination]
	}

	getValidMoves(): TCellFlags {
		const vectors = [
			// Вертикаль
			[1, 0], [-1, 0],
			// Горизонталь
			[0, 1], [0, -1],
			// Диагонали
			[1, 1], [1, -1],
			[-1, 1], [-1, -1],
		]
		// todo Нельзя ходить под шах и на битое поле (по идее это ответственность GameField)
		// todo Рокировка (по идее тоже GameField) (нельзя делать рокировку через битое поле)
		return mkCellFlags(this.multiVectorDestinations(vectors, 1).idList)
	}

}
