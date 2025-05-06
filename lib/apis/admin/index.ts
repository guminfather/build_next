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

//쿠폰 생성
export const createCoupon = async (newCoupon: Coupon) => {
    try {
        const res = await axiosInstance.post('/api/admin/coupon', newCoupon);
        return { success: true, value: "쿠폰생성 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//쿠폰 수정
export const updateCoupon = async (newCoupon: Coupon) => {
    try {
        const res = await axiosInstance.patch('/api/admin/coupon', newCoupon);
        return { success: true, value: "쿠폰수정 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//쿠폰 삭제
export const deleteCoupon = async (couponId: number) => {
    try {
        const res = await axiosInstance.delete(`/api/admin/coupon/${couponId}`);
        return { success: true, value: "쿠폰삭제 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

// 관리자 쿠폰 리스트
export const fetchAdminCoupons = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/admin/coupons?${query}`);
        return { success: true, value: res.data };

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//관리자 쿠폰 상세보기
export const fetchAdminCouponDetail = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/api/admin/coupon/${id}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//---------------------------------------------------------------------------------------

// 사업자 리스트
export const fetchPartners = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/admin/partners?${query}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//사업자 생성
export const createPartner = async (newPartner: Partner) => {
    try {
        const res = await axiosInstance.post('/api/admin/partner', newPartner);
        return { success: true, value: "사업자 등록록 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//사업자 수정
export const updatePartner = async (newPartner: Partner) => {
    try {
        const res = await axiosInstance.patch('/api/admin/partner', newPartner);
        return { success: true, value: "사업자 정보 수정 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//사업자 삭제
export const deletePartner = async (partnerId: String) => {
    try {
        const res = await axiosInstance.delete(`/api/admin/partner/${partnerId}`);
        return { success: true, value: "사업자 정보 삭제 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};


//사업자 상세보기
export const fetchAdminPartnerDetail = async (partnerId: string) => {
    try {
        const res = await axiosInstance.get(`/api/admin/partner/${partnerId}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};


// 관리자 사업자리스트 (엑셀 다운로드용 전체 리스트)
export const fetchBusinessesAll = async (params: {
    name: string;
    startDate: string;
    endDate: string;
    sort: string;
}) => {
    try {
        const query = qs.stringify(params);

        const res = await axiosInstance.get<{ total: number, businessInfo: Business[] }>(`/business/list?${query}`);

        return { data: res.data.businessInfo, total: res.data.total };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        throw new Error(message); // 실패시 에러 throw (엑셀 다운로드 같은 경우는 실패를 알려야 하니까)
    }
};