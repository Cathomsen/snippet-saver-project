import { createCookie } from "remix";

export const sessionCookie = createCookie("__session", {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  /* secrets: [process.env.COOKIE_SECRET], */
});

/* export async function loader({ request }) {
  const oldCookie = request.headers.get("Cookie");
  // oldCookie may have been signed with "olds3cret", but still parses ok
  const value = await sessionCookie.parse(oldCookie);

  new Response("Chris and the chamber of secret cookies", {
    headers: {
      // Set-Cookie is signed with "n3wsecr3t"
      "Set-Cookie": await sessionCookie.serialize(value),
    },
  });
}
 */
