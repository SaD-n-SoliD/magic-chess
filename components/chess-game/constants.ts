import { StaticImageData } from "next/image";
import avatarSrc1 from "./ui/images/avatar.png";
import avatarSrc2 from "./ui/images/avatar2.png";
import { ValueOf } from "next/dist/shared/lib/constants";
import { Cell, TCell } from "./model/cell";
import { Piece, TPiece } from "./model/piece";
import { capitalize } from "@/utils/capitalize";

// px
export const CELL_SIZE = 75
// cells in row/col
export const FIELD_LENGTH = 8
export const FIELD_HEIGHT = 8
// cells in field
export const FIELD_SIZE = FIELD_LENGTH * FIELD_HEIGHT

export const COL_LABELS = 'abcdefghijklmnopqrstuvwxyz'
// [1, 2, 3, ..]
export const ROW_LABELS = new Array(FIELD_LENGTH).fill(0).map((_, i) => i + 1)

export const MOVE_ORDER: TSide[] = ['white', 'black']

export type TRow = number
export type TCol = number

export const SIDES = {
	black: 'black',
	white: 'white',
} as const

export type TSide = ValueOf<typeof SIDES>
export type TPieceType = ValueOf<typeof PIECES>

export const PIECES = {
	pawn: 'pawn',
	knight: 'knight',
	bishop: 'bishop',
	rook: 'rook',
	queen: 'queen',
	king: 'king',
} as const

export type TPlayerInfo = {
	id: string
	name: string
	rating: number
	avatar: StaticImageData
	side: TSide
}

export const PLAYERS = [
	{
		id: '1',
		name: 'Daniel',
		rating: 1230,
		avatar: avatarSrc1,
		side: SIDES.white
	},
	{
		id: '2',
		name: 'VereIntedinglapotur',
		rating: 850,
		avatar: avatarSrc2,
		side: SIDES.black
	}
] as TPlayerInfo[]

export type TCellId = number
export type TPiecePositions = Record<TCellId, TPieceType>

const INITIAL_BLACK_POSITIONS = {
	0: 'rook', 1: 'knight', 2: 'bishop', 3: 'queen',
	4: 'king', 5: 'bishop', 6: 'knight', 7: 'rook',
	8: 'pawn', 9: 'pawn', 10: 'pawn', 11: 'pawn',
	12: 'pawn', 13: 'pawn', 14: 'pawn', 15: 'pawn',
} as TPiecePositions

const INITIAL_WHITE_POSITIONS = {
	48: 'pawn', 49: 'pawn', 50: 'pawn', 51: 'pawn',
	52: 'pawn', 53: 'pawn', 54: 'pawn', 55: 'pawn',
	56: 'rook', 57: 'knight', 58: 'bishop', 59: 'queen',
	60: 'king', 61: 'bishop', 62: 'knight', 63: 'rook',
} as TPiecePositions

export const INITIAL_POSITIONS: Record<TSide, TPiecePositions> = {
	black: INITIAL_BLACK_POSITIONS,
	white: INITIAL_WHITE_POSITIONS,
}

const ctx = require.context('./model/pieces', false)
const pieceModules = ctx.keys().map(piece => ctx(piece));

export const INITIAL_CELLS = (() => {
	let CELLS = new Array(FIELD_SIZE)
		.fill(null)
		.map((_, id) => new Cell({
			id,
			piece: null,
			object: null,
		}))

	const mkPiece = (data: TPiece, cellId: TCellId) => {
		const cClass = capitalize(data.type)
		const Piece = pieceModules.find(module => module[cClass])[cClass]
		return new Piece(data, cellId)
	}

	for (const [side, sidePositions] of Object.entries(INITIAL_POSITIONS)) {
		for (const [index, pieceType] of Object.entries(sidePositions)) {
			Object.assign(CELLS[+index], {
				piece: mkPiece({
					side: side as TSide,
					type: pieceType
				}, +index),
			})
		}
	}

	return CELLS
})()

// id -> [row, col] 
// id -> [y, x]
export const CELL_POSITIONS =
	new Array(FIELD_SIZE)
		.fill(null)
		.map((_, i) => [Math.floor(i / FIELD_LENGTH), i % FIELD_LENGTH]) as [TRow, TCol][]

export const INITIAL_HIGHLIGHTED_CELLS = INITIAL_CELLS.map(_ => false)




