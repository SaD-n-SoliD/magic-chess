import { HistoryIcon } from "./icons/history-icon"
import { StarIcon } from "./icons/star-icon"
import { UserIcon } from "./icons/user-icon"

type props = {
	isRatingGame?: boolean
	playerCount?: number
	timeMode: string
}

export function GameInfo({ isRatingGame, playerCount = 2, timeMode }: props) {
	return (
		<div className="flex items-center gap-3 text-xs text-slate-400">
			{isRatingGame && <StarIcon />}
			<div className="flex items-center gap-1">
				<UserIcon /> {playerCount}
			</div>
			<div className="flex items-center gap-1">
				<HistoryIcon /> {timeMode}
			</div>
		</div>
	)
}

