'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { fetchAdminCoupons } from '@/lib/apis/admin';
import { CouponResponse } from '@/types/coupon';
import { Search } from '@/types/search';

import Pagination from '@/components/Pagination';
import CouponTable from '@/components/table/CouponTable';
//import CouponExcel from '@/components/excel/CouponExcel';


export default function BusinessCoupons() {

    const router = useRouter();
    const params = useSearchParams();

    const [coupons, setCoupons] = useState<CouponResponse[]>([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<'latest' | 'oldest' | 'name'>('latest');
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoding, setIsLoding] = useState(false);

    const pageSize = 10;

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

        const result = await fetchAdminCoupons(newSearch);
        if (result.success) {
            console.log("받아온 내용 : ", result.value)
            setCoupons(result.value.coupons);
            setTotal(result.value.total);
            setIsLoding(true);
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

        router.push(`/admin/manage/coupon/list?${query}`);
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

        router.push(`/admin/manage/coupon/list?${query}`);
    };


    //쿠폰생성 링크
    const handleCouponInput = () => {
        router.push(`/admin/manage/coupon/add`);
    }

    if (!isLoding) return <div className="p-6">로딩 중...</div>;
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">쿠폰 리스트 관리</h1>

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
                    placeholder="쿠폰명"
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
            <CouponTable coupons={coupons} total={total} currentPage={page} pageSize={pageSize}
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
                router.push(`/admin/manage/coupon/list?${query}`);
            }}
            />

            {/* 엑셀 다운로드  
            <div className="mt-4">
                <CouponExcel name={name} startDate={startDate} endDate={endDate} sort={sort} />
            </div>*/}

            {/* 쿠폰등록  */}
            <div>
                <button onClick={handleCouponInput} className="bg-blue-500 text-white px-4 py-2 rounded">
                    쿠폰등록
                </button>
            </div>
        </div>
    );
}