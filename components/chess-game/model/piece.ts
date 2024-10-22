import { DeepPartial } from "@/utils/types/deep-partial"
import { CELL_POSITIONS, FIELD_HEIGHT, FIELD_LENGTH, SIDES, TCellId, TCol, TPieceType, TRow, TSide } from "../constants"
import { Cell } from "./cell"
import { TCellFlags } from "../utils"

//? todo Добавить id в piece (constants, формат сообщения от сервера?)
export type TPiece = {
	side: TSide
	type: TPieceType
	hp?: number
	atk?: number
	armor?: number
}

export type TPiecePart = DeepPartial<TPiece>

export type TUnitVector = 1 | 0 | -1
export type TVector = number[]

export type TVectorDestinations = {
	idList: TCellId[]
	obstacle: null | {
		pos: [TRow, TCol]
		id: TCellId
		cell: Cell
	}
}

export type TMultiVectorDestinations = {
	idList: TCellId[]
	data: TVectorDestinations[]
}

export interface Piece extends TPiece { }

export abstract class Piece {
	//? todo Статистика (кол-во ходов, кого и сколько съела фигура, ...)
	// todo Менять на false при первом ходе фигуры
	public isFirstMove = true
	// Единичный вектор направления (вдоль y), зависящий от цвета (side)
	public vy = 0
	public cells: Cell[] = []
	public cellId: TCellId

	constructor(piece: TPiece, cellId: TCellId) {
		Object.assign(this, piece)
		this.cellId = cellId

		if (piece.side === SIDES.white) this.vy = -1
		else if (piece.side === SIDES.black) this.vy = 1
	}

	//! Вызывать при изменении сслыки на cells
	saveCells(cells: Cell[]) {
		this.cells = cells
	}
	//! Вызывать при перемещении фигуры
	saveCellId(cellId: TCellId) {
		this.cellId = cellId
	}

	isValidMove(destination: TCellId) {
		return false
	}

	getValidMoves(): TCellFlags {

		const validMoves: TCellFlags = {}
		for (const id of this.cells.keys()) {
			validMoves[id] = this.isValidMove(id)
		}
		return validMoves
	}

	// Соберёт id'шники всех ячеек, которые оказались свободными вдоль указанных направлений (векторов)
	// Также соберёт отдельно информацию по каждому из направлений, включая первое встреченное препятствие
	multiVectorDestinations(vectors: TVector[], steps: number[] | number = Infinity)
		: TMultiVectorDestinations {

		const vSteps = (() => {
			if (Array.isArray(steps))
				return steps
			else
				return vectors.map(_ => steps)
		})()

		const res: TMultiVectorDestinations = {
			idList: [],
			data: [],
		}

		for (const [i, vector] of vectors.entries()) {
			const vd = this.vectorDestinations(vector, vSteps[i])
			res.data.push(vd)
			res.idList.push(...vd.idList)
		}
		return res
	}

	// Соберёт id'шники всех ячеек, которые оказались свободными вдоль указанного направления (вектора)
	// Про встрече с объектом, который вохможно атаковать: останавливаем продвижение, но не считаем этот объект препятствием
	// Начинаем с текущей ячейки (this.cellId)
	// Размер шага вдоль вектора зависит от самого вектора. [dy, dx]
	// Также найдёт id и pos первого встреченного препятствия (obstacle)
	// Если препятствий не нашлось, obstacle === null
	vectorDestinations(direction: TVector, steps = Infinity): TVectorDestinations {
		//! Формат вектора
		const [dy, dx] = direction
		if (!dx && !dy) throw new Error("Вектор [0, 0] не подходит");

		let [row, col] = CELL_POSITIONS[this.cellId]
		let dest: TCellId[] = []

		col += dx
		row += dy

		let id = row * FIELD_LENGTH + col

		const mkRes = (isPassible: boolean): TVectorDestinations => ({
			idList: dest,
			obstacle: isPassible ? null : {
				pos: [row, col],
				id,
				cell: this.cells[id],
			}
		})

		let counter = 0

		while (counter < steps && row >= 0 && row < FIELD_HEIGHT && col >= 0 && col < FIELD_LENGTH) {
			// Если в ячейке есть нечто, что можно атаковать, то не считаем это за препятствие, но останавливаем продвижение
			if (this.cells[id].isBeatable) {
				dest.push(id)
				return mkRes(true)
			}
			// Если ячейка непроходима, то мы закончили
			if (!this.cells[id].isPassable) return mkRes(false)
			dest.push(id)
			col += dx
			row += dy
			id = row * FIELD_LENGTH + col
			counter++
		}
		// Нет препятствий до границы поля или до границы проверки (steps)
		return mkRes(true)
	}

}



