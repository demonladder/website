import React, { useState } from 'react';
import './Root.css';
import Header from '../../Header';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

function Root() {
  const [userID] = useState(Cookies.get('userID') || null);

  return (
    <>
      <Header userID={userID} />
      <Outlet context={[userID]} sessionID={userID} />
    </>
  );
}

export default Root;
