import api from "./axiosConfig";
import type { LoginUser, User } from "../type";

export const getAuthToken = async (user: LoginUser) => {
  const response = await api.post("/login", user);
  const token = response.headers.authorization;
  sessionStorage.setItem("jwt", token);
  return response.data as any;
};

export const signUp = async (user: User): Promise<User> => {
  const res = await api.post("/signup", user);
  return res.data as any;
};

export const checkDuplicateEmail = async (email: string): Promise<boolean> => {
  const res = await api.get("/signup/echeck", { params: { email } });
  return res.data as any;
};

export const checkDuplicateNickname = async (nickname: string): Promise<boolean> => {
  const res = await api.get("/signup/ncheck", { params: { nickname } });
  return res.data as any;
};

export const checkDuplicatePhone = async (phoneNum: string): Promise<boolean> => {
  const res = await api.get("/signup/pcheck", { params: { phoneNum } });
  return res.data as any;
};
