import { LoginPageView } from "@/components/auth/LoginPageView";

type LoginPageProps = {
  searchParams: Promise<{
    reset?: string;
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  const resetOk = sp.reset === "1";
  const callbackUrl =
    sp.callbackUrl?.startsWith("/") && !sp.callbackUrl.startsWith("//")
      ? sp.callbackUrl
      : "/dashboard/user";

  return <LoginPageView resetOk={resetOk} callbackUrl={callbackUrl} />;
}
