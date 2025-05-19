'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select, { SingleValue } from 'react-select';

import { fetchAdminCoupons } from '@/lib/apis/admin';
import { CouponResponse } from '@/types/coupon';
import { SearchCoupon } from '@/types/search';
import { OptionType, SelectCouponSearchOptions } from '@/types/select';

import Pagination from '@/components/Pagination';
import CouponTable from '@/components/table/CouponTable';
//import CouponExcel from '@/components/excel/CouponExcel';

import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";




export default function BusinessCoupons() {

    const router = useRouter();
    const params = useSearchParams();

    const [coupons, setCoupons] = useState<CouponResponse[]>([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); //한페이지에 뿌려질 데이타

    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [isLoding, setIsLoding] = useState(false);


    //검색 셀렉트 박스 선택시
    const handleChange = (selected: SingleValue<OptionType>) => {
        console.log(selected?.value); // 선택된 값
        if (!searchText) alert("검색어를 입력해주세요!");

        const value = selected?.value?.toString() || '';
        setSearchType(value);

        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: value,
            startDate: startDate,
            endDate: endDate,
            page: '1',
            pageSize: pageSize.toString(),
        }).toString();
        router.push(`/admin/manage/coupon/list?${query}`);
    };

    //한페이지에 보여질 데이타수 변경시(검색)
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value)); // 선택된 값
        setPage(1);
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || '',
            startDate: startDate || '',
            endDate: endDate || '',
            page: '1',
            pageSize: event.target.value || '10',
        }).toString();
        router.push(`/admin/manage/coupon/list?${query}`);
    };

    // 데이터 조회 함수
    const fetchData = async (search: {
        page: number;
        pageSize: number;
        searchText: string;
        searchType: string;
        startDate: string;
        endDate: string;
    }) => {
        const newSearch: SearchCoupon = { ...search };

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

    //쿠폰생성 페이지 이동
    const handleCouponInput = () => {
        router.push(`/admin/manage/coupon/add`);
    }

    // params 변경될 때마다 상태 갱신 + fetch
    useEffect(() => {
        const queryPage = parseInt(params.get('page') || '1', 10);
        const queryPageSize = parseInt(params.get('pageSize') || '10', 10);
        const querySearchText = params.get('searchText') || '';
        const querySearchType = params.get('searchType') || '';
        const queryStartDate = params.get('startDate') || '';
        const queryEndDate = params.get('endDate') || '';

        setPage(queryPage);
        setPageSize(queryPageSize);
        setSearchText(querySearchText);
        setSearchType(querySearchType);
        setStartDate(queryStartDate);
        setEndDate(queryEndDate);

        console.log("데이타를 불러 오겠습니다. -------------")
        fetchData({
            page: queryPage,
            pageSize: queryPageSize,
            searchText: querySearchText,
            searchType: querySearchType,
            startDate: queryStartDate,
            endDate: queryEndDate,
        }); //함수호출

    }, [params]);

    //if (!isLoding) return <div className="p-6">로딩 중...</div>;
    return (
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">쿠폰리스트</h1>
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
                            <li className="breadcrumb-item text-muted">쿠폰리스트</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-xxl">
                    <div className="card">
                        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                            <div className="card-title">
                                <div className="d-flex align-items-center position-relative my-1">
                                    <i className="ki-duotone ki-magnifier fs-2 position-absolute ms-4">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                    <input type="text" value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="form-control form-control-solid w-250px ps-12" placeholder="Search Report" />
                                </div>
                                <div id="kt_ecommerce_report_views_export" className="d-none"></div>
                            </div>
                            <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                                <input className="form-control form-control-solid w-100 mw-250px" placeholder="Pick date range" id="kt_ecommerce_report_views_daterangepicker" />
                                <div className="w-150px">
                                    <Select<OptionType>
                                        options={SelectCouponSearchOptions}
                                        placeholder="선택"
                                        isSearchable={false}
                                        onChange={handleChange}
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 5,
                                            colors: {
                                                ...theme.colors,
                                                primary25: '#e9ecef',
                                                primary: '#ECECEE',
                                                neutral0: '#fff', //option 기본색(흰색)
                                                neutral80: '#929191', //선택된 글자색
                                            },
                                        })}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                backgroundColor: '#F9F9F9',
                                                borderColor: '#fff',
                                                minHeight: '40px',
                                                fontSize: '13px',
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isSelected
                                                    ? '#F7F7F6' //선택시 배경색
                                                    : state.isFocused
                                                        ? '#F7F7F6' //마우스오버시 배경색
                                                        : 'transparent',
                                                color: state.isSelected
                                                    ? '#3E97FF' // 선택시 글자색
                                                    : state.isFocused
                                                        ? '#3E97FF' // hover 시 파란색 글자
                                                        : '#808080', // 기본 글자색
                                                fontWeight: 'normal',
                                            }),
                                        }}
                                    />
                                </div>
                                <button type="button" className="btn btn-light-primary">
                                    <i className="ki-duotone ki-exit-up fs-2">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>엑셀다운로드</button>
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            {/* 테이블 */}
                            <CouponTable coupons={coupons} total={total} currentPage={page} pageSize={pageSize}
                                searchText={searchText} searchType={searchType}
                                startDate={startDate} endDate={endDate} />

                            <div className="row">
                                <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start">
                                    <div className="dataTables_length">
                                        <label>
                                            <select value={pageSize} onChange={handlePageSizeChange}
                                                className="form-select form-select-sm form-select-solid">
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                {/* 페이징 */}
                                <Pagination currentPage={page} totalItems={total} pageSize={pageSize} onPageChange={(p) => {
                                    const query = new URLSearchParams({
                                        searchText,
                                        searchType,
                                        startDate,
                                        endDate,
                                        page: p.toString(),
                                        pageSize: pageSize.toString(),
                                    }).toString();
                                    router.push(`/admin/manage/coupon/list?${query}`);
                                }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div id="kt_scrolltop" className="scrolltop" data-kt-scrolltop="true">
                    <i className="ki-duotone ki-arrow-up">
                        <span className="path1"></span>
                        <span className="path2"></span>
                    </i>
                </div>
            </div>
        </>
    );
}

    {/* 엑셀 다운로드  
            <div className="mt-4">
                <CouponExcel name={name} startDate={startDate} endDate={endDate} sort={sort} />
            </div>*/}
