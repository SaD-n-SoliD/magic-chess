import { FIELD_LENGTH, FIELD_SIZE, TCellId, TCol, TRow } from "./constants";

const CELL_POSITIONS =
	new Array(FIELD_SIZE)
		.fill(null)
		.map((_, i) => [Math.floor(i / FIELD_LENGTH), i % FIELD_LENGTH]) as [TRow, TCol][]

// [row, col] -> id
// [y, x] -> id 
// Зависит от FIELD_LENGTH, который зависит от конкретной игры. В класс засовывать особо нет смысла
export function mkCellId(row: TRow, col: TCol) {
	return row * FIELD_LENGTH + col
}

// id -> [row, col] 
// id -> [y, x]
export function getCellPosition(id: TCellId) {
	return CELL_POSITIONS[id]
}


export type TCellFlags = boolean[]; // { [key: TCellId]: boolean }

// Собираем cellFlags из массива id'шников
export function mkCellFlags(idList: TCellId[]): TCellFlags {
	const flags: TCellFlags = idList.reduce((acc, id) => Object.assign(acc, { [id]: true }), [])

	for (let i = 0; i < FIELD_SIZE; i++) {
		if (!flags[i]) flags[i] = false
	}

	return flags
}

export type TUnitVector = 1 | 0 | -1
export type T2DVector = [number, number]
export type TVector = number[]

function areFloatsEqual(a: number, b: number, epsilon = Number.EPSILON) {
	return Math.abs(a - b) < epsilon
}

// Проверка на сонаправленность векторов
export function vectorsAreCodirectional(v1: TVector, v2: TVector) {
	const directionCount = Math.max(v1.length, v2.length)
	let k
	for (let i = 0; i < directionCount; i++) {
		// Если в текущем направлении один вектор смещается, а другой нет, то векторы не сонаправлены
		if (!v1[i] !== !v2[i]) return false
		// Если в текущем направлении оба вектора не смещаются, идём дальше
		if (!v1[i] && !v2[i]) continue
		// Если коэффициента ещё нет, вычисляем
		if (!k)
			k = v1[i] / v2[i]
		// Если в текущем направлении соотношение перемещений не равно k, векторы не сонаправлены
		else if (!areFloatsEqual(k, v1[i] / v2[i]))
			return false
	}
	return true
}

// Разморот вектора на 180 градусов
export function reverseVector(v: TVector) {
	return v.map(v => -v)
}

// Наибольший общий делитель
export function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b);
}

// Сократить дробь без учёта знака
export function simplifyFraction([numerator, denominator]: number[]): [number, number] {
	const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
	return [Math.round(numerator / divisor), Math.round(denominator / divisor)]
}

