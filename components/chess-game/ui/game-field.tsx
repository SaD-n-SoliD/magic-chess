import { CELL_SIZE, FIELD_LENGTH } from "../constants"

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
			className="grid grid-cols-[--grid-rows] grid-rows-[--grid-rows] mt-3"
			style={{ '--grid-rows': `repeat(${FIELD_LENGTH}, ${CELL_SIZE}px)` } as React.CSSProperties}
		>
			{children}
		</div>
	)
}