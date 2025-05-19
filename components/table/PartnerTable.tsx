//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { Partner } from '@/types/partner';
import Link from 'next/link';

interface Props {
    partners: Partner[];
    total: number;
    currentPage: number;
    pageSize: number;
    searchText: string;
    searchType: string;
}




export default function PartnerTable({ partners, total, currentPage, pageSize, searchText, searchType }: Props) {
    return (

        <div id="kt_ecommerce_report_views_table_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
            <div className="table-responsive">
                <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_report_views_table">
                    <thead>
                        <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                            <th className="w-10px pe-2">
                                <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                    <input className="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_ecommerce_report_views_table .form-check-input" value="1" />
                                </div>
                            </th>
                            <th className="min-w-300px text-center">상호</th>
                            <th className="min-w-200px text-center">사업자번호</th>
                            <th className="min-w-100px text-center">사업분야</th>
                            <th className="min-w-100px text-center">지역</th>
                        </tr>
                    </thead>
                    <tbody className="fw-semibold text-gray-600">
                        {/*{(currentPage - 1) * pageSize + i + 1} ---- 총 {total}명 */}
                        {partners.map((m, i) => (
                            <tr className="text-center"  key={i}>
                                <td>
                                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                                        <input className="form-check-input" type="checkbox" value={i} />
                                    </div>
                                </td>
                                <td className="text-start">
                                    <Link className="text-hover-primary text-gray-600"
                                        href={{pathname: `./edit/${m.partnerId}`,
                                               query: { searchText, searchType, page: currentPage, pageSize }, }}
                                        >{m.partnerName}
                                    </Link>
                                </td>
                                <td>{m.businessRegistrationNo}</td>
                                <td>{m.businessType}</td>
                                <td>{m.region}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}