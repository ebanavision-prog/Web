import "server-only";

export async function sendPasswordResetEmail(toEmail: string, resetLink: string): Promise<boolean> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_RESET_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[password-reset] EmailJS not configured, skipping reset email");
    return false;
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: toEmail,
          reset_link: resetLink,
        },
      }),
    });
    return response.ok;
  } catch (err) {
    console.error("[password-reset] EmailJS error:", err);
    return false;
  }
}
