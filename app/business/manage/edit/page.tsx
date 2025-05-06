'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use, useRef } from 'react';
import { fetchPartnerDetail, updatePartner } from '@/lib/apis/partner';
import { PartnerResponse, PartnerRequest } from '@/types/partner';
import { getCookieBusinessId } from '@/lib/businessAuth';

//import { saveTokens } from '@/lib/businessAuth';



export default function PartnerEdit() {

	//params	동적 라우팅(폴더 경로)의 [id], [slug] 같은 URL 경로의 일부를 가져옴
	//searchParams	?key=value 형태의 쿼리 파라미터를 가져옴
	const partnerId = getCookieBusinessId()+'';
	const router = useRouter();
	const searchParams = useSearchParams();

	const nameInputRef = useRef<HTMLInputElement>(null);
	const [partner, setPartner] = useState<PartnerResponse | null>(null);
	
	//정규 표현식
	const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
	const discountRegex = /^(100|[1-9]?[0-9])$/;

	//useEffect
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchPartnerDetail(partnerId);
				setPartner(result.value);
			} catch (error) {
				console.error("데이터 가져오기 실패:", error);
			}
		};
		fetchData();
	}, [partnerId]);

	//사업자수정 버튼 클릭 핸들러 (handleSubmit)
	const handleSubmit = async () => {
		try {
			//nameInputRef.current?.focus(); /*********** 이름에 포커스 ******************* */
			/*
			if (!dateRegex.test(coupon?.usageStartDate || '')) { //시작일 검증
				alert('사용기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(coupon?.usageEndDate || '')) { //마지막일 검증
				alert('사용기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(coupon?.issueStartDate || '')) { //시작일 검증
				alert('발급기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(coupon?.issueEndDate || '')) { //마지막일 검증
				alert('발급기간 형식이 올바르지 않습니다.');
				return;
			}
			
			if (!discountRegex.test(typeof Number(coupon?.discountRate))) { //할인율
				alert('형식이 올바르지 않습니다.');
				return;
			}
			*/
			const newPartner: PartnerRequest = {
				partnerName: partner?.partnerName || '',
				partnerId: partner?.partnerId || '',
				partnerPassword: '',
				businessRegistrationNo: partner?.businessRegistrationNo || '',
				phone: partner?.phone || '',
				email: partner?.email || '',
				businessType: partner?.businessType || '',
				region: partner?.region || '',
				address: partner?.address || '',
				addressDetail: partner?.addressDetail || '',
				postalCode: partner?.postalCode || '',
			}
			console.log(newPartner)
			
			//사업자수정 API 호출
			const result = await updatePartner(newPartner);
			if (result.success) {
				alert(`사업자 정보를 수정 하였습니다.`); 
				router.push(`./`); //페이지 이동
			} else {
				alert(result.message);
				return;
			}
			
		} catch (err) {
			alert('사업자 정보 수정 실패');
		}
	};

	return (
		<div>
			<p>사업자 내 정보 수정</p>
			<div>
				<dl>
					<dt>아이디</dt>
					<dd>{partner?.partnerId}</dd>	
				</dl>
				<dl>
					<dt>상호</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="partnerName"
						value={partner?.partnerName || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, partnerName: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>사업자번호</dt>
					<dd>{partner?.businessRegistrationNo}</dd>	
				</dl>
				<dl>
					<dt>전화번호</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="phone"
						value={partner?.phone || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, phone: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>이메일</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="email"
						value={partner?.email || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, email: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>사업종류</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="businessType"
						value={partner?.businessType || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, businessType: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>지역</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="region"
						value={partner?.region || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, region: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>주소</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="address"
						value={partner?.address || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, address: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>상세주소</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="addressDetail"
						value={partner?.addressDetail || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, addressDetail: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>우편번호</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="postalCode"
						value={partner?.postalCode || ''} 
						onChange={e => setPartner(prev => ({ ...prev!, postalCode: e.target.value }))}/>
					</dd>	
				</dl>
			</div>
			<div>
				<button onClick={handleSubmit} id="register">사업자수정</button>
			</div>

		</div>
	);
}




