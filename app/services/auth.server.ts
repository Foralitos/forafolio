import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";
import type { SessionUser } from "~/services/session.server";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  ALLOWED_EMAIL,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  throw new Error("Faltan variables de entorno de Google OAuth");
}
if (!ALLOWED_EMAIL) {
  throw new Error("ALLOWED_EMAIL no está definida");
}

type GoogleUserInfo = {
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
};

export const authenticator = new Authenticator<SessionUser>();

authenticator.use(
  new OAuth2Strategy<SessionUser>(
    {
      cookie: "oauth2",
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      redirectURI: GOOGLE_REDIRECT_URI,
      scopes: ["openid", "email", "profile"],
    },
    async ({ tokens }) => {
      const res = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        { headers: { Authorization: `Bearer ${tokens.accessToken()}` } }
      );
      if (!res.ok) throw new Error("No se pudo obtener el perfil de Google");

      const profile = (await res.json()) as GoogleUserInfo;

      // Gate single-user: solo el email permitido y verificado entra.
      if (!profile.email_verified || profile.email !== ALLOWED_EMAIL) {
        throw new Error("Unauthorized");
      }

      return {
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      };
    }
  ),
  "google"
);
