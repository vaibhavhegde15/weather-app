import { LoginForm } from './types.server'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma.server'
import { createCookieSessionStorage, redirect } from '@remix-run/node'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
    cookie: {
        name: 'login-session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
})

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession()
    session.set('userId', userId)
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session),
        },
    })
}

export async function login({ username, password }: LoginForm) {
    const user = await prisma.user.findUnique({
        where: { username },
    })
    if (!user || !(await bcrypt.compare(password, user.password)))
        return Response.json({ error: `Incorrect Username or Password` }, { status: 400 })
    // if (!user || user.password !== password)
    //     return Response.json({ error: `Incorrect login` }, { status: 400 })
    
    // return { id: user.id, username }
    return createUserSession(user.id, "/");

}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    const session = await getUserSession(request)
    const userId = session.get('userId')
    if (!userId || typeof userId !== 'string') {
        const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
        throw redirect(`/login?${searchParams}`)
    }
    return userId
}

function getUserSession(request: Request) {
    return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request)
    const userId = session.get('userId')
    if (!userId || typeof userId !== 'string') return null
    return userId
}

export async function getUser(request: Request) {
    const userId = await getUserId(request)
    if (typeof userId !== 'string') {
        return null
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, cities: true },
        })
        return user
    } catch {
        throw logout(request)
    }
}

export async function logout(request: Request) {
    const session = await getUserSession(request)
    return redirect('/login', {
        headers: {
            'Set-Cookie': await storage.destroySession(session),
        },
    })
}