import { useState } from "react"


type params = null | {

}

type TGameState = {
	cells: Array<number | null>
	currentMove: 'w' | 'b'
}

export function useGameState(_: params) {
	const [{ cells, currentMove }, setGameState] = useState<TGameState>(
		() => ({
			cells: new Array(8 * 8).fill(null),
			currentMove: 'w'
		})
	)

	return [{ cells, currentMove }, setGameState] as const
}