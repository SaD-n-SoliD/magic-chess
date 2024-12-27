import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			fontFamily: {
				'chess-glyph': ['var(--icon-font-chess)']
			},
			lineHeight: {
				tight: '1.2'
			},
			colors: {
				'neo-black': '#5d5956',
				'neo-black-shadow': '#32302e',
				'board-light': '#ececd0',
				'board-dark': '#729551',
				'board-selection': '#ffff3380',
				'board-hint': 'rgba(0, 0, 0, .14)',
				'transparent-black-65': 'rgba(0, 0, 0, .65)',
				'gray-alt-75': '#f8f8f8',
				'gray-alt-100': ' #f1f1f1',
				'gray-alt-200': ' #e7e6e5',
				'gray-alt-300': ' #dad8d6',
				'gray-alt-400': ' #bebdb9',
				'gray-alt-500': ' #8b8987',
				'gray-alt-600': ' #666564',
				'gray-alt-700': ' #4b4847',
				'gray-alt-800': ' #312e2b',
				'gray-alt-900': ' #262421',
			}
		},
	},
	plugins: [],
};
export default config;
