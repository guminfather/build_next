'use client'
import React from 'react';
import { qrcodeCreate } from '@/lib/apis/common';
import { useRouter, useSearchParams } from 'next/navigation';
import { qrcodeUsed } from '@/lib/apis/partner';

export default function qrCodeUsed() {

    const params = useSearchParams();
    
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const queryId = params?.get('id') || '';
            console.log("id : ", queryId)

            const result = await qrcodeUsed(queryId);
            if (result.success) {
                alert("쿠폰사용 성공");
                console.log("성공 : ", result.value)
            } else {
                alert("쿠폰사용 실패");
                console.log("실패 : ", result.message)
            }
        } catch (err) {
            console.log("실패 : ", err)
        }
    };


    return (
        <div>
            <button onClick={handleSubmit} type="button" id="kt_sign_in_submit" className="btn btn-primary"  data-kt-indicator="off">
                <span className="indicator-label">쿠폰사용</span>
            </button>
        </div>
    );
}
