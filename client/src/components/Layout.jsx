import React from 'react';

import Head from 'next/head';
import Navbar from './Navbar';

const Layout = (props) => (
  <div>
    <Navbar/>
    <div className="container">
      {props.children}
    </div>
  </div>
);

export default Layout;