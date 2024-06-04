// src/components/Login.js
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Input from './form/Input';
import { MyAppContext } from '../pages/_app';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setJwtToken, setAlertClassName, setAlertMessage, toggleRefresh } = useContext(MyAppContext);

    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // build the request payload
        let payload = {
            email: email,
            password: password,
        }

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/authenticate`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error("Too many login attempts. Please try again later.");
                    } else {
                        return response.json().then((data) => {
                            throw new Error(data.message || "An error occurred. Please try again.");
                        });
                    }
                }
                return response.json();
            })
            .then((data) => {
                if (data.error) {
                    setAlertClassName("alert-danger");
                    setAlertMessage(data.message);
                } else {
                    setJwtToken(data.access_token);
                    setAlertClassName("d-none");
                    setAlertMessage("");
                    toggleRefresh(true);
                    router.push("/");
                }
            })
            .catch(error => {
                setAlertClassName("alert-danger");
                setAlertMessage(error);
            })
    }

    return(
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />

            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(event) => setEmail(event.target.value)}
                />

                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password-new"
                    onChange={(event) => setPassword(event.target.value)}
                />

                <hr />

                <input 
                    type="submit"
                    className="btn btn-primary"
                    value="Login"
                />


            </form>
        </div>
    )
}

export default Login;