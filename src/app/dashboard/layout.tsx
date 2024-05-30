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
		<div className=" h-full">
			<nav className=" h-[80px]  border-b w-full sticky top-0 z-50 bg-white">
				<div className=" container flex justify-end items-center h-full">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage
									src={session.user.image!}
								></AvatarImage>
								<AvatarFallback>
									{session.user.name?.substring(0, 2)}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								{session.user.name}
							</DropdownMenuLabel>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className=" absolute top-0 h-full left-1/2 -translate-x-1/2 flex justify-center items-center">
					{nav}
				</div>
			</nav>
			<main className=" h-[calc(100%-80px)] overflow-hidden">{children}</main>
		</div>
	);
}
