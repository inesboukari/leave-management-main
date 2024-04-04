import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMainContext } from '../hooks/useMainContext';

{/*page de connexion*/}
{/* useState pour stocker les valeurs de userEmail, userPassword et loginBtnLoading. */}
{/* validateFormAndSignIn déclanché lorsque user soumet le formulaire de connexion*/}
function LoginPage() {    
        const {fetchUserList, setCurrentUser, setSessionToken, validateEmail} = useMainContext()
        const navigate = useNavigate()
        const [userEmail, setUserEmail] = useState("")
        
        const [userPassword, setUserPassword] = useState("")
        const [loginBtnLoading, setLoginBtnLoading] = useState("")

        const url = `localhost:3001/login`
        
        const validateFormAndSignIn = (e) => {
            setLoginBtnLoading("loading")
            e.preventDefault()
            if(
                userEmail === undefined || userEmail.length === 0 ||
                userPassword === undefined || userPassword.length === 0
            )
            {
                setLoginBtnLoading("")
                return toast.error("Fill in all blanks!")
            }

            if(!validateEmail(userEmail)){
                setLoginBtnLoading("")
                return toast.error("Invalid email!")
            }
            const signInData = 
            {
                email: userEmail,
                password: userPassword
            }
            axios
                .post(url, signInData)
                .then(resp => {
                    if(resp.status === 200) toast.success("Login Successful!")
                    console.log(resp.data)
                    setCurrentUser(resp.data)
                    sessionStorage.setItem('leaveMgtToken',JSON.stringify(resp.data.sessionToken).replace(/"/g,""))
                    setSessionToken(resp.data.sessionToken)
                    fetchUserList()
                    navigate('/')
                    console.log(resp)
                })
                .catch(err => {
                    console.log(err)
                    setLoginBtnLoading("")
                    if(err.response.status === 400) toast.error("email is not registered!")
                    if(err.response.status === 401) toast.error("Incorrect email or password")
                })
        }
        

        return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-20 mb-12'>
                    <p className='text-slate-600 text-5xl'>LEAVE <span className="text-sky-500">PLANS</span> </p>
                    <p className='text-slate-600 text-4xl'>休 <span className="text-sky-500">划</span> </p>
                </div>
                <form className="grid h-58 card rounded-box place-items-center my-1" onSubmit="validateFormAndSignIn(e)">
                    <div className="form-control w-full max-w-xs">
                        <input type="text" placeholder="Email 邮箱" className="input input-bordered w-full max-w-xs" onChange={(event) => setUserEmail(event.target.value)}/>
                        <input type="password" placeholder="Password 密码" className="input input-bordered w-full max-w-xs my-4" onChange={(event) => setUserPassword(event.target.value)}/>
                    </div>
                    <button type='submit' className={`btn btn-wide bg-black my-8 ${loginBtnLoading}`}>LOGIN 登陆</button>
                    <Link to="/change-password">
                        <span className='underline text-slate-400'>Forgot password / 忘了密码</span>
                    </Link>
                </form>
            </div>
        </div>
        )
}

{/*formulaire de connexion avec des champs pour l'e-mail et le mot de passe, ainsi qu'un bouton de connexion. 
Il y a aussi un lien "Forgot password"
 pour rediriger l'utilisateur vers la page de réinitialisation du mot de passe en cas d'oubli. */}

export default LoginPage