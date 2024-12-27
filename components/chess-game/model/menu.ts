import { lodash } from "@/app/re-exports";
import { Cell } from "./cell";
import { getMenuConfig, TMenuData, TMenuOwner, TMenuType } from "./constants/menu-configs";
import { GameField } from "./game-field";

export type TMenuParams = Partial<CellMenu> & Pick<CellMenu, 'owner' | 'type' | 'originCell' | 'targetCell'>

// На разных owner'ов нужны разные поля (вроде origin и target) и разные UI компоненты
// Выходит, нужна иерархия Menu -> CellMenu/AnyOtherMenu
export class CellMenu {
	// static create = (...args: [TModalParams]) => new Modal(...args)

	public owner!: TMenuOwner;
	public type!: TMenuType;
	public originCell!: Cell;
	public targetCell!: Cell;
	public data: {} = {};
	public actionHandlers: Record<string, Function> = {};

	constructor(params: TMenuParams) {
		Object.assign(this, params)
	}

	handleAction(gameField: GameField, action: string, data?: string) {
		if (action in this.actionHandlers)
			this.actionHandlers[action](gameField, data)
		else
			throw new Error(
				`Действия '${action}' не существует для модального окна типа '${this.owner}/${this.type}'`
			);

	}

	static create(menuData: TMenuData, targetCell: Cell, originCell: Cell) {
		const { owner, type } = menuData
		const menuConfig = getMenuConfig(owner, type)
		// lodash.merge делает рекурсивное слияние объектов. При этом массивы конкатенируются, а необычные объекты перезаписываются без рекурсии. Проверка на обычность: lodash.isPlainObject.
		// Необычным считается объект, имеющий свой прототип (экземпляры классов тоже необычные)
		const data = lodash.merge({}, menuConfig, menuData, { originCell, targetCell })
		return new CellMenu(data)
	}

}

