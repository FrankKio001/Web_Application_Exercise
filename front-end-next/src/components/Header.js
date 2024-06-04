// components/Header.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/logo.png';
import github from '../../public/github.png';
import login from '../../public/login.png';

const Header = ({ jwtToken, setJwtToken, onLogout }) => {
    return (
        <header className="App-header">
            <div className="header-container">
                <div className="header-left">
                    {jwtToken === "" ? (
                        <Link href="/login">
                            <a><Image src={login} alt="Login" height="50px" width="50px" /></a>
                        </Link>
                    ) : (
                        <a onClick={onLogout}>
                            <Image src={login} alt="Logout" height="50px" width="50px" />
                        </a>
                    )}
                </div>
                <div className="header-center">
                    <Link href="/">
                        <a><Image src={logo} alt="Logo" height="50px" width="50px" /></a>
                    </Link>
                </div>
                <div className="header-right">
                    <a href="https://github.com/FrankKio001" target="_blank" rel="noopener noreferrer">
                        <Image src={github} alt="GitHub" height="50px" width="50px" />
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
