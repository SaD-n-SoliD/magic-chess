import { useState } from "react"
import { INITIAL_CELLS, SIDES, TCell, TSide } from "../constants"


type params = null | {

}

type TGameState = {
	cells: Array<TCell>
	currentMove: TSide
}

export function useGameState(_: params) {
	const [{ cells, currentMove }, setGameState] = useState<TGameState>(
		() => ({
			cells: INITIAL_CELLS,
			currentMove: SIDES.white,
		})
	)

	return [{ cells, currentMove }, setGameState] as const
}