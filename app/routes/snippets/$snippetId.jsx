import { useLoaderData, json, useCatch, Link, redirect } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response(`Couldnt find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  return json(snippet);
}

//DELETE
export const action = async ({ request, params }) => {
  const db = await connectDb();
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const snippets = await db.models.Snippet.findById(params.snippetId);

    if (!snippets) throw new Error("Snippet not found");

    await snippets.delete({ where: { id: params.snippetId } });
    return redirect("../");
  } else if (form.get("_method") === "favorite") {
    const snippet = await db.models.Snippet.findById(params.snippetId);
    snippet.favorite = !snippet.favorite;
    snippet.save();
  }
  return null;
};

export default function SnippetPage() {
  const snippet = useLoaderData();
  const showDate = new Date(snippet.dateAdded);
  const date = showDate.getDate();
  const month = showDate.getMonth() + 1;
  const year = showDate.getFullYear();
  return (
    <>
      <div className="space-y-5">
        <div className="flex space-x-10">
          <h1 className="text-2xl font-bold py-3">{snippet.title}</h1>
          <p className="bg-slate-100 rounded-lg py-4 px-3 font-medium">
            {snippet.language}
          </p>
          <form method="POST">
            <input type="hidden" name="_method" value="favorite" />
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={snippet.favorite ? "yellow" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </form>
          <p className="py-3 flex-1 text-right font-medium">
            {date}.{month}.{year}
          </p>
        </div>
        <div className="bg-slate-100 rounded-lg">
          <code>
            <pre className="whitespace-normal p-5">{snippet.snippet}</pre>
          </code>
        </div>
        <p className="resize-y">{snippet.description}</p>
      </div>
      <div className="flex w-max space-x-5 mt-12">
        <div className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          <form method="POST">
            <input type="hidden" name="_method" value="update" />
            <Link to={`/snippets/update/${snippet._id}`}>Update Snippet</Link>
          </form>
        </div>
        <div className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button>Delete snippet</button>
          </form>
        </div>
      </div>

      <div>
        <form method="POST">
          <input type="hidden" name="_method" value="favorite" />
        </form>
      </div>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      {caught.status}
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
