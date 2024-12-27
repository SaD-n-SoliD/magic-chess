import { configureStore } from '@reduxjs/toolkit';
import gameFieldReducer from './chess-game/game-field-slice'
import gameModalReducer from './chess-game/game-modal-slice';

const store = configureStore({
	reducer: {
		gameField: gameFieldReducer,
		gameModal: gameModalReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: ['gameModal/openModal'],
				// Ignore these field paths in all actions
				// ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
				// Ignore these paths in the state
				// ignoredPaths: ['gameModal.sInstance'],
			},
		}),
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch

export default store
