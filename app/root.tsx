import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
const theme = createTheme();
import { LoaderFunction } from '@remix-run/node'
import { requireUserId } from '~/utils/auth.server'

// export const loader: LoaderFunction = async ({ request }) => {
//   await requireUserId(request)
//   return null
// }
export const links: LinksFunction = () => [

];
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}