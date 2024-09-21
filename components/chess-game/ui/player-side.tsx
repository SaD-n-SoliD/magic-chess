import clsx from 'clsx';
import { PIECES, SIDES, TSide } from '../constants';
import { PieceImage } from './images/piece-image';

type props = {
	className?: string
	imageClassName?: string
	side: TSide
}

export function PlayerSide({ className, imageClassName, side }: props) {

	return (
		<div className={clsx(
			className,
			{
				[SIDES.black]: 'bg-board-light',
				[SIDES.white]: 'bg-board-dark'
			}[side],
			"w-7 h-7 rounded-full shadow flex items-center justify-center")
		}>
			<PieceImage piece={PIECES.king} side={side} className={imageClassName} />
		</div>
	)
}

