import clsx from "clsx"

import { UiButton } from "../uikit/ui-button";
import { PlayerSide } from "./player-side";
import { CELL_LABELS } from "./constants";

type props = {
	className?: string
}

const cells = new Array(8 * 8).fill(null)

// px
const cellSize = 75


export function GameField({ className }: props) {
	return (
		<div className={clsx(
			className,
			'bg-white rounded-2xl shadow-md px-8 pt-5 pb-7'
		)}>
			<div className="flex gap-3 items-center">
				<div className="mr-auto">
					<div className="flex items-center gap-1 text-xl leading-tight font-semibold">
						Ход:
						<PlayerSide side="white" className="p-px" />
					</div>
				</div>
				<UiButton size="md" variant="primary">Ничья</UiButton>
				<UiButton size="md" variant="outline">Сдаться</UiButton>
			</div>

			<div
				className="grid grid-cols-[--grid-rows] grid-rows-[--grid-rows] mt-3"
				style={{ '--grid-rows': `repeat(8, ${cellSize}px)` } as React.CSSProperties}
			>
				{cells.map((_, i) => {
					const row = Math.floor(i / 8)
					const col = i % 8

					return (
						<button key={i} className={clsx(
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
				})}
			</div>

		</div>
	)
}

