import bcrypt from 'bcryptjs'
import type { LoginForm } from './types.server'
import { prisma } from './prisma.server'
import { redirect } from '@remix-run/node'
import { getUser, getUserId } from './auth.server'

export const createUser = async (user: LoginForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10)
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      password: passwordHash,
      cities: []
    },
  })
  return redirect('/login')
}

export const addCity = async (cityName: String, request: Request) => {
  try {
    const user = await getUser(request)

    if (user && user.cities.length >= 5) {
      // Optionally, you could return a message to inform the user
      return Response.json({ error: "You can only have up to 5 favorite cities." });
    }
    return await prisma.user.update({
      where: { id: await getUserId(request) },
      data: {
        cities: {
          push: cityName,
        },
      },
    });
  }
  catch (e) {
    return e
  }
}

export const removeCity = async (cityName: String, request: Request) => {
  try {
    const id = await getUserId(request)
    const { cities } = await prisma.user.findUnique({
      where: {
        id: id
      },
    });
    return await prisma.user.update({
      where: { id: id },
      data: {
        cities: cities.filter(city => city != cityName)
      },
    });
  }
  catch (e) {
    return e
  }
}