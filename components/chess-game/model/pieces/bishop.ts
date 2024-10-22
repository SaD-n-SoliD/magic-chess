import { CELL_POSITIONS, TCellId } from "../../constants";
import { mkCellFlags, TCellFlags } from "../../utils";
import { Piece } from "../piece";


export class Bishop extends Piece {

	isValidMove(destination: TCellId): boolean {
		return this.getValidMoves()[destination]
	}

	getValidMoves(): TCellFlags {
		const vectors = [
			// Вперёд, вправо
			[1, 1],
			// Вперёд, влево
			[1, -1],
			// Назад, вправо
			[-1, 1],
			// Назад, влево
			[-1, -1],
		]
		return mkCellFlags(this.multiVectorDestinations(vectors).idList)
	}

}
