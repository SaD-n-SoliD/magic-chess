import { toCamelCase } from "@/utils/to-camel-case";

const context = require.context('../pieces', false, /\.ts$/);

// Генерация объекта на основе имён файлов и классов/конструкторов
// {pawn: class Pawn, king: class King, ...}
export const PIECE_CONSTRUCTORS = context.keys()

	.reduce((acc, filePath) => {
		const fileName = filePath.replace('./', '').replace(/\.[^/.]+$/, ''); // Убираем './' и расширение
		const camelCaseKey = toCamelCase(fileName);

		const cModule = context(filePath);
		const pieceConstructor = cModule.default || Object.values(cModule)[0]; // Поддержка default и именованных экспортов
		acc[camelCaseKey] = pieceConstructor;
		return acc;
	}, {} as res);

type res = Record<string, any>

// import { decapitalize } from "@/utils/capitalize";

// const ctx = require.context('../pieces', false)
// const pieceModules = ctx.keys().map(piece => ctx(piece));

// const pieceConstructorsArr = pieceModules
// 	.map(module => module[Object.keys(module)[0]])
// 	.filter((c, i, arr) => arr[i - 1] !== c)

// const d = decapitalize

// // {pawn: class Pawn, king: class King, ...}
// export const PIECE_CONSTRUCTORS = pieceConstructorsArr
// 	.reduce((acc, c) => Object.assign(acc, { [d(c.name)]: c }), {})

