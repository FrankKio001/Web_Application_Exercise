// components/MainContent.js
import React from 'react';
import Alert from './Alert';
import Link from 'next/link';

const MainContent = ({ jwtToken, alertMessage, alertClassName, children }) => {
    return (
        <div className="row">
            {jwtToken !== "" && (
                <div className="col-md-2">
                    <nav>
                        <div className="list-group">
                            <Link href="/"><a className="list-group-item list-group-item-action">Home</a></Link>
                            <Link href="/projects"><a className="list-group-item list-group-item-action">Projects</a></Link>
                            <Link href="/skills"><a className="list-group-item list-group-item-action">Skills</a></Link>
                            <Link href="/admin/project/0"><a className="list-group-item list-group-item-action">Add Project</a></Link>
                            <Link href="/manage-catalogue"><a className="list-group-item list-group-item-action">Manage Catalogue</a></Link>
                            <Link href="/graphql"><a className="list-group-item list-group-item-action">GraphQL</a></Link>
                        </div>
                    </nav>
                </div>
            )}
            <div className={jwtToken === "" ? "col-md-12" : "col-md-10"}>
                <Alert message={alertMessage} className={alertClassName} />
                {children}
            </div>
        </div>
    );
};

export default MainContent;
