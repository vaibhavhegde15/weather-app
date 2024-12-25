import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";
    const apiKey = process.env.WEATHER_API_KEY;
    return fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    })
    .then(response => response.json())
    .then(cities => Response.json(cities.map(city => city.name)))
};