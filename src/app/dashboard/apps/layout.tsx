export default function AppLayout({
	children,
	intercepting,
}: {
	children: React.ReactNode;
	intercepting: React.ReactNode;
}) {
	return (
		<>
			{intercepting}
			{children}
		</>
	);
}
