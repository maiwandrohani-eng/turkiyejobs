import { ForgotPasswordPageView } from "@/components/auth/ForgotPasswordPageView";
import { isDemoAuthEnabled } from "@/lib/demo-auth";

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageView demo={isDemoAuthEnabled()} />;
}
