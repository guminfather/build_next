/*
import axios from 'axios';
import qs from 'qs';
import { Member } from '@/types/memberType';
import { Business } from '@/types/businessType';
import { Partner } from '@/types/partner';
import { Coupon } from '@/types/coupon';
import { Search } from '@/types/search';
import { parseStringPromise } from 'xml2js';
import { getBusinessAccessToken } from '@/lib/businessAuth';
import { getAdminAccessToken } from '@/lib/adminAuth';


const API_BASE_URL = 'http://localhost:8080'; // Spring API 주소로 변경
const API_BIZNO_URL = 'https://bizno.net'; // 사업자번호

// 사업자 아이디 존재 여부 확인
export const fetchBusinessIdCheck = async (id: string) => {
    try {
        const res = await axios.get<{ isnt: number }>(`${API_BASE_URL}/api/auth/partner/isnt/${id}`);
        return { success: true, value: res.data.isnt }; // isnt = 1
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

//쿠폰 생성
export const createCoupon = async (newCoupon: Coupon) => {
    try {
        console.log("token : " , getBusinessAccessToken())
        const res = await fetch(`${API_BASE_URL}/api/partner/coupon/add`, {
            method: "POST",
            headers: { 
                Authorization: `Bearer ${getBusinessAccessToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCoupon),
        });
        
        if (res.ok) {
            return { success: true, value: "쿠폰생성 성공" }; // isnt = 1
        
        } else {
            const data = await res.json();
            console.log("에러메세지 : " , data.error)
            return { success: false, value: "쿠폰생성 실패" }; // isnt = 1
        }
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }   
};


//사업자 가입
export const register = async (newPartner: Partner) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/partner`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPartner),
        });
        const data = await res.json();
        if (res.ok) {
            return { success: true, value: "회원가입 성공" }; // isnt = 1
        } else {
            console.log("에러메세지 : " , data.error)
            return { success: false, value: "회원가입 실패" }; // isnt = 1
        }
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }   
};

//토큰 재발급 refreshToken이용 : 사업자,관리자 같이 씀
export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/newToken`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Content-Type': 'application/json'
            },
            
        });
        const data = await res.json();
        
        console.log("res : ", res)
        console.log("data : ", data)
        
        if (res.ok) {
            return { success: true, value: data.accessToken }; //토큰 전송
        } else {
            console.log("에러메세지 : " , data.error)
            return { success: false, value: data.error }; 
        }
        
    } catch (error: any) {
        console.log(error)
        console.log("여기인가? $$$$$$$$$$$$$$$$$$$$$$$$$$$")
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }      
};


//사업자 로그인
export const businessLogin = async (userId: string, userPw: string) => {

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/partner/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username : userId, password: userPw}),
        });
        const data = await res.json();
        
        if (res.ok) {
            console.log("로그인성공 : " , data)
            return { success: true, value: data }; // isnt = 1
        } else {
            console.log("에러메세지 : " , data.error)
            return { success: false, value: "회원로그인 실패" }; // isnt = 1
        }
        
        
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }      
};



//관리자 로그인
export const adminLogin = async (userId: string, userPw: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username : userId, password: userPw}),
        });
        const data = await res.json();
        
        if (res.ok) {
            console.log("로그인성공 : " , data)
            return { success: true, value: data }; // isnt = 1
        } else {
            console.log("에러메세지 : " , data.error)
            return { success: false, value: "관리자로그인 실패" }; // isnt = 1
        }
     } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }      
};

//사업자번호 조회 (API_BIZNO_URL)
//https://bizno.net/api/fapi?key=a2VqZ29nb2dvQG5hdmVyLmNvbSAg&gb=1&q=3988701116&type=xml
// https://api.bizno.net/fapi 참조
// kejgogogo@naver.com / h9413079@#
// api 주소 : 3524000116
export const fetchBusinessCheck = async (businessNumber: string) => {
    const url = `https://bizno.net/api/fapi?key=a2VqZ29nb2dvQG5hdmVyLmNvbSAg&gb=1&q=${businessNumber}&type=xml`;
    const res = await axios.get(url);

    const jsonResult = await parseStringPromise(res.data, {
        explicitArray: false, // 배열 없이 단순한 JSON으로 변환
        trim: true,           // 문자열 양 끝 공백 제거
    });
    //console.log("검색갯수 : " + jsonResult.response.body.totalCount)
    //console.log("회사명 : " + jsonResult.response.body.items.item.company)
    //console.log("결과코드가 0일때 OK : " + jsonResult.response.header.resultCode)
    //resultCode(-1,미등록 사용자입니다)/(-2,파라메터 오류.)/(-3,1일 200건 조회수 초과.)/(-9,기타오류.)

    return jsonResult.response.body.totalCount;

    //console.log(res)
    //const res = await axios.get<>(`${API_BASE_URL}/business/list?${query}`);

    return res; // { accessToken }
};



//관리자 쿠폰리스트 
export const fetchAdminCoupons = async (newSearch: Search) => {
    try {
        console.log("token : " , getBusinessAccessToken())
        
        const query = qs.stringify(newSearch);
        const res = await fetch(`${API_BASE_URL}/api/admin/coupon/list?${query}`, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${getAdminAccessToken()}`,
            },
        });
        const data = await res.json();
        console.log("제대로 들어오는거지? ", data)
        if (res.ok) {
            return { success: true, value: data }; // isnt = 1
        } else {
            console.log("에러메세지 : " , data.error)
            return { success: false, value: "쿠폰목록 실패" }; // isnt = 1
        }
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }  
};

//사업자 쿠폰리스트 
export const fetchPartnerCoupons = async (newSearch: Search) => {
    try {
        console.log("token : " , getBusinessAccessToken())
        
        const query = qs.stringify(newSearch);
        const res = await fetch(`${API_BASE_URL}/api/partner/coupon/list?${query}`, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${getBusinessAccessToken()}`,
            },
        });
        const data = await res.json();
        console.log("제대로 들어오는거지? ", data)
        if (res.ok) {
            return { success: true, value: data }; // isnt = 1
        } else {
            console.log("에러메세지 : " , data.error)
            return { success: false, value: "쿠폰목록 실패" }; // isnt = 1
        }
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }  
};


//관리자 사업자리스트 
export const fetchPartners = async (newSearch: Search) => {
    try {
        console.log("token : " , getAdminAccessToken())
        
        const query = qs.stringify(newSearch);
        const res = await fetch(`${API_BASE_URL}/api/admin/partner/list?${query}`, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${getAdminAccessToken()}`,
            },
        });
        const data = await res.json();
        console.log("제대로 들어오는거지? ", data)
        if (res.ok) {
            return { success: true, value: data }; // isnt = 1
        } else {
            console.log("에러메세지 : " , data.error)
            return { success: false, value: "사업자목록 실패" }; // isnt = 1
        }
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }  
};


//사업자리스트 (엑셀파일을 위한 전체 리스트-검색 포함함)
export const fetchBusinessesAll = async (params: {
    name: string;
    startDate: string; // '2024-01'
    endDate: string;   // '2024-12'
    sort: string;
}) => {
    const query = qs.stringify(params);

    //total//businessInfo 서버에서 오는 이름 그대로 써야한다.
    const res = await axios.get<{ total: number, businessInfo: Business[] }>(`${API_BASE_URL}/business/list?${query}`);

    return { data: res.data.businessInfo, total: res.data.total };
};


//사업자정보(주키값으로 찾기)
export const fetchBusinessById = async (id: number) => {

    const res = await axios.get<{ Business: Business }>(`${API_BASE_URL}/business/${id}`);
    return res.data.Business;
};

//사업자정보(businessId로 찾기)
export const fetchBusinessByBusinessId = async (businessId: string) => {

    const res = await axios.get<{ data: Business }>(`${API_BASE_URL}/businessId/${businessId}`);
    //console.log("businessId : ", businessId)
    //console.log("res.data : ", res.data)
    return res.data;
};


//lib/api.ts API 통신

*/