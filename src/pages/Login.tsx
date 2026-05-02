import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { useState } from "react";
import type { LoginUser } from "../type";
import { getAuthToken } from "../api/LoginApi";
import { Button, Snackbar, Stack, TextField, Typography } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [toastOpen, setToastOpen] = useState(false);
  const [user, setUser] = useState<LoginUser>({
    loginId: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    if (!user.loginId || !user.password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    getAuthToken(user)
      .then((res: any) => {
        sessionStorage.setItem("userId", res.userId);
        sessionStorage.setItem("nickname", res.nickname);
        sessionStorage.setItem("role", res.role);
        login(res);
        navigate("/");
      })
      .catch(() => {
        setUser({ ...user, password: "" });
        setToastOpen(true);
      });

  };

  return (
    <>
      <Stack spacing={2} mt={2} alignItems={"center"}>
        <Typography>로그인 페이지</Typography>
        <TextField
          label="ID"
          name="loginId"
          value={user.loginId}
          onChange={handleChange}
          sx={{
            width: 300, // px 단위
          }}
        />
        <TextField
          label="PW"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          sx={{
            width: 300,
            '& .MuiInputBase-input': { fontFamily: 'Arial, sans-serif', fontSize: '0.9rem' }}
          } // 입력 텍스트
        />
        <Button onClick={handleSignUp}>회원가입</Button>
        <Button color="primary" onClick={handleLogin}>로그인</Button>
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          message="로그인 실패"
        />
      </Stack>
    </>
  );
}