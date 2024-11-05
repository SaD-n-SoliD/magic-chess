import { isEqual } from "lodash-es";
import { FIELD_LENGTH, INITIAL_HIGHLIGHTED_CELLS, MOVE_ORDER, PIECES, TCellId, TSide } from "../constants";
import { getCellPosition, reverseVector, simplifyFraction, TCellFlags, vectorsAreCodirectional } from "../utils";
import { Cell } from "./cell";
import { Piece, TVectorDestinationOptions } from "./piece";
import { King } from "./pieces/king";

export class GameField {
	public cells: Cell[]
	public setGameField: Function
	public moveCounter: number = 0
	public selectedCellId?: TCellId | null
	public highlightedCells: TCellFlags = []
	public availableMoves: TCellFlags = []
	public pieces: Piece[] = []
	public deadPieces: Piece[] = []
	public kings: King[] = []

	constructor(cells: Cell[], setGameField: Function) {
		this.cells = cells
		this.setGameField = setGameField
	}

	init() {
		this.resetHighlighting()
		for (const cell of this.cells) {
			if (!cell.piece) continue
			cell.piece.saveCells(this.cells)
			this.pieces.push(cell.piece)
			if (cell.piece instanceof King) this.kings.push(cell.piece)
		}
		for (const piece of this.pieces) {
			this.updatePieceValidMoves(piece)
		}
	}

	update() {
		const newGameField = new GameField(this.cells, this.setGameField)
		this.setGameField(Object.assign(newGameField, this))
	}

	getCurrentMove() {
		return MOVE_ORDER[this.moveCounter % MOVE_ORDER.length]
	}

	handleCellClick(id: TCellId) {
		// Если ячейка не была выделена до этого, выделяем её
		if (!Number.isInteger(this.selectedCellId)) {
			this.selectCell(id)
		}
		// Если кликнули в ту же ячейку, сбрасываем выделение
		else if (this.selectedCellId === id) {
			this.resetSelection()
		}
		// При потытке сделать невозможный ход выделяем новую ячейку
		else if (!this.availableMoves[id]) {
			this.resetSelection()
			this.selectCell(id)
		}
		// Если ход возможен, делаем его
		else {
			this.movePiece(id)
			this.resetSelection()
			this.moveCounter++
		}

		this.update()
	}

	selectCell(id: TCellId) {
		this.selectedCellId = id
		this.highlightedCells[id] = true
		if (this.cellContainsAllyPiece(id)) this.setAvailableMoves(id)
	}

	setAvailableMoves(id: TCellId) {
		const piece = this.cells[id].piece
		if (!piece) return
		this.availableMoves = piece.availableMoveFlags
	}

	resetSelection() {
		this.resetHighlighting()
		this.selectedCellId = null
		this.availableMoves = []
	}

	resetHighlighting() {
		this.highlightedCells = [...INITIAL_HIGHLIGHTED_CELLS]
	}

	cellContainsAllyPiece(id: TCellId) {
		return this.cells[id].containsPieceOf(this.getCurrentMove())
	}

	getCellsByIds(idList: TCellId[]) {
		return idList.map(id => this.cells[id])
	}

	movePiece(destination: TCellId, origin = this.selectedCellId as TCellId) {
		const [cell, dCell] = this.getCellsByIds([origin, destination])
		if (!cell?.piece) return

		// Перестановка фигуры
		const piece = cell.piece
		cell.piece = null
		if (dCell.piece) this.deletePiece(dCell)
		dCell.piece = piece

		// Обновление данных
		piece.saveCellId(destination)
		this.updateValidMovesByAffectedCells([origin, destination])
		// Если не отслеживать изменение битых полей, доступные королю ходы нужно обновлять всегда
		for (const king of this.kings) {
			debugger
			this.updatePieceValidMoves(king)
		}
	}

	deletePiece(cell: Cell) {
		if (!cell.piece) return
		this.pieces = this.pieces.filter((p) => p !== cell.piece)
		this.deadPieces.push(cell.piece)
		cell.piece = null
	}

