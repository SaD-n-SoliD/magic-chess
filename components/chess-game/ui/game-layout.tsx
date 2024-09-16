
type props = {
	backLink: JSX.Element
	title: JSX.Element
	gameInfo: JSX.Element
	playersList: React.ReactNode
	gameMoveInfo: JSX.Element
	actions: JSX.Element
	gameCells: React.ReactNode
}

// px
const cellSize = 75

export function GameLayout({ backLink, title, gameInfo, playersList, gameMoveInfo, actions, gameCells }: props) {
	return (
		<div className="pb-10">
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
					className="grid grid-cols-[--grid-rows] grid-rows-[--grid-rows] mt-3"
					style={{ '--grid-rows': `repeat(8, ${cellSize}px)` } as React.CSSProperties}
				>
					{gameCells}
				</div>
			</div>
		</div>
	)
}