import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Obtener la cookie de sesión
    const authSession = request.cookies.get('auth-storage');
    const sessionData = authSession ? JSON.parse(authSession.value || '{}') : null;
    const isAuthenticated = !!sessionData?.token; // Verificar si el token existe
    console.log(sessionData)
    const isAuthPage = request.nextUrl.pathname === '/login';

    // Redirección si no está autenticado y no está en la página de login
    if (!isAuthenticated && !isAuthPage) {
      return NextResponse.redirect(new URL('/logins1', request.url));
    }

    // Redirección si está autenticado pero está en la página de login
    if (isAuthenticated && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Continuar con la solicitud si no aplica ninguna redirección
    return NextResponse.next();
  } catch (error) {
    console.error('Error en middleware:', error);
    return NextResponse.redirect(new URL('/logins2', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
