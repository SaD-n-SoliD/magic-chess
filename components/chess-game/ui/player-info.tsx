import { PlayerSide } from "./player-side"
import { PlayerProfile } from "@/components/player-profile"
import clsx from "clsx"
import { TPlayerInfo } from "../constants"


type props = {
	playerInfo: TPlayerInfo
	isRight?: boolean
}

export function PlayerInfo({ playerInfo: { name, rating, avatar, side }, isRight }: props) {
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
