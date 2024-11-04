import { TCellId } from "../../constants";
import { mkCellFlags, T2DVector, TCellFlags } from "../../utils";
import { Piece, TPieceAttack, TPieceMoves, TValidMoves } from "../piece";


export class Knight extends Piece {

	attackVectors: T2DVector[] = [
		// Вниз
		[2, 1], [2, -1],
		// Вниз, в сторону
		[1, 2], [1, -2],
		// Вверх, в сторону
		[-1, 2], [-1, -2],
		// Вверх
		[-2, 1], [-2, -1],
	]

	attackOptions: TPieceAttack[] = this.attackVectors.map((v) => ({
		vector: v,
		range: 1,
	}))

	computeValidMoves(): TValidMoves {
		return [this.multiVectorDestinations(this.attackOptions).moves]
	}
}
