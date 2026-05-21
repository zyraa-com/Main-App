import { BillingView } from "@/components/dashboard/views/BillingView";
import { getCurrentUser } from "@/lib/auth";

export default async function BillingPage() {
  const user = await getCurrentUser();
  return <BillingView user={user} />;
}
