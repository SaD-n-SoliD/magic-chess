import { TCellId } from "../../constants";
import { mkCellFlags, T2DVector, TCellFlags } from "../../utils";
import { Piece, TPieceAttack, TPieceMoves, TValidMoves } from "../piece";


export class Bishop extends Piece {

	attackVectors: T2DVector[] = [
		// Вниз, вправо
		[1, 1],
		// Вниз, влево
		[1, -1],
		// Вверх, вправо
		[-1, 1],
		// Вверх, влево
		[-1, -1],
	]

	attackOptions: TPieceAttack[] = this.attackVectors.map((v) => ({
		vector: v,
		range: Infinity,
	}))

	computeValidMoves(): TValidMoves {
		return [this.multiVectorDestinations(this.attackOptions).moves]
	}

}
