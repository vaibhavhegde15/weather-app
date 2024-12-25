import { getWeather } from "~/utils/weather.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const city = url.searchParams.get("city");

  if (!city) {
    return Response.json({ error: "City is required" }, { status: 400 });
  }

  try {
    const weather = await getWeather(city);
    return Response.json(weather);
  } catch (error) {

    return Response.json({ error: "City not found" }, { status: 404 });
  }
}
