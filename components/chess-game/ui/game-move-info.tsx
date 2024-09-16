import { PlayerSide } from "./player-side"

type props = {

}

export function GameMoveInfo({ }: props) {
	return (
		<div className="flex items-center gap-1 text-xl leading-tight font-semibold">
			Ход:
			<PlayerSide side="white" className="p-px" />
		</div>
	)
}

