import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SocialLogin from "./pages/SocialLogin";
import Login from "./pages/Login";
import LoginError from "./pages/LoginError";
import NaverMapSearch from "./components/MapSearch";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SocialLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<NaverMapSearch />} />
        <Route path="/error" element={<LoginError />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
