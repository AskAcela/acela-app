"use client";

import BillingModal from "@/components/BillingModal";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return <BillingModal open={true} onClose={() => router.push("/")} />;
}
