import { CustomGenre, Genre } from "src/types/Genre";

export const API_ENDPOINT_URL = import.meta.env.VITE_APP_API_ENDPOINT_URL;
export const TMDB_V3_API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

export const HOST_URL = import.meta.env.VITE_APP_HOST_URL;

export const MAIN_PATH = {
  root: "",
  browse: "browse",
  genreExplore: "genre",
  search : "search",
  watch: "watch",
  register: "register",
  login: "login",
};

export const ARROW_MAX_WIDTH = 60;
export const COMMON_TITLES: CustomGenre[] = [
  { name: "Topliked", apiString: "topliked" },
  { name: "Myliked", apiString: "myliked" },
  { name: "Recommend", apiString: "recommend"},
];

export const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
export const APP_BAR_HEIGHT = 70;

export const TOAST_OPTIONS = {
  borderRadius: '10px',
  background: '#333',
  color: '#fff',
};

export const genres: Genre[] | undefined = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
];

export const genresKorMap: { [key: string]: string } = {
  "Action": "액션",
  "Adventure": "어드벤처",
  "Animation": "애니메이션",
  "Comedy": "코미디",
  "Crime": "범죄",
  "Documentary": "다큐멘터리",
  "Drama": "드라마",
  "Family": "가족",
  "Fantasy": "판타지",
  "History": "역사",
  "Horror": "공포",
  "Music": "음악",
  "Mystery": "미스터리",
  "Romance": "로맨스",
  "Science Fiction": "SF",
  "TV Movie": "TV",
  "Thriller": "스릴러",
  "War": "전쟁",
  "Western": "서부",
  "Recommend" : "당신을 위한",
  "Topliked" : "좋아요가 많은",
  "Myliked" : "내가 좋아요한",
};