import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import './App.css';
import Alert from "./components/Alert";
import logo from "./images/logo.png";
import github from "./images/github.png";
import login from "./images/login.png";

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  const [tickInterval, setTickInterval] = useState();
  const navigate = useNavigate();

  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
    .catch(error => {
      console.log("error logging out", error);
    })
    .finally(() => {
      setJwtToken("");
      toggleRefresh(false);
    })

    navigate("/login");
  }

  const toggleRefresh = useCallback((status) => {
    console.log("clicked");

    if (status) {
      console.log("turning on ticking");
      let i  = setInterval(() => {

        const requestOptions = {
          method: "GET",
          credentials: "include",
        }

        fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
          }
        })
        .catch(error => {
          console.log("user is not logged in");
        })
      }, 600000);
      setTickInterval(i);
      console.log("setting tick interval to", i);
    } else {
      console.log("turning off ticking");
      console.log("turning off tickInterval", tickInterval);
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval])

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      }

      fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(error => {
          console.log("user is not logged in", error);
        })
    }
  }, [jwtToken, toggleRefresh])

  return (
    <div className="container-fluid" >
      <header className="App-header">
        <div className="header-left">
          {jwtToken === "" ? (
            <Link to="/login" >
              <img src={login} alt="Login" style={{ height: "50px" }} />
            </Link>
          ) : (
            <a href="#!" onClick={logOut} className="header-left">
              <img src={login} alt="Logout" style={{ height: "60px" }} />
            </a>
          )}
        </div>
        <div className="header-center">
          <Link to="/" className="header-center">
            <img src={logo} alt="Logo" style={{ height: "100px" }} />
          </Link>
        </div>
        <div className="header-right">
          <a href="https://github.com/FrankKio001">
            <img src={github} alt="GitHub" style={{ height: "60px" }} />
          </a>
        </div>
      </header>

      <div className="row">
        {jwtToken !== "" && (
          <div className="col-md-2">
            <nav>
              <div className="list-group">
                <Link to="/" className="list-group-item list-group-item-action">
                  Home
                </Link>
                {jwtToken !== "" && (
                  <>
                    <Link
                      to="/projects"
                      className="list-group-item list-group-item-action"
                    >
                      Project
                    </Link>
                    <Link
                      to="/skills"
                      className="list-group-item list-group-item-action"
                    >
                      Skills
                    </Link>

                    <Link
                      to="/admin/project/0"
                      className="list-group-item list-group-item-action"
                    >
                      Add Project
                    </Link>
                    <Link
                      to="/manage-catalogue"
                      className="list-group-item list-group-item-action"
                    >
                      Manage Catalogue
                    </Link>
                    <Link
                      to="/graphql"
                      className="list-group-item list-group-item-action"
                    >
                      GraphQL
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}

        <div className={jwtToken === "" ? "col-md-12" : "col-md-10"}>
          <Alert message={alertMessage} className={alertClassName} />
          <Outlet
            context={{
              jwtToken,
              setJwtToken,
              setAlertClassName,
              setAlertMessage,
              toggleRefresh,
            }}
          />
        </div>

      </div>
    </div>
  );
}

export default App;