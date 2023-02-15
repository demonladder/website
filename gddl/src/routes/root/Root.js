import React from 'react';
import Header from '../../Header';
import { Outlet, useLoaderData } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUser } from './profile/Profile';

export async function rootLoader() {
  let userID = Cookies.get('userID') || null;
  if (!userID) return null;
  return await getUser(userID);
}

function Root() {
  const user = useLoaderData();

  return (
    <>
      <Header user={user} />
      <Outlet context={[user]}/>
    </>
  );
}

export default Root;
