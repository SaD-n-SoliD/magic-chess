import Link from "next/link"
import { ArrowLeftIcon } from "./icons/arrow-left-icon"

type props = {

}

export function BackLink({ }: props) {
	return (
		<Link href="#" className="flex items-center gap-2 text-xs text-teal-600 hover:text-teal-500 leading-tight -mb-0.5">
			<ArrowLeftIcon />
			На главную
		</Link>
	)
}

