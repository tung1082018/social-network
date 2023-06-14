import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
  const [current, setCurrent] = useState("");
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    // we're on the client (not server side)
    typeof window !== "undefined" && setCurrent(window.location.pathname);
  }, [typeof window !== "undefined" && window.location.pathname]);

  const router = useRouter();

  const logout = async () => {
    window.localStorage.removeItem("auth");
    setState(null);
    await router.push("/login");
  };

  return (
    <nav
      className="nav d-flex justify-content-between"
      style={{ backgroundColor: "blue" }}
    >
      <Link
        href="/"
        className={`nav-link text-light logo ${current === "/" && "active"}`}
      >
        <Avatar src="/images/logo.png" /> SOCIAL NETWORK
      </Link>

      {state !== null ? (
        <div className="dropdown">
          <button
            className="btn dropdown-toggle text-light"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {state && state.user && state.user.name}
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link
                href="/user/dashboard"
                className={`dropdown-item nav-link ${
                  current === "/user/dashboard" && "active"
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/user/profile/update"
                className={`dropdown-item nav-link ${
                  current === "/user/profile/update" && "active"
                }`}
              >
                Profile
              </Link>
            </li>

            {state.user.role === "Admin" && (
              <li>
                <Link
                  href="/admin"
                  className={`dropdown-item nav-link ${
                    current === "/admin" && "active"
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}

            <li>
              <a onClick={logout} className="dropdown-item nav-link">
                Logout
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <>
          <Link
            href="/login"
            className={`nav-link text-light ${
              current === "/login" && "active"
            }`}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={`nav-link text-light ${
              current === "/register" && "active"
            }`}
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
