import React from 'react';
import Header from '../../Header';
import { Outlet, useLoaderData } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUser } from './profile/Profile';

export async function rootLoader() {
  let userID = Cookies.get('userID') || null;
  return await getUser(userID);
}

function Root() {
  const user = useLoaderData();
  let sessionID = Cookies.get('sessionToken');


  return (
    <>
      <Header user={user} />
      <Outlet context={[sessionID]}/>
    </>
  );
}

export default Root;
