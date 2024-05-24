import axios from 'axios'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMainContext } from '../hooks/useMainContext'

function ChangePasswordPage() {
    const {validateEmail} = useMainContext()
    const [userEmail, setUserEmail] = useState("")
    
    const navigate = useNavigate('/')
    const validateAndSubmitData = async (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_BACKENDURL}/change-password`

        if(!validateEmail(userEmail))
            return toast.error("Invalid email!")
        
        if(userEmail === undefined || userEmail.length === 0)
            return toast.error("Fill in all blanks!")

        
        const formData = {
            email: userEmail
        }
        axios
            .post(url, formData)
            .then(resp => {
                console.log(resp.message)
                if(resp.status === 200) {
                    navigate('/login')
                    return toast.success("Check your email for next steps! /")
                }
            })
            .catch((err) => {
                if (err.response.status === 488){
                    return toast.error("sendgrid email limit exceeded!")
                }
                else{
                    return toast.error(err.response.data)
                }
            })
    }
    
    return (
    <div>
        <div className="flex flex-col w-full border-opacity-50">
        <div className="bg-coral-100 h-screen">

            <div className='grid place-items-center mt-20 mb-8'>
                <p className=' text-sky-800 p'>RESET <span className="text-sky-800 p">PASSWORD</span> </p>
            </div>
            <form className="grid h-58 card rounded-box place-items-center my-1" onSubmit={validateAndSubmitData}>
                <div className="form-control w-full max-w-xs">
                    <input type="text" placeholder="Email " className="input input-bordered w-full max-w-xs" onChange={(event) => setUserEmail(event.target.value)}/>
                </div>
                <button type='submit' className={`btn bg-rose-200 text-white text-center text-base font-semibold shadow-md rounded-lg mt-4`}>Reset Password </button>
                <Link to="/login">
                    <span className='underline text-slate-600'> Login / </span>
                </Link>
            </form>
        </div>
        </div>
    </div>
    )
}

export default ChangePasswordPage