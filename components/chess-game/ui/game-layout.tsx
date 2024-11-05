import { CELL_SIZE, FIELD_LENGTH } from "../constants"

type props = {
	backLink: JSX.Element
	title: JSX.Element
	gameInfo: JSX.Element
	playersList: React.ReactNode
	gameMoveInfo: JSX.Element
	actions: JSX.Element
	children: React.ReactNode
}

export function GameLayout({
	backLink,
	title,
	gameInfo,
	playersList,
	gameMoveInfo,
	actions,
	children,
}: props) {
	return (
		<div className="GameLayout pb-10">
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
				{children}
			</div>
		</div>
	)
}