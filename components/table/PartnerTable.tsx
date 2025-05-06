//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { Partner } from '@/types/partner';
import Link from 'next/link';

interface Props {
    partners: Partner[];
    total: number;
    currentPage: number;
    pageSize: number;
    name: string;
    startDate: string;
    endDate: string;
    sort : string;
}




export default function PartnerTable({ partners, total, currentPage, pageSize, name, startDate, endDate, sort  }: Props) {
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
                    {partners.map((m, i) => (
                        <tr key={i}>
                            <td>{(currentPage - 1) * pageSize + i + 1}</td>
                            <td>
                                <Link href={{pathname: `./${m.partnerId}`,
                                    query: { name, startDate, endDate, page: currentPage, sort }, }}
                                >{m.partnerId}/{m.partnerName}</Link>
                            </td>
                            <td>{m.businessRegistrationNo}</td>
                            <td>{m.address}</td>
                            <td>{m.region}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}