import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { Button, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Box from '@mui/material/Box';
import { isAdmin } from "../utils/auth";
import MainSearch from "../components/MainSearch";

export default function Header() {
  const { isAuthenticated, userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  // sessionStorage에서 토큰을 가져옴
  const token = sessionStorage.getItem("jwt") ?? "";

  // 관리자 권한 체크
  const admin = isAdmin(token);

  const handleLogout = () => {
    sessionStorage.removeItem("jwt"); // 토큰 제거
    logout();                         // 상태 초기화
    navigate("/login");              // 로그인 페이지로 이동
  };

  const goToMyPage = () => {
    if (isAuthenticated) {
      navigate("/mypage");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="header">
      {/* 왼쪽: 로고 */}
      <div className="header-left">
        <span className="logo-text" onClick={() => navigate("/")} style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/carret_favicon.png" 
            alt="logo icon" 
            style={{ 
              height: '50px', 
              width: 'auto', 
              marginRight: '10px',
              marginBottom: '5px'
            }} 
          />
          캐럿마켓
        </span>
      </div>
      {isAuthenticated && userInfo.role === "ROLE_ADMIN" && (
        <Button onClick={() => navigate("/manage/visit")}>관리자 페이지</Button>
      )}

      
      {/* 가운데: 검색창 또는 관리자 메뉴 */}
    <div className="header-center">
      {!admin ? (
        // {/* 일반 사용자일 때 검색창 보이기 */}
        <Box width="400px" mt={1}>
          <MainSearch />
        </Box>
      ) : (
        // {/* ADMIN에서만 쓸 수 있는 페이지 카테고리 보이기 */}
        <Box display="flex" mt={2} gap={1}>
          <Button className="admin-button" onClick={() => navigate('/manage/visit')}>방문자수</Button>
          <Button className="admin-button" onClick={() => navigate('/manage/fileSetting')}>파일설정</Button>
          <Button className="admin-button" onClick={() => navigate('/manage/users')}>회원데이터</Button>
          <Button className="admin-button" onClick={() => navigate('/manage/posts')}>게시글데이터</Button>
          <Button className="admin-button" onClick={() => navigate('/manage/trash')}>휴지통</Button>
        </Box>
      )}
    </div>

      {/* 오른쪽: 로그인 버튼 & 아이콘 */}
      <div className="header-right">
        <Box mt={1}>
          {isAuthenticated ? (
            <Button onClick={handleLogout}>로그아웃</Button>
          ) : (
            <Button onClick={() => navigate("/login")}>로그인</Button>
          )}
          <IconButton
            color="inherit"
            onClick={goToMyPage}
            sx={{
              outline: "none",
              boxShadow: "none",
              "&:focus": {
                outline: "none",
                boxShadow: "none",
              },
              "&:active": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </div>
    </div>
  );
}
