import axios from "axios";
import type { User } from "../type";

const BASE_URL = import.meta.env.VITE_API_URL;

export const verifyPassword = async (password: string): Promise<boolean> => {
  const token = sessionStorage.getItem("jwt");
  if (!token) throw new Error("로그인 토큰이 없습니다.");

  try {
      const res = await axios.post(
        `${BASE_URL}/mypage/pw`,
        { password },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json", // 명시적으로 JSON 요청임을 선언
          },
        }
      );
      return (res.data as any).valid;
    }catch (error: any) {
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
  const token = sessionStorage.getItem("jwt");
  if (!token) throw new Error("로그인 토큰이 없습니다.");

  const res = await axios.get(`${BASE_URL}/mypage/info`, {
    headers: {
      Authorization: token,
    },
  });
  return res.data as any;
};

export const updateUserInfo = async (data: Omit<User, "loginId">): Promise<void> => {
  const token = sessionStorage.getItem("jwt");
  if (!token) throw new Error("로그인 토큰이 없습니다.");

  await axios.put(`${BASE_URL}/mypage/update`, data, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteUserAccount = async (): Promise<void> => {
  const token = sessionStorage.getItem("jwt");
  if (!token) throw new Error("로그인 토큰이 없습니다.");

  try {
    await axios.delete(`${BASE_URL}/mypage/delete`, {
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    throw new Error("회원탈퇴 요청 중 오류가 발생했습니다.");
  }
};