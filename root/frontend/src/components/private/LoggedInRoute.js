import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'

function LoggedInRoute() {/*ce composant assure que seuls les utilisateurs connectés peuvent accéder aux routes protégées, 
et redirige automatiquement vers la page de connexion dans le cas contraire.*/

    const {currentUser} = useMainContext()

    return (
    <div>
        {/* if user is not logged in, direct them to sign in page */}
        {(currentUser) ? <Outlet/> : <Navigate to = "/login"/>} 
    </div>
    )
}

export default LoggedInRoute