'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { getAdminAccessToken, getAdminRefreshToken, saveAdminTokens, isAdminTokenExpired, decodeAdminToken, removeAdminTokensCookies } from '@/lib/adminAuth';
import { refreshAccessToken } from '@/lib/apis/common';
import { removeCookieName } from '@/lib/cookies';

export default function AdminLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [user, setUser] = useState<{ userId: string; roles: string } | null>(null);
    const [isLoding, setIsLoding] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {
            const accessToken = getAdminAccessToken();
            const refreshToken = getAdminRefreshToken();

            //토큰여부, 토큰 유효기간 체크 
            if (accessToken && !isAdminTokenExpired(accessToken)) {
                const payload = decodeAdminToken(accessToken);
                setUser({ userId: payload.subject, roles: "Admin" }); //로그인 아이디, 롤정보
                setIsLoding(true);
            //토큰 재발급
            } else if (refreshToken && !isAdminTokenExpired(refreshToken)) {
                try {
                    console.log("- 토큰 재발급 ----------------------------")
                    const result = await refreshAccessToken(refreshToken);
                    if (result.success) {
                        console.log("data : ", result.value) //새토큰
                        saveAdminTokens(result.value, refreshToken); //새토큰,refreshToken 저장
                        const payload = decodeAdminToken(result.value); //새토큰 정보

                        console.log("다시 요청해서 받은 토큰 데이터 : ", payload)
                        setUser({ userId: payload.subject, roles: "Admin" }); //로그인 아이디, 롤정보

                        setIsLoding(true);

                    } else throw new Error(result.value || "토큰 재발급 실패");

                } catch (err) {
                    console.log("토큰 재생성 API 에러")
                    removeAdminTokensCookies();
                    setUser(null);
                    window.location.href = '/admin/login';
                }
            } else {
                console.log("모든 유효기간이 만료되었습니다.")
                removeAdminTokensCookies();
                setUser(null);
                
                window.location.href = '/admin/login';
                
            }

        };

        checkAuth();

    }, []);

    //로그아웃
    const handleLogout = () => {
        removeAdminTokensCookies();
        setUser(null);
        window.location.href = '/admin/login';
    };


    if (!isLoding) return <div className="p-6">로딩 중...</div>;

    return (
        <div>
            <div className="navbar2">
                {user ? (
                    <div>
                        <span>
                            관리자 {user.userId}님 환영합니다.
                        </span>

                        <Link href="/admin/manage/business/list">사업자 관리</Link>
                        <Link href="/admin/manage/coupon/list">쿠폰 관리</Link>
                        <Link href="/admin/manage/coupon/companylist">회원별 쿠폰관리</Link>
                        <Link href="/admin/manage/coupon/issuelist">쿠폰발급 목록</Link>
                        <button onClick={handleLogout}> 로그아웃 </button>
                    </div>
                ) : (
                    <a href="/admin/login">로그인</a>
                )}
            </div>
            {children}
        </div>

    );
}





