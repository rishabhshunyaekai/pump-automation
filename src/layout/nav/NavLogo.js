import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PATHS } from 'config.js';

const NavLogo = () => {
  return (
    <div className="logo position-relative">
      <Link to={DEFAULT_PATHS.APP} >
        {/* <img src="img/logo.png" alt="logo" style={{width:"33px"}} /> */}
        {/* <img src="img/env.svg" alt="logo" /> */}
        {/* <img src="img/logo4.svg" alt="logo" style={{width:'55px', position:'relative', left:"-11px"}} /> */}
        {/* <img src="img/Logo.png" alt="logo" /> */}
        {/* <div className="img" /> */}
      </Link>
    </div>
  );
};
export default React.memo(NavLogo);
