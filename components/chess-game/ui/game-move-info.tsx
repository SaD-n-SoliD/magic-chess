import { TSide } from "../constants"
import { PlayerSide } from "./player-side"

type props = {
	side?: TSide
}

export function GameMoveInfo({ side }: props) {
	return (
		<div className="flex items-center gap-1 text-xl leading-tight font-semibold">
			Ход:
			{side && <PlayerSide side={side} className="p-px" />}
		</div>
	)
}

