import clsx from "clsx"
import { COL_LABELS, FIELD_SIZE, ROW_LABELS } from "../constants"

type props = {
	index: number
	children?: React.ReactNode
}

export function GameCell({ index, children }: props) {
	const row = Math.floor(index / FIELD_SIZE)
	const col = index % FIELD_SIZE

	return (
		<button className={clsx(
			(row + col) % 2 ?
				'bg-board-dark text-board-light' :
				'bg-board-light text-board-dark',
			"flex items-center justify-center relative"
		)}
		>
			{children}
			{col === 0 &&
				<div className="absolute top-1 left-1 leading-tight">
					{ROW_LABELS[FIELD_SIZE - 1 - row]}
				</div>
			}
			{row === FIELD_SIZE - 1 &&
				<div className="absolute bottom-px right-1 leading-tight">
					{COL_LABELS[col]}
				</div>
			}
		</button>
	)
}

