export interface Partner {
    partnerName: string;        // 상호명
    partnerId: string;          // 로그인 아이디
    partnerPassword: string;    // 로그인 비밀번호
    businessRegistrationNo: string;   // 사업자번호
    phone: string;              // 사업분야
    email: string;              // 지역
    businessType: string;       // 전화번호
    region: string;             // 이메일
    address: string;            // 우편번호
    addressDetail: string;      // 주소1
    postalCode: string;         // 주소2
    
}  


export interface PartnerRequest extends Partner {
    
}

export interface PartnerResponse extends Partner {
    createdAt: string;          // 가입일
    updatedAt: string;          // 수정일
    deletedAt: string;          // 삭제일
}