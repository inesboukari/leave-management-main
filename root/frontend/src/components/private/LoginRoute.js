import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'

function LoginRoute() {/*définit une route spécifique pour la page de connexion*/
    const {currentUser} = useMainContext()

    return (
    <div>
        {/* if user is logged in, direct them to homepage */}
        {(currentUser) ? <Navigate to='/'/> : <Outlet/>}
    </div>
    )
}

export default LoginRoute