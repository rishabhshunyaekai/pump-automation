import React, { useEffect } from 'react'

const LogOut = () => {
  useEffect(() => {
    sessionStorage.removeItem('isLogin');
    window.location.reload("/login")
    sessionStorage.removeItem("user_id");
    sessionStorage.clear();
  })
  return (
    <>

    </>

  )
}

export default LogOut