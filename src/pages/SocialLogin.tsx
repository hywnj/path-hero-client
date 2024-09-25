import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
// import KakaoIcon from '@mui/icons-material/Chat';
import NaverIcon from "@mui/icons-material/TravelExplore";
import { useNavigate } from "react-router-dom";

const SocialLogin: React.FC = () => {
  const navigate = useNavigate(); // 리다이렉트를 위한 useNavigate 훅

  const handleNaverLogin = async () => {
    try {
      window.location.href = `${
        import.meta.env.VITE_SERVER_URL
      }/oauth2/authorization/naver`;
      navigate("/main");
    } catch (error) {
      console.error("Naver Login Error:", error);
    }
  };

  // const handleKakaoLogin = async () => {
  //   try {
  // window.location.href = `${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/kakao`;
  //     navigate('/main');
  //   } catch (error) {
  //     console.error('Kakao Login Error:', error);
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      // 백엔드의 Google 로그인 엔드포인트로 요청
      window.location.href = `${
        import.meta.env.VITE_SERVER_URL
      }/oauth2/authorization/google`;
      // 로그인 성공 시 아래 코드를 실행하여 리다이렉트 (필요에 따라 조건 추가 가능)
      navigate("/main");
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box textAlign="center">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
            maxWidth: 400,
            minWidth: 400,
            padding: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            인증
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<NaverIcon />}
                onClick={handleNaverLogin}
                sx={{
                  backgroundColor: "#03C75A",
                  "&:hover": { backgroundColor: "#02984A" },
                  color: "#fff",
                }}
              >
                Naver Login
              </Button>
            </Grid>

            {/* <Grid item xs={12} sm={8}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<KakaoIcon />}
                onClick={handleKakaoLogin}
                sx={{
                  backgroundColor: '#FEE500',
                  '&:hover': { backgroundColor: '#E4C800' },
                  color: '#000',
                  mb: 2,
                }}
              >
                Kakao Login
              </Button>
            </Grid> */}

            <Grid item xs={12} sm={8}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  backgroundColor: "#DB4437",
                  "&:hover": { backgroundColor: "#C33D29" },
                  color: "#fff",
                  mb: 2,
                }}
              >
                Google Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SocialLogin;
