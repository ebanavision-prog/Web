import Link from "next/link";
import { verifyPasswordResetToken } from "@/lib/auth";
import ResetPasswordForm from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const isValid = await verifyPasswordResetToken(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-xl font-semibold text-white">Nueva contraseña</h1>

        {isValid ? (
          <ResetPasswordForm token={token} />
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-300">
              Este enlace ha expirado o no es válido. Solicita uno nuevo.
            </p>
            <Link
              href="/admin/forgot-password"
              className="block w-full rounded-lg bg-red-600 py-2 text-center font-medium text-white transition hover:bg-red-700"
            >
              Solicitar nuevo enlace
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
