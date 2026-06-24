import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await authenticator.authenticate("google", request);

    const session = await getSession(request.headers.get("Cookie"));
    session.set("user", user);

    return redirect("/admin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    // Los redirects internos de la estrategia se relanzan tal cual.
    if (error instanceof Response) throw error;
    return redirect("/login?error=unauthorized");
  }
}
