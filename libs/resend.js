import { Resend } from "resend";
import config from "@/config";

// Se instancia perezosamente: `new Resend(undefined)` truena, y no queremos que
// un build sin RESEND_API_KEY se caiga solo por importar este módulo.
let resend;

function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Falta la variable de entorno RESEND_API_KEY");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  await getResend().emails.send({
    from: config.resend.fromAdmin,
    to,
    replyTo,
    subject,
    text,
    html,
  });
};
