import {NextRequest, NextResponse} from "next/server";
import {container} from "./inversify.config";
import AuthService from "./lib/authService";

const authService = container.get<AuthService>('AuthService');

const protectedRoutes = [];
const apiProtectedRoutes = ['/api/appointments', '/api/provider/*'];
const publicRoutes = ['/login', '/register', '/profile', '/', '/api/appointment', '/api/providers', '/api/register', '/api/login'];

export const UserIDHeader = 'x-user-id';

export async function middleware(request: NextRequest) {
    let token = request.headers.get('Authorization') || '';
    token = token.replace(/^Bearer\s+/i, ''); // Remove "Bearer " prefix

    const pathname = request.nextUrl.pathname;
    if (!token && publicRoutes.includes(pathname)) { // check if the route is public
        return NextResponse.next()
    }

    const user = await authService.verifyToken(token);

    if (token && !user) {
        return new NextResponse(null, {status: 401});
    }

    if (user) {
        // inject user id into the request object
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set(UserIDHeader, user.id);
        return NextResponse.next({
            headers: requestHeaders
        })
    }

    if (protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    if (apiProtectedRoutes.some(route => pathname.startsWith(route))) {
        // respond with 401 unauthorized
        return new NextResponse(null, {status: 401});
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
}