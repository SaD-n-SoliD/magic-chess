import { FIELD_LENGTH, FIELD_SIZE, TCellId, TCol, TRow } from "./constants";

// [row, col] -> id
// [y, x] -> id 
// Зависит от FIELD_LENGTH, который зависит от конкретной игры. В класс засовывать особо нет смысла
export const mkId = (row: TRow, col: TCol) => row * FIELD_LENGTH + col

export type TCellFlags = { [key: TCellId]: boolean }

// Собираем cellFlags из массива id'шников
export function mkCellFlags(idList: TCellId[]): TCellFlags {
	const flags: TCellFlags = idList.reduce((acc, id) => Object.assign(acc, { [id]: true }), {})

	for (let i = 0; i < FIELD_SIZE; i++) {
		if (!flags[i]) flags[i] = false
	}

	return flags
}