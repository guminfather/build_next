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
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"> Kees Business Manage </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                                <a href="/admin/manage" className="text-muted text-hover-primary">Home</a>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="bullet bg-gray-400 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-muted">Dashboards</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-xxl">
                    <div className="card">
                        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                            <div className="card-title">
                                
                                {
                                    couponUrl && (
                                        <div className="mt-6">
                                            <h2> QR 코드 샘플</h2>
                                            <QRCodeCanvas value={couponUrl} size={200} />
                                            <p className="mt-2 text-sm">{couponUrl}</p>

                                            <h2> QR 코드 샘플-더 선명함</h2>
                                            <QRCodeSVG value={couponUrl} size={200} />

                                            <button onClick={handleDownload}>
                                                QR 코드 다운로드
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}



