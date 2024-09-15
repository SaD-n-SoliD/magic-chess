import { clsx } from 'clsx';
import { PlayerProfile } from '../player-profile';
import { PlayerSide } from './player-side';

import { StaticImageData } from 'next/image';
import avatarSrc1 from "./images/avatar.png";
import avatarSrc2 from "./images/avatar2.png";

const players = [
	{ name: 'Daniel', rating: 1230, avatar: avatarSrc1, side: 'white' },
	{ name: 'VereIntedinglapotur', rating: 850, avatar: avatarSrc2, side: 'black' }
] as playerInfo[]

type props = {
	className?: string
}

export function GameInfo({ className }: props) {
	return (
		<div className={clsx(
			className,
			'bg-white rounded-2xl shadow-md px-8 py-4 flex justify-between'
		)}>
			<PlayerInfo
				playerInfo={players[0]}
			/>
			<PlayerInfo
				playerInfo={players[1]}
				isRight={true}
			/>
		</div>
	)
}

type playerInfo = {
	name: string
	rating: number
	avatar: StaticImageData
	side: 'black' | 'white'
}

type playerProps = {
	playerInfo: playerInfo
	isRight?: boolean
}

function PlayerInfo({ playerInfo: { name, rating, avatar, side }, isRight }: playerProps) {
	return (
		<div className={clsx(
			'flex items-center gap-3 ',
			isRight ? 'flex-row-reverse' : ''
		)}>
			<div className="relative">
				<PlayerProfile
					className={'w-44'}
					name={name}
					rating={rating}
					avatar={avatar}
					isRight={isRight}
				/>
				<PlayerSide
					side={side}
					className={clsx('absolute -top-2', isRight ? '-right-2' : '-left-2')}
					imageClassName='-translate-y-[1px]'
				/>
			</div>
			<div className="h-6 w-px bg-slate-200"></div>
			<div className="text-slate-900 text-lg font-semibold">01:08</div>
		</div>
	)
}


