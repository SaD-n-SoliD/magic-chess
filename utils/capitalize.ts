// Приводит первый символ строки к верхнему регистру
export function capitalize(str: string) {
	if (!str) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}
// Приводит первый символ строки к нижнему регистру
export function decapitalize(str: string) {
	if (!str) return str
	return str.charAt(0).toLowerCase() + str.slice(1)
}