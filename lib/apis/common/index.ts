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
import axiosInstance from '@/lib/apis/axiosInstance';


const API_BIZNO_URL = 'https://bizno.net'; // 사업자번호 API 주소

// 사업자 아이디 존재 여부 확인
export const fetchBusinessIdCheck = async (id: string) => {
    try {
        const res = await axiosInstance.get<{ isnt: number }>(`/api/auth/partner/isnt/${id}`);
        return { success: true, value: res.data.isnt };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};


// 사업자 가입
export const register = async (newPartner: Partner) => {
    try {
        const res = await axiosInstance.post('/api/auth/partner', newPartner);
        return { success: true, value: "회원가입 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

// 사업자 로그인
export const businessLogin = async (userId: string, userPw: string) => {
    try {
        const res = await axiosInstance.post('/api/auth/partner/login', {
            username: userId,
            password: userPw,
        });
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

// 관리자 로그인
export const adminLogin = async (userId: string, userPw: string) => {
    try {
        const res = await axiosInstance.post('/api/auth/admin/login', {
            username: userId,
            password: userPw,
        });
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

// 사업자번호 조회 (외부 API - bizno.net)
export const fetchBusinessCheck = async (businessNumber: string) => {
    const url = `${API_BIZNO_URL}/api/fapi?key=a2VqZ29nb2dvQG5hdmVyLmNvbSAg&gb=1&q=${businessNumber}&type=xml`;
    const res = await axios.get(url);

    const jsonResult = await parseStringPromise(res.data, {
        explicitArray: false,
        trim: true,
    });

    return jsonResult.response.body.totalCount;
};

// 사업자정보 조회
export const fetchBusinessByBusinessId = async (businessId: string) => {
    const res = await axiosInstance.get<{ data: Business }>(`/businessId/${businessId}`);
    return res.data;
};



// 토큰 재발급 (refreshToken 사용, 사업자,관리자 같이 사용 - 분리해주고 위와같은 axiosInstance 를 사용하자.)
export const refreshAccessToken = async (refreshToken: string) => {
    try {
        //const res = await axios.post(`http://localhost:8080/api/auth/newToken`,{}, {
        const res = await axios.post(`http://1.234.38.137:8080/api/auth/newToken`,{}, {
            
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return { success: true, value: res.data.accessToken };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};