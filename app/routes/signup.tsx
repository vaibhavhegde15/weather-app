import { useActionData } from '@remix-run/react';
import { redirect, ActionFunction, LoaderFunction } from '@remix-run/node';
import { TextField, Button, Typography, Box } from '@mui/material';
import { getUser, login } from '~/utils/auth.server'
import { createUser } from '~/utils/user.server';
export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect('/') : null
}
export default function Login() {
  const actionData = useActionData();


  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4">Signup</Typography>
      <form method="post">
        <TextField
          label="Username"
          name='username'
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name='password'
          type="password"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Signup</Button>
      </form>
      {actionData?.error && <Typography color="error">{actionData?.error}</Typography>}
    </Box>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const {username, password} = Object.fromEntries(formData);
  return await createUser({ username, password })
}
