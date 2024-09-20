import Image from 'next/image';
import clsx from 'clsx';

import whiteKingSrc from '@/public/images/pieces/white_king.png';
import blackKingSrc from '@/public/images/pieces/black_king.png';

type props = {
	className?: string
	imageClassName?: string
	side: 'black' | 'white'
}

export function PlayerSide({ className, imageClassName, side }: props) {

	const imageSrc = { black: blackKingSrc, white: whiteKingSrc }[side]

	return (
		<div className={clsx(
			className,
			{
				black: 'bg-board-light',
				white: 'bg-board-dark'
			}[side],
			"w-7 h-7 rounded-full shadow flex items-center justify-center")
		}>
			<Image src={imageSrc} alt={side[0]} className={imageClassName} />
		</div>
	)
}

