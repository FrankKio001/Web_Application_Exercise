import { useCallback, useEffect, useState, createContext } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../app/globals.css';
import '../app/header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import MainContent from '../components/MainContent'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { Hydrate, DehydratedState } from '@tanstack/react-query';

// 全局 Context
export const MyAppContext = createContext();

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [tickInterval, setTickInterval] = useState(null);
  const router = useRouter();

  // Log out function
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

  // Toggle refresh
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
            setJwtToken(data.access_token);// 設定新的 JWT Token
          }
        })
        .catch(error => {
          console.log("user is not logged in");
        })
      }, 600000);// 10 分鐘
      setTickInterval(i);
      console.log("setting tick interval to", i);
    } else {
      console.log("turning off ticking");
      console.log("turning off tickInterval", tickInterval);
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval])


  // 頁面加載
  useEffect(() => {
    if (typeof window !== 'undefined' && jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      }

      fetch(`${process.env.NEXT_PUBLIC_BACKEND}/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);// 設定新的 JWT Token
            toggleRefresh(true);// Toggle refresh
          }
        })
        .catch(error => {
          console.log("user is not logged in", error);
        })
    }
  }, [jwtToken, toggleRefresh])

  return (
    <QueryClientProvider client={queryClient}>
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
            {/* <Hydrate state={pageProps.dehydratedState}> */}
              <MainContent Component={Component} pageProps={pageProps} />
            {/* </Hydrate> */}
          </div>
        </>
      </MyAppContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
