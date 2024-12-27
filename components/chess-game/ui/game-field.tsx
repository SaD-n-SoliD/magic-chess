import clsx from "clsx"
import { CELL_SIZE, CSSClassNames, FIELD_LENGTH } from "../constants"

type props = {
	onClickGameField: React.MouseEventHandler
	onBlur: React.FocusEventHandler
	children: React.ReactNode
}

export function GameField({
	onClickGameField,
	onBlur,
	children,
}: props) {
	return (
		<div
			onClick={onClickGameField}
			onBlur={onBlur}
			className={clsx(
				CSSClassNames.gameField,
				"grid grid-cols-[--grid-rows] grid-rows-[--grid-rows] mt-3"
			)}
			style={{ '--grid-rows': `repeat(${FIELD_LENGTH}, ${CELL_SIZE}px)` } as React.CSSProperties}
		>
			{children}
		</div>
	)
}