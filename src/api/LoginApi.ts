
import axios from "axios";
import type { LoginUser, User } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const getAuthToken = async (user: LoginUser) => {
  const response = await axios.post(`${BASE_URL}/login`, user);
  const token = response.headers.authorization;
  sessionStorage.setItem("jwt", token);
  return response.data as any;
}

export const signUp = async (user: User): Promise<User> => {
  const res = await axios.post(`${BASE_URL}/signup`, user);
  return res.data as any;
}

export const checkDuplicateEmail = async (email: string): Promise<boolean> => {
  const res = await axios.get("/api/signup/echeck", { params: { email } });
  return res.data as any; // true면 중복됨, false면 사용 가능
};

export const checkDuplicateNickname = async (nickname: string): Promise<boolean> => {
  const res = await axios.get("/api/signup/ncheck", { params: { nickname } });
  return res.data as any;
};

export const checkDuplicatePhone = async (phoneNum: string): Promise<boolean> => {
  const res = await axios.get("/api/signup/pcheck", { params: { phoneNum } });
  return res.data as any;
};
