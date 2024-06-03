import { getServerSession } from "@/server/auth";
import { db } from "@/server/db/db";
import { redirect } from "next/navigation";
import { X, Check } from "lucide-react";
import { ReactNode } from "react";
import { AutoRedirect } from "./AutoRedirect";

export default async function PaySuccess() {
    const session = await getServerSession();

    if (!session) {
        return redirect("/login");
    }

    const userPlan = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.id),
        columns: {
            plan: true,
        },
    });

    let content: ReactNode;

    if (!userPlan || userPlan.plan === "free") {
        content = (
            <>
                <div className=" w-32 h-32 rounded-full bg-red-700 text-3xl text-white flex justify-center items-center mt-20">
                    <X></X>
                </div>
                <div className=" text-2xl">You have some error when pay</div>
            </>
        );
    } else {
        content = (
            <>
                <div className=" w-32 h-32 rounded-full bg-green-700 text-3xl text-white flex justify-center items-center mt-20">
                    <Check></Check>
                </div>
                <div className=" text-2xl">Success</div>
                <AutoRedirect delay={3000} path="/dashboard"></AutoRedirect>
            </>
        );
    }

    return (
        <div className=" h-screen flex flex-col gap-10 items-center">
            {content}
        </div>
    );
}