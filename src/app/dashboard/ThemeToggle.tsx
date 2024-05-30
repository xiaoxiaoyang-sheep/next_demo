"use client";

import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeTroggle() {
	const { theme, setTheme } = useTheme();

	const isDark = theme === "dark";

	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	return (
		<Button
			variant="ghost"
			onClick={() => {
				setTheme(isDark ? "light" : "dark");
			}}
		>
			{ready ? isDark ? <Sun /> : <Moon /> : <Sun />}
		</Button>
	);
}
