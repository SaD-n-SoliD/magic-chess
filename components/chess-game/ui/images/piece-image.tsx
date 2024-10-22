import Image from "next/image";
import { TPieceType, TSide } from "../../constants";

const images = require.context('/public/images/pieces', false);
const imageList = images.keys().map(image => images(image));

type props = {
	piece: TPieceType
	side: TSide
	className?: string
}

export function PieceImage({ piece, side, className }: props) {
	return (
		<Image
			className={className}
			src={
				imageList.find(
					el => el.default.src.includes(`${side}_${piece}`)
				)?.default
			}
			alt={`${side} ${piece}`}
		/>
	)
}

