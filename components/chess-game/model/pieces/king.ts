import { TCellId } from "../../constants";
import { mkCellFlags, mkCellId, T2DVector, TCellFlags } from "../../utils";
import { Piece, TPieceAttack, TPieceMoves, TValidMoves } from "../piece";


export class King extends Piece {

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
		range: 1,
	}))

	computeValidMoves(): TValidMoves {
		return [this.multiVectorDestinations(this.attackOptions).moves]
	}
	// todo Нельзя ходить под шах (по идее это ответственность GameField)
	// todo Нельзя своим ходом подставлять короля под удар
	// todo Рокировка (нельзя делать рокировку через битое поле)

}
