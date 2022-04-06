import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  return json(snippet);
}

export const action = async ({ request, params }) => {
  const db = await connectDb();
  const form = await request.formData();

  const title = form.get("title");
  const language = form.get("language");
  const description = form.get("description");
  const snippet = form.get("snippet");
  const snippetId = params.snippetId;
  console.log("title", title);

  try {
    await db.models.Snippet.findOneAndUpdate(
      { _id: snippetId },
      {
        $set: {
          title: title,
          language: language,
          description: description,
          snippet: snippet,
        },
      }
    );

    return redirect(`/snippets/${snippetId}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
};

export default function SnippetUpdate() {
  const actionData = useActionData();
  const snippet = useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Update current snippet</h1>
      <Form method="post">
        <label
          htmlFor="title"
          className="block mb-2  font-medium text-gray-900 dark:text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title ?? snippet.title}
          id="title"
          className="mb-4 bg-slate-100 text-gray-900  rounded-lg focus:shadow focus:outline-none block w-3/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}

        <label
          htmlFor="language"
          className="block mb-2  font-medium text-gray-900 dark:text-gray-300"
        >
          Language
        </label>
        <input
          type="text"
          name="language"
          defaultValue={actionData?.values.language ?? snippet.language}
          id="language"
          className="mb-4 bg-slate-100 text-gray-900  rounded-lg focus:shadow focus:outline-none block w-3/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <label
          htmlFor="description"
          className="block mb-2  font-medium text-gray-900 dark:text-gray-300"
        >
          Description
        </label>
        <input
          type="text"
          name="description"
          defaultValue={actionData?.values.description ?? snippet.description}
          id="description"
          className="mb-4 bg-slate-100 text-gray-900  rounded-lg focus:shadow focus:outline-none block w-3/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <label
          htmlFor="snippet"
          className="block mb-2 font-medium text-gray-900 dark:text-gray-300"
        >
          Snippet
        </label>
        <textarea
          type="text"
          name="snippet"
          defaultValue={actionData?.values.snippet ?? snippet.snippet}
          id="snippet"
          className="bg-slate-100 text-gray-900 rounded-lg focus:shadow focus:outline-none block w-7/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y"
        />
        <br />
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
