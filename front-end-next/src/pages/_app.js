import { useCallback, useEffect, useState, createContext } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../app/globals.css';
import Alert from '../components/Alert';
import logo from '../../public/logo.png';
import github from '../../public/github.png';
import login from '../../public/login.png';
import Link from 'next/link';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';


export const MyAppContext = createContext();

function App({ Component, pageProps }) {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [tickInterval, setTickInterval] = useState(null);
  const router = useRouter();

  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/logout`, requestOptions)
    .catch(error => {
      console.log("error logging out", error);
      setAlertMessage('Logout failed: ' + error.message);
      setAlertClassName('alert-danger'); // 假設您有一個對應的 CSS 類來顯示錯誤信息
    })
    .finally(() => {
      setJwtToken("");
      toggleRefresh(false);
    })

    router.push("/login");
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

        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/refresh`, requestOptions)
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

      fetch(`${process.env.NEXT_PUBLIC_BACKEND}/refresh`, requestOptions)
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
    <MyAppContext.Provider value={{ 
      jwtToken, setJwtToken, 
      alertMessage, setAlertMessage, 
      alertClassName, setAlertClassName, 
      toggleRefresh 
    }}>
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Mr.Kio</title>
      </Head>

      <div className="container-fluid">
        <header className="App-header">
          <div className="header-container">
            <div className="header-left">
              {jwtToken === "" ? (
                <Link href="/login">
                  <Image src={login} alt="Login" width={50} height={50}/>
                </Link>
              ) : (
                <a onClick={logOut}>
                  <Image src={login} alt="Logout"  width={50} height={50}/>
                </a>
              )}
            </div>
            <div className="header-center">
              <Link href="/">
                <Image src={logo} alt="Logo" width={100} height={60}/>
              </Link>
            </div>
            <div className="header-right">
              <a href="https://github.com/FrankKio001">
                <Image src={github} alt="GitHub" width={50} height={50}/>
              </a>
            </div>
          </div>
        </header>


        <div className="row">
          {jwtToken !== "" && (
            <div className="col-md-2">
              <nav>
                <div className="list-group">
                  <Link href="/" className="list-group-item list-group-item-action">
                    Home
                  </Link>
                  <Link href="/projects" className="list-group-item list-group-item-action">
                    Projects
                  </Link>
                  <Link href="/skills" className="list-group-item list-group-item-action">
                    Skills
                  </Link>
                  <Link href="/admin/project/0" className="list-group-item list-group-item-action">
                    Add Project
                  </Link>
                  <Link href="/manage-catalogue" className="list-group-item list-group-item-action">
                    Manage Catalogue
                  </Link>
                  <Link href="/graphql" className="list-group-item list-group-item-action">
                    GraphQL
                  </Link>
                </div>
              </nav>
            </div>
          )}

          <div className={jwtToken === "" ? "col-md-12" : "col-md-10"}>
            <Alert message={alertMessage} className={alertClassName} />
            <Component 
              {...pageProps} 
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
    </>
    </MyAppContext.Provider>
  );
}

export default App;