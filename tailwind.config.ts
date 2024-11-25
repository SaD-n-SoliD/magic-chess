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
			}
		},
	},
	plugins: [],
};
export default config;
