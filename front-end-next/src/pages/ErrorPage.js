// src/pages/_error.js
import React from 'react';

const ErrorPage = ({ statusCode, message }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="mt-3">Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <em>{message || 'An unexpected error occurred.'}</em>
          </p>
        </div>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : 'Page not found';
  return { statusCode, message };
};

export default ErrorPage;
