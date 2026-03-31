import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startLogout } from "../slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  return (
    <header className="header">
      <div className="content-container">
        <div className="header__content">
          <Link className="header__title" to="/dashboard">
            <h1>Expensify</h1>
          </Link>
          <button
            className="button button--link"
            onClick={() => dispatch(startLogout())}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
