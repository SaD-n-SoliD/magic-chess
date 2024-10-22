import clsx from "clsx"
import { CELL_POSITIONS, COL_LABELS, FIELD_LENGTH, ROW_LABELS, TCellId } from "../constants"

type props = {
	index: TCellId
	isAvailableToMove?: boolean
	isHighlighted?: boolean
	containsPiece?: boolean
	children?: React.ReactNode
}

export function GameCell({ index, isAvailableToMove, isHighlighted, containsPiece, children }: props) {
	const [row, col] = CELL_POSITIONS[index]

	return (
		<button
			data-id={index}
			className={clsx(
				(row + col) % 2 ?
					'bg-board-dark text-board-light' :
					'bg-board-light text-board-dark',
				"GameCell flex items-center justify-center relative cursor-default"
			)}
		>
			{children}
			{col === 0 &&
				<div className="absolute top-1 left-1 leading-tight">
					{ROW_LABELS[FIELD_LENGTH - 1 - row]}
				</div>
			}
			{row === FIELD_LENGTH - 1 &&
				<div className="absolute bottom-px right-1 leading-tight">
					{COL_LABELS[col]}
				</div>
			}
			{isHighlighted &&
				<div className="absolute w-full h-full bg-board-selection"></div>
			}
			{isAvailableToMove && !containsPiece &&
				<div className="absolute z-20 w-full h-full p-[33.3%]">
					<div className="w-full h-full bg-board-hint rounded-full"></div>
				</div>
			}
			{isAvailableToMove && containsPiece &&
				<div className="absolute z-20 w-full h-full pointer-events-none">
					<div className="w-full h-full [border-width:7px] border-solid border-board-hint rounded-full"></div>
				</div>
			}
		</button>
	)
}

