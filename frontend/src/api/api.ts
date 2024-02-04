import axios from "axios";
import { HOST_URL } from "src/constant";

let baseAxios = axios.create({
    baseURL: HOST_URL,
});

async function apiPost(url: string, data: any) {
    return await baseAxios.post(url, data,
        {
            headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
        }
    ).then((res) => {
        return res;
    }
    ).catch((err) => {

        let refreshToken = localStorage.getItem("refreshToken");
        if ((err.response.status === 401 || err.response.status === 419) && refreshToken) {
            return baseAxios.get("/user/refreshToken",
                {
                    headers: { Authorization: "Bearer " + refreshToken },
                }).then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    return apiPost(url, data);
                }).catch((err) => {
                })
        }

        return err.response;
    })
}


async function apiGet(url: string) {
    return await baseAxios.get(url,
        {
            headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
        }
    ).then((res) => {
        return res;
    }
    ).catch((err) => {

        let refreshToken = localStorage.getItem("refreshToken");
        if ((err.response.status === 401 || err.response.status === 419) && refreshToken) {
            return baseAxios.get("/user/refreshToken",
                {
                    headers: { Authorization: "Bearer " + refreshToken },
                }
            ).then((res) => {
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                return apiGet(url);
            }).catch((err) => {
            })
        }


        return err.response;
    })
}

export default baseAxios;
export { apiPost, apiGet };