import { useLoaderData, Link, useSubmit, Outlet, useLocation } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  const sortQuery = url.searchParams.get("s");
  const snippets = await db.models.Snippet.find(
    searchQuery
      ? {
          title: { $regex: new RegExp(searchQuery, "i") },
        }
      : {}
  ).sort(
    sortQuery
      ? {
          [sortQuery]: 1,
          language: 1,
        }
      : {
          favorite: -1,
          language: 1,
        }
  );
  return snippets;
}

export default function Snippet() {
  const snippets = useLoaderData();
  const submit = useSubmit();
  const location = useLocation();

  return (
    <div className="flex w-full space-x-10">
      <div className="w-3/12 bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Remix + Mongoose</h1>
        <h2 className="text-lg font-bold mb-3">
          Here are a few of my favorite snippets:
        </h2>
        <form
          className="sortForm"
          method="get"
          onChange={(e) => {
            submit(e.currentTarget);
          }}
        >
          <select
            className="mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            name="s"
            id="s"
          >
            <option value="" selected disabled hidden>
              Sort snippets
            </option>
            <option value="favorite">Favorite</option>
            <option value="title">Title</option>
            <option value="language">Language</option>
            <option value="dateAdded">Date</option>
          </select>
        </form>
        <form
          onChange={(e) => {
            submit(e.currentTarget);
          }}
          className="searchForm"
          method="get"
        >
          <input
            autoComplete="off"
            name="q"
            type="search"
            className="w-full mb-1"
            placeholder="Search snippet"
          />
        </form>
        <ul className="ml-5 list-disc">
          {snippets.map((snippet) => {
            return (
              <li key={snippet._id}>
                <Link
                  to={`/snippets/${snippet._id}${location.search}`}
                  className="text-blue-600 hover:underline"
                >
                  {snippet.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="w-9/12 bg-white rounded-lg p-6">
        <Outlet />
      </div>
    </div>
  );
}
