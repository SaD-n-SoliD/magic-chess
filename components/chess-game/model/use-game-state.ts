import { useEffect, useState } from "react"
import { CSSClassNames, TCellId, TSide } from "../constants"
import { GameField } from "./game-field"
import { INITIAL_CELLS } from "./constants/initial-cells"
import { useDispatch, useSelector } from "react-redux"
import { TRootState } from "@/store"
import { closeModal, getModalInstance } from "@/store/chess-game/game-modal-slice"
import { TMenuType, TMenuConfigsByType } from "./constants/menu-configs"

type params = null | {}

export function useGameState(_: params) {

	const dispatch = useDispatch()
	// Нельзя хранить экземпляры класса в сторе. Поэтому подопрём всё это костылём.
	// Подписываемся на изменение состояния и получаем экземпляр модалки
	const flattedActiveModal = useSelector((state: TRootState) => state.gameModal.sInstance)
	const activeModal = getModalInstance()

	const [gameState, setGameState] = useState(initGameState)
	const { gameField } = gameState

	gameField.activeMenu = activeModal

	// console.log('-'.repeat(50) + '\n', 'render' + Date.now().toString().slice(-4), gameField, activeModal);

	// Загружаем и устанавливаем данные с сервера
	// useEffect(() => {
	// 	const newState = ..
	// 	setGameState(newState)
	// }, [])

	const { currentMove, cells, availableMoves, highlightedCells, isCheck, isCheckmate } = gameField

	return {
		currentMove,
		cells,
		availableMoves,
		highlightedCells,
		isCheck,
		isCheckmate,
		activeModal,
		closeGameModal,
		onClickGameField,
		onBlur,
	} as const

	type TGameState = {
		gameField: GameField,
	}

	function initGameState(): TGameState {
		return ({
			gameField: new GameField(INITIAL_CELLS, refreshGameState, dispatch, activeModal),
		})
	}

	function refreshGameState() {
		setGameState(state => ({ ...state }))
	}

	function onClickGameField(e: React.MouseEvent) {
		handleClickIfCell(e)
		handleClickIfMenu(e)
	}

	function closeGameModal() {
		dispatch(closeModal())
	}

	function handleClickIfMenu(e: React.MouseEvent) {
		if (!(e.target instanceof HTMLElement) || !activeModal) return
		const { gameField: gameFieldC, gameModal } = CSSClassNames
		const el = e.target.closest(`.${gameFieldC} .${gameModal} [data-action-type]`) as HTMLElement

		const actionType = el?.dataset.actionType
		// Данные, необходимые для точной идентификации действия (~ Индекс массива options)
		const actionId = el?.dataset.actionId

		if (!actionType) return closeGameModal()

		activeModal.handleAction(gameField, actionType, actionId)

		return true
	}

	function handleClickIfCell(e: React.MouseEvent) {
		if (!(e.target instanceof HTMLElement)) return
		const { gameCell } = CSSClassNames
		const cellId = Number((e.target.closest('.' + gameCell) as HTMLElement)?.dataset?.id) as TCellId
		if (Number.isNaN(cellId)) return

		gameField.handleCellClick(cellId)
	}

	function onBlur(e: React.FocusEvent) {
		// В dev моде эта функция мешает, т.к. при открытии chrome dev tools фокус пропадает с поля
		if (process.env.NODE_ENV === 'development') return

		if (e.currentTarget.contains(e.relatedTarget)) return
		gameField.resetSelection()
		closeGameModal()
		gameField.update()
	}
}

export type TMenuActionAttrs<ModalType extends TMenuType> = {
	'data-action-type': keyof TMenuConfigsByType[ModalType]['actionHandlers'],
	'data-action-id': number | string,
}