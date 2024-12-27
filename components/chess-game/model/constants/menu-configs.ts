import { TPieceType } from "../../constants"
import { CellMenu, TMenuParams } from "../menu"

type TBasicMenuConfig = Pick<CellMenu, 'data' | 'actionHandlers'>
type TBasicMenuConfigs = Record<string, TBasicMenuConfig>

// Тип игрового меню жёстко привязан к UI компоненту
const MENU_CONFIGS_BY_TYPE = {
	transformation: {
		data: {
			options: [] as TPieceType[],
		},
		actionHandlers: {
			choose: (...args: any[]) => { },
		},
	},
} as const satisfies TBasicMenuConfigs


export type TMenuConfigsByType = typeof MENU_CONFIGS_BY_TYPE
export type TMenuType = keyof TMenuConfigsByType


//* Здесь можно расширить некоторые типы модалок 
//* Например, подкинуть поля в data в случае переиспользования UI компонента модалки
const MENU_CONFIGS = {
	cell: {
		transformation: MENU_CONFIGS_BY_TYPE.transformation,
	},
} as const satisfies TMenuConfigsTemplate


type TMenuConfigsTemplate = Record<string, Partial<TMenuConfigsByType>>
export type TMenuConfigs = typeof MENU_CONFIGS
export type TMenuOwner = keyof TMenuConfigs


// Данные для отрисовки меню (~ MOVE_CONFIRMATIONS->...->menuData)
export type TMenuData = {
	[O in keyof Con]: {
		[T in keyof Con[O]]: {
			owner: O;
			type: T;
		} & Con[O][T]
	}[keyof Con[O]]
}[keyof Con]

type Con = TMenuConfigs

export function getMenuConfig(owner: TMenuOwner, type: TMenuType) {
	return MENU_CONFIGS[owner][type]
}

