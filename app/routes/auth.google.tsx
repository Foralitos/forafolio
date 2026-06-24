import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

// Inicia el flow de OAuth (POST desde el botón de login).
export async function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("google", request);
}

// Si alguien llega por GET, lo mandamos al login.
export async function loader() {
  return redirect("/login");
}
