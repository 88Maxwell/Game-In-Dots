import config from "../../configs";

class API {
    constructor({ prefix = "api/v1" } = {}) {
        this.prefix = prefix;
        this.token = "";

        [ "get", "post", "patch", "delete" ].forEach(
            method =>
                // eslint-disable-next-line
                (this[method] = async (url, data) =>
                    this.request({
                        url,
                        method : method.toUpperCase(),
                        body   : { data }
                    }))
        );
    }

    async request({ url, method, body }) {
        if (this.token) {
            // eslint-disable-next-line
            params.token = this.token;
        }

        const response = await fetch(`${config.apiUrl}${this.prefix}${url}`, {
            method,
            headers : {
                "Content-Type"  : "application/json",
                "Cache-Control" : "no-cache",
                "pragma"        : "no-cache"
            },
            withCredentials : true,
            crossDomain     : false,
            body            : method !== "GET" ? JSON.stringify(body) : undefined
        });

        if (response.status !== 200) throw new Error("REQUEST ERROR");

        const json = await response.json();

        return json;
    }

    setToken(token) {
        this.token = token;
    }
}

export default new API({ prefix: config.apiPrefix });
