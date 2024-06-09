// src/pages/login.js
/*
import Login from '../components/Login';

export default function LoginPage() {
  return <Login />;
}
*/
// src/pages/login.js
import Login from '../components/Login';

export default function LoginPage() {
  return <Login />;
}

export async function getServerSideProps(context) {
    return { props: {} };
}
