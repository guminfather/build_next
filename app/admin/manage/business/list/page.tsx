'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select, { SingleValue } from 'react-select';

import { fetchPartners } from '@/lib/apis/admin';
import { Partner } from '@/types/partner';
import { Search } from '@/types/search';
import { OptionType, SelectPartnerSearchOptions } from '@/types/select';

import Pagination from '@/components/Pagination';
import PartnerTable from '@/components/table/PartnerTable';

//import BusinessExcel from '@/components/excel/BusinessExcel';
import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";







export default function AdminPartners() {

    const router = useRouter();
    const params = useSearchParams();

    const [partners, setPartners] = useState<Partner[]>([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); //한페이지에 뿌려질 데이타
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('');

    //검색 셀렉트 박스 선택시
    const handleChange = (selected: SingleValue<OptionType>) => {
        console.log(selected?.value); // 선택된 값
        if(!searchText) alert("검색어를 입력해주세요!");
        
        const value = selected?.value?.toString() || '';
        setSearchType(value);

        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: value,
            page: '1',
            pageSize: pageSize.toString(),
        }).toString();
        router.push(`/admin/manage/business/list?${query}`);
    };
    
    //한페이지에 보여질 데이타수 변경시(검색)
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value)); // 선택된 값
        setPage(1);
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || '',
            page: '1',
            pageSize: event.target.value || '10',
        }).toString();
        router.push(`/admin/manage/business/list?${query}`);
    };
    
    // params 변경될 때마다 상태 갱신 + fetch
    useEffect(() => {
        const queryPage = parseInt(params.get('page') || '1', 10);
        const queryPageSize = parseInt(params.get('pageSize') || '10', 10);
        const querySearchText = params.get('searchText') || '';
        const querySearchType = params.get('searchType') || '';
        
        setPage(queryPage);
        setPageSize(queryPageSize);
        setSearchText(querySearchText);
        setSearchType(querySearchType);

        fetchData({
            page: queryPage,
            pageSize: queryPageSize,
            searchText: querySearchText,
            searchType: querySearchType,
        });
    }, [params]);

    // 데이터 조회
    const fetchData = async (search: {
        page: number;
        pageSize: number;
        searchText: string;
        searchType: string;
    }) => {
        const newSearch: Search = { ...search };

        //api 호출
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



    //사업자 등록 페이지 이동
    const handlePartnerInput = () => {
        router.push(`/admin/manage/business/add`);
    }

    return (
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">사업자회원관리</h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                                <a href="../../demo1/dist/index.html" className="text-muted text-hover-primary">Home</a>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="bullet bg-gray-400 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-muted">사업자회원관리</li>
                        </ul>
                    </div>
                    <div>
                        {/*------- 사업자 등록 버튼 -------------- */}
                        <button type="button" onClick={handlePartnerInput} className="btn btn-light-primary">
                            <i className="ki-duotone ki-exit-up fs-2">
                                <span className="path1"></span>
                                <span className="path2"></span>
                            </i>사업자 등록
                        </button>
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
                                <div className="w-150px">
                                    <Select<OptionType>
                                        options={SelectPartnerSearchOptions}
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
                            <PartnerTable partners={partners} total={total} currentPage={page} pageSize={pageSize}
                                searchText={searchText} searchType={searchType}/>

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
                                        page: p.toString(),
                                        pageSize: pageSize.toString(),
                                    }).toString();
                                    router.push(`/admin/manage/business/list?${query}`);
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

            {/* 검색 필터 
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
                    */}
            {/* 정렬 버튼 
                    <div className="flex gap-2 mb-2">
                        <button onClick={() => handleSortChange('latest')} className={`underline ${sort === 'latest' ? 'text-blue-700 font-semibold' : 'text-blue-500'}`}>최신순</button>
                        <button onClick={() => handleSortChange('oldest')} className={`underline ${sort === 'oldest' ? 'text-blue-700 font-semibold' : 'text-blue-500'}`}>오래된순</button>
                        <button onClick={() => handleSortChange('name')} className={`underline ${sort === 'name' ? 'text-blue-700 font-semibold' : 'text-blue-500'}`}>이름순</button>
                    </div>
                    */}
            {/* 엑셀 다운로드  
                    <div className="mt-4">
                        <BusinessExcel name={name} startDate={startDate} endDate={endDate} sort={sort} />
                    </div>
                    */}
        </>
    );

}
