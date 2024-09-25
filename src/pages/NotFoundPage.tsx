import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontFamily: "Pretendard", marginBottom: "2rem" }}
        >
          Wrong Access..!
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2D2D2D",
            color: "#00C4B4",
            "&:hover": {
              backgroundColor: "#00C4B4",
              color: "#FFFFFF",
            },
          }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}
