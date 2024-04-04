import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMainContext } from '../hooks/useMainContext'


{/* useParams pour obtenir le paramètre token de l'URL, qui est utilisé pour valider la demande de réinitialisation de mot de passe. */}

function SetNewPasswordPage() {
    const {validateEmail} = useMainContext()
    const [userPassword, setUserPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const params = useParams()
    const userToken = params.token
    const navigate = useNavigate()
    
    const validateAndSubmitNewPassword = async (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_BACKENDURL}/set-new-password`
        
        if(!userToken) return toast.error("Missing token!")

        if(userPassword === undefined || userPassword.length === 0)
            return toast.error("Fill in all blanks!")

        if (userPassword !== confirmPassword) {
            return toast.error("Passwords don't match! / 密码不匹配！")
        }

        if (userPassword.length < 6) {
            return toast.error("Password must be at least 6 characters / 密码必须至少6个字符")
        }
        const formData = {
            // email: ,
            password: userPassword,
            userToken: userToken
        }
        axios
            .post(url, formData)
            .then(resp => {
                console.log(resp)
                if(resp.status === 200) {
                    toast.success("Password reset successful")
                    navigate('/login')
                }
            })
            .catch((err) => {
                toast.error(err.response.data)
            })
    }
    
    return (
    <div>
        <div className="flex flex-col w-full border-opacity-50">
            <div className='grid place-items-center mt-20 mb-8'>
                <p className='text-slate-600 text-3xl'>SET NEW <span className="text-sky-500">PASSWORD</span> </p>
            </div>
            <form className="grid h-58 card rounded-box place-items-center my-1" onSubmit={validateAndSubmitNewPassword}>
                <div className="form-control w-full max-w-xs">
                    <input type="password" placeholder="New Password 新密码" className="input input-bordered w-full max-w-xs" onChange={(event) => setUserPassword(event.target.value)}/>
                    <input type="password" placeholder="Confirm New Password 二次确认新密码" className="input input-bordered w-full max-w-xs mt-4" onChange={(event) => setConfirmPassword(event.target.value)}/>
                </div>
                <button type='submit' className={`btn btn-wide bg-black my-12`}>Update Password 更新密码</button>
            </form>
        </div>
    </div>
    )
}
{/*n formulaire où les utilisateurs peuvent saisir leur nouveau mot de passe et le confirmer.
 Le bouton "Update Password" est utilisé pour soumettre le formulaire. */}

export default SetNewPasswordPage