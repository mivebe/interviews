import type { Context } from "@netlify/functions";

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("query") ?? "";

  try {
    const response = await fetch(
      `https://excitel-countries.azurewebsites.net/countries/${searchQuery}`
    );
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch countries" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
