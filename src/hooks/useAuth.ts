import { Cookies } from "react-cookie";

const useAuth = () => {
  const cookies = new Cookies();

  // 로그인 여부 확인 (쿠키를 읽어서 Authorization이 있는지 확인)
  const isAuthenticated = () => cookies.get("Authorization") !== undefined;

  return { isAuthenticated };
};

export default useAuth;
