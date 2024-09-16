import clsx from "clsx"
import { CELL_LABELS } from "../constants"

type props = {
	index: number
}

export function GameCell({ index }: props) {
	const row = Math.floor(index / 8)
	const col = index % 8

	return (
		<button className={clsx(
			(row + col) % 2 ?
				'bg-board-dark text-board-light' :
				'bg-board-light text-board-dark',
			"flex items-center justify-center relative"
		)}
		>

			{col === 0 &&
				<div className="absolute top-1 left-1 leading-tight">
					{CELL_LABELS.row[row]}
				</div>
			}
			{row === 7 &&
				<div className="absolute bottom-px right-1 leading-tight">
					{CELL_LABELS.col[col]}
				</div>
			}
		</button>
	)
}

