import { X } from "lucide-react";

export default function CancelPage() {
    return (
        <div className=" h-screen flex flex-col items-center gap-10 pt-10">
            <div className=" w-32 h-32 rounded-full bg-red-700 text-3xl text-white flex justify-center items-center mt-20">
                <X></X>
            </div>
            <div className=" text-2xl">You have canceled your payment</div>
        </div>
    );
}