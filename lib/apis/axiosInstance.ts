import axios from "axios";
import { getBusinessAccessToken } from '@/lib/businessAuth';
import { getAdminAccessToken } from '@/lib/adminAuth';

//const API_BASE_URL = 'http://localhost:8080'; // API 서버 주소
const API_BASE_URL = 'http://1.234.38.137:8080'; // API 서버 주소

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (토큰 자동 추가)
axiosInstance.interceptors.request.use(
    (config) => {
        if (!config.url) {
            return config;
        }
        //delete일경우는 Content-Type을 보내지 않겠다.
        if (config.method === 'delete') {
            if (config.headers) {
                delete config.headers['Content-Type'];
            }
        }

        // 사업자 요청이면 사업자 토큰
        if (config.url.startsWith('/api/partner')) {
            const businessToken = getBusinessAccessToken();
            if (businessToken && config.headers) {
                config.headers['Authorization'] = `Bearer ${businessToken}`;
            }
        }
        // 관리자 요청이면 관리자 토큰
        else if (config.url.startsWith('/api/admin')) {
            const adminToken = getAdminAccessToken();
            if (adminToken && config.headers) {
                config.headers['Authorization'] = `Bearer ${adminToken}`;
            }
        }
        // 나머지 (ex: /api/auth 등) 는 토큰 안 붙임
        else {

        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (공통 에러 핸들링)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("에러 응답:", error.response.data?.error || error.message);
        } else {
            console.error("서버 연결 실패:", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;