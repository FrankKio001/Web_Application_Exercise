import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Input from './form/Input';
import { MyAppContext } from '../pages/_app';
import { setCookie } from 'nookies'; 
import * as Yup from 'yup';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});// 顯示錯誤狀態
    const [loginAttempts, setLoginAttempts] = useState(0);

    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
    });

    const { setJwtToken, setAlertClassName, setAlertMessage, toggleRefresh } = useContext(MyAppContext);

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        let payload = {
            email: email,
            password: password,
        }

        try{
            await loginSchema.validate({ email, password }, { abortEarly: false });
            setFormErrors({});
        

            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LOGIN}/authenticate`, requestOptions);
            if (!response.ok) {
                setLoginAttempts(prev => prev + 1);
                if (response.status === 429) {
                    throw new Error("Too many login attempts. Please try again later.");
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || "An error occurred. Please try again.");
                    });
                }
            }

            const data = await response.json();
            if (data.error) {
                setAlertClassName("alert-danger");
                setAlertMessage(data.message);
            } else {
                setJwtToken(data.access_token);
                setCookie(null, 'jwt', data.access_token, {// 使用 nookies 設置 cookie
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                });
                setAlertClassName("d-none");
                setAlertMessage("");
                toggleRefresh(true);
                router.push("/");
            }

        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const errors = error.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setFormErrors(errors);
            } else {
                setAlertClassName("alert-danger");
                setAlertMessage(error.message);
            }
        }
    }

    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />

            {loginAttempts > 0 && <div className="alert alert-danger">Login failed {loginAttempts} times.</div>} 

            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    name="email"
                    autoComplete="email-new"
                    onChange={(event) => setEmail(event.target.value)}
                    errorDiv={formErrors.email ? "text-danger" : "d-none"}
                    errorMsg={formErrors.email}
                />

                <Input
                    title="Password"
                    type="password"
                    className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    name="password"
                    autoComplete="password-new"
                    onChange={(event) => setPassword(event.target.value)}
                    errorDiv={formErrors.password ? "text-danger" : "d-none"}
                    errorMsg={formErrors.password}
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