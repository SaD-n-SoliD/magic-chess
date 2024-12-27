import clsx from "clsx"
import { Cell } from "../model/cell"
import { TMenuConfigs, TMenuType } from "../model/constants/menu-configs"
import { TransformationMenu } from "./menus/transformation-menu"
import { CSSClassNames, SIDES, TSide } from "../constants"

type TCellMenuType = keyof TMenuConfigs['cell']

type props = {
	data: {
		type: TCellMenuType
		originCell: Cell
		targetCell: Cell
		//...
	}
	//todo Рассмотреть закрытие меню нажатием escape
	onClose: React.MouseEventHandler
	children?: React.ReactNode
	currentMove: TSide
}

type InnerProps = {
	data: any
	currentMove: TSide
	onClose: React.MouseEventHandler
	children?: React.ReactNode
	flexDir?: string
	className?: string
}

const components: Record<TCellMenuType, React.ComponentType<InnerProps>> = {
	transformation: TransformationMenu,
}
// Нужно учесть наличие игровых действий (~transformation). Для каждого игрового действия может существовать модалка и мб свой компонент, который рендерит модалку внутри себя.

export function CellMenu({ data, currentMove, onClose, children }: props) {
	const Component = components[data.type]
	const flexDir = {
		[SIDES.black]: 'flex flex-col-reverse',
		[SIDES.white]: 'flex flex-col',
	}[currentMove]
	const absDir = {
		[SIDES.black]: 'bottom-0',
		[SIDES.white]: 'top-0',
	}[currentMove]
	return (
		<div className={clsx(CSSClassNames.gameModal, 'absolute z-40', absDir)}>
			<Component
				data={data}
				onClose={onClose}
				flexDir={flexDir}
				currentMove={currentMove}
			>
				{children}
			</Component>
		</div>
	)
}

