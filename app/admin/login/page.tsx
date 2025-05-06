'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { adminLogin } from '@/lib/apis/common';
import { setCookieName } from '@/lib/cookies';
import { saveAdminTokens } from '@/lib/adminAuth';


export default function LoginAdmin() {

    let router = useRouter()
    console.log('API BASE URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    var [userId, setUserId] = useState("");
    var [userPw, setUserPw] = useState("");
    var [autoLogin, setAutoLogin] = useState(false);
    var [errerTxt, setErrerTxt] = useState(false);
    var [errerTxt2, setErrerTxt2] = useState(false);

    
    //로그인 아이디 기억하기 이미 체크 되어 있는경우
    useEffect(() => {
        const savedId = localStorage.getItem('savedAdminId');
        if (savedId) {
            setUserId(savedId);
            setAutoLogin(true);
        }
    }, []);

    //로그인 버튼 클릭 핸들러 (handleLogin)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            //로그인 API 호출
            const result = await adminLogin(userId, userPw);
            if (result.success) {
                alert(`로그인 완료`);
                //console.log("* 사업자정보 : ", result.value.partner)  //userId, email,
                //console.log("* 토큰 : ",  result.value.token)
                //console.log("* 리플래쉬토큰큰 : ",  result.value.refreshToken)
                saveAdminTokens(result.value.token, result.value.refreshToken); //받아온 토큰 저장
                setCookieName("cookieAdminId", result.value.adminId, 60 * 60 * 24 * 30); //30일
                setCookieName("cookieAdminName", "관리자", 60 * 60 * 24 * 30); //30일
            } else {
                alert(result.message);
                return;
            }

            if (autoLogin) {
                localStorage.setItem('savedAdminId', userId); //로그인 아이디 기억하기
            } else {
                localStorage.removeItem('savedAdminId');
            }

            router.push("/admin/manage");
        } catch (err) {
            alert('로그인 실패');
        }
    };
    
    return (
        <div>
            <p>관리자 로그인 페이지 입니다.</p>
            <Link href="/admin/">관리자 메인 페이지 이동</Link>
            <form onSubmit={handleLogin}>
                <input name="userId" title="아이디" type="text" placeholder="아이디"
                    value={userId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUserId(e.target.value) }} />
                <input name="userPw" title="비밀번호" type="password" placeholder="비밀번호"
                    value={userPw} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUserPw(e.target.value) }} />
                {errerTxt ?
                    <div>
                        아이디 또는 비밀번호가 잘못 되었습니다.
                        아이디와 비밀번호를 정확히 입력해 주세요
                    </div> : ''
                }
                {errerTxt2 ?
                    <div>
                        내부 서버 오류입니다. 관리자에게 문의해주세요.
                    </div> : ''
                }
                <button type="submit" id="login" >관리자 로그인</button>

                <input
                    id="rememberId"
                    type="checkbox"
                    checked={autoLogin}
                    onChange={() => setAutoLogin(!autoLogin)}
                /> 아이디 저장
            </form>

            <p></p>
        </div>
    );
}




