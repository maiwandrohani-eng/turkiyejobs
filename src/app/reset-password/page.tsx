import { ResetPasswordPageView } from "@/components/auth/ResetPasswordPageView";
import { isDemoAuthEnabled } from "@/lib/demo-auth";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const sp = await searchParams;
  return (
    <ResetPasswordPageView
      demo={isDemoAuthEnabled()}
      token={sp.token?.trim() ?? ""}
    />
  );
}
