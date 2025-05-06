'use client';

import Link from "next/link";
import Modal from '@/components/modal';
import { useEffect, useState } from 'react';
import { refreshAccessToken } from '@/lib/apis/common';
import { getBusinessAccessToken, getBusinessRefreshToken, saveBusinessTokens
        , isBusinessTokenExpired, decodeBusinessToken, removeBusinessTokensCookies } from '@/lib/businessAuth';


export default function BusinessLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    const [user, setUser] = useState<{ userId: string; roles: string } | null>(null);
    const [isLoding, setIsLoding] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = getBusinessAccessToken();
            const refreshToken = getBusinessRefreshToken();
            
            console.log("accessToken : ", accessToken)
            console.log("refreshToken : ", refreshToken)
        
            //토큰여부, 토큰 유효기간 체크 
            if (accessToken && !isBusinessTokenExpired(accessToken)) {
                const payload = decodeBusinessToken(accessToken);
                setUser({ userId: payload.subject, roles: "Partner" }); //로그인 아이디, 롤정보
                setIsLoding(true);

            //토큰 재발급
            } else if (refreshToken && !isBusinessTokenExpired(refreshToken)) {
                try {
                    console.log("- 토큰 재발급 ----------------------------")
                    const result = await refreshAccessToken(refreshToken);
                    if (result.success) {
                        console.log("data : ", result.value) //새토큰
                        saveBusinessTokens(result.value, refreshToken); //새토큰,refreshToken 저장
                        const payload = decodeBusinessToken(result.value); //새토큰 정보

                        console.log("다시 요청해서 받은 토큰 데이터 : ", payload)
                        setUser({ userId: payload.subject, roles: "Partner" }); //로그인 아이디, 롤정보
                        
                        setIsLoding(true);
                    
                    } else throw new Error(result.message || "토큰 재발급 실패");
                        
                } catch (err) {
                    console.error("토큰 재발급 에러:", err);
                    removeBusinessTokensCookies();
                    setUser(null);
                    window.location.href = '/business/login';
                }
            } else {
                console.log("모든 유효기간이 만료되었습니다.")
                removeBusinessTokensCookies();
                setUser(null);
                window.location.href = '/business/login';
            }
        };
        checkAuth();
    }, []);

    //로그아웃
    const handleLogout = () => {
        removeBusinessTokensCookies();
        setUser(null);
        window.location.href = '/business/login';
    };

    if (!isLoding) return <div className="p-6">로딩 중...</div>;
    
    const openPopup = () => {
        window.open('/popup-content', 'popup', 'width=500,height=400');
    };

    return (
        <div>
            <div className="navbar2">
                {user ? (
                    <div>
                        <span>
                            사업자 {user.userId}님 환영합니다.
                        </span>
                        <Link href="/business/manage/coupon/list">쿠폰리스트</Link>
                        <Link href="/business/manage/edit">정보수정</Link>
                        <Link href="#" onClick={() => setIsOpen(true)}>비밀번호 변경</Link>
                        <Link href="#" onClick={() => openPopup()}>비밀번호 변경</Link>
                        
                        <button onClick={handleLogout}> 로그아웃 </button>
                    </div>
                ) : (
                    <a href="/business/login">로그인</a>
                )}


            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-lg font-semibold">🎉 팝업이 열렸습니다!</h2>
                <p className="mt-2">이곳에 원하는 내용을 표시하세요.</p>
            </Modal>

            </div>

            {children}
        </div>
    );
}





