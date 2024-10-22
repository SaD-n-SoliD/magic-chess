import { CELL_POSITIONS, TCellId } from "../../constants";
import { mkCellFlags, mkId, TCellFlags } from "../../utils";
import { Piece } from "../piece";


export class Queen extends Piece {

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
		return mkCellFlags(this.multiVectorDestinations(vectors).idList)
	}

}
