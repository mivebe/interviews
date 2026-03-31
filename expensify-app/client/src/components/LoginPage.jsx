import { useDispatch } from "react-redux";
import { startLogin } from "../slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  return (
    <div className="box-layout">
      <div className="box-layout__box">
        <h1 className="box-layout__title">Expensify</h1>
        <p>It's time to get your expenses under control.</p>
        <button className="button" onClick={() => dispatch(startLogin())}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
