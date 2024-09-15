import Image from "next/image";
import logoSrc from './logo.png'
import { UiButton } from "../uikit/ui-button";
import { UserProfile } from "../user-profile";

export function Header() {
	return (
		<header className="header h-24 px-8 py-6 flex items-center bg-white shadow-lg">
			<Image src={logoSrc} alt="logo" priority={true} className="" />
			<div className="w-px h-8 bg-slate-200 mx-6"></div>
			<UiButton className="w-44" size="lg" variant="primary">Играть</UiButton>

			<UserProfile />
		</header>
	)
}