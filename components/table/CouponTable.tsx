//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { CouponResponse } from '@/types/coupon';
import Link from 'next/link';

interface Props {
    coupons: CouponResponse[];
    total: number;
    currentPage: number;
    pageSize: number;
    name: string;
    startDate: string;
    endDate: string;
    sort : string;
}




export default function CouponTable({ coupons, total, currentPage, pageSize, name, startDate, endDate, sort  }: Props) {
    return (
        <div>
            <div className="mb-2">총 {total}개</div>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th>NO</th>
                        <th>사업자</th>
                        <th>쿠폰명</th>
                        <th>사용기간</th>
                        <th>발급기간</th>
                        <th>사용여부</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((m, i) => (
                        <tr key={i}>
                            <td>{(currentPage - 1) * pageSize + i + 1}</td>
                            <td>{m.partnerName}</td>
                            <td>
                                <Link href={{pathname: `./${m.couponId}`,
                                    query: { name, startDate, endDate, page: currentPage, sort }, }}
                                >{m.couponName}</Link>
                            </td>
                            <td>{m.couponName}</td>
                            <td>{m.couponName}</td>
                            <td>{m.couponName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}