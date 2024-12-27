import { flatted } from "@/app/re-exports";
import { CellMenu } from "@/components/chess-game/model/menu";
import { createSlice } from "@reduxjs/toolkit";

type TGameModalState = {
	sInstance: string | null
}

const initialState: TGameModalState = {
	sInstance: null
}

// todo Поменять тип, когда будет создан общий тип Menu или тип перечислений всех разновидностей меню
// В GameField тоже поменять
let gameModalInstance: CellMenu | null = null

export const getModalInstance = () => gameModalInstance

const gameModalSlice = createSlice({
	name: 'gameModal',
	initialState,
	reducers: {
		openModal(state, action) {
			state.sInstance = flatted.stringify(action.payload)
			gameModalInstance = action.payload
		},
		closeModal(state) {
			state.sInstance = gameModalInstance = null
		},
	},
})

export const { openModal, closeModal } = gameModalSlice.actions

export default gameModalSlice.reducer