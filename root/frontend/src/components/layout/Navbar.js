import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useMainContext } from '../../hooks/useMainContext'
import Loading from '../Loading'

function Navbar() {/* est une barre de navigation qui fournit différentes fonctionnalités en fonction de l'état de l'utilisateur connecté*/
    const {currentUser, setActiveTab, setCurrentUser, setCurrentLeaveSelection} = useMainContext()
    const url = `${process.env.REACT_APP_BACKENDURL}/logout`
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const signOutCurrentUser = () => {
        axios
            .post(url)
            .then((resp)=>{
                setIsLoading(true)
                if(resp.status === 200) {
                    toast.success("Log out successful ")
                    setIsLoading(false)
                    sessionStorage.removeItem('leaveMgtToken')
                    setCurrentUser(null)
                    navigate('/login')
                }
                else {
                    setIsLoading(false)
                    toast.error("failed to log out ")
                }
            })
            .catch(err => {
                toast.warning("failed to log out")
                console.log("err: ", err)
            })
    }

    const clearState = () => {
        setCurrentLeaveSelection("Annual Leave ")
    }
    return (
        <div className='flex justify-between navbar bg-slate-800'>
                <div className="navbar-start">
                    {
                        <button className="btn btn-ghost normal-case text-xl " onClick={() => setActiveTab("Home ")}>
                            {/* icon only links to homepage if user is logged in */}
                            {!currentUser && <div className='text-slate-50 p'>LEAVE <span className="text-sky-400">PLANS</span> </div>}
                            {currentUser && <Link onClick={clearState} to="" className='text-slate-50 p' >LEAVE <span className="text-sky-400">PLANS</span> </Link>}
                        </button>
                    }

                </div>
                <div className="navbar-end hidden lg:flex mr-3">
                    {/* if user is signed in, sign up and sign in page will be hidden */}
                    {/*Lorsqu'un utilisateur est connecté, les liens "Profile" est affichés à la place de "Login".*/}
                    {!currentUser && <Link to="/login" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Login</Link>}
                    {currentUser && <Link to="/profile" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Profile</Link>}
                
                    
                    {/* manage user is only visible by admin user */}
                    {/*: Si l'utilisateur connecté est un administrateur, un menu déroulant "Admin" est affiché avec plusieurs options */}

                    {currentUser && (currentUser.isAdmin === "admin") && (<div className="dropdown dropdown-end dropdown-hover text-lg text-white cursor-pointer mx-2 py-4">
                        <label tabIndex={0}>Admin</label>
                        <ul tabIndex={0} className="absolute z-1 menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            <li className='text-slate-800'>
                                <Link 
                                    to="/approve-leave" 
                                    className="text-sm mx-2 cursor-pointer hover:text-gray-500"
                                    onClick={() => setActiveTab("Pending")}
                                    >Approve Leave</Link>
                            </li>
    
                            <li className='text-slate-800'>
                                <Link 
                                    to="/approve-leave" 
                                    className="text-sm mx-2 cursor-pointer hover:text-gray-500"
                                    onClick={() => setActiveTab("Pending")}
                                    >Approve Attestation</Link>
                                    </li>
                            <li className='text-slate-800'>
                                <Link to="/user-management" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Manage User</Link>
                            </li> 
                            <li className='text-slate-800'>
                                <Link to="/set-leave-entitlement" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Set Entitlement</Link>
                            </li>
                            <li className='text-slate-800'>
                                <Link to="/create-new-leave" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Create New Leave</Link>
                            </li>
                            <li className='text-slate-800'>
                                <Link to="/delete-leave-type" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Delete Leave Type</Link>
                            </li>
                            <li className='text-slate-800'>
                                <Link to="/Attestation-form" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Attestation form</Link>
                            </li>
                    
                        </ul>
                    </div>)
                    }
                    {/* if user is not signed in, log out will be hidden */}
                    {currentUser && <Link to="/login" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400" onClick={signOutCurrentUser}>Log Out</Link>}
                </div>
                {isLoading && <Loading/>}{/*Un indicateur de chargement est affiché pendant que les opérations sont en cours */}
        </div>
        )
}

export default Navbar