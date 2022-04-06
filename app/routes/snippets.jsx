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
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 pr-2"
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
            className="w-full pr-8 pl-5 px-4 py-2.5 rounded-lg z-0 focus:shadow focus:outline-none text-sm bg-slate-100 mt-3 mb-5"
            placeholder="Search snippet"
          />
        </form>
        <ul className=" list-none w-full text-sm font-medium text-gray-900 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {snippets.map((snippet) => {
            return (
              <li key={snippet._id}>
                <Link
                  to={`/snippets/${snippet._id}${location.search}`}
                  className="text-base block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
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
