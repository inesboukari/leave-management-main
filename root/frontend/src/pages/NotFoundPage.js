import React from 'react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div class="h-screen w-full flex flex-col justify-start items-center bg-[#191918]">
      <h1 class="text-[200px] font-extrabold text-white tracking-widest mt-36">404</h1>
      <div class="bg-[#FF6A3D] px-8 text-sm rounded rotate-12 absolute mt-80 text-2xl">
        Page Not Found
      </div>
      <Link to="/">
        <button class="btn btn-primary mt-5 px-20">
            Go Home
          </button>
      </Link>
    </div>
  )
}

export default NotFoundPage