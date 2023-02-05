import React from 'react';
import './Root.css';
import Header from '../../Header';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <>
      <Header />
      <div className='container'>
        <Outlet />
      </div>
    </>
  );
}

export default Root;
