//필요없어 보임
// import axios from "axios";

<<<<<<< Updated upstream
// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });
=======
// axios instance 생성
// baseURL: 환경변수(VITE_API_URL)가 있으면 그 값을, 없으면 로컬 주소를 사용
// → 로컬: http://localhost:8080  /  Vercel 배포: 실제 백엔드 주소
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 30000, // 30초 안에 응답 없으면 에러 처리 (서버 먹통 방지)
});
>>>>>>> Stashed changes

// instance.interceptors.request.use(config => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default instance;