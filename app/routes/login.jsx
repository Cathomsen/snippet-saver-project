import {
  useLoaderData,
  Form,
  redirect,
  json,
  createCookie,
  useActionData,
} from "remix";
import { sessionCookie } from "../cookies";
import { getSession, commitSession } from "../session";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const formdata = await request.FormData();
  const db = await connectDb();
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
  const actionData = useActionData();
  console.log(userId);
  if (userId) {
    return (
      <div>
        <p>Logged in</p>
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
        <Form method="post" action="/logout" reloadDocument>
          <button type="submit">Logout</button>
        </Form>
      </div>
    );
  } else {
    return (
      <div className="bg-white rounded-lg">
        <Form method="post" reloadDocument className="ml-5 p-5">
          <label
            htmlFor="username"
            className="block mb-2  font-medium text-gray-900 dark:text-gray-300"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="mb-4 bg-slate-100 text-gray-900  rounded-lg focus:shadow focus:outline-none block w-3/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <label
            htmlFor="password"
            className="block mb-2  font-medium text-gray-900 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="text"
            name="password"
            id="password"
            className="mb-4 bg-slate-100 text-gray-900  rounded-lg focus:shadow focus:outline-none block w-3/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <button
            type="submit"
            name="login"
            className="text-white bg-green-500 flex-1 text-center hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-500 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Login
          </button>
        </Form>
        <p></p>
      </div>
    );
  }
}
