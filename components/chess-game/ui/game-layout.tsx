import { CELL_SIZE, FIELD_LENGTH } from "../constants"

type props = {
	onBlur: React.FocusEventHandler
	backLink: JSX.Element
	title: JSX.Element
	gameInfo: JSX.Element
	playersList: React.ReactNode
	gameMoveInfo: JSX.Element
	actions: JSX.Element
	gameCells: React.ReactNode
	onClickGameField: React.MouseEventHandler
}

export function GameLayout({
	onBlur,
	backLink,
	title,
	gameInfo,
	playersList,
	gameMoveInfo,
	actions,
	gameCells,
	onClickGameField,
}: props) {
	return (
		<div className="GameLayout pb-10" onBlur={onBlur}>
			<div className="pl-2">
				{backLink}
				{title}
				{gameInfo}
			</div>
			<div
				className="mt-4 bg-white rounded-2xl shadow-md px-8 py-4 flex justify-between gap-10"
			>
				{playersList}
			</div>
			<div className="mt-6 bg-white rounded-2xl shadow-md px-8 pt-5 pb-7">
				<div className="flex gap-3 items-center">
					<div className="mr-auto">
						{gameMoveInfo}
					</div>
					{actions}
				</div>
				<div
					onClick={onClickGameField}
					className="grid grid-cols-[--grid-rows] grid-rows-[--grid-rows] mt-3"
					style={{ '--grid-rows': `repeat(${FIELD_LENGTH}, ${CELL_SIZE}px)` } as React.CSSProperties}
				>
					{gameCells}
				</div>
			</div>
		</div>
	)
}