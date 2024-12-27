import clsx from "clsx"
import { CELL_SIZE, TPieceType, TSide } from "../../constants"
import { Cell } from "../../model/cell"
import { Piece } from "../../model/piece"
import { TMenuActionAttrs } from "../../model/use-game-state"
import { Dropdown } from "../dropdown"
import { PieceImage } from "../images/piece-image"
import { CSSProperties } from "react"

type props = {
	data: {
		originCell: Cell
		targetCell: Cell
		data: {
			options: TPieceType[]
		}
	}
	onClose: React.MouseEventHandler
	className?: string
	flexDir?: string
	currentMove: TSide
}

export function TransformationMenu({ data, onClose, currentMove, className, flexDir }: props) {

	const getAttrs = (i: number): TMenuActionAttrs<'transformation'> => ({
		'data-action-type': 'choose',
		'data-action-id': i,
	})

	return (
		<Dropdown
			className={clsx(className, flexDir)}
			onClose={onClose}
			closeButton={
				<button
					className={clsx(
						"bg-gray-alt-100 text-gray-alt-500",
						"font-chess-glyph before:content-['\\0042']",
						"h-[--height]",
					)}
					style={{ '--height': `${CELL_SIZE / 2}px` } as CSSProperties}
					onClick={onClose}
				>
				</button>
			}
		>
			{
				data.data.options.map((p, i) => (
					<div key={i} {...getAttrs(i)} className="cursor-pointer">
						<PieceImage piece={p} side={currentMove} />
					</div>
				))
			}
		</Dropdown>
	)
}

