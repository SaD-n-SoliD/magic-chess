import { ChessGame } from "@/components/chess-game";
import { Header } from "@/components/header/";

export default function Home() {
	return (
		<HomeLayout header={<Header />}>
			<ChessGame />
		</HomeLayout>
	);
}


type props = {
	header: JSX.Element
	children: React.ReactNode
}

function HomeLayout({ header, children }: props) {
	return (
		<div className="bg-slate-50 min-h-screen">
			{header}
			<main className="pt-6 mx-auto w-max">
				{children}
			</main>
		</div>
	)
}

