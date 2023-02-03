import React from 'react';
import './Root.css';
import Header from '../../Header';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <div>
      <Header />
      <div className='container'>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
