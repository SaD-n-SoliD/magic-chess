import { isEqual } from "lodash-es";
import { FIELD_LENGTH, INITIAL_HIGHLIGHTED_CELLS, MOVE_ORDER, PIECES, TCellId, TSide } from "../constants";
import { getCellPosition, pointBelongsToLineSegment, reverseVector, simplifyFraction, TCellFlags, vectorsAreCodirectional } from "../utils";
import { Cell } from "./cell";
import { Piece, TVectorDestinationOptions } from "./piece";
import { King } from "./pieces/king";

export class GameField {
	public cells: Cell[]
	public update: Function
	public moveCounter: number = 0
	public selectedCellId?: TCellId | null
	public highlightedCells: TCellFlags = []
	public availableMoves: TCellFlags = []
	public pieces: Piece[] = []
	public deadPieces: Piece[] = []
	public kings: King[] = []
	public isCheck: boolean = false
	public isDoubleCheck: boolean = false
	public isCheckmate: boolean = false
	public checkDetails?: {
		king: King
		attacker: Piece
		validMoveExists?: boolean
	}

	constructor(cells: Cell[], update: Function) {
		this.cells = cells
		this.update = update
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

	get currentMove() {
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
		// todo Проверка на isGameFinished вместо isCheckmate
		// При потытке сделать невозможный ход выделяем новую ячейку
		else if (!this.availableMoves[id] || this.isCheckmate) {
			this.resetSelection()
			this.selectCell(id)
		}
		// Если ход возможен, делаем его
		else {
			this.movePiece(id)
			this.resetSelection()
			this.moveCounter++
			// todo Метод finish, который завершает игру (с исходами win: player.side, draw)
			// Если объявлен шах и нет безопасных ходов, то объявляем мат
			if (this.isCheck && !this.checkDetails?.validMoveExists)
				this.checkmate()
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
		const blockMoves = this.isDoubleCheck && !(piece instanceof King)

		this.availableMoves = blockMoves ?
			piece.availableMoveFlags.map(_ => false) :
			piece.availableMoveFlags;
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
		return this.cells[id].containsPieceOf(this.currentMove)
	}

	movePiece(destination: TCellId, origin = this.selectedCellId as TCellId) {
		const [cell, dCell] = [origin, destination].map(id => this.cells[id])
		if (!cell?.piece) return

		// Перестановка фигуры
		const piece = cell.piece
		cell.piece = null
		if (dCell.piece) this.deletePiece(dCell)
		dCell.piece = piece

		// Обновление данных
		piece.saveCellId(destination)
		this.updateValidMoves()
		// this.optimizedUpdateValidMoves(piece, [origin, destination])
	}

	deletePiece(cell: Cell) {
		if (!cell.piece) return
		const index = this.pieces.findIndex((p) => p === cell.piece)
		this.pieces.splice(index, 1)
		this.deadPieces.push(cell.piece)
		cell.piece = null
	}

	clearCheck() {
		this.isCheck = this.isDoubleCheck = false
		delete this.checkDetails
	}

	checkmate() {
		this.isCheckmate = true
	}

	// Шах, двойной шах
	setSpecialGameStates() {
		for (const king of this.kings) {
			const attackers = this.mkMoveValidator.findCellAttackers(king.side)(king.cellId)

			if (attackers.length > 1)
				this.isDoubleCheck = true

			if (attackers.length) {
				this.isCheck = true
				this.checkDetails = { king, attacker: attackers[0] }
				break
			}
		}
	}

	// Обновляет доступные ходы всех фигур
	updateValidMoves() {
		this.clearCheck()

		for (const cPiece of this.pieces) {
			this.updatePieceValidMoves(cPiece)
		}

		this.setSpecialGameStates()
		// Если шах, пересчитываем ходы. Если двойной шах, нет смысла пересчитывать
		if (this.isCheck && !this.isDoubleCheck) {
			for (const cPiece of this.pieces) {
				this.updatePieceValidMoves(cPiece)
			}
		}

		// Ходы королей должны обновляться исключительно после всех остальных
		for (const king of this.kings) {
			this.updatePieceValidMoves(king)
		}
	}

	//* ПРИМЕЧАНИЕ: не работает в полной мере
	// Если делать оптимизацию, появляется проблема освобождения фигуры от связки при перекрытии связки другой фигурой. можно попробовать отслеживать все поля вдоль связки, двже если она сейчас неактивна (?)
	// Обновляет доступные ходы тех фигур, которым это необходимо
	optimizedUpdateValidMoves(piece: Piece, [origin, destination]: TCellId[]) {
		if (piece instanceof King) {
			// Обновление доступных ходов после хода короля (освобождение фигур из-под связки и попадание под новые связки вынуждает обновлять все союзные фигуры)
			for (const cPiece of this.pieces) {
				if (cPiece.side === piece.side) {
					this.updatePieceValidMoves(cPiece)
				}
			}
		} else {
			this.updateValidMovesByAffectedCells([origin, destination])
			// Доступные королю ходы нужно обновлять всегда, если не отслеживать изменение битых полей 
			for (const king of this.kings) {
				this.updatePieceValidMoves(king)
			}
		}
	}

	// Обновляет доступные для хода ячейки каждой фигуры, если эти ячейки пересекаются с idList
	// idList - массив id'шников всех затронутых ячеек, изменения в которых приведут к изменению доступных ходов какой-либо фигуры
	updateValidMovesByAffectedCells(idList: TCellId[]) {
		for (const piece of this.pieces) {
			for (const id of idList) {
				if (piece.isPotentialMove(id)) {
					this.updatePieceValidMoves(piece)
					break
				}
			}
		}
	}

	// todo Ничья в случае повторения позиции 3 раза
	// todo Пат
	// todo Ничья в случае 50 ходов без взятий и ходов пешек
	updatePieceValidMoves(piece: Piece) {
		piece.updateValidMoves((moves) => {
			const allyKing = this.kings.find(k => k.side === piece.side)
			if (!allyKing) throw new Error("Ошибка обновления возможных ходов: Короля нет на поле");
			// debugger

			const checkKingSafety = allyKing === piece ?
				this.mkMoveValidator.isSafeCell(allyKing.side) :
				this.mkMoveValidator.kingRemainsSafe(piece, allyKing);

			const moveDefendsKing = allyKing === piece ?
				() => true :
				this.mkMoveValidator.moveDefendsKing();

			const newMoves = moves.filter((cellId) => {
				// Нельзя атаковать союзников
				if (piece.sideMatchesWith(cellId)) return false

				if (this.isCheck)
					return checkKingSafety(cellId) && moveDefendsKing(cellId)

				return checkKingSafety(cellId)
			})

			const d = this.checkDetails
			// Если объявлен шах и нашёлся возможный ход
			if (d && piece.side === d.king.side && newMoves.length)
				d.validMoveExists = true

			return newMoves
		})
	}

	//* Если mkMoveValidator сделать свойством, ссылка this.pieces указывает на старый массив!!! (видимо дело было в сохранении старой сслыки и смене ссылки на массив)
	get mkMoveValidator() {
		return {
			// Безопасная клетка? (true : false)
			isSafeCell: (allySide: TSide) => {
				return (destination: TCellId) => {
					debugger
					for (const piece of this.pieces) {
						// Союзные фигуры не учитываем
						if (piece.side === allySide) continue
						// Поле под боем
						if (piece.potentiallyAttacks(destination)) return false
					}
					// Поле не под боем
					return true
				}
			},

			// Находит все не союзные фигуры, которые могут атаковать данную клетку
			findCellAttackers: (allySide: TSide) => {
				return (destination: TCellId) => {
					debugger
					const attackers = []
					for (const piece of this.pieces) {
						// Союзные фигуры не учитываем
						if (piece.side === allySide) continue
						// Поле под боем
						if (piece.potentiallyAttacks(destination)) attackers.push(piece)
					}
					return attackers
				}
			},

			// Защитит ли короля текущий ход? (true : false)
			moveDefendsKing: () => {
				if (!this.checkDetails) return () => true
				const { attacker, king } = this.checkDetails
				const [a, b] = [attacker.cellId, king.cellId].map(getCellPosition)

				return (destination: TCellId) => {
					const p = getCellPosition(destination)
					return pointBelongsToLineSegment(a, b, p)
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



}