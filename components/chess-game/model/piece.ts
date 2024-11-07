import { DeepPartial } from "@/utils/types/deep-partial"
import { FIELD_HEIGHT, FIELD_LENGTH, SIDES, TCellId, TCol, TPieceType, TRow, TSide } from "../constants"
import { Cell } from "./cell"
import { getCellPosition, mkCellFlags, T2DVector, TCellFlags, TUnitVector, TVector } from "../utils"

//? todo Добавить id в piece (constants, формат сообщения от сервера?)
export type TPiece = {
	side: TSide
	type: TPieceType
	hp?: number
	atk?: number
	armor?: number
}

export type TPiecePart = DeepPartial<TPiece>

type TObstacle = {
	pos: [TRow, TCol]
	id: TCellId
	cell: Cell
}

export type TVectorDestinations = {
	moves: TPieceMoves
	potentialMoves: TPieceMoves
	obstacles: TObstacle[]
}

export type TMultiVectorDestinations = {
	moves: TPieceMoves
	data: TVectorDestinations[]
}

export type TPieceAttack = {
	vector: T2DVector
	// Дальность атаки в длинах вектора
	range?: number
	// Пронзание навылет
	punchThrough?: number
}

export type TVectorDestinationOptions = {
	vector: T2DVector
	// Дальность атаки в длинах вектора
	range?: number
	// Пронзание навылет
	punchThrough?: number
}

export type TPieceMoves = TCellId[]

export type TValidMoves = [TPieceMoves, TPieceMoves?, TPieceMoves?, TPieceMoves?]

export interface Piece extends TPiece { }

export abstract class Piece {
	//? todo Статистика (кол-во ходов, кого и сколько съела фигура, ...)
	// todo Менять на false при первом ходе фигуры
	public isFirstMove = true
	// Единичный вектор направления (вдоль y), зависящий от цвета (side)
	public vy: TUnitVector = 0
	public cells: Cell[] = []
	public cellId: TCellId
	// Потенциальные ходы, не учитывающие никакие условия кроме наличия препятствий на пути 
	public potentialMoves: TPieceMoves = []
	// Потенциально битые поля
	public potentialAttacks: TPieceMoves = []
	public availableAttacks: TPieceMoves = []
	public availableMoves: TPieceMoves = []
	public availableMoveFlags: TCellFlags = []
	abstract attackOptions: TPieceAttack[]
	// todo Разделить вычисление атак и ходов
	// returns: [validMoves, potentialMoves]
	//* Получение potentialMoves из vectorDestinations().potentialMoves позволит нормально обновлять ранее перекрытые ходы фигур, которые не могут есть в направлении перекрытия
	abstract computeValidMoves(): TValidMoves

	constructor(piece: TPiece, cellId: TCellId) {
		Object.assign(this, piece)
		this.cellId = cellId

		if (piece.side === SIDES.white) this.vy = -1
		else if (piece.side === SIDES.black) this.vy = 1
	}

	//* Вызывать при изменении сслыки на cells
	saveCells(cells: Cell[]) {
		this.cells = cells
	}
	//* Вызывать при перемещении фигуры
	saveCellId(cellId: TCellId) {
		this.cellId = cellId
	}

	sideMatchesWith(cellId: TCellId) {
		const targetPiece = this.cells[cellId].piece
		if (!targetPiece) return false
		return targetPiece.side === this.side
	}

	//* После внешних проверок
	isValidMove(destination: TCellId) {
		return this.availableMoveFlags[destination]
	}

	isCellAttacked(destination: TCellId) {
		return this.availableAttacks.includes(destination)
	}

	isPotentialMove(destination: TCellId) {
		return this.potentialMoves.includes(destination)
	}

	potentiallyAttacks(destination: TCellId) {
		return this.potentialAttacks.includes(destination)
	}
	// todo Сделать понятное разграничение на до/после внешних проверок. Выяснить, что из этого действительно нужно
	updateValidMoves(externalChecks: (arr: TPieceMoves) => TPieceMoves = (d) => (d)) {
		const [moves, attacks, pMoves, pAttacks] = this.computeValidMoves()
		this.availableMoves = moves
		this.availableAttacks = attacks || moves
		this.potentialMoves = pMoves || moves
		this.potentialAttacks = pAttacks || moves
		return this.availableMoveFlags = mkCellFlags(externalChecks(moves))
	}

	// Соберёт id'шники всех ячеек, которые оказались свободными вдоль указанных направлений (векторов)
	// Также соберёт отдельно информацию по каждому из направлений, включая первое встреченное препятствие
	multiVectorDestinations(multiOptions: TVectorDestinationOptions[]): TMultiVectorDestinations {

		const res: TMultiVectorDestinations = {
			moves: [],
			data: [],
		}

		for (const options of multiOptions) {
			const vd = this.vectorDestinations(options)
			res.data.push(vd)
			res.moves.push(...vd.moves)
		}
		return res
	}

	// Соберёт id'шники всех ячеек, которые оказались свободными вдоль указанного направления (вектора)
	// Также соберёт информацию обо всех встреченных препятствиях, учитывая пронзание навылет
	// Начинаем с текущей ячейки(this.cellId) не включая её
	// Размер шага вдоль вектора зависит от самого вектора. [dy, dx]
	vectorDestinations({ vector: [dy, dx], range = Infinity, punchThrough = 1 }: TVectorDestinationOptions): TVectorDestinations {
		if (!dx && !dy) throw new Error("Вектор [0, 0] не подходит");

		let [row, col] = getCellPosition(this.cellId)
		const dest: TCellId[] = []
		const obstacles: TObstacle[] = []

		col += dx
		row += dy

		let id = row * FIELD_LENGTH + col

		const mkRes = (): TVectorDestinations => ({
			moves: dest,
			// Используется при punchThrough = 0 для отслеживания изменений на клетке с препятствием
			potentialMoves: !punchThrough && obstacles.length ? dest.concat(id) : dest,
			obstacles,
		})

		const mkObstacle = (): TObstacle => ({
			pos: [row, col],
			id,
			cell: this.cells[id],
		})

		while (
			dest.length < range &&
			(obstacles.length < punchThrough || punchThrough === 0) &&
			row >= 0 && row < FIELD_HEIGHT &&
			col >= 0 && col < FIELD_LENGTH
		) {
			// Если ячейка содержит препятствие, обновляем препятствия
			if (!this.cells[id].isPassable) {
				obstacles.push(mkObstacle())
				// Если фигура не может бить в этом направлении, выходим (препятствие не попадёт в idList)
				if (punchThrough === 0) break
			}

			// Если ячейка недостижима, выходим (препятствие не попадёт в idList)
			if (this.cells[id].isUnreachable)
				break

			dest.push(id)
			col += dx
			row += dy
			id = row * FIELD_LENGTH + col
		}

		return mkRes()
	}

}



