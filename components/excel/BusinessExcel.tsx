//사업자 목록 다운로드 기능
'use client';

// 기존
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { fetchBusinessesAll } from '@/lib/apis/admin';


type Props = {
    name: string;
    startDate: string;
    endDate: string;
    sort: string;
};

export default function BusinessExcel<T>({ name, startDate, endDate, sort }: Props) {

    const handleDownload = async () => {

        //다운로드 파일명
        const fileName = "사업자목록.xlsx";
        //다운로드할 데이타 불러오기
        const { data, total } = await fetchBusinessesAll({ name, startDate, endDate, sort });
        //console.log("data : ", data)
        //console.log("total : ", total)

        //컬럼 및 헤더 설정
        const header = ["사업자", "사업자번호", "사업분야", "지역"];
        const sheetData = [header, ...data.map(item => [item.businessName, item.businessNumber, item.category, item.region]),];

        // 워크시트 생성
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

        // 셀 스타일 설정 (헤더 볼드 + 배경색, 테두리)
        const range = XLSX.utils.decode_range(worksheet['!ref']!);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cell_address];







                if (cell) {
                    // 테두리
                    cell.s = {
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } },
                        },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        font: R === 0 ? { bold: true } : {},
                        fill: R === 0
                            ? { fgColor: { rgb: 'D9E1F2' } } // 헤더 연한 파랑
                            : { fgColor: { rgb: 'FFFFFF' } }, // 리스트 흰색
                    };

                    // 헤더 스타일
                    if (R === 0) {
                        cell.s.fill = { fgColor: { rgb: "D9E1F2" } }; // 연한 파란색
                        cell.s.font = { bold: true };
                    }
                }
            }
        }

        // 워크북 생성 및 다운로드 (fileName)
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '사업자 목록');
        XLSX.writeFile(workbook, fileName, { bookType: 'xlsx' });

        //const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        //파일 다운로드 처리
        //saveAs(blob, `${fileName}`);
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            엑셀 다운로드
        </button>
    );
}