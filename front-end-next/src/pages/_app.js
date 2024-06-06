import { useCallback, useEffect, useState, createContext } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../app/globals.css';
import '../app/header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import MainContent from '../components/MainContent'; 


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
      setAlertClassName('alert-danger');
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
      toggleRefresh, logOut 
    }}>
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Mr.Kio</title>
      </Head>

      <div className="container-fluid">
        <Header />
        <MainContent Component={Component} pageProps={pageProps} />
      </div>
    </>
    </MyAppContext.Provider>
  );
}

export default App;