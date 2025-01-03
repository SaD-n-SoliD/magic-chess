import { StaticImageData } from "next/image";
import avatarSrc1 from "./ui/images/avatar.png";
import avatarSrc2 from "./ui/images/avatar2.png";
import { ValueOf } from "next/dist/shared/lib/constants";
import { TUnitVector } from "./utils";

export enum CSSClassNames {
	gameField = 'GameField',
	gameCell = 'GameCell',
	gameModal = 'GameModal',
}

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

type TSideInfo = {
	vy: TUnitVector
	yStart: TRow,
	yEnd: TRow
}
export const SIDE_INFO: Record<TSide, TSideInfo> = {
	black: {
		vy: 1,
		yStart: 0,
		yEnd: FIELD_HEIGHT - 1
	},
	white: {
		vy: -1,
		yStart: FIELD_HEIGHT - 1,
		yEnd: 0
	},
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




