import { Api } from "axios-es6-class";
export interface translateData {
    sl?: string;
    tl?: string;
    text?: string;
}
export declare class TranslateApi extends Api {
    constructor(config: any);
    translate(data: translateData): any;
    test(): any;
}
export declare const translateApi: TranslateApi;
