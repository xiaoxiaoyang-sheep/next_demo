import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { getServerSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeTroggle } from "./ThemeToggle";
import { Plan } from "./Plan";

export default async function RootLayout({
	children,
	nav,
}: Readonly<{
	children: React.ReactNode;
	nav: React.ReactNode;
}>) {
	const session = await getServerSession();

	if (!session?.user) {
		redirect("/api/auth/signin");
	}

	return (
		<ThemeProvider>
			<div className=" h-full">
				<nav className=" h-[80px] container border-b w-full sticky top-0 z-50 bg-[hsl(var(--background))]">
					<div className=" flex justify-end items-center h-full gap-2 relative">
						<ThemeTroggle></ThemeTroggle>
						<DropdownMenu>
							<DropdownMenuTrigger className=" relative">
								<Avatar>
									<AvatarImage
										src={session.user.image!}
									></AvatarImage>
									<AvatarFallback>
										{session.user.name?.substring(0, 2)}
									</AvatarFallback>
								</Avatar>
								<Plan></Plan>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>
									{session.user.name}
								</DropdownMenuLabel>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className=" absolute top-0 h-full flex  items-center">
						{nav}
					</div>
				</nav>
				<main className=" h-[calc(100%-80px)] overflow-hidden">
					{children}
				</main>
			</div>
		</ThemeProvider>
	);
}
