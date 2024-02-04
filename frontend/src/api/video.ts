import baseAxios, { apiGet, apiPost } from "./api";

async function videoDetailApi(videoId: string) {
    return await apiGet('/video/video/' + videoId);
}

async function videoListApi(genre: string) {
    return await apiGet(`/video/videolist?genre=${genre}`);
}

async function videoSearchApi(target: string) {
    return await apiGet(`/video/search?target=${target}`);
}

async function likeVideoApi(videoId: string) {
    return await apiPost('/video/likevideo', { videoId });
}

async function userWatchApi(videoId: string, duration: number) {
    return await apiPost('/video/userwatch', { videoId, duration });
}

async function videoRecommendApi() {
    return await apiGet(`/video/recommend`);
}

async function videoLogApi(data : any){
    return await apiPost('/video/log', data);
}

export { videoDetailApi, videoListApi, likeVideoApi, userWatchApi, videoRecommendApi, videoLogApi, videoSearchApi }