/*
import { NextRequest, NextResponse } from 'next/server';

// middleware 함수 정의
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 예: 인증이 필요한 경로 차단
    if (pathname.startsWith('/business/manage')) {
        const accessToken = request.cookies.get('adminAccessToken')?.value;
        const refreshToken = request.cookies.get('adminRefreshToken')?.value;

        if (!accessToken && !refreshToken) {
            const loginUrl = new URL('/business/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }else if (pathname.startsWith('/admin/manage')) {
        const accessToken = request.cookies.get('businessAccessToken')?.value;
        const refreshToken = request.cookies.get('businessRefreshToken')?.value;

       if (!accessToken && !refreshToken) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 기본 응답
    return NextResponse.next();
}

// middleware가 적용될 경로 지정
export const config = {
    matcher: [
        '/business/manage/:path*',
        '/admin/manage/:path*',
    ],
};*/