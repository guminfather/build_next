export interface Search {
    name: string;
    startDate: string;
    endDate: string;
    sort: string;
    page: number;
    pageSize: number;
}


export interface SearchRequest extends Search {
}

export interface SearchResponse extends Search {
}