
import { StaticImageData } from "next/image";
import avatarSrc1 from "./ui/images/avatar.png";
import avatarSrc2 from "./ui/images/avatar2.png";

export type TPlayerInfo = {
	id: string
	name: string
	rating: number
	avatar: StaticImageData
	side: 'black' | 'white'
}

export const CELL_LABELS = {
	row: '12345678',
	col: 'abcdefgh',
}

export const PLAYERS = [
	{
		id: '1',
		name: 'Daniel',
		rating: 1230,
		avatar: avatarSrc1,
		side: 'white'
	},
	{
		id: '2',
		name: 'VereIntedinglapotur',
		rating: 850,
		avatar: avatarSrc2,
		side: 'black'
	}
] as TPlayerInfo[]

// export const INITIAL_PIECE_POSITIONS