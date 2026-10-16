"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logoutAction } from "@/app/admin/(dashboard)/logout-action";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await logoutAction();
          router.push("/admin/login");
          router.refresh();
        })
      }
      className="text-red-500 hover:text-red-400 disabled:opacity-60"
    >
      Salir
    </button>
  );
}
