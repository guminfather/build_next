'use client';
import React, { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

import axios from 'axios';

export default function Business() {

    const [couponUrl, setCouponUrl] = useState('http://www.naver.com');
    

    const handleDownload = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            alert('QR 코드가 아직 생성되지 않았어요!');
            return;
        }
    
        console.log("여기 클릭했어?")
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'coupon_qr.png';
        downloadLink.click();
    };


    return (
        <div>
            <h2>사업자 메인 - QR 코드 샘플이예요.</h2>
            {couponUrl && (
                <div className="mt-6">
                    <h2>QR 코드</h2>
                    <QRCodeCanvas value={couponUrl} size={200} />
                    <p className="mt-2 text-sm">{couponUrl}</p>

                    <h2>QR 코드-더 선명함</h2>
                    <QRCodeSVG value={couponUrl} size={200} />

                    <button onClick={handleDownload}>
                        QR 코드 다운로드
                    </button>
                </div>
            )}
        </div>
    );
}



