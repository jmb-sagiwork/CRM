import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (session) redirect("/");
  return <LoginForm />;
}

