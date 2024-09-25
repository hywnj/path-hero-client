import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { Box, TextField, Button, Typography, Link } from "@mui/material";

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 컴포넌트 마운트 이후 Login 된 상태면 main으로 이동
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/main");
    }
  }, [isAuthenticated, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 이메일을 서버로 전송하여 소셜 제공자 정보 확인
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/check-account`,
        {
          account: email,
        }
      );

      // 서버에서 소셜 제공자 정보를 반환
      const provider = response.data.provider;

      console.log("받은 소셜 제공자:", provider);
      console.log("provider 값:", response.data.provider);

      if (provider === "google") {
        window.location.href = `${
          import.meta.env.VITE_SERVER_URL
        }/oauth2/authorization/google`;
      } else if (provider === "naver") {
        window.location.href = `${
          import.meta.env.VITE_SERVER_URL
        }/oauth2/authorization/naver`;
      } else {
        setErrorMessage("지원하지 않는 소셜 로그인 제공자입니다.");
      }
    } catch (error) {
      // 에러가 발생하면 메세지 설정
      setErrorMessage("등록된 소셜 로그인 제공자가 없습니다.");
      console.error("Error fetching provider: ", error);
    }
  };

  // 회원가입 페이지로 이동하는 함수
  const goToSignup = () => {
    navigate("/signup");
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
        padding: "20px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        로그인
      </Typography>

      <Box
        component="form"
        onSubmit={handleEmailSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TextField
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={{ width: "300px" }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "300px" }}
        >
          로그인
        </Button>

        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}

        {/* 회원가입 바로가기 */}
        <Typography variant="body2" sx={{ marginTop: "16px" }}>
          회원이 아니신가요?{" "}
          <Link href="#" onClick={goToSignup} underline="hover">
            회원가입 바로가기
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
