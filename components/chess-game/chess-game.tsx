"use client"

import { GameInfo } from "./ui/game-info"
import { GameTitle } from "./ui/game-title"
import { BackLink } from "./ui/back-link"
import { GameLayout } from "./ui/game-layout"
import { PlayerInfo } from "./ui/player-info"
import { GameMoveInfo } from "./ui/game-move-info"
import { GameCell } from "./ui/game-cell"
import { UiButton } from "../uikit/ui-button"

import { PLAYERS } from "./constants"
import { useGameState } from "./model/use-game-state"

type props = {

}

export function ChessGame({ }: props) {
	const [{ cells }, setGameState] = useGameState(null)

	return (
		<GameLayout
			backLink={<BackLink />}
			title={<GameTitle />}
			gameInfo={<GameInfo isRatingGame timeMode="1 мин на ход" />}
			playersList={PLAYERS.map((player, i) =>
				<PlayerInfo
					key={player.id}
					playerInfo={player}
					isRight={i % 2 === 1}
				/>
			)}
			gameMoveInfo={<GameMoveInfo />}
			actions={
				<>
					<UiButton size="md" variant="primary">Ничья</UiButton>
					<UiButton size="md" variant="outline">Сдаться</UiButton>
				</>
			}
			gameCells={cells.map((cell, i) => <GameCell key={i} index={i} />)}
		/>
	)
}