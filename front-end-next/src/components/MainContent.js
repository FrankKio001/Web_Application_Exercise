import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Alert from './Alert';
import { MyAppContext } from '../pages/_app';

const MainContent = ({ Component, pageProps }) => {
  const { jwtToken, alertMessage, alertClassName } = useContext(MyAppContext);
  
  // Example to fetch data based on jwtToken
  const [data, setData] = useState(null);

  useEffect(() => {
    if (jwtToken) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          });
          const result = await response.json();
          console.log("API Response:", result); // Log the complete API response
          setData(result);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          setData(null);
        }
      };
  
      fetchData();
    }
  }, [jwtToken]);
  
  

  return (
    <div className="row">
      {jwtToken !== "" && (
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link href="/" className="list-group-item list-group-item-action">Home</Link>
              <Link href="/projects" className="list-group-item list-group-item-action">Projects</Link>
              <Link href="/skills" className="list-group-item list-group-item-action">Skills</Link>
              <Link href="/admin/project/0" className="list-group-item list-group-item-action">Add Project</Link>
              <Link href="/manage-catalogue" className="list-group-item list-group-item-action">Manage Catalogue</Link>
              <Link href="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
            </div>
          </nav>
        </div>
      )}
      <div className={jwtToken === "" ? "col-md-12" : "col-md-10"}>
        <Alert message={alertMessage} className={alertClassName} />
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default MainContent;
