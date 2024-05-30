"use client"

import { BreadCrumb } from "../BreadCrumb";

export default function AppDashboardNav({
	params: { id },
}: {
	params: { id: string };
}) {

	return (
		<div className=" flex justify-between items-center">
			<BreadCrumb id={id} leaf="api-key"></BreadCrumb>
		</div>
	);
}
