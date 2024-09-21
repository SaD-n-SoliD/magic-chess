import Image from "next/image";
import { TPiece, TSide } from "../../constants";

const images = require.context('/public/images/pieces', false);
const imageList = images.keys().map(image => images(image));

type props = {
	piece: TPiece
	side: TSide
}

export function PieceImage({ piece, side }: props) {
	return (
		<Image
			src={
				imageList.find(
					el => el.default.src.includes(`${side}_${piece}`)
				)?.default
			}
			alt="piece"
		/>
	)
}

