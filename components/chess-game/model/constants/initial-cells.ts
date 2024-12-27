import { FIELD_SIZE, INITIAL_POSITIONS, TCellId, TSide } from "../../constants"
import { mkPiece } from "../../utils"
import { Cell } from "../cell"

export const INITIAL_CELLS = (() => {
	let CELLS = new Array(FIELD_SIZE)
		.fill(null)
		.map((_, id) => new Cell({
			id,
			piece: null,
			object: null,
		}))

	for (const [side, sidePositions] of Object.entries(INITIAL_POSITIONS)) {
		for (const [index, pieceType] of Object.entries(sidePositions)) {
			Object.assign(CELLS[+index], {
				piece: mkPiece({
					side: side as TSide,
					type: pieceType
				}, +index),
			})
		}
	}

	return CELLS
})()

export const INITIAL_HIGHLIGHTED_CELLS = INITIAL_CELLS.map(_ => false)
