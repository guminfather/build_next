
export interface Coupon {
    partnerId: string; //사업자 아이디
    couponName: string;
    discountRate: number;
    templateType: number;
    usageStartDate: string;
    usageEndDate: string;
    issueStartDate: string;
    issueEndDate: string;
    benefitDescription: string;
    isUsable: 'USABLE' | 'NOT_USABLE';
    isIssue: 'Y' | 'N';
    issueDate: string;
    productNames: string[];
}

export interface CouponRequest extends Coupon {
    couponId: number;
}

export interface CouponResponse extends Coupon {
    couponId: number;
    partnerName: string; // 상호명
    createdAt: string;
    updatedAt: string;
}