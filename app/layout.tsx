import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./null.css";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
	title: "Magic Chess",
	description: "What happens if you combine chess and magic?",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body className={clsx(inter.className, 'text-slate-900')}>{children}</body>
		</html>
	);
}
