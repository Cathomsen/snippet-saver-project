import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import { commitSession, getSession } from "../sessions.server";
import connectDb from "~/db/connectDb.server.js";
import bcrypt from "bcryptjs";

export const action = async ({ request }) => {
  const form = await request.formData();
  const db = await connectDb();

  const user = await db.models.User.findOne({
    username: form.get("username").trim(),
    /* password: form.get("password").trim(), */
  });

  let isCorrectPassword = false;

  if (user) {
    isCorrectPassword = await bcrypt.compare(
      form.get("password").trim(),
      user.password
    );
  }

  if (user && isCorrectPassword) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user._id);

    return redirect("/snippets", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return json(
      { errors: "hello", values: Object.fromEntries(form) },
      { status: 401 }
    );
  }
};

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function LoginPage() {
  const { userId } = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h1 className="font-bold pb-2">Log in</h1>
      {userId && (
        <pre className="inline-block bg-gray-200 rounded px-2 py-2 text-sm font-semibold text-gray-700 mb-2">
          {JSON.stringify(userId)}
        </pre>
      )}
      <div className="flex">
        {!userId ? (
          <Form method="post" className="pr-2" autoComplete="off">
            <div className="flex flex-col">
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                className="mb-2"
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>
            {actionData && (
              <p className="text-red-500 text-xs">
                User not found or password didn't match
              </p>
            )}
            <button
              type="submit"
              className="text-xs bg-green-200 hover:bg-green-700 text-green-800 hover:text-green-200 font-bold py-1 px-2 rounded"
            >
              Login
            </button>
          </Form>
        ) : (
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="text-xs hover:bg-red-200 bg-red-700 hover:text-red-800 text-red-200 font-bold py-1 px-2 rounded"
            >
              Logout
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
