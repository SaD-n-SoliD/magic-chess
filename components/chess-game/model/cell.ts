import { TCellId, TPieceType, TSide } from "../constants"
import isEqual from "lodash-es/isEqual"
import { Piece, TPiece, TPiecePart } from "./piece"

export type TCell = {
	id: TCellId
	piece: null | Piece
	object: null | {

	}
}

type TCheckPiece = (piece: Piece) => boolean

export interface Cell extends TCell { }
// Класс ячейки шахматного поля
export class Cell {
	constructor(cell: TCell) {
		Object.assign(this, cell)
	}
	// Проверяет ячейку на наличие фигуры указанной стороны (игрока)
	containsPieceOf(playerSide: TSide) {
		return this.piece?.side === playerSide
	}
	// Проверяет ячейку на наличие подходящей фигуры
	// При вызове без аргументов вернёт true при наличии любой фигуры в ячейке
	containsPiece(arg1: TPiecePart | TCheckPiece = {}): boolean {
		if (typeof arg1 === 'object') {
			return this.containsShapedPiece(arg1)
		} else if (typeof arg1 === 'function') {
			return this.containsSuitablePiece(arg1)
		}
		else throw new Error("Неверные входные данные");
	}
	// Проверяет поля объекта фигуры на соответствие переданной форме
	// Если передать пустой объект, то вернёт true при наличии любой фигуры в ячейке
	containsShapedPiece(shape: TPiecePart): boolean {
		if (!this.piece) return shape === this.piece

		const piecePart = Object.create(shape)
		for (const k in shape) {
			const key = k as keyof TPiece
			piecePart[key] = this.piece[key]
		}

		return isEqual(piecePart, shape)
	}
	// Проверяет ячейку на наличие подходящей фигуры с помощью переданной функции
	containsSuitablePiece(check: TCheckPiece): boolean {
		return !!this.piece && check(this.piece)
	}

	// Проверка на возможность пройти сквозь ячейку
	get isPassable() {
		return !this.piece && !this.object
	}
	// Проверка на возможность атаковать содержимое ячейки
	// Не учитывает цвет (сторону) фигуры. Это ответственность GameField
	get isBeatable() {
		return !!this.piece
	}

	// Непреодолимое препятствие
	get isUnreachable() {
		return !this.isPassable && !this.isBeatable
	}
}


