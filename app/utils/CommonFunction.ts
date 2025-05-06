// 날짜 포맷 함수
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

// 주민번호 마스킹 함수
const maskSSN = (ssn: string) => {
    return ssn ? ssn.replace(/(\d{6})-(\d{1})\d{6}/, "$1-$2******") : '';
};