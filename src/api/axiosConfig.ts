import axios from "axios";

// axios instance 생성
// baseURL: 환경변수(VITE_API_URL)가 있으면 그 값을, 없으면 로컬 주소를 사용
// → 로컬: http://localhost:8080  /  Vercel 배포: 실제 백엔드 주소
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 5000, // 5초 안에 응답 없으면 에러 처리 (서버 먹통 방지)
});

// 요청 인터셉터: 모든 요청에 JWT 토큰을 자동으로 헤더에 붙임
// → 각 API 파일마다 sessionStorage.getItem("jwt") 반복할 필요 없음
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwt");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;