export interface CouponInfo { 
    id: number;
    businessId: number;        // 상호코드 (business_info.id 참조)
    businessName?: string;     // 상호명 (display용)
    couponName: string;        // 쿠폰명
    discountRate?: number;     // 할인율 (예: 15.0)
    templateNumber?: string;   // 템플릿번호
    usePeriodStart?: string;   // 사용 시작일 (YYYY-MM-DD)
    usePeriodEnd?: string;     // 사용 종료일
    issuePeriodStart?: string; // 발급 시작일
    issuePeriodEnd?: string;   // 발급 종료일
    benefit?: string;          // 혜택내용
    isAvailable: '사용' | '사용불가'; // 쿠폰 사용여부
    createdAt: string;
    updatedAt: string;
}  