
type props = {
	title: string
}

export function GameTitle({ title }: props) {
	return (
		<h1 className="text-4xl leading-tight">{title}</h1>
	)
}

