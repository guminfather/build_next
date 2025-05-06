import { v4 as uuidv4 } from 'uuid';

// 날짜 포맷팅 함수 (YYYY-MM-DD)
export const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
};

// 숫자에 콤마(,) 추가 (1000 → 1,000)
export const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};

// 숫자 , 표시 (20,000원 / 2,000개)
export const formatNumberWithUnit = (data, unit) => {
    return formatNumber(data) + unit
};





// 로컬 스토리지 저장 & 가져오기
export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

// API 요청 공통 함수 (fetch 사용)
export const fetchData = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
};

// 이메일 유효성 검사
export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

// 랜덤 ID 생성
//export const generateRandomId = () => {
//  return "_" + Math.random().toString(36).substr(2, 9);
//};

// 게스트 고유 아이디 생성
export const generateGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
        guestId = uuidv4();
        localStorage.setItem('guestId', guestId);
    }
    return guestId;
};



// JSON 변환
export const json_print = (data) => {
    let returnData = JSON.stringify(data, null, 2);
    return returnData;
};


