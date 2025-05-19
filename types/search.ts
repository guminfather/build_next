export interface Search {
    page: number;
    pageSize: number;
    searchText: string;
    searchType: string;
}

export interface SearchCoupon extends Search {
    startDate: string;
    endDate: string;
}



export interface SearchRequest extends Search {
}

export interface SearchResponse extends Search {
}