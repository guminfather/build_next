'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';

import React, { useState, useEffect } from 'react';
import { businessLogin } from '@/lib/apis/common';
import { saveBusinessTokens } from '@/lib/businessAuth';
import { setCookieName } from '@/lib/cookies';
//import EcommerceViewsReport from '@/components/EcommerceViewsReport';

export default function LoginBusiness() {

    let router = useRouter()
    //console.log('사업자 > API  BASE URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    var [userId, setUserId] = useState("");
    var [userPw, setUserPw] = useState("");
    var [autoLogin, setAutoLogin] = useState(false);
    var [errerTxt, setErrerTxt] = useState(false);
    var [errerTxt2, setErrerTxt2] = useState(false);

    //"아이디 저장" 체크 되어 있는 경우
    useEffect(() => {
        const savedId = localStorage.getItem('savedBusinessId');
        if (savedId) {
            setUserId(savedId);
            setAutoLogin(true);
        }
    }, []);

    /* localStorage => useEffect에서만 사용해야함
    //로그인 성공시 localStorage에 토큰 저장 // tmpToken 값이 변경될때
    useEffect(()=>{
      if (typeof window != 'undefined') { //window 브라우저에서만 사용(에러방지지)
          localStorage.setItem('accessToken', tmpToken)
          localStorage.setItem('accessTokenExpired', tmpTokenExpired.toString())
      }
    },[tmpToken])
    */
 
    //로그인 버튼 클릭 핸들러 (handleLogin)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            //로그인 API 호출
            const result = await businessLogin(userId, userPw);
            if (result.success) {
				alert(`로그인 완료`);
				//console.log("* 사업자정보 : ", result.value.partner)  //userId, email,
                //console.log("* 토큰 : ",  result.value.token)
                //console.log("* 리플래쉬토큰큰 : ",  result.value.refreshToken)
                saveBusinessTokens(result.value.token, result.value.refreshToken); //받아온 토큰 저장
                setCookieName("cookieBusinessId", result.value.partner.partnerId, 60 * 60 * 24 * 30); //30일
                setCookieName("cookieBusinessName", result.value.partner.partnerName, 60 * 60 * 24 * 30); //30일
			} else {
				alert(result.message);
				return;
			}

            if (autoLogin) {
                localStorage.setItem('savedBusinessId', userId); //로그인 아이디 기억하기
            } else {
                localStorage.removeItem('savedBusinessId');
            }

            router.push("/business/manage");

        } catch (err) {
            alert('로그인 실패');

            /*
            console.error('API request failed:', data.code);
            console.error("errer msg : " + data.msg)
      
            if(data.code == 400) { //아이디,비빌번호 오류
                  setErrerTxt2(false)
                  setErrerTxt(true)
                  setUserPw("")
            } else { //data.code == 500 //서버오류
                  setErrerTxt(false)
                  setErrerTxt2(true)
            }	
                console.log('통신안됨 : ' + errer) 
            */
        }
    };


    return (
        <div>
            <p>사업자 로그인 페이지 입니다.</p>
            
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
                <button type="submit" id="login" >사업자 로그인</button>

                <input type="checkbox" id="rememberId" checked={autoLogin} onChange={() => setAutoLogin(!autoLogin)}/> 아이디 저장
            </form>
            
            
            <div>
                <p>비밀번호 찾기</p>
            </div>    
            <div>
            <p><a href="/business/register/agree">회원가입</a></p>
            </div>    
            {/*
            <div>
                달력력
                <input
                className="form-control form-control-solid w-100 mw-250px"
                placeholder="Pick date range"
                id="kt_ecommerce_report_views_daterangepicker"
                type="text"
                />
            </div>
            -->
            */}
            {/*<EcommerceViewsReport />*/}
        
        </div>
    );
}
