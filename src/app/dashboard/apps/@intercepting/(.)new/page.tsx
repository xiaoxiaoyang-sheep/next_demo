import { DialogContent } from "@/components/ui/Dialog";
import { BackableDialog } from "./BackableDialog";
import { CreateAppFrom } from "../../new/CreateAppForm";

export const dynamic = "force-dynamic";

export default function InterceptingCreateApp() {
	return (
		<BackableDialog>
			<DialogContent>
				<div className="h-full flex justify-center items-center">
					<CreateAppFrom></CreateAppFrom>
				</div>
			</DialogContent>
		</BackableDialog>
	);
}
