//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { Business } from '@/types/businessType';
import Link from 'next/link';

interface Props {
    businesses: Business[];
    total: number;
    currentPage: number;
    pageSize: number;
    name: string;
    startDate: string;
    endDate: string;
    sort : string;
}




export default function BusinessTable({ businesses, total, currentPage, pageSize, name, startDate, endDate, sort  }: Props) {
    return (
        <div>
            <div className="mb-2">총 {total}명</div>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th>NO</th>
                        <th>상호명</th>
                        <th>사업자번호</th>
                        <th>사업분야</th>
                        <th>지역</th>
                    </tr>
                </thead>
                <tbody>
                    {businesses.map((m, i) => (
                        <tr key={m.id}>
                            <td>{(currentPage - 1) * pageSize + i + 1}</td>
                            <td>
                                <Link href={{pathname: `/admin/business/${m.id}`,
                                    query: { name, startDate, endDate, page: currentPage, sort }, }}
                                >{m.businessName}/{m.businessId}/{m.id}</Link>
                            </td>
                            <td>{m.businessNumber}</td>
                            <td>{m.category}</td>
                            <td>{m.region}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}