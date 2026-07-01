"use server";

import { redirect } from "next/navigation";
import { checkPassword, startAdminSession, endAdminSession } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "Admin login is not configured on the server." };
  }
  if (!checkPassword(password)) {
    return { error: "Incorrect password." };
  }

  await startAdminSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endAdminSession();
  redirect("/admin/login");
}
