import Image, { StaticImageData } from 'next/image';
import { clsx } from 'clsx';

import avatarSrc from "./avatar.png";

type props = {
	className?: string
	name: string
	rating: number
	avatar: StaticImageData
	isRight?: boolean
}

export function PlayerProfile({ name, rating, className, avatar = avatarSrc, isRight }: props) {
	return (
		<div className={clsx(
			className,
			isRight && "flex-row-reverse",
			"flex items-center gap-2 text-start text-teal-600"
		)}
		>
			<Image src={avatar} width={48} height={48} alt="avatar" unoptimized />
			<div className="overflow-hidden">
				<div className="text-lg leading-tight truncate">{name}</div>
				<div className="text-slate-400 text-xs leading-tight">Рейтинг: {rating}</div>
			</div>

		</div>
	)
}