'use client'

import { useRouter } from 'next/navigation';

import React, { useState, useEffect, useRef } from 'react';
import { createCoupon, fetchPartnersAll } from '@/lib/apis/admin';
import { useSignUpStore } from '@/stores/useSignUpStore';
import { Coupon } from '@/types/coupon';
import { Partner } from '@/types/partner';
import { getCookieName } from '@/lib/cookies';

import "../../../../css/fullcalendar.bundle.css";
import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";
import { symlink } from 'fs';

export default function AdminCouponAdd() {

	let router = useRouter()

	const nameInputRef = useRef<HTMLInputElement>(null);

	var [partnerId, setPartnerId] = useState("kejgogo1111a");
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
	var [partners, setPartners] = useState<Partner[]>([]);
	var [productNames, setProductNames] = useState<string[]>([]);
	

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
				partnerId: partnerId,
				couponName: couponName,
				discountRate: discountRate,
				templateType: templateType,
				usageStartDate: usageStartDate,
				usageEndDate: usageEndDate,
				issueStartDate: issueStartDate,
				issueEndDate: issueEndDate,
				benefitDescription: benefitDescription,
				isUsable: "USABLE",
				isIssue: "N",
				issueDate: "",
				productNames: productNames.length > 0 ? 
								productNames
								: ["상품1", "상품2"],
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


	useEffect(() => {
		// 사업자 데이터 조회
		const fetchData = async () => {
			const result = await fetchPartnersAll();
			if (result.success) {
				//console.log("받아온 내용 : ", result.value)
				setPartners(result.value);
			} else {
				console.log(result.message);
				return;
			}
		};

		fetchData();
	}, []);


	return (
		<>
			<div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
				<div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
					<div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
						<h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">쿠폰등록</h1>
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
							<li className="breadcrumb-item text-muted">쿠폰등록</li>
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
											<select name="partnerId" value={partnerId}
												className="form-select form-select-sm form-select-solid"
												onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { 
													setPartnerId(e.target.value) 
												}}
                                            >
                                                <option value="">선택</option>
												{partners.map((m, i) => (
													<option value={m.partnerId} key={i}>{m.partnerId}/{m.partnerName}</option>
                                                ))}
                                            </select>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰명</label>
										<div className="col-lg-8 fv-row">
											<input type="text" name="couponName" className="form-control form-control-lg form-control-solid" placeholder="" 
											value={couponName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCouponName(e.target.value) }} />
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">할인율</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="number" name="discountRate" className="form-control form-control-lg form-control-solid mb-3 mb-lg-0" placeholder="숫자만 입력" 
													value={discountRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDiscountRate(parseFloat(e.target.value)) }} />
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
													<input type="radio" className="btn-check" name="templateType" value="1" checked={templateType === 1} id="kt_create_account_form_account_type_personal" 
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTemplateType(parseFloat(e.target.value)) }}/>
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
															<span className="text-muted fw-semibold fs-6">사용기간 : {usageStartDate.replace(/-/g, '.')}~{usageEndDate.replace(/-/g, '.')}</span>
														</span>
													</label>
												</div>
												<div className="col-lg-6">
													<input type="radio" className="btn-check" name="templateType" value="2" checked={templateType === 2} id="kt_create_account_form_account_type_corporate" 
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTemplateType(parseFloat(e.target.value)) }}/>
													<label className="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center" htmlFor="kt_create_account_form_account_type_corporate">
														<i className="ki-duotone ki-briefcase fs-3x me-5">
															<span className="path1"></span>
															<span className="path2"></span>
														</i>
														<span className="d-block fw-semibold text-start">
															<span className="text-dark fw-bold d-block fs-4 mb-2">상품명 및 할인율</span>
															<span className="text-muted fw-semibold fs-6">사용기간 : {usageStartDate.replace(/-/g, '.')}~{usageEndDate.replace(/-/g, '.')}</span>
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
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsageStartDate(e.target.value) }}
													value={usageStartDate} />
												</div>
												<div className="col-lg-6 fv-row">
													<input type="date" className="form-control form-control-solid" name="usageEndDate" placeholder="Pick a end date" id="kt_calendar_datepicker_end_date" 
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsageEndDate(e.target.value) }}
													value={usageEndDate} />
												</div>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">발급기간</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="date" name="issueStartDate"  className="form-control form-control-solid" placeholder="Pick a start date" id="kt_calendar_datepicker_start_date01" 
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIssueStartDate(e.target.value) }}
													value={issueStartDate} />
												</div>
												<div className="col-lg-6 fv-row">
													<input type="date" name="issueEndDate" className="form-control form-control-solid"  placeholder="Pick a end date" id="kt_calendar_datepicker_end_date01" 
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIssueEndDate(e.target.value) }}
													value={issueEndDate} />
												</div>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label fw-semibold fs-6">혜택내용</label>
										<div className="col-lg-8 fv-row">
											<textarea className="form-control form-control-solid" rows={3} 
											name="benefitDescription" placeholder="내용 입력" value={benefitDescription}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBenefitDescription(e.target.value)}></textarea>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰 사용여부</label>
										<div className="col-lg-8 fv-row">
											<div className="d-flex align-items-center mt-3">
												<label className="form-check form-check-custom form-check-inline form-check-solid me-5">
													<input name="isUsable" type="radio" value="USABLE" checked={isUsable === 'USABLE'} className="form-check-input me-3" id="kt_modal_update_role_option_0" 
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsUsable(e.target.value) }} />
													<span className="fw-semibold ps-2 fs-6">사용</span>
												</label>
												<label className="form-check form-check-custom form-check-inline form-check-solid">
													<input name="isUsable" type="radio" value="NOT_USABLE" checked={isUsable === 'NOT_USABLE'} className="form-check-input me-3"  id="kt_modal_update_role_option_1" 
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsUsable(e.target.value) }} />
													<span className="fw-semibold ps-2 fs-6">사용불가</span>
												</label>
											</div>
										</div>
									</div>
								</div>
								<div className="card-footer d-flex justify-content-end py-6 px-9">
									<button type="button" onClick={handleSubmit} className="btn btn-primary me-2" id="kt_account_profile_details_submit">쿠폰생성</button>
									<button type="button" className="btn btn-light btn-active-light-primary"
										onClick={() => { 
                                            router.push("../list"); //목록
                                        }}
										>목록</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}




