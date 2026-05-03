import api from "./axiosConfig";
import type { User } from "../type";

export const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const res = await api.post("/mypage/pw", { password });
    return (res.data as any).valid;
  } catch (error: any) {
    if (error.isAxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error("Axios 오류 상태코드:", status ?? "응답 없음");
      console.error("Axios 오류 응답:", data ? JSON.stringify(data) : error.message);
    } else if (error instanceof Error) {
      console.error("일반 오류:", error.message);
    } else {
      console.error("알 수 없는 오류:", error);
    }
    throw new Error("인증 요청 중 오류가 발생했습니다.");
  }
};

export const getUserInfo = async (): Promise<User> => {
  const res = await api.get("/mypage/info");
  return res.data as any;
};

export const updateUserInfo = async (data: Omit<User, "loginId">): Promise<void> => {
  await api.put("/mypage/update", data);
};

export const deleteUserAccount = async (): Promise<void> => {
  try {
    await api.delete("/mypage/delete");
  } catch (error) {
    throw new Error("회원탈퇴 요청 중 오류가 발생했습니다.");
  }
};