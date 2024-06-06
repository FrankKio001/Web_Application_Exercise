import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MyAppContext } from '../pages/_app';

const Header = () => {
    const { jwtToken, logOut } = useContext(MyAppContext);

    return (
        <header className="App-header">
            <div className="header-container">
                <div className="header-left">
                    {jwtToken === "" ? (
                        <Link href="/login"><a><Image src="/login.png" alt="Login" width={50} height={50} /></a></Link>
                    ) : (
                        <a onClick={logOut}><Image src="/login.png" alt="Logout" width={50} height={50} /></a>
                    )}
                </div>
                <div className="header-center">
                    <Link href="/"><a><Image src="/logo.png" alt="Logo" width={100} height={60} /></a></Link>
                </div>
                <div className="header-right">
                    <a href="https://github.com/FrankKio001" target="_blank" rel="noopener noreferrer">
                        <Image src="/github.png" alt="GitHub" width={50} height={50} />
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
