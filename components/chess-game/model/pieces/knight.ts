import { CELL_POSITIONS, TCellId } from "../../constants";
import { mkCellFlags, TCellFlags } from "../../utils";
import { Piece } from "../piece";


export class Knight extends Piece {

	isValidMove(destination: TCellId): boolean {
		return this.getValidMoves()[destination]
	}

	getValidMoves(): TCellFlags {
		const vectors = [
			// Вперёд
			[2, 1], [2, -1],
			// Вперёд, в сторону
			[1, 2], [1, -2],
			// Назад, в сторону
			[-1, 2], [-1, -2],
			// Назад
			[-2, 1], [-2, -1],
		]
		return mkCellFlags(this.multiVectorDestinations(vectors, 1).idList)

	}
}
