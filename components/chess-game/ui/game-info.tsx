import { HistoryIcon } from "./icons/history-icon"
import { StarIcon } from "./icons/star-icon"
import { UserIcon } from "./icons/user-icon"

type props = {
	isRatingGame?: boolean
	playersCount?: number
	timeMode: string
}

export function GameInfo({ isRatingGame, playersCount = 2, timeMode }: props) {
	return (
		<div className="flex items-center gap-3 text-xs text-slate-400">
			{isRatingGame && <StarIcon />}
			<div className="flex items-center gap-1">
				<UserIcon /> {playersCount}
			</div>
			<div className="flex items-center gap-1">
				<HistoryIcon /> {timeMode}
			</div>
		</div>
	)
}

