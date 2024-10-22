import { CELL_POSITIONS, TCellId } from "../../constants";
import { mkCellFlags, mkId, TCellFlags } from "../../utils";
import { Piece } from "../piece";


export class Rook extends Piece {

	isValidMove(destination: TCellId): boolean {
		return this.getValidMoves()[destination]
	}

	getValidMoves(): TCellFlags {
		const vectors = [
			// Вперёд
			[1, 0],
			// Назад
			[-1, 0],
			// Вправо
			[0, 1],
			// Влево
			[0, -1],
		]
		return mkCellFlags(this.multiVectorDestinations(vectors).idList)
	}

}
