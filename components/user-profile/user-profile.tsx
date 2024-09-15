import Image from "next/image";
import avatarSrc from './avatar.png'
import { ArrowDownIcon } from "./icons/arrow-down-icon";

type props = {

}

export function UserProfile({ }: props) {
	return (
		<button className="ml-auto flex items-center gap-2 text-start text-teal-600 hover:text-teal-500 transition-colors">
			<Image src={avatarSrc} width={48} height={48} alt="avatar" unoptimized />
			<div className="">
				<div className="text-lg leading-tight">Daniel</div>
				<div className="text-slate-400 text-xs leading-tight">Рейтинг: 1230</div>
			</div>
			<ArrowDownIcon />
		</button>
	)
}

