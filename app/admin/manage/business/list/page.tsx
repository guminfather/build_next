'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select, { SingleValue } from 'react-select';

import { Partner } from '@/types/partner';
import { SearchPartner } from '@/types/search';
import { OptionType, SelectPartnerSearchOptions } from '@/types/select';
import { fetchPartners, deletePartners } from '@/lib/apis/admin';

import Pagination from '@/components/Pagination';
import PartnerTable from '@/components/table/PartnerTable';
import PartnersExcel from '@/components/excel/PartnersExcel';

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
    const [isLoading, setIsLoading] = useState(false);

    //한페이지에 보여질 데이타수 변경시(검색)
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            page: String(1) || '1',
            pageSize: String(event.target.value) || '10',
        }).toString();
        window.location.href = `/admin/manage/business/list?${query}`;
    };

    //페이지 변경시(검색)
    const handlePageChange = (newPage: number = page) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            page: String(newPage) || '1',
            pageSize: String(pageSize) || '10',
        }).toString();
        window.location.href = `/admin/manage/business/list?${query}`;
    };

    //검색버튼 클릭시 (재검색)
    const handleSearchSubmit = () => {
        handlePageChange(1);
    }

    //검색범위 셀렉트 박스 선택시
    const handleChange = (selected: SingleValue<OptionType>) => {
        setSearchType(selected?.value || 'all');
    };


    // 데이터 조회 함수
    const fetchData = async (search: SearchPartner) => {
        setIsLoading(false);
        const result = await fetchPartners(search); //api 호출
        if (result.success) {
            console.log("받아온 내용 : ", result.value)
            setPartners(result.value.partners);
            setTotal(result.value.total);
            setIsLoading(true);
        } else {
            console.log(result.message);
        }
    };




    //ParterTable 컴포넌트에서 delete 호출하면 실행(API연동및 재배열)
    const handleDeletePartners = async (ids: string[]) => {
        const result = await deletePartners(ids); //api 호출
        if (result.success) {
            // 삭제 API 호출 또는 로컬 데이터 필터링
            //const filtered = partners.filter(partner => !ids.includes(partner.partnerId));
            //setPartners(filtered); // 상태 업데이트로 화면에서 제거됨
            //console.log("삭제된 파트너 ID:", ids);
            alert("사업자 " + ids + "들을 탈퇴처리 하였습니다. 한달후 자동 삭제 됩니다.");
            handleSearchSubmit(); //다시 검색
        } else {
            console.log(result.message);
            return;
        }
    };

    //검색타입 selectbox default value
    const selectedSearchType = useMemo(() => {
        return SelectPartnerSearchOptions.find(option => option.value === searchType);
    }, [searchType]);


    //데이타 로딩 함수호출
    useEffect(() => {
        const queryPage = parseInt(params.get('page') || '1', 10);
        const queryPageSize = parseInt(params.get('pageSize') || '10', 10);
        const querySearchText = params.get('searchText') || '';
        const querySearchType = params.get('searchType') || '';
        setSearchText(querySearchText);
        setSearchType(querySearchType);
        setPage(queryPage);
        setPageSize(queryPageSize);

        //데이타 로딩 함수호출
        fetchData({
            page: queryPage,
            pageSize: queryPageSize,
            searchText: querySearchText,
            searchType: querySearchType,
        });
    }, [params]);

    //사업자 등록 페이지 이동
    const handlePartnerInput = () => {
        router.push(`/admin/manage/business/add`);
    }

    if (!isLoading) return <div className="p-6">로딩 중...</div>;

    return (
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">사업자회원관리</h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                                <a href="/admin/manage" className="text-muted text-hover-primary">Home</a>
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
                            <div className="card-toolbar flex-row-fluid justify-content gap-5">
                                <div className="w-150px">
                                    <Select<OptionType>
                                        options={SelectPartnerSearchOptions}
                                        placeholder="전체"
                                        value={selectedSearchType}
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
                                <div className="d-flex align-items-center position-relative my-1">
                                    <i className="ki-duotone ki-magnifier fs-2 position-absolute ms-4">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                    <input type="text" value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="form-control form-control-solid w-250px ps-12" placeholder="Search Report" />
                                </div>
                                <div className="mb-2">
                                    <button type="button" onClick={handleSearchSubmit} className="btn btn-outline text-nowrap">검색하기</button>
                                </div>

                            </div>
                            <div className="card-title">
                                <div className="d-flex align-items-center position-relative my-1">
                                    {/*--- 엑셀 다운로드---- */}
                                    <PartnersExcel searchText={searchText} searchType={searchType} />
                                </div>
                                <div id="kt_ecommerce_report_views_export" className="d-none"></div>
                            </div>

                        </div>
                        <div className="card-body pt-0">
                            {/* 테이블 */}
                            <PartnerTable partners={partners} total={total} currentPage={page} pageSize={pageSize}
                                searchText={searchText} searchType={searchType} onDelete={handleDeletePartners} />

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
                                <Pagination
                                    currentPage={page} totalItems={total} pageSize={pageSize}
                                    onPageChange={(p) => {
                                        handlePageChange(p);
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
