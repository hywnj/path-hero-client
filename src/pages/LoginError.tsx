import { useLocation } from 'react-router-dom';

function LoginError() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const error = params.get('error');

  return (
    <div>
      <h1>로그인 에러 발생</h1>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
export default LoginError