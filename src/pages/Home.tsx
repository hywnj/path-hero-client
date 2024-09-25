import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useAuth from "../hooks/useAuth";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 로그인 페이지로 이동하는 함수
  const goToLogin = () => {
    navigate("/login");
  };

  // 회원가입 페이지로 이동하는 함수
  const goToSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    // 로그아웃 시 스프링 백엔드의 로그아웃 URL 호출
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/logout`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <h1>🦸‍♀️ Path HERO 🦸‍♂️</h1>
      {isAuthenticated() ? (
        // 로그아웃 버튼만 보임
        <Button
          onClick={handleLogout}
          style={{ marginLeft: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          로그아웃
        </Button>
      ) : (
        // 로그인, 회원가입 버튼 보임
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={goToLogin}
            sx={{ margin: "10px", padding: "10px 20px" }}
          >
            로그인
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={goToSignup}
            sx={{ margin: "10px", padding: "10px 20px" }}
          >
            회원가입
          </Button>
        </>
      )}
    </Box>
  );
}

export default HomePage;
