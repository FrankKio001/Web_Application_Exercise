// src/pages/login.js
import Login from '../components/Login';
import { parseCookies } from 'nookies';

export default function LoginPage() {
  return <Login />;
}

export async function getServerSideProps(context) {

    const cookies = parseCookies(context);
    const jwtToken = cookies.jwt;

    if (!jwtToken) {
        return {
            redirect: {
            destination: '/',
            permanent: false,
            },
        };
    }
    return { props: {} };
}

