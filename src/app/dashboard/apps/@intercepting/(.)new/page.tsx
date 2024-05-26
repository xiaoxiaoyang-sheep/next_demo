import { DialogContent} from "@/components/ui/Dialog";
import CreateApp from "../../new/page";
import { BackableDialog } from "./BackableDialog";

export const dynamic = 'force-dynamic'

export default function InterceptingCreateApp() {
    console.log('aaaaaaaâddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    
    return <BackableDialog>
        <DialogContent>
            <CreateApp />
        </DialogContent>
    </BackableDialog>
}