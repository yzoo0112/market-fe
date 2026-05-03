import { Button, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../type";
import { checkDuplicateEmail, checkDuplicateNickname, checkDuplicatePhone, signUp } from "../api/LoginApi";

export default function SignUpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const loginIdFromLogin = location.state?.loginId ?? "";

    
    const [toastOpen, setToastOpen] = useState(false);
    const [user, setUser] = useState<User>({
        loginId: loginIdFromLogin,
        password: '',
        nickname: '',
        userName: '',
        phoneNum: '',
        birth: '',
        email: '',
        addr: '',
    });

    const [emailCheck, setEmailCheck] = useState<null | boolean>(null);
    const [nicknameCheck, setNicknameCheck] = useState<null | boolean>(null);
    const [phoneCheck, setPhoneCheck] = useState<null | boolean>(null);


    const fieldLabels: Record<keyof User, string> = {
        loginId: "아이디",
        password: "비밀번호",
        nickname: "닉네임",
        userName: "이름",
        phoneNum: "전화번호",
        birth: "생년월일",
        email: "이메일",
        addr: "주소"
    };


    const handleCheckEmail = () => {
        checkDuplicateEmail(user.email).then((exists) => {
            setEmailCheck(exists);
        });
    };

    const handleCheckNickname = () => {
        checkDuplicateNickname(user.nickname).then((exists) => {
            setNicknameCheck(exists);
        });
    };

    const handleCheckPhone = () => {
        checkDuplicatePhone(user.phoneNum).then((exists) => {
            setPhoneCheck(exists);
        });
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({...user, [e.target.name]: e.target.value});
    }


    const handleSign = async () => {
    const missingFields = (Object.keys(user) as (keyof User)[])
        .filter((key) => !user[key])
        .map((key) => fieldLabels[key]);

    if (missingFields.length > 0) {
        alert(`${missingFields.join(", ")}을 작성해주세요`);
        return;
    }

    if (emailCheck === null || nicknameCheck === null || phoneCheck === null) {
        alert("이메일, 닉네임, 전화번호의 중복 확인을 먼저 해주세요.");
        return;
    }

    if (emailCheck || nicknameCheck || phoneCheck) {
        alert("중복된 정보가 있습니다. 확인 후 다시 시도해주세요.");
        return;
    }


    try {
        await signUp(user);
        alert("회원가입 성공!");
        navigate("/login");
    } catch (error) {

        alert("회원가입에 실패했습니다.");
    }
    };

    return(
        <>
        <Stack spacing={2} mt={2} alignItems={"center"}>
            <Typography>회원가입 페이지</Typography>
            <TextField 
                label="ID"
                name="loginId"
                value={user.loginId}
                onChange={handleChange}
            />
            <TextField 
                label="PW"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                sx={{
                    width: 184,
                    '& .MuiInputBase-input': { fontFamily: 'Arial, sans-serif', fontSize: '0.9rem' }}
                }
            />
            <TextField
                label="이메일"
                name="email"
                value={user.email}
                onChange={handleChange}
            />

            <Button onClick={handleCheckEmail}>중복 확인</Button>
            {emailCheck === true && <span style={{ color: "red" }}>이미 존재하는 이메일입니다</span>}
            {emailCheck === false && <span style={{ color: "green" }}>사용 가능한 이메일입니다</span>}

            <TextField
            label="닉네임"
            name="nickname"
            value={user.nickname}
            onChange={handleChange}
            />

            <Button onClick={handleCheckNickname}>중복 확인</Button>
            {nicknameCheck === true && <span style={{ color: "red" }}>이미 존재하는 닉네임입니다</span>}
            {nicknameCheck === false && <span style={{ color: "green" }}>사용 가능한 닉네임입니다</span>}
            
            <TextField 
                label="이름"
                name="userName"
                value={user.userName}
                onChange={handleChange}
            />
            <TextField 
                label="생년월일"
                name="birth"
                value={user.birth}
                onChange={handleChange}
            />
            <TextField 
                label="전화번호"
                name="phoneNum"
                value={user.phoneNum}
                onChange={handleChange}
            />

            <Button onClick={handleCheckPhone}>중복 확인</Button>
            {phoneCheck === true && <span style={{ color: "red" }}>이미 가입된 전화번호입니다</span>}
            {phoneCheck === false && <span style={{ color: "green" }}>사용 가능한 전화번호입니다</span>}

            <TextField 
                label="주소"
                name="addr"
                value={user.addr}
                onChange={handleChange}
            />
            <Button
                color="error"
                onClick={handleSign}
            >
                회원가입하기
            </Button>
            <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={() => setToastOpen(false)}
                message="회원가입 실패"
            />
        </Stack>
        </>
    );
}