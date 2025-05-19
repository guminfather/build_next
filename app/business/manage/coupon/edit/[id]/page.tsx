'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use, useRef } from 'react';
import { fetchPartnerCouponDetail, updateCoupon } from '@/lib/apis/partner';
import { CouponResponse, CouponRequest } from '@/types/coupon';
import { getCookieName } from '@/lib/cookies';

//import { saveTokens } from '@/lib/businessAuth';

import "../../../../../css/fullcalendar.bundle.css";
import "../../../../../css/datatables.bundle.css";
import "../../../../../css/plugins.bundle.css";
import "../../../../../css/style.bundle.css";

export default function BusinessCouponEdit({ params }: { params: Promise<{ id: string }> }) {

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
				const result = await fetchPartnerCouponDetail(id);
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
				partnerId: '' + getCookieName("cookieBusinessId"),
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
				productNames: coupon?.productNames && (coupon.productNames).length > 0 ? 
								coupon.productNames
								: ["상품4", "상품5", "상품6", "상품7"]
			}
			console.log(newCoupon)
			
			//쿠폰수정 API 호출
			const result = await updateCoupon(newCoupon);
			if (result.success) {
				alert(`쿠폰을 수정 하였습니다.`); 
				router.push(`../${coupon?.couponId}?${searchParams.toString()}`); //페이지 이동
			} else {
				alert(result.message);
				return;
			}
			
		} catch (err) {
			alert('쿠폰생성 실패');
		}
	};

	return (
		<>
			<div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
				<div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
					<div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
						<h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">쿠폰수정</h1>
						<ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
							<li className="breadcrumb-item text-muted">
								<a href="../../demo1/dist/index.html" className="text-muted text-hover-primary">Home</a>
							</li>
							<li className="breadcrumb-item">
								<span className="bullet bg-gray-400 w-5px h-2px"></span>
							</li>
							<li className="breadcrumb-item text-muted">쿠폰관리</li>
							<li className="breadcrumb-item">
								<span className="bullet bg-gray-400 w-5px h-2px"></span>
							</li>
							<li className="breadcrumb-item text-muted">쿠폰수정</li>
						</ul>
					</div>
				</div>
			</div>

			<div id="kt_app_content" className="app-content flex-column-fluid">
				<div id="kt_app_content_container" className="app-container container-xxl">
					<div className="card mb-5 mb-xl-10">
						<div id="kt_account_settings_profile_details" className="collapse show">
							<form id="kt_account_profile_details_form" className="form">
								<div className="card-body border-top p-9">
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label fw-semibold fs-6">상호</label>
										<div className="col-lg-8 fv-row form-control-lg">
											{coupon?.partnerId},{coupon?.partnerName}
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰명</label>
										<div className="col-lg-8 fv-row">
											<input type="text" name="couponName" className="form-control form-control-lg form-control-solid" placeholder=""
												value={coupon?.couponName || ''}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, couponName: e.target.value })) }} />
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">할인율</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="number" name="discountRate" className="form-control form-control-lg form-control-solid mb-3 mb-lg-0" placeholder="숫자만 입력"
														value={coupon?.discountRate || 0}
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, discountRate: Number(e.target.value) })) }} />
												</div>
												<span className="col-lg-1 fw-semibold pt-7">%</span>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">템플릿 선택</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6">
													<input type="radio" className="btn-check" name="templateType" value="1" checked={coupon?.templateType === 1} id="kt_create_account_form_account_type_personal"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, templateType: Number(e.target.value) })) }} />
													<label className="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center" htmlFor="kt_create_account_form_account_type_personal">
														<i className="ki-duotone ki-badge fs-3x me-5">
															<span className="path1"></span>
															<span className="path2"></span>
															<span className="path3"></span>
															<span className="path4"></span>
															<span className="path5"></span>
														</i>
														<span className="d-block fw-semibold text-start">
															<span className="text-dark fw-bold d-block fs-4 mb-2">상품명 및 할인율</span>
															<span className="text-muted fw-semibold fs-6">
																사용기간 : {coupon?.usageStartDate.replace(/-/g, '.')}~{coupon?.usageEndDate.replace(/-/g, '.')}
															</span>
														</span>
													</label>
												</div>
												<div className="col-lg-6">
													<input type="radio" className="btn-check" name="templateType" value="2" checked={coupon?.templateType === 2} id="kt_create_account_form_account_type_corporate"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, templateType: Number(e.target.value) })) }} />
													<label className="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center" htmlFor="kt_create_account_form_account_type_corporate">
														<i className="ki-duotone ki-briefcase fs-3x me-5">
															<span className="path1"></span>
															<span className="path2"></span>
														</i>
														<span className="d-block fw-semibold text-start">
															<span className="text-dark fw-bold d-block fs-4 mb-2">상품명 및 할인율</span>
															<span className="text-muted fw-semibold fs-6">
																사용기간 : {coupon?.usageStartDate.replace(/-/g, '.')}~{coupon?.usageEndDate.replace(/-/g, '.')}
															</span>
														</span>
													</label>
												</div>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">사용기간</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="date" className="form-control form-control-solid" name="usageStartDate" placeholder="Pick a start date" id="kt_calendar_datepicker_start_date"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, usageStartDate: e.target.value })) }}
														value={coupon?.usageStartDate || ''} />
												</div>
												<div className="col-lg-6 fv-row">
													<input type="date" className="form-control form-control-solid" name="usageEndDate" placeholder="Pick a end date" id="kt_calendar_datepicker_end_date"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, usageEndDate: e.target.value })) }}
														value={coupon?.usageEndDate || ''} />
												</div>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">발급기간</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="date" name="issueStartDate" className="form-control form-control-solid" placeholder="Pick a start date" id="kt_calendar_datepicker_start_date01"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, issueStartDate: e.target.value })) }}
														value={coupon?.issueStartDate || ''} />
												</div>
												<div className="col-lg-6 fv-row">
													<input type="date" name="issueEndDate" className="form-control form-control-solid" placeholder="Pick a end date" id="kt_calendar_datepicker_end_date01"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => ({ ...prev!, issueEndDate: e.target.value })) }}
														value={coupon?.issueEndDate || ''} />
												</div>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label fw-semibold fs-6">혜택내용</label>
										<div className="col-lg-8 fv-row">
											<textarea className="form-control form-control-solid" rows={3}
												name="benefitDescription" placeholder="내용 입력" value={coupon?.benefitDescription}
												onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCoupon(prev => ({ ...prev!, benefitDescription: e.target.value }))}></textarea>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰 사용여부</label>
										<div className="col-lg-8 fv-row">
											<div className="d-flex align-items-center mt-3">
												<label className="form-check form-check-custom form-check-inline form-check-solid me-5">
													<input name="isUsable" type="radio" value="USABLE" checked={coupon?.isUsable === 'USABLE'} className="form-check-input me-3" id="kt_modal_update_role_option_0"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => prev ? { ...prev, isUsable: e.target.value as 'USABLE' | 'NOT_USABLE' } : null) }} />
													<span className="fw-semibold ps-2 fs-6">사용</span>
												</label>
												<label className="form-check form-check-custom form-check-inline form-check-solid">
													<input name="isUsable" type="radio" value="NOT_USABLE" checked={coupon?.isUsable === 'NOT_USABLE'} className="form-check-input me-3" id="kt_modal_update_role_option_1"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCoupon(prev => prev ? { ...prev, isUsable: e.target.value as 'NOT_USABLE' | 'USABLE' } : null) }} />
													<span className="fw-semibold ps-2 fs-6">사용불가</span>
												</label>
											</div>
										</div>
									</div>
								</div>
								<div className="card-footer d-flex justify-content-end py-6 px-9">
									<button type="button" onClick={handleSubmit} className="btn btn-primary" id="kt_account_profile_details_submit">쿠폰수정</button>
									<button type="button" onClick={() => { 
                                            router.push(`../list?${searchParams.toString()}`); //목록
                                        }}
										className="btn btn-light btn-active-light-primary me-2">목록</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}




