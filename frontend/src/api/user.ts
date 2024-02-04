import baseAxios, { apiPost, apiGet } from "./api";

async function loginApi(email: string, password: string) {
    return await apiPost('/user/login', { email, password });
}

async function registerApi(email: string, password: string, gender: string, age: number, nickname: string) {
    //return await baseAxios.post('/user/signup', { email, password, gender, age, nickname })
    return await apiPost('/user/signup', { email, password, gender, age, nickname });
}

async function meApi() {
    return await apiGet('/user/me');
}

export { loginApi, registerApi, meApi }