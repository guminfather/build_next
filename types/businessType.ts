export interface Business {
    id: number;                // 일련번호
    businessId: string;        // 상호아이디
    businessPw: string;        // 상호비밀번호
    businessName: string;      // 상호명
    businessNumber: string;   // 사업자번호
    category: string;         // 사업분야
    region: string;           // 지역
    phone: string;            // 전화번호
    email: string;            // 이메일
    zipcode: string;          // 우편번호
    addr1: string;            // 주소1
    addr2: string;            // 주소2
    createdAt: string;         // 생성일 (ISO date string)
    updatedAt: string;         // 수정일
}  


