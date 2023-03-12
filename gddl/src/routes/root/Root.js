import React from 'react';
import Header from '../../Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function Root() {
  return (
    <>
      <Helmet>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GDDLadder" />
        <meta property="og:url" content="https://gdladder.com" />
        <meta property="og:description" content="The project to improve demon difficulties" />
      </Helmet>
      <Header />
      <Outlet />
    </>
  );
}

export default Root;
