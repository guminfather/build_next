'use client'

import { useEffect, useState, use, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Partner } from '@/types/partner';
import { CouponResponse, CouponRequest, CouponProduct } from '@/types/coupon';
import { hasText, rangeDate } from '@/utils/common';
import { dateRegex, discountRegex } from '@/utils/regex';
import { fetchAdminCouponDetail, updateCoupon, fetchPartnersAll, deleteCoupon, checkDeleteCoupon } from '@/lib/apis/admin';

import "../../../../css/fullcalendar.bundle.css";
import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";

export default function AdminCouponEdit({ params }: { params: Promise<{ id: string }> }) {

	//params	동적 라우팅(폴더 경로)의 [id], [slug] 같은 URL 경로의 일부를 가져옴
	//searchParams	?key=value 형태의 쿼리 파라미터를 가져옴
	const { id } = use(params);
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryString = (searchParams as unknown as URLSearchParams).toString();

	const [partners, setPartners] = useState<Partner[]>([]);
	const [coupon, setCoupon] = useState<CouponResponse | null>(null);
	const [couponProducts, setCouponProducts] = useState<CouponProduct[]>([])
	
	//쿠폰삭제
	const handleDelete = async () => {
		if (!confirm(" 쿠폰을 정말 삭제 하시겠습니까? ")) return;
		try {
			const res = await checkDeleteCoupon(Number(id));
			//console.log("결과 : " , res.success);
			if (res.success) {
				const result = await deleteCoupon(Number(id));
				if (result.success) {
					alert(`쿠폰을 삭제 하였습니다.`);
					router.push(`../list`); //페이지 이동
				} else {
					alert(result.message);
					return;
				}
			} else {
				alert(`사용중인 쿠폰은 삭제 할수 없습니다.`);
			}
		} catch (error) {
			console.error("데이터 삭제 실패:", error);
		}
	};

	//useEffect
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchAdminCouponDetail(id);
				setCoupon(result.value);

				// 문자열 배열을 Product[] 형태로 변환
				const converted = result.value.productNames.map((name: string, index: number) => ({
					id: Date.now() + index, // 고유 ID 생성
					name
				}))
				setCouponProducts(converted)

			} catch (error) {
				console.error("데이터 가져오기 실패:", error);
			}
		};
		fetchData();
	}, [id]);

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
						<h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">쿠폰수정</h1>
						<ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
							<li className="breadcrumb-item text-muted">
								<a href="/admin/manage" className="text-muted text-hover-primary">Home</a>
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
											{`${coupon?.partnerName + " ( ID : " + (coupon?.partnerId || '') + " )"}`}
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰명</label>
										<div className="col-lg-8 fv-row form-control-lg">
											{coupon?.couponName}
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">할인율</label>
										<div className="col-lg-8 fv-row form-control-lg">
											{coupon?.discountRate} %
										</div>
									</div>

									{/*--------------------------------------------------------------------*/}
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">상품명</label>
										<div className="col-lg-8 fv-row form-control-lg">
											{coupon?.productNames.map((product, index) => (
                                                <div className="row" key={index}>
                                                    <div className="col-lg-6 fv-row">
                                                        {index+1}. {product}
                                                    </div>
                                                </div>
                                            ))}
										</div>
									</div>
									{/*--------------------------------------------------------------------*/}
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">템플릿 선택</label>
										<div className="col-lg-8">
											<div className="row">
												{(coupon?.templateType || '') === 1 ?
                                                    <div className="col-lg-6">
                                                        <input type="radio" className="btn-check" name="templateType" id="kt_create_account_form_account_type_personal" />
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
                                                                <span className="text-muted fw-semibold fs-6">사용기간 : {(coupon?.usageStartDate || '').replace(/-/g, '.')}~{(coupon?.usageEndDate || '').replace(/-/g, '.')}</span>
                                                            </span>
                                                        </label>
                                                    </div> : ''
                                                }
                                                {(coupon?.templateType || '') === 2 ?
                                                    <div className="col-lg-6">
                                                        <input type="radio" className="btn-check" name="templateType" id="kt_create_account_form_account_type_personal" />
                                                        <label className="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center" htmlFor="kt_create_account_form_account_type_corporate">
                                                            <i className="ki-duotone ki-briefcase fs-3x me-5">
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                            </i>
                                                            <span className="d-block fw-semibold text-start">
                                                                <span className="text-dark fw-bold d-block fs-4 mb-2">상품명 및 할인율</span>
                                                                <span className="text-muted fw-semibold fs-6">사용기간 : {(coupon?.usageStartDate || '').replace(/-/g, '.')}~{(coupon?.usageEndDate || '').replace(/-/g, '.')}</span>
                                                            </span>
                                                        </label>
                                                    </div> : ''
                                                }

											</div>
										</div>
									</div>
									{/*--------------------------------------------------------------------*/}


									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">사용기간</label>
										<div className="col-lg-8 fv-row form-control-lg">
											{coupon?.usageStartDate} ~  {coupon?.usageEndDate}
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">발급기간</label>
										<div className="col-lg-8 fv-row form-control-lg">
											{coupon?.issueStartDate} ~ {coupon?.issueEndDate}
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label fw-semibold fs-6">혜택내용</label>
										<div className="col-lg-8 fv-row" style={{ whiteSpace: 'pre-line' }}>
                                            {coupon?.benefitDescription}
                                        </div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰 사용여부</label>
										<div className="col-lg-8 fv-row">
											<div className="d-flex align-items-center mt-3">
                                                {coupon?.isUsable === 'USABLE' ? '사용' : '사용불가'}
                                            </div>
										</div>
									</div>
								</div>
								<div className="card-footer d-flex justify-content-end py-6 px-9">
									<button type="button" onClick={handleDelete} className="btn btn-light btn-active-light-primary me-2">쿠폰삭제</button>
									<button type="button" className="btn btn-primary me-2" id="kt_account_profile_details_submit"
										onClick={() => {
											router.push(`./edit/${id}?${queryString}`); //수정
										}}>수정</button>
									<button type="button" className="btn btn-light btn-active-light-primary me-2"
										onClick={() => {
											router.push(`./list?${queryString}`); //목록
										}}>목록</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}




