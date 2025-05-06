'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchBusinessCheck } from '@/lib/apis/common';
import { useSignUpStore } from '@/stores/useSignUpStore';
import { create } from 'zustand';






export default function BusinessAgree() {

    let router = useRouter()
    
    const { setBizNumber } = useSignUpStore();

    const [businessNumber, setBusinessNumber] = useState(""); //사업자등록번호
    const [businessCheck, setBusinessCheck] = useState(false); //사업자번호 정상인지, 비정상인지
    
    const [bizButtonCheck, setBizButtonCheck] = useState(false); //사업자번호 조회 버튼을 클릭했는지
    const [bizCheckResult, setBizCheckResult] = useState<string | null>(null); //조회후 결과 메세지
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        marketing: false,
        thirdParty: false,
    });
    
      
    


    //동의 체크박스 핸들러
    const handleCheckboxChange = (key: keyof typeof agreements) => {
        
        const newAgreements = {
            ...agreements,
            [key]: !agreements[key],
        };
        // 전체 동의 체크박스 처리
        if (key === 'all') {
            for (const k in agreements) {
                newAgreements[k as keyof typeof agreements] = !agreements.all;
            }
        }
        setAgreements(newAgreements);
        
    };

    //사업자번호 확인 핸들들러(API)
    const handleBisunissCheck = async () => {
        
        const total = await fetchBusinessCheck(businessNumber);
        
        setBusinessCheck(total>0 ? true : false);
        
        setBizButtonCheck(true);
        setBizCheckResult(total>0 ? '유효한 사업자입니다' : '사업자번호가 유효하지 않습니다');
    };

    
    //회원가입 다음단계 이동 핸들러 (handleSubmit)
    const handleSubmit = async () => {
        for (const k in agreements) {
            if(k!='all' && !agreements[k as keyof typeof agreements]) {
                alert("모두 동의 해주세요.");
                return ;
            }    
        }
        
        if(!bizButtonCheck) {
            alert("사업자 번호를 인증해 주세요.");
            return ;        
        } 
        if(!businessCheck) {
            alert("사업자번호가 유효하지 않습니다.");
            return ;        
        } 

        setBizNumber(businessNumber);
        router.push('./add');
        
    };
    
    



    return(
    <div>
        <h2>회원가입 동의서</h2>

        <div className="p-6 max-w-md mx-auto">



            <div>
                <label className="block mb-2">사업자등록번호</label>
                <input type="text" placeholder="사업자번호" value={businessNumber}
                    maxLength={10} className="border px-2 py-1 w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const input = e.target.value.replace(/\D/g, ''); // 숫자 외 문자 제거
                        setBusinessNumber(input);
                        setBusinessCheck(false);
                        setBizButtonCheck(false);
                    }}
                     />
                    숫자만 입력해 주세요.
                <button onClick={handleBisunissCheck} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
                    인증하기
                </button>
            </div>
            <div>                
                {bizCheckResult && <p className="mt-2 text-sm">{bizCheckResult}</p>}
            </div>

            <hr className="my-4" />
            <h2 className="text-xl font-bold mb-4">이용 약관 동의</h2>

            <label>
                <input type="checkbox" checked={agreements.all} onChange={() => handleCheckboxChange('all')} />전체 동의
            </label>
            <br />
            <label>
                <input type="checkbox" checked={agreements.terms} onChange={() => handleCheckboxChange('terms')} />이용 약관 (필수)
            </label>
            <br />
            <label>
                <input type="checkbox" checked={agreements.privacy} onChange={() => handleCheckboxChange('privacy')} />개인정보 수집 및 이용 (필수)
            </label>
            <br />
            <label>
                <input type="checkbox" checked={agreements.marketing} onChange={() => handleCheckboxChange('marketing')} />마케팅 수신 (선택)
            </label>
            <br />
            <label>
                <input type="checkbox" checked={agreements.thirdParty} onChange={() => handleCheckboxChange('thirdParty')} />제3자 정보 제공 (선택)
            </label>
        </div>
        <div>
            <input type="button" onClick={handleSubmit} value="다음단계"/>
        </div>
    </div>
    );
}