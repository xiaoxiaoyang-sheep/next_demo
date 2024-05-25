"use client";

import { Button } from "@/components/ui/Button";

export default function CreateAppError({ error, reset }: { error: Error, reset: () => void }) {
	return (
		<div>
			<div className="w-64 mx-auto p-8 flex justify-center items-center flex-col">
                <span>Create App Failed</span>
                <Button onClick={reset}>Reset</Button>
            </div>
		</div>
	);
}
