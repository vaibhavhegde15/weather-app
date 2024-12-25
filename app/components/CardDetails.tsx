import {
  Card,
  CardContent,
  IconButton,
  Box,
  Typography,
  Divider,
  Grid
} from "@mui/material";
import { useFetcher } from "@remix-run/react";

export default function CardDetails({ weather, fav }) {
  const fetcher = useFetcher();
  const toggleFavorite = () => {
    fetcher.submit(
      { name: weather.location.name, _action: fav ? "delete" : "add" },
      { method: "post" }
    );
  };

  if (!weather) return null;

  const getFormattedDate = () => {
    const today = new Date();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(today);
  };
  return (
    <>
      {fetcher?.data?.error && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography color="error">{fetcher?.data?.error}</Typography>
        </Box>)
      }
      <Card
        sx={{
          maxWidth: 400,
          margin: "auto",
          mt: 5,
          boxShadow: 3,
          borderRadius: 2,
          position: "relative", // For positioning the favorite button
        }}
      >
        {/* Favorite Icon */}
        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: fav ? "rgb(25, 118, 210)" : "gray",
          }}
          onClick={toggleFavorite}
        >
          {fav ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="rgb(25, 118, 210)"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="none"
                stroke="gray"
                strokeWidth="2"
              />
            </svg>
          )}
        </IconButton>

        <Box
          sx={{
            width: 400,
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Header */}
          <Typography variant="h5" align="center" gutterBottom>
            {weather.location.name}, {weather.location.region}
          </Typography>
          <Typography variant="subtitle2" align="center" color="textSecondary">
            {getFormattedDate()}
          </Typography>

          <Divider sx={{ my: 1 }} />

          {/* Temperature and Details */}
          <Typography variant="h4" align="center">
            {weather.current.temp_c + "° C"}
          </Typography>

          {/* Weather Icon below temperature */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              style={{ width: 50, height: 50 }}
            />
          </Box>

          <Typography variant="subtitle1" align="center" color="textSecondary">
            {weather.current.condition.text}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Weather Details */}
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">Wind Gusts</Typography>
              <Typography variant="body1">{weather.current.wind_kph} km/h</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Pressure</Typography>
              <Typography variant="body1">{weather.current.pressure_mb} mb</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Humidity</Typography>
              <Typography variant="body1">{weather.current.humidity}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Cloud Cover</Typography>
              <Typography variant="body1">{weather.current.cloud}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Precipitation</Typography>
              <Typography variant="body1">{weather.current.precip_mm}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Visibility</Typography>
              <Typography variant="body1">{weather.current.vis_km} km</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Dew Point</Typography>
              <Typography variant="body1">{weather.current.dewpoint_c}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">UV</Typography>
              <Typography variant="body1">{weather.current.uv}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
}