	// Обновляет доступные для хода ячейки каждой фигуры, если эти ячейки пересекаются с idList
	// idList - массив id'шников всех затронутых ячеек, изменения в которых приведут к изменению доступных ходов какой-либо фигуры
	updateValidMovesByAffectedCells(idList: TCellId[]) {
		debugger
		for (const piece of this.pieces) {
			for (const id of idList) {
				if (piece.isPotentialMove(id)) {
					this.updatePieceValidMoves(piece)
					break
				}
			}
		}
	}

	// todo Ходы под шахом 
	updatePieceValidMoves(piece: Piece) {
		piece.updateValidMoves((moves) => {
			const allyKing = this.kings.find(k => k.side === piece.side)
			if (!allyKing) throw new Error("Ошибка обновления возможных ходов: Короля нет на поле");
			debugger

			const checkKingSafety = allyKing === piece ?
				this.mkMoveValidator.isValidKingMove(allyKing) :
				this.mkMoveValidator.kingRemainsSafe(piece, allyKing);

			return moves.filter((cellId) => {
				// Нельзя атаковать союзников
				if (piece.sideMatchesWith(cellId)) return false

				return checkKingSafety(cellId)
			})
		})
	}

	mkMoveValidator = {
		// Может ли король пойти на клетку destination? (true : false)
		isValidKingMove: (king: King) => {
			return (destination: TCellId) => {
				for (const piece of this.pieces) {
					// Союзные фигуры не станут атаковать короля
					if (piece.side === king.side) continue
					// Если поле под боем, туда нельзя ходить
					if (piece.isPotentialAttack(destination)) return false
				}
				// Поле не под боем
				return true
			}
		},

		// Останется ли король в безопасности после хода союзной фигуры? (true : false)
		kingRemainsSafe: (piece: Piece, king: King) => {
			const [y, x] = getCellPosition(piece.cellId)
			const [ky, kx] = getCellPosition(king.cellId)
			const shortedKingVector = simplifyFraction([y - ky, x - kx])
			const dOptions = { vector: shortedKingVector, range: Infinity, punchThrough: 2 }
			const kvd = king.vectorDestinations(dOptions)

			return (destination: TCellId) => {
				debugger

				const [dy, dx] = getCellPosition(destination)
				const isKingVectorChanged = !vectorsAreCodirectional(shortedKingVector, [dy - ky, dx - kx])
				// ПРИМЕЧАНИЕ: Работает, пока фигуры не могут перепрыгивать через препятствия вдоль своего вектора (Конь не может, он перепрыгивает не пункты своего вектора)
				// Если вектор от короля не изменился, фигура всё ещё прикрывает короля со своего направления
				if (!isKingVectorChanged) return true

				// Если текущая фигура - не первое препятствие на пути к королю, то первое в любом случае защитит короля
				if (kvd.obstacles[0]?.id !== piece.cellId) return true

				// Если второе препятствие - союзная фигура (тогда второе препятствие защитит{не будет нас атаковать}, если убрать нашу фигуру с первого)
				if (kvd.obstacles[1]?.cell?.containsPieceOf(king.side)) return true

				const secondObstaclePiece = kvd.obstacles[1]?.cell?.piece
				const dangerousAttack = secondObstaclePiece?.attackOptions
					?.find((a) => isEqual(shortedKingVector, reverseVector(a.vector)))
				// Если второе препятствие (фигура) от короля вдоль вектора не способна атаковать вдоль данного вектора, то король король будет в безопасности после хода
				if (!dangerousAttack) return true

				const pseudoAttack = { ...dangerousAttack, punchThrough: 2 }
				const pseudoTarget = secondObstaclePiece?.vectorDestinations(pseudoAttack).obstacles[1]?.cell?.piece

				// Если второе препятствие (вражеская фигура) способна атаковать в данном направлении, но не достаёт до короля (даже если убрать текущую фигуру) 
				// true : false
				return (pseudoTarget !== king)
			}
		}
	}



}