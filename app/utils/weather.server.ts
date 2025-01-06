export const getWeather = async (city: String) => {
   const apiKey = process.env.WEATHER_API_KEY;
   const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
   const response = await fetch(weatherUrl).then(response=>response.json());
   return response;
};
