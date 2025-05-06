'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { fetchPartnerCouponDetail, deleteCoupon } from '@/lib/apis/partner';
import { CouponResponse } from '@/types/coupon';
import axios from 'axios';

export default function BusinessCouponDetail({ params }: { params: Promise<{ id: string }> }) {

    //params	동적 라우팅(폴더 경로)의 [id], [slug] 같은 URL 경로의 일부를 가져옴
    //searchParams	?key=value 형태의 쿼리 파라미터를 가져옴
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [coupon, setCoupon] = useState<CouponResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultData = await fetchPartnerCouponDetail(id);
                setCoupon(resultData.value);
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };
        fetchData();

    }, [id]);

    const handleDelete = async () => {
        if(!confirm(" 쿠폰을 정말 삭제 하시겠습니까? ")) return;
        try {
            const result = await deleteCoupon(Number(id));
            if (result.success) {
                alert(`쿠폰을 삭제 하였습니다.`); 
                router.push(`../coupon/list`); //페이지 이동
            } else {
                alert(result.message);
                return;
            }
        } catch (error) {
            console.error("데이터 삭제 실패:", error);
        }
    };
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">쿠폰상세정보</h1>
            <div className="border p-4 mb-4">
                <dl>
                    <dt>상호</dt>
                    <dd>{coupon?.partnerName}</dd>
                </dl>
                <dl>
                    <dt>쿠폰명</dt>
                    <dd>{coupon?.couponName}</dd>
                </dl>
                <dl>
                    <dt>할인율</dt>
                    <dd>{coupon?.discountRate}</dd>
                </dl>
                <dl>
                    <dt>쿠폰타입</dt>
                    <dd>{coupon?.templateType}</dd>
                </dl>
                <dl>
                    <dt>사용기간</dt>
                    <dd>{coupon?.usageStartDate} ~ {coupon?.usageEndDate}</dd>
                </dl>
                <dl>
                    <dt>발급기간</dt>
                    <dd>{coupon?.issueStartDate} ~ {coupon?.issueEndDate}</dd>
                </dl>
                <dl>
                    <dt>사용가능여부</dt>
                    <dd>{coupon?.isUsable}</dd>
                </dl>
                <dl>
                    <dt>해택내용</dt>
                    <dd>{coupon?.benefitDescription}</dd>
                </dl>
            </div>
            <button onClick={() => { router.push(`./list?${searchParams.toString()}`); }}>목록으로 돌아가기</button>
            <button onClick={() => { router.push(`./edit/${id}?${searchParams.toString()}`); }}>수정</button>
            <button onClick={handleDelete} id="del">삭제</button>
            
        </div>
    );
}
