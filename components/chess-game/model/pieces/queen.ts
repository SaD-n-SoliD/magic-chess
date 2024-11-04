import { TCellId } from "../../constants";
import { mkCellFlags, mkCellId, T2DVector, TCellFlags } from "../../utils";
import { Piece, TPieceAttack, TPieceMoves, TValidMoves } from "../piece";


export class Queen extends Piece {

	attackVectors: T2DVector[] = [
		// Вертикаль
		[1, 0], [-1, 0],
		// Горизонталь
		[0, 1], [0, -1],
		// Диагонали
		[1, 1], [1, -1],
		[-1, 1], [-1, -1],
	]

	attackOptions: TPieceAttack[] = this.attackVectors.map((v) => ({
		vector: v,
		range: Infinity,
	}))

	computeValidMoves(): TValidMoves {
		return [this.multiVectorDestinations(this.attackOptions).moves]
	}

}
