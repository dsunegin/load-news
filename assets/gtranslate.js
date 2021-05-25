"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateApi = exports.TranslateApi = void 0;
const axios_es6_class_1 = require("axios-es6-class");
// this are the minimun properties the Api class expect
let apiConfig = {
    timeout: 60000,
    baseURL: "https://bbabo.net"
};
class TranslateApi extends axios_es6_class_1.Api {
    constructor(config) {
        super(config);
        // this middleware is been called right before the http request is made.
        this.interceptors.request.use(param => {
            return Object.assign(Object.assign({}, param), { headers: Object.assign(Object.assign({}, param.headers), { "Authorization": `Bearer ${this.getToken()}` }) });
        });
        this.translate = this.translate.bind(this);
        this.test = this.test.bind(this);
    }
    translate(data) {
        return this.post("/translate", data)
            .then(this.success);
    }
    test() {
        return this.get("/translate")
            .then(this.success);
    }
}
exports.TranslateApi = TranslateApi;
exports.translateApi = new TranslateApi(apiConfig);
//# sourceMappingURL=gtranslate.js.map