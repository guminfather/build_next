'use client'

import { useRouter } from 'next/navigation';

import React, { useState, useEffect, useRef } from 'react';
import { register, fetchBusinessIdCheck } from '@/lib/apis/common';
import { useSignUpStore } from '@/stores/useSignUpStore';
import { Partner } from '@/types/partner';

//import { saveTokens } from '@/lib/businessAuth';
//import { setCookieName } from '@/lib/cookies';


export default function BusinessAdd() {

	let router = useRouter()

	const { bizNumber } = useSignUpStore(); //동의 페이지에서 받아온 사업자 번호 

	const [isFormatValid, setIsFormatValid] = useState<boolean | null>(null);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [checkClicked, setCheckClicked] = useState(false);

	const nameInputRef = useRef<HTMLInputElement>(null);

	var [userId, setUserId] = useState("kejgogo");
	var [name, setName] = useState("김은정"); //회사명
	var [pw, setPw] = useState("1111");
	var [pwRe, setPwRe] = useState("1111");
	var [hp1, setHp1] = useState("010"); //전화번호
	var [hp2, setHp2] = useState("92646071");
	var [email1, setEmail1] = useState("kejgogogo"); //이메일
	var [email2, setEmail2] = useState("naver.com");
	var [zipcode, setZipcode] = useState("123456"); //주소
	var [addr1, setAddr1] = useState("경기도 김포시 김포한강2로 273");
	var [addr2, setAddr2] = useState("503동 1002호");
	var [region, setRegion] = useState("서울");
	
	//유효값 체크 필드
	const [valid, setValid] = useState({
		email: false,
		password: false,
		name: false,
		phone: false,
		id: false,
	});

	//정규 표현식
	const usernameRegex = /^[a-z][a-z0-9]{3,11}$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
	const nameRegex = /^[가-힣]{2,}$/;
	const phoneRegex = /^(01[016789]|070)\d{7,8}$/;

	//아이디 change시 
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value; //아이디값값
		setUserId(value);
		setIsFormatValid(usernameRegex.test(value)); //문자열value가 정규 표현식 객체를 참조하는지(true) 아닌지(false)
		setIsAvailable(null); // 중복 상태 초기화
		setCheckClicked(false); // 중복 버튼 클릭 여부
	};
	
	//중복확인 버튼 클릭시
	const checkDuplicate = async () => {
		setIsAvailable(false);
		if (!isFormatValid) { //정규식에 맞지 안을경우
			alert('아이디 형식이 올바르지 않습니다.');
			return;
		}
		//중복확인 api 호출
		const result = await fetchBusinessIdCheck(userId);
		if (result.success) {
			//alert("사용 가능한 사업자 아이디입니다!");
			setIsAvailable(true); // 가입가능
		} else {
			//alert(`사용 불가: ${result.message}`);
			setIsAvailable(false); // 가입불능
		}
		setCheckClicked(true); // 중복확인 버튼 클릭 완료
	};

	//회원가입 버튼 클릭 핸들러 (handleSubmit)
	const handleSubmit = async () => {
		try {
			if (!isFormatValid) {
				alert('아이디 형식이 올바르지 않습니다.');
				return;
			}
			if (!checkClicked || isAvailable === false) {
				alert('아이디 중복 확인을 완료해주세요.');
				return;
			}
			/*
			if (!passwordRegex.test(pw)) { //비밀번호 검증	영문/숫자/특수문자 포함, 8자 이상
				alert('비밀번호 형식이 올바르지 않습니다.\n(영문/숫자/특수문자 포함, 8자 이상)');
				return;
			}
			*/
			if (pw != pwRe) { //비밀번호 검증	영문/숫자/특수문자 포함, 8자 이상
				alert('비밀번호가 서로 일치 하지 않습니다.');
				return;
			}
			if (!nameRegex.test(name)) { //이름 검증	
				alert('이름 형식이 올바르지 않습니다.\n(한글 2자 이상)');
				nameInputRef.current?.focus(); /*********** 이름에 포커스 ******************* */
				return;
			}
			if (!emailRegex.test(email1 + '@' + email2)) { //이메일 검증	@ 포함, 일반 이메일 형식
				alert('이메일 형식이 올바르지 않습니다.\n(@ 포함, 일반 이메일 형식)');
				return;
			}
			if (!phoneRegex.test(hp1 + '' + hp2)) { //휴대폰 번호 검증	숫자만, 010으로 시작, 10~11자
				alert('휴대폰 형식이 올바르지 않습니다.\n(010/011 등으로 시작, 숫자만, 10~11자리)');
				return;
			}
			if (!addr1.trim()) {
				alert('우편번호를 클릭해주세요.');
				return;
			}
			if (!addr2.trim()) {
				alert('상세주소를 입력해주세요');
				return;
			}

			const newPartner: Partner = {
				partnerName: name,      // 상호명
				partnerId: userId,      // 로그인 아이디
				partnerPassword: pw,    // 로그인 비밀번호
				businessRegistrationNo: bizNumber,
				phone: hp1 + hp2,		//전화번호
				email: email1 + email2,              // 이메일
				businessType: '',       // 
				region: region,             // 지역
				address: addr1,            // 우편번호
				addressDetail: addr2,      // 주소1
				postalCode: zipcode,         // 주소2
			};
			//회원가입 API 호출
			const result = await register(newPartner);
			if (result.success) {
				alert(`"${userId}"로 가입이 완료되었습니다!\n로그인 페이지로 이동합니다.`);
				router.push("/business/login"); //페이지 이동
			} else {
				alert(result.message);
				return;
			}
		} catch (err) {
			alert('회원가입 실패');
		}
	};

	//focus 타이밍 (상세주소) 를 위한(다음 우편번호)
	const addr2Ref = useRef<HTMLInputElement>(null); // DOM 요소를 addr2Ref에에 할당

	//우편번호 클릭시 (다음 우편번호 팝업 띄움)
	const openPostcode = () => {
		const { daum } = window as any;
		new daum.Postcode({
			oncomplete: (data: { zonecode: string, address: string }) => {
				setZipcode(data.zonecode);
				setAddr1(data.address);
				//focus 타이밍 (상세주소)
				setTimeout(() => {
					addr2Ref.current?.focus();
				}, 0);
			},
		}).open();
	};

	useEffect(() => {
		// 다음 우편번호 스크립트 삽입(다음 기본셋팅)
		const script = document.createElement('script');
		script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
		script.async = true;
		document.body.appendChild(script);
		if (!bizNumber) {
			alert("사업자 번호가 없네요. 동의 페이지로 이동합니다.")
			//router.push("/manage/business/agree");
		}
	}, []);


	return (
		<div>
			<p>회원가입 페이지</p>
			<div>
				<dl>
					<dt>사업자번호</dt>
					<dd><input type="text" placeholder="사업자번호" name="easyLoginId" readOnly
						value={bizNumber} /></dd>
				</dl>
				<dl>
					<dt>이름</dt>
					<dd><input type="text" placeholder="이름을 입력해 주세요." name="name"
						ref={nameInputRef}
						value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }} /></dd>
				</dl>
				<dl>
					<dt>아이디</dt>
					<dd>
						<input type="text" value={userId} onChange={handleChange} placeholder="영문 시작, 4~12자" className="border p-2 flex-1" />
						<button onClick={checkDuplicate} id="id-button" className="bg-blue-500 text-white px-3 py-1 rounded">중복 확인</button>
						<div>
							{isFormatValid === false && (
								<p className="text-red-500 text-sm mt-1">
									❗ 아이디는 영문으로 시작하고, 영문+숫자 조합 4~12자여야 합니다.
								</p>
							)}
							{checkClicked && isAvailable === true && (
								<p className="text-green-600 text-sm mt-1">✅ 사용 가능한 아이디입니다.</p>
							)}
							{checkClicked && isAvailable === false && (
								<p className="text-red-600 text-sm mt-1">❌ 이미 사용 중인 아이디입니다.</p>
							)}
						</div>
					</dd>
				</dl>

				<dl>
					<dt>비밀번호</dt>
					<dd>
						<input type="password" placeholder="대소문자 구별, 영문숫자 혼합하여 6~13자리 입력"
							name="pw" value={pw} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPw(e.target.value) }} />
						<input type="password"
							name="pwRe" value={pwRe} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPwRe(e.target.value) }}
							placeholder="비밀번호를 한번 더 입력해 주세요." />
					</dd>
				</dl>
				<dl>
					<dt>휴대전화</dt>
					<dd>
						<div>
							<select name="NO_TEL1" id="NO_TEL1"
								value={hp1} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setHp1(e.target.value) }}>
								<option value="">선택</option>
								{["010", "011", "016", "017", "018", "019", "070"].map((no) => (
									<option key={no} value={no}>{no}</option>
								))}
							</select>
							<input type="tel" name="NO_TEL2" id="NO_TEL2"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setHp2(e.target.value) }}
								value={hp2} maxLength={8} placeholder="-없이 숫자만 입력" />
						</div>
					</dd>
				</dl>
				<dl>
					<dt>이메일</dt>
					<dd>
						<input type="text" name="email" title="이메일" id="email"
							value={email1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail1(e.target.value) }} />
						<span>@</span>
						<input type="text" name="email-1" id="email-1"
							value={email2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail2(e.target.value) }} />
					</dd>
				</dl>
				<dl>
					<dt>사업분야</dt>
					<dd>
						<select value={region} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setRegion(e.target.value) }} name="region" id="region">
							<option value="">선택</option>
							<option value="과학">과학</option>
							<option value="수학">수학</option>
							<option value="영어">영어</option>
							<option value="독서">독서</option>
							<option value="사회">사회</option>
						</select>
					</dd>
				</dl>
				<dl>
					<dt>주소</dt>
					<dd>
						<div>
							<button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
								onClick={openPostcode}>우편번호 찾기</button>

							<input type="text" name="zipcode" value={zipcode} title="우편번호" id="zipcode"
								onChange={(e) => { setZipcode(e.target.value) }} readOnly />

						</div>
						<input type="text" name="addr1" value={addr1} title="주소" id="addr1"
							onChange={(e) => { setAddr1(e.target.value) }} readOnly />
						<input type="text" name="addr2" value={addr2} title="상세주소" id="addr2"
							onChange={(e) => { setAddr2(e.target.value) }}
							ref={addr2Ref} />
					</dd>
				</dl>
			</div>
			<div>
				<button onClick={handleSubmit} id="register">회원가입</button>
			</div>

		</div>
	);
}




