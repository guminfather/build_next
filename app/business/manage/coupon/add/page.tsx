'use client'

import { useRouter } from 'next/navigation';

import React, { useState, useEffect, useRef } from 'react';
import { createCoupon } from '@/lib/apis/partner';
import { useSignUpStore } from '@/stores/useSignUpStore';
import { Coupon } from '@/types/coupon';
import { getCookieName } from '@/lib/cookies';

//import { saveTokens } from '@/lib/businessAuth';



export default function BusinessCouponAdd() {

	let router = useRouter()

	const nameInputRef = useRef<HTMLInputElement>(null);

	var [couponName, setCouponName] = useState("할인쿠폰");
	var [discountRate, setDiscountRate] = useState(30);
	var [templateType, setTemplateType] = useState(2);
	var [usageStartDate, setUsageStartDate] = useState("2024-01-01");
	var [usageEndDate, setUsageEndDate] = useState("2024-10-10");
	var [issueStartDate, setIssueStartDate] = useState("2024-01-10");
	var [issueEndDate, setIssueEndDate] = useState("2024-10-10");
	var [benefitDescription, setBenefitDescription] = useState("ㅇㄹㄴㅇㄹ니");
	var [isUsable, setIsUsable] = useState("USABLE");
	var [isIssue, setIsIssue] = useState("N");

	//정규 표현식
	const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
	const discountRegex = /^(100|[1-9]?[0-9])$/;
	
	//쿠폰등록 버튼 클릭 핸들러 (handleSubmit)
	const handleSubmit = async () => {
		try {
			//nameInputRef.current?.focus(); /*********** 이름에 포커스 ******************* */

			if (!dateRegex.test(usageStartDate)) { //시작일 검증
				alert('사용기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(usageEndDate)) { //마지막일 검증
				alert('사용기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(issueStartDate)) { //시작일 검증
				alert('발급기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(issueEndDate)) { //마지막일 검증
				alert('발급기간 형식이 올바르지 않습니다.');
				return;
			}
			/*
			if (!discountRegex.test(typeof Number(discountRate))) { //할인율
				alert('형식이 올바르지 않습니다.');
				return;
			}*/
			
			const newCoupon: Coupon = {
				partnerId: ''+getCookieName("cookieBusinessId"),
				couponName: couponName,
				discountRate: discountRate,
				templateType: templateType,
				usageStartDate: usageStartDate,
				usageEndDate: usageEndDate,
				issueStartDate: issueStartDate,
				issueEndDate: issueEndDate,
				benefitDescription: benefitDescription,
				isUsable: "USABLE",
				isIssue : "N",
				issueDate : "",
				productNames: ["상품3","상품4","상품5"]
			}
            
            console.log(newCoupon)
			//쿠폰등록 API 호출
			const result = await createCoupon(newCoupon);
			if (result.success) {
				alert(`"쿠폰을 생성 하였습니다.`);
				router.push("./list"); //페이지 이동
			} else {
				alert(result.message);
				return;
			}
		} catch (err) {
			alert('쿠폰생성 실패');
		}
	};

	return (
		<div>
			<p>쿠폰 등록</p>
			<div>
				<dl>
					<dt>상호</dt>
					<dd>{getCookieName("cookieBusinessName")}</dd>
				</dl>
				<dl>
					<dt>쿠폰명</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="couponName"
						value={couponName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCouponName(e.target.value) }} /></dd>
				

				</dl>
				<dl>
					<dt>할인율</dt>
					<dd><input type="number" placeholder="입력해 주세요." name="discountRate"
						value={discountRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDiscountRate(parseFloat(e.target.value))}} /></dd>
				</dl>
				<dl>
					<dt>쿠폰타입</dt>
					<dd>
						<label>
							<input type="radio" name="templateType" value="1" checked={templateType === 1} 
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTemplateType(parseFloat(e.target.value))}} /> 템플릿 A
						</label>
						<label>
							<input type="radio" name="templateType" value="2" checked={templateType === 2} 
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTemplateType(parseFloat(e.target.value))}} /> 템플릿 B
						</label>
					</dd>
				</dl>
            	<dl>
					<dt>사용기간</dt>
					<dd>
						<div>
							<input type="date" name="usageStartDate" id="usageStartDate"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsageStartDate(e.target.value) }}
								value={usageStartDate} />
							<input type="date" name="usageEndDate" id="usageEndDate"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsageEndDate(e.target.value) }}
								value={usageEndDate} />
						</div>
					</dd>
				</dl>
				<dl>
					<dt>발급기간</dt>
					<dd>
						<div>
							<input type="date" name="issueStartDate" id="issueStartDate"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIssueStartDate(e.target.value) }}
								value={issueStartDate} />
							<input type="date" name="issueEndDate" id="issueEndDate"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIssueEndDate(e.target.value) }}
								value={issueEndDate} />
						</div>
					</dd>
				</dl>
				<dl>
					<dt>사용가능여부</dt>
					<dd>
						<label>
							<input type="radio" name="isUsable" value="USABLE" checked={isUsable === 'USABLE'} 
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsUsable(e.target.value)}} /> Y
						</label>
						<label>
							<input type="radio" name="isUsable" value="NOT_USABLE" checked={isUsable === 'NOT_USABLE'} 
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsUsable(e.target.value)}} /> N
						</label>
					</dd>
				</dl>



				<dl>
					<dt>해택내용</dt>
					<dd>
						<textarea value={benefitDescription} 
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBenefitDescription(e.target.value)}/>
					</dd>
				</dl>
			</div>	
			<div>
				<button onClick={handleSubmit} id="register">쿠폰등록</button>
			</div>

		</div>
	);
}




