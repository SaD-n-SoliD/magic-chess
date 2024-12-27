import clsx from "clsx"

type props = {
	className?: string
	children: React.ReactNode
	data?: {
		options: string[]
	}
	onClose: React.MouseEventHandler
	closeButton?: React.ReactNode
}

export function Dropdown({ className, children, data, onClose, closeButton }: props) {

	return (
		<div
			className={clsx(
				"bg-white rounded-[3px] overflow-hidden",
				"shadow-[3px_3px_10px_rgba(0,0,0,.65)]",
				className,
			)}
		>
			{children}
			{!children && data && data.options.map((text, i) =>
				<div key={i}
					className="p-1"
				>
					{text}
				</div>
			)}
			{closeButton}
			{!closeButton &&
				<button
					className={clsx(
						"bg-gray-alt-100 text-gray-alt-500",
						"font-chess-glyph before:content-['\\0042']",
					)}
					onClick={onClose}
				>
				</button>
			}
		</div>
	)
}

