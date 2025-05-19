//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { CouponResponse } from '@/types/coupon';
import Link from 'next/link';

interface Props {
    coupons: CouponResponse[];
    total: number;
    currentPage: number;
    pageSize: number;
    searchText: string;
    searchType: string;
    startDate: string;
    endDate: string;
}

export default function PartnerCouponTable({ coupons, total, currentPage, pageSize, searchText, searchType, startDate, endDate }: Props) {
    return (
        <>
            <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_report_views_table">
                <thead>
                    <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th className="w-10px pe-2">
                            <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                <input className="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_ecommerce_report_views_table .form-check-input" value="1" />
                            </div>
                        </th>
                        <th className="min-w-300px text-center">쿠폰명</th>
                        <th className="min-w-70px text-center">할인율</th>
                        <th className="min-w-200px text-center">기간</th>
                        <th className="min-w-80px text-center">다운로드 수</th>
                        <th className="min-w-80px text-center">사용 수</th>
                        <th className="min-w-100px text-center">상태</th>
                    </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                    {coupons.map((m, i) => (
                    <tr className="text-center" key={i}>
                        <td>
                            <div className="form-check form-check-sm form-check-custom form-check-solid">
                                <input className="form-check-input" type="checkbox" value="1" />
                                {/*(currentPage - 1) * pageSize + i + 1*/}
                            </div>
                        </td>
                        <td className="text-start">
                            <Link className="text-hover-primary text-gray-600" 
                                    href={{
                                        pathname: `./${m.couponId}`,
                                        query: { searchText, searchType, startDate, endDate, page: currentPage, pageSize},
                                    }}
                                    >{m.couponName}</Link>
                        </td>
                        <td>{m.discountRate}%</td>
                        <td>{m.usageStartDate}-{m.usageEndDate}</td>
                        <td data-bs-target="license">32</td>{/*사용수*/}
                        <td>{/*사용수*/}20</td>
                        <td>
                            {/*<span className="badge fw-bold me-auto px-4 py-3 badge-light  ">기간만료 </span>*/}
                            <span className="badge fw-bold me-auto px-4 py-3 badge-light-primary ">진행중</span>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}