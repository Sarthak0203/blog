import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from '../Components/logo.png'

export const Header = () => {
  const {setUserInfo,userInfo} = useContext(UserContext);


  useEffect(() => {
    fetch("http://localhost:9000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        const username = userInfo?.username;
      });
    });
  }, []);
  

  function logout() {
    fetch("http://localhost:9000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }
  const username = userInfo?.username;

  return (
    <div className="head">
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
        <Link className="title" to="/">
        InkQuill
        </Link>
      </div>
      <nav className="navigation">
        <ul className="nav-links">
          {username && (
            <>
              <li>
                <Link to="/create">Create Post</Link>
              </li>
              <li>
                <Link to="/" onClick={logout}>
                  Logout
                </Link>
              </li>
            </>
          )}
          {!username && (
            <>
              <li>
                <Link to="/loginsignup">Login</Link>
              </li>
              <li>
                <Link to="/loginsignup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
    </div>
  );
};
