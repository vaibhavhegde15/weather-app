import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
const theme = createTheme();
export const links: LinksFunction = () => [];
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
