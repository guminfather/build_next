'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { fetchPartners } from '@/lib/apis/admin';
import { Partner } from '@/types/partner';
import { Search } from '@/types/search';

import Pagination from '@/components/Pagination';
import PartnerTable from '@/components/table/PartnerTable';
//import BusinessExcel from '@/components/excel/BusinessExcel';


export default function AdminPartners() {

    const router = useRouter();
    const params = useSearchParams();

    const [partners, setPartners] = useState<Partner[]>([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<'latest' | 'oldest' | 'name'>('latest');
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const pageSize = 20;

    // params 변경될 때마다 상태 갱신 + fetch
    useEffect(() => {
        const queryPage = parseInt(params.get('page') || '1', 10);
        const querySort = (params.get('sort') as 'latest' | 'oldest' | 'name') || 'latest';
        const queryName = params.get('name') || '';
        const queryStartDate = params.get('startDate') || '';
        const queryEndDate = params.get('endDate') || '';

        setName(queryName);
        setStartDate(queryStartDate);
        setEndDate(queryEndDate);
        setPage(queryPage);
        setSort(querySort);

        fetchData({
            page: queryPage,
            sort: querySort,
            name: queryName,
            startDate: queryStartDate,
            endDate: queryEndDate,
        });
    }, [params]);

    // 데이터 조회
    const fetchData = async (search: {
        page: number;
        sort: 'latest' | 'oldest' | 'name';
        name: string;
        startDate: string;
        endDate: string;
    }) => {
        const newSearch: Search = { ...search, pageSize, };

        const result = await fetchPartners(newSearch);
        if (result.success) {
            console.log("받아온 내용 : ", result.value)
            setPartners(result.value.partners);
            setTotal(result.value.total);
        } else {
            console.log(result.message);
            return;
        }
    };


    //검색버튼 클릭시
    const handleSearch = () => {
        setPage(1);
        const query = new URLSearchParams({
            name,
            startDate,
            endDate,
            page: '1',
            sort,
        }).toString();

        router.push(`/admin/manage/business/list?${query}`);
    };

    // 정렬 버튼 클릭 시
    const handleSortChange = (newSort: 'latest' | 'oldest' | 'name') => {
        const query = new URLSearchParams({
            name,
            startDate,
            endDate,
            page: '1',
            sort: newSort,
        }).toString();

        router.push(`/admin/manage/business/list?${query}`);
    };

    //사업자 등록 페이지 이동
    const handlePartnerInput = () => {
        router.push(`/admin/manage/business/add`);
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">사업자자 리스트 관리</h1>

            {/* 검색 필터 */}
            <div className="flex gap-2 mb-4">
                <input
                    type="month"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2"
                />
                ~
                <input
                    type="month"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="상호명"
                    className="border p-2"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
                    검색
                </button>
            </div>

            {/* 정렬 버튼 */}
            <div className="flex gap-2 mb-2">
                <button onClick={() => handleSortChange('latest')} className={`underline ${sort === 'latest' ? 'text-blue-700 font-semibold' : 'text-blue-500'}`}>최신순</button>
                <button onClick={() => handleSortChange('oldest')} className={`underline ${sort === 'oldest' ? 'text-blue-700 font-semibold' : 'text-blue-500'}`}>오래된순</button>
                <button onClick={() => handleSortChange('name')} className={`underline ${sort === 'name' ? 'text-blue-700 font-semibold' : 'text-blue-500'}`}>이름순</button>
            </div>

            {/* 테이블 */}
            <PartnerTable partners={partners} total={total} currentPage={page} pageSize={pageSize}
                name={name} startDate={startDate} endDate={endDate} sort={sort} />

            {/* 페이징 */}
            <Pagination currentPage={page} totalItems={total} pageSize={pageSize} onPageChange={(p) => {
                                const query = new URLSearchParams({
                                    name,
                                    startDate,
                                    endDate,
                                    page: p.toString(),
                                    sort,
                                }).toString();
                                router.push(`/admin/manage/business/list?${query}`);
                            }}
            />
            {/* 엑셀 다운로드  
            <div className="mt-4">
                <BusinessExcel name={name} startDate={startDate} endDate={endDate} sort={sort} />
            </div>
            */}

            {/* 사업자 등록  */}
            <div>
                <button onClick={handlePartnerInput} className="bg-blue-500 text-white px-4 py-2 rounded">
                    사업자 등록
                </button>
            </div>
        </div>
    );
}
