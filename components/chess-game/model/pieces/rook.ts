import { TCellId } from "../../constants";
import { mkCellFlags, mkCellId, T2DVector, TCellFlags } from "../../utils";
import { Piece, TPieceAttack, TPieceMoves, TValidMoves } from "../piece";


export class Rook extends Piece {

	attackVectors: T2DVector[] = [
		// Вниз
		[1, 0],
		// Вверх
		[-1, 0],
		// Вправо
		[0, 1],
		// Влево
		[0, -1],
	]

	attackOptions: TPieceAttack[] = this.attackVectors.map((v) => ({
		vector: v,
		range: Infinity,
	}))

	computeValidMoves(): TValidMoves {
		return [this.multiVectorDestinations(this.attackOptions).moves]
	}

}
