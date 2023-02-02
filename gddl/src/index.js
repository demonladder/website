import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import './index.css';
import Root from './routes/Root';
import Index from './routes/Index';
import Ladder, { ladderLoader } from './Ladder';
import References from './References';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'list',
        element: <Ladder />,
        loader: ladderLoader
      },
      {
        path: 'references',
        element: <References />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);