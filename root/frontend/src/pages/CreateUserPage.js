import React, { useState } from 'react'
import RadioSelection from '../components/layout/RadioSelection'
import { useMainContext } from '../hooks/useMainContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

function CreateUserPage() {
    const {fetchUserList, isAdmin, validateEmail} = useMainContext()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [reportingEmail, setReportingEmail] = useState()
    const [coveringEmail, setCoveringEmail] = useState()
    const [createUserBtnLoading, setCreateUserBtnLoading] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const validateAndSubmitData = async (url, formData) => {

        setCreateUserBtnLoading("loading")
        if(!validateEmail(email)){
            setCreateUserBtnLoading("")
            return toast.error("Invalid email!")
        }
        
        if(password !== confirmPassword){
            setCreateUserBtnLoading("")
            return toast.error("Passwords don't match!")
        }
        
        if(isAdmin === "admin"){
            // admin acc creation check
            if(
                name === undefined || name.length === 0 ||
                email === undefined || email.length === 0 ||
                password === undefined || password.length === 0 ||
                confirmPassword === undefined || confirmPassword.length === 0 ||
                isAdmin === undefined
            ){
                setCreateUserBtnLoading("")
                return toast.error("Fill in all blanks!")
            }
        }
        else{
            // user acc creation check
            if(
                name === undefined || name.length === 0 ||
                email === undefined || email.length === 0 ||
                password === undefined || password.length === 0 ||
                confirmPassword === undefined || confirmPassword.length === 0 ||
                reportingEmail === undefined || reportingEmail.length === 0 ||
                coveringEmail === undefined || coveringEmail.length === 0 ||
                isAdmin === undefined
            ){
                setCreateUserBtnLoading("")
                return toast.error("Fill in all blanks!")
            }
        }

        if(coveringEmail === reportingEmail && isAdmin !== "admin"){
            // for user account creation, its not allowed to have the same CO and RO
            setCreateUserBtnLoading("")
            return toast.error("covering and reporting officer cannot be the same person!")
        }

        // starts loading screen
        setIsLoading(true)

        axios
            .post(url, formData)
            .then(result => {
                setIsLoading(false)
                if(result.status === 200) {
                    fetchUserList()
                    toast.success("User Created!")
                    navigate('/user-management')
                }
            })
            .catch(err => {
                console.log(err)
                setIsLoading(false)
                if (err.response.status === 488){
                    setCreateUserBtnLoading("")
                    toast.error("sendgrid email limit exceeded!")
                }
                else if (err.response.status === 499){
                    setCreateUserBtnLoading("")
                    toast.error("Email already exists on system!")
                }
                else{
                    setCreateUserBtnLoading("")
                    toast.error("Failed to create user")
                }
            })

    }
/*sera déclenchée lorsque le formulaire est soumis */

    const sendFormData = (e) => {
        e.preventDefault()
        console.log("form data sending in progress")
        const url = `${process.env.REACT_APP_BACKENDURL}/admin/create-user`

        
        const formData = 
        {
            name: name,
            isAdmin: isAdmin,
            email: email,
            password: password,
            createdOn: new Date(),
            lastUpdatedOn: new Date(),
            reportingEmail: (isAdmin === "admin") ? "-" : reportingEmail,
            coveringEmail: (isAdmin === "admin") ? "-" : coveringEmail
        }
        console.log(formData)
        validateAndSubmitData(url, formData)
    }
    return (
        <div>
            <div className='grid place-items-center mt-8 text-slate-600 text-3xl'>Create User</div>

            <div className="grid place-items-center">
                <form className="form-control w-full max-w-xs" onSubmit={sendFormData}>
                    <label className="label text-sm">Account Type</label>
                    <RadioSelection radioType="accountTypeRadio" id="accountType"/>
                    <label className="label text-sm">Name</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="name" onChange={(e) => setName(e.target.value)} value={name}/>
                    <label className="label text-sm">Email 邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="password" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <label className="label text-sm">Password 密码</label>
                    <input type="password" className="input input-bordered w-full max-w-xs" name="confirmPassword" onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <label className="label text-sm">Confirm Password 二次确认密码</label>
                    <input type="password" className="input input-bordered w-full max-w-xs" name="email" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>

                    {isAdmin === "admin" ?
                        <>
                        </> 
                        :
                        <>
                            <label className="label text-sm">Reporting Officer Email 主管邮箱</label>{/*Adresse e-mail du responsable de rapport" */}
                            <input type="text" className="input input-bordered w-full max-w-xs" onChange={(e) => setReportingEmail(e.target.value)} value={reportingEmail}/>
                            <label className="label text-sm">Covering Officer Email 代办邮箱</label>{/*t à l'adresse e-mail d'un officier désigné pour couvrir ou remplacer temporairement un autre officier.*/}
                            <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setCoveringEmail(e.target.value)} value={coveringEmail}/>
                        </>
                    }
                    
                    <button type="submit" className={`btn mt-8 rounded-sm ${createUserBtnLoading}`}>Create User</button>
                </form>
                {isLoading && <Loading/>}
            </div>
        </div>
        )
}
{/*cette partie du code fournit une interface pour créer un nouvel utilisateur dans l'application.
 Elle permet de saisir les informations nécessaires et de les envoyer au serveur pour traitement. */}

export default CreateUserPage