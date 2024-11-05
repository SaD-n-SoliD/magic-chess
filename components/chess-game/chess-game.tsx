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
import { PieceImage } from "./ui/images/piece-image"
import { useGameState } from "./model/use-game-state"

type props = {

}

export function ChessGame({ }: props) {
	const {
		currentMove,
		cells,
		availableMoves,
		highlightedCells,
		onClickGameField,
		onBlur,
	} = useGameState(null)

	return (
		<GameLayout
			onBlur={onBlur}
			backLink={<BackLink />}
			title={<GameTitle title="Магические шахматы" />}
			gameInfo={<GameInfo isRatingGame timeMode="1 мин на ход" />}
			playersList={PLAYERS.map((player, i) =>
				<PlayerInfo
					key={player.id}
					playerInfo={player}
					isRight={i % 2 === 1}
				/>
			)}
			gameMoveInfo={<GameMoveInfo side={currentMove} />}
			actions={
				<>
					<UiButton size="md" variant="primary">Ничья</UiButton>
					<UiButton size="md" variant="outline">Сдаться</UiButton>
				</>
			}
			onClickGameField={onClickGameField}
			gameCells={cells.map((cell, i) =>
				<GameCell
					key={i}
					index={i}
					isAvailableToMove={availableMoves[i]}
					isHighlighted={highlightedCells[i]}
					containsPiece={!!cell.piece}
				>
					{cell.piece &&
						<PieceImage
							piece={cell.piece.type}
							side={cell.piece.side}
							className="z-10 cursor-pointer"
						/>
					}
				</GameCell>
			)}
		/>
	)
}