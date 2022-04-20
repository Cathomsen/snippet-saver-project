import { useLoaderData, Form, redirect, json, createCookie } from "remix";
import { sessionCookie } from "../cookies";
import { getSession, commitSession } from "./session";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", "1001");
  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function Login() {
  const { userId } = useLoaderData();
  console.log(userId);
  return (
    <div>
      <h2>Current cookies</h2>
      <p>Cookie: {JSON.stringify(userId, null, 2)}</p>
      <Form method="post" reloadDocument>
        <button
          type="submit"
          name="login"
          className="text-white bg-green-500 flex-1 text-center hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-500 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Login
        </button>
      </Form>
    </div>
  );
}
