import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    const newSnippet = await db.models.Snippet.create({
      title: form.get("title"),
      language: form.get("language"),
      description: form.get("description"),
      snippet: form.get("snippet"),
    });
    return redirect(`/snippets/${newSnippet._id}`);
  } catch (error) {
    console.log(error);
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateSnippet() {
  const actionData = useActionData();
  return (
    <div>
      <h1>Create snippet</h1>
      <Form method="post">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title}
          id="title"
          className={
            actionData?.errors.title ? "border-2 border-red-500" : null
          }
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}
        <label htmlFor="language" className="block">
          Language
        </label>
        <input
          type="text"
          name="language"
          defaultValue={actionData?.values.language}
          id="language"
          className={
            actionData?.errors.language ? "border-2 border-red-500" : null
          }
        />
        <label htmlFor="description" className="block">
          Description
        </label>
        <input
          type="text"
          name="description"
          defaultValue={actionData?.values.description}
          id="description"
          className={
            actionData?.errors.description
              ? "border-2 border-red-500 resize-y"
              : null
          }
        />
        <label htmlFor="snippet" className="block">
          Snippet
        </label>
        <textarea
          type="text"
          name="snippet"
          defaultValue={actionData?.values.snippet}
          id="snippet"
          className={
            actionData?.errors.snippet ? "border-2 border-red-500" : null
          }
        />
        <br />
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
