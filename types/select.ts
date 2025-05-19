export type OptionType = {
        value: string;
        label: string;
}


export const SelectPartnerSearchOptions: OptionType[] = [
        { value: 'all', label: '전체' },
        { value: 'name', label: '상호명' },
        { value: 'number', label: '사업자번호' },
        { value: 'area', label: '지역' },
];

export const SelectCouponSearchOptions: OptionType[] = [
        { value: 'all', label: '전체' },
        { value: 'name', label: '상호명' },
        { value: 'coupon', label: '쿠폰명' },
        { value: 'state', label: '상태' },
];

export const SelectBusinessTypeOptions: OptionType[] = [
        { value: '한식', label: '한식' },
        { value: '중식', label: '중식' },
        { value: '일식', label: '일식' },
        { value: '양식', label: '양식' },
        { value: '피자', label: '피자' },
        { value: '치킨', label: '치킨' },
        { value: '패스트푸드', label: '패스트푸드' },
        { value: '아시안', label: '아시안' },
        { value: '카페ㆍ디저트', label: '카페ㆍ디저트' },
];
