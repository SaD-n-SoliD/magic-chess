import { TCellId } from "../../constants";
import { getCellPosition, mkCellFlags, mkCellId, T2DVector, TCellFlags } from "../../utils";
import { Piece, TPieceAttack, TPieceMoves, TValidMoves } from "../piece";


export class Pawn extends Piece {

	attackVectors: T2DVector[] = [
		// Влево
		[this.vy, -1],
		// Вправо
		[this.vy, 1],
	]

	attackOptions: TPieceAttack[] = this.attackVectors.map((v) => ({
		vector: v,
		range: 1,
	}))

	computeValidMoves(): TValidMoves {
		const vy = this.vy
		const availableMoves: TPieceMoves = []
		const availableAttacks: TPieceMoves = []
		const potentialMoves: TPieceMoves = []
		const potentialAttacks: TPieceMoves = []
		const forward = this.vectorDestinations({ vector: [vy, 0], range: 2, punchThrough: 0 })
		const left = this.vectorDestinations(this.attackOptions[0])
		const right = this.vectorDestinations(this.attackOptions[1])

		availableMoves.push(...forward.moves)

		potentialMoves.push(...forward.potentialMoves, left.moves[0], right.moves[0])

		potentialAttacks.push(left.moves[0], right.moves[0])

		if (left.obstacles[0]?.cell.isBeatable) {
			availableMoves.push(left.moves[0])
			availableAttacks.push(left.moves[0])
		}
		if (right.obstacles[0]?.cell.isBeatable) {
			availableMoves.push(right.moves[0])
			availableAttacks.push(right.moves[0])
		}

		return [availableMoves, availableAttacks, potentialMoves, potentialAttacks]
	}

	// todo Сделать превращение
	// todo Взятие на проходе
}
