import { ProfileView } from "@/components/dashboard/views/ProfileView";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return <ProfileView user={user} />;
}
