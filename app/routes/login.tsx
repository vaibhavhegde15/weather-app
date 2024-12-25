import { useActionData } from '@remix-run/react';
import { redirect, ActionFunction, LoaderFunction } from '@remix-run/node';
import { TextField, Button, Typography, Box } from '@mui/material';
import { getUser, login } from '~/utils/auth.server';
export const loader: LoaderFunction = async ({ request }) => {
    // If there's already a user in the session, redirect to the home page

  return (await getUser(request)) ? redirect('/') : null;
};

export default function Login() {
  const actionData = useActionData();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4">Login</Typography>
      <form method="post">
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          required
          error={!!actionData?.usernameError}
          helperText={actionData?.usernameError}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          required
          error={!!actionData?.passwordError}
          helperText={actionData?.passwordError}
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      {actionData?.error && <Typography color="error">{actionData?.error}</Typography>}
    </Box>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { username, password } = Object.fromEntries(formData);

  // Validate form fields
  if (!username || !password) {
    return {
      error: 'Please provide both username and password.',
      usernameError: !username ? 'Username is required' : undefined,
      passwordError: !password ? 'Password is required' : undefined,
    };
  }

  // Attempt to log the user in
  try {
    return await login({ username, password });
  } catch (error) {
    // If login fails, return the error message
    return {
      error: 'Invalid username or password.',
    };
  }
};
