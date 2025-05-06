'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use, useRef } from 'react';
import { fetchAdminCouponDetail, updateCoupon } from '@/lib/apis/admin';
import { CouponResponse, CouponRequest } from '@/types/coupon';
import { getCookieName } from '@/lib/cookies';

//import { saveTokens } from '@/lib/businessAuth';



export default function AdminCouponEdit({ params }: { params: Promise<{ id: string }> }) {

	//params	동적 라우팅(폴더 경로)의 [id], [slug] 같은 URL 경로의 일부를 가져옴
	//searchParams	?key=value 형태의 쿼리 파라미터를 가져옴
	const { id } = use(params);
	const router = useRouter();
	const searchParams = useSearchParams();

	const nameInputRef = useRef<HTMLInputElement>(null);
	const [coupon, setCoupon] = useState<CouponResponse | null>(null);
	
	//정규 표현식
	const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
	const discountRegex = /^(100|[1-9]?[0-9])$/;

	//useEffect
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchAdminCouponDetail(id);
				setCoupon(result.value);
			} catch (error) {
				console.error("데이터 가져오기 실패:", error);
			}
		};
		fetchData();
	}, [id]);

	//쿠폰등록 버튼 클릭 핸들러 (handleSubmit)
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
			const newCoupon: CouponRequest = {
				couponId: coupon?.couponId || 0,
				partnerId: coupon?.partnerId || '',
				couponName: coupon?.couponName || '',
				discountRate: coupon?.discountRate || 0,
				templateType: coupon?.templateType || 1,
				usageStartDate: coupon?.usageStartDate || '',
				usageEndDate: coupon?.usageEndDate || '',
				issueStartDate: coupon?.issueStartDate || '',
				issueEndDate: coupon?.issueEndDate || '',
				benefitDescription: coupon?.benefitDescription || '',
				isUsable: coupon?.isUsable ? coupon.isUsable : 'USABLE', // 수정
  				isIssue: coupon?.isIssue ? coupon.isIssue : 'Y',         // 수정
				issueDate: coupon?.issueDate || '',
				productNames: coupon?.productNames || [],
			}
			console.log(newCoupon)
			
			//쿠폰수정 API 호출
			const result = await updateCoupon(newCoupon);
			if (result.success) {
				alert(`쿠폰을 수정 하였습니다.`); 
				router.push(`../list?${searchParams.toString()}`); //페이지 이동
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
			<p>쿠폰 수정</p>
			<div>
				<dl>
					<dt>사업자</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="partnerId"
						value={coupon?.partnerId || ''} 
						onChange={e => setCoupon(prev => ({ ...prev!, partnerId: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>쿠폰명</dt>
					<dd><input type="text" placeholder="입력해 주세요." name="couponName"
						value={coupon?.couponName || ''} 
						onChange={e => setCoupon(prev => ({ ...prev!, couponName: e.target.value }))}/>
					</dd>	
				</dl>
				<dl>
					<dt>할인율</dt>
					<dd><input type="number" placeholder="입력해 주세요." name="discountRate"
						value={coupon?.discountRate || 0} 
						onChange={(e) => setCoupon(prev => ({ ...prev!, discountRate: Number(e.target.value) }))}/>
					</dd>
				</dl>
				<dl>
					<dt>쿠폰타입</dt>
					<dd>
						<label>
							<input type="radio" name="templateType" value="1" checked={coupon?.templateType === 1}
								onChange={(e) => setCoupon(prev => ({ ...prev!, templateType: Number(e.target.value) }))}/>
						</label>
						<label>
							<input type="radio" name="templateType" value="2" checked={coupon?.templateType === 2}
								onChange={(e) => setCoupon(prev => ({ ...prev!, templateType: Number(e.target.value) }))}/>
						</label>
					</dd>
				</dl>
				<dl>
					<dt>사용기간</dt>
					<dd>
						<div>
							<input type="date" name="usageStartDate" id="usageStartDate"
								onChange={(e) => setCoupon(prev => ({ ...prev!, usageStartDate: e.target.value }))}
								value={coupon?.usageStartDate || ''} />
							<input type="date" name="usageEndDate" id="usageEndDate"
								onChange={(e) => setCoupon(prev => ({ ...prev!, usageEndDate: e.target.value }))}
								value={coupon?.usageEndDate || ''} />
						</div>
					</dd>
				</dl>
				<dl>
					<dt>발급기간</dt>
					<dd>
						<div>
							<input type="date" name="issueStartDate" id="issueStartDate"
								onChange={(e) => setCoupon(prev => ({ ...prev!, issueStartDate: e.target.value }))}
								value={coupon?.issueStartDate || ''} />
							<input type="date" name="issueEndDate" id="issueEndDate"
								onChange={(e) => setCoupon(prev => ({ ...prev!, issueEndDate: e.target.value }))}
								value={coupon?.issueEndDate || ''} />
						</div>
					</dd>
				</dl>
				<dl>
					<dt>사용가능여부</dt>
					<dd>
						<label>
							<input type="radio" name="isUsable" value="USABLE" checked={coupon?.isUsable === 'USABLE'}
								onChange={(e) =>
									setCoupon(prev => prev ? { ...prev, isUsable: e.target.value as 'USABLE' | 'NOT_USABLE' } : null)
								} />
						</label>
						<label>
							<input type="radio" name="isUsable" value="NOT_USABLE" checked={coupon?.isUsable === 'NOT_USABLE'}
								onChange={(e) =>
									setCoupon(prev => prev ? { ...prev, isUsable: e.target.value as 'NOT_USABLE' | 'USABLE' } : null)
								} />
						</label>
					</dd>
					
				</dl>



				<dl>
					<dt>해택내용</dt>
					<dd>
						<textarea value={coupon?.benefitDescription}
							onChange={(e) => setCoupon(prev => ({ ...prev!, benefitDescription: e.target.value }))}/>
					</dd>
				</dl>
			</div>
			<div>
				<button onClick={handleSubmit} id="register">쿠폰수정</button>
			</div>

		</div>
	);
}




