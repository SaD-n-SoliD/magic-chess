
import { StaticImageData } from "next/image";
import avatarSrc1 from "./ui/images/avatar.png";
import avatarSrc2 from "./ui/images/avatar2.png";
import { ValueOf } from "next/dist/shared/lib/constants";

// px
export const CELL_SIZE = 75
// cells in field
export const FIELD_SIZE = 8

export const COL_LABELS = 'abcdefghijklmnopqrstuvwxyz'
export const ROW_LABELS = new Array(FIELD_SIZE).fill(0).map((_, i) => i + 1)

export const SIDES = {
	black: 'black',
	white: 'white',
} as const

export const PIECES = {
	pawn: 'pawn',
	knight: 'knight',
	bishop: 'bishop',
	rook: 'rook',
	queen: 'queen',
	king: 'king',
} as const

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


export type TSide = ValueOf<typeof SIDES>
export type TPiece = ValueOf<typeof PIECES>

export type TPlayerInfo = {
	id: string
	name: string
	rating: number
	avatar: StaticImageData
	side: TSide
}

export type TCell = {
	piece: null | {
		side: TSide
		type: TPiece
		hp?: number
		atk?: number
		armor?: number
	}
	object: null | {

	}
}

export type TPiecePositions = { [key: number]: TPiece }

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

const INITIAL_POSITIONS = {
	...INITIAL_BLACK_POSITIONS,
	...INITIAL_WHITE_POSITIONS,
} as TPiecePositions

export const INITIAL_CELLS: TCell[] =
	new Array(FIELD_SIZE ** 2)
		.fill(null)
		.map((_, i) => INITIAL_POSITIONS[i] ?
			{
				piece: {
					side: i < FIELD_SIZE ** 2 / 2 ? SIDES.black : SIDES.white,
					type: INITIAL_POSITIONS[i]
				},
				object: null
			} :
			{
				piece: null,
				object: null
			}
		)