import { useFetcher, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Toolbar,
  AppBar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Icon,
  Grid,
  Divider,
} from "@mui/material";
import CitySearchAdd from "~/components/CitySearchAdd";
import CardDetails from "~/components/CardDetails";
import { getUser, requireUserId, logout } from "~/utils/auth.server"; // Import the logout function
import { redirect } from "@remix-run/node";
import { addCity, removeCity } from "~/utils/user.server";

export async function loader({ request }: { request: Request }) {
  await requireUserId(request)
  return await getUser(request);
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action");
  if (actionType === "logout") {
    return await logout(request)
  }
  const cityName = formData.get("name");
  
  if (actionType === "add") {
   return await addCity(cityName, request)
  }

  if (actionType === "delete") {
    await removeCity(cityName, request)
  }
  return null
}

export default function Index() {
  const { username, cities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [weather, setWeather] = useState<any>(null);

  // Fetch weather data for the selected city
  const fetchWeather = async (city: string) => {
    const res = await fetch(`/api/weather?city=${city}`);
    const data = await res.json();
    setWeather(data);
  };

  // SVG for Filled Heart (Favorite)
  const FilledHeartSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgb(25, 118, 210)" />
    </svg>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Full-Width Header */}
      <AppBar position="static" sx={{ width: "100%", backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Welcome to Weather App, {username}
          </Typography>
          {/* Logout Button */}
          <Button
            color="inherit"
            onClick={() => fetcher.submit({_action: 'logout'}, { method: "post" })}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 200,
            backgroundColor: "#f5f5f5",
            padding: 2,
            height: "calc(100vh - 64px)", // Adjust height to exclude the AppBar
            overflow: "auto",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Favorite Cities
          </Typography>
          <List>
            {cities.map((cityName) => (
              <ListItem
                key={cityName}
                disablePadding
                onClick={() => fetchWeather(cityName)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: weather?.location?.name === cityName ? "#e0f7fa" : "inherit",
                  marginBottom: 1,
                  borderRadius: 1,
                }}
              >
                <ListItemText primary={cityName} sx={{ textTransform: "capitalize" }} />
                <IconButton
                  sx={{
                    color: "blue",
                  }}
                  onClick={(e) =>{ 
                    e.stopPropagation()
                    fetcher.submit(
                    { name: cityName, _action: "delete" },
                    { method: "post" }
                  )}
                }
                >
                  <FilledHeartSVG />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Main Content */}
        <Box sx={{ flex: 1, padding: 3 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Search a City
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: 1 }}>
              <CitySearchAdd onSelected={fetchWeather} />
            </Box>
          </Box>
          {/* Display Weather for Searched City */}
          {weather && !weather.error && (
            <CardDetails weather={weather} fav={cities.includes(weather.location.name)} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
