import React from 'react';
import Header from '../../Header';
import { Outlet, useLoaderData } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUser } from './profile/Profile';
import { Helmet } from 'react-helmet';

export async function rootLoader() {
  let userID = Cookies.get('userID') || null;
  if (!userID) return null;
  return await getUser(userID);
}

function Root() {
  const user = useLoaderData();

  return (
    <>
      <Helmet>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GDDLadder" />
        <meta property="og:url" content="https://gdladder.com" />
        <meta property="og:description" content="The project to improve demon difficulties" />
      </Helmet>
      <Header user={user} />
      <Outlet context={[user]}/>
    </>
  );
}

export default Root;
