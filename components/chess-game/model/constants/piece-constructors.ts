import { decapitalize } from "@/utils/capitalize";

const ctx = require.context('../pieces', false)
const pieceModules = ctx.keys().map(piece => ctx(piece));

const pieceConstructorsArr = pieceModules
	.map(module => module[Object.keys(module)[0]])
	.filter((c, i, arr) => arr[i - 1] !== c)

const d = decapitalize

// {pawn: class Pawn, king: class King, ...}
export const PIECE_CONSTRUCTORS = pieceConstructorsArr
	.reduce((acc, c) => Object.assign(acc, { [d(c.name)]: c }), {})
