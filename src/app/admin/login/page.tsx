import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LOGO_SRC, BRAND } from "@/lib/seminar";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Login", robots: { index: false } };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex justify-center">
          <Image
            src={LOGO_SRC}
            alt={`${BRAND.name} Financial Services`}
            width={471}
            height={229}
            priority
            className="h-14 w-auto"
          />
        </div>
        <h1 className="mt-6 text-center text-xl font-bold text-navy">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Seminar registrations</p>
        <LoginForm />
      </div>
    </main>
  );
}
