import { mapValues } from "lodash-es";
import { PIECES, SIDE_INFO, SIDES, TCellId, TPieceType } from "../../constants";
import { GameField } from "../game-field";
import { TMenuData } from "./menu-configs";
import { Piece } from "../piece";
import { getCellPosition } from "../../utils";
import { closeModal } from "@/store/chess-game/game-modal-slice";

type TMoveConfirmation = {
	checkConditions: (gameField: GameField, destination: TCellId) => boolean
	menuData: TMenuData
}

type TMoveConfirmationsByPiece = Record<TPieceType, TMoveConfirmation[]>

const { king, pawn, knight, bishop, rook, queen } = PIECES

// Для каждой ситуации (проверки) известно, что за модалка нужна и с какими данными
export const MOVE_CONFIRMATIONS: TMoveConfirmationsByPiece = {

	// По умолчанию пустой массив подтверждений для каждой фигуры
	...mapValues(PIECES, () => []),

	[PIECES.pawn]: [
		{
			// Для confirmation/gameAction может понадобиться не просто модалка + данные, но и свой UI компонент, в котором в модалку, возможно, будут рендериться другие компоненты с нужными данными
			// Меню знает, какие данные ему нужны и какие action будет генерировать.
			// Таким образом, конфиги должны отражать конкретные меню. Правда действя всё-равно будут абстрактные, вроде выбора из списка или клика по конкретной кнопке, т.к. конкретный список действий может зависеть, например, от фигуры и определяться в data здесь. 
			// Возможно, будет общий список действий c коллбэками, а менюшки будут содержать часть его ключей. Только не забыть проверку на существование полученного из UI действия в этой менюшке.
			// todo Подумать о глобальном реестре действий над игровыми данными. Возможно, разделить их. 
			// Одна группа действий отвечает за игровой цикл. 
			// Другая - за действия(ходы) игрока. 
			// Третья за функции, меняющие отображение.
			// Разделить функции на модули. 
			// Главный модуль в конструкторе создаёт экземпляры вспомогательных и передаёт им this. Затем присваивает их в свои свойства.
			checkConditions(gameField: GameField, destination: TCellId) {
				const { yEnd } = SIDE_INFO[gameField.currentMove]
				console.log(yEnd);
				return getCellPosition(destination).y === yEnd
			},
			menuData: {
				owner: 'cell',
				type: 'transformation',
				data: {
					options: [queen, rook, knight, bishop]
				},
				get actionHandlers() {
					const data = this.data
					return ({
						choose: (gameField: GameField, optionId: `${TCellId}`) => {
							const menu = gameField.activeMenu
							if (!menu) return

							const { targetCell, originCell } = menu
							gameField.dispatch(closeModal())

							const newPieceType = data.options[+optionId]
							gameField.pieceTransform(originCell.piece as Piece, { type: newPieceType })
							// Поставил ход после превращения для автоматического перерасчёта ходов
							gameField.makeMove(targetCell.id, originCell.id)
						},
					})
				},
			},
		},
	],
}




