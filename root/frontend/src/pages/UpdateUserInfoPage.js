import React, { useState } from 'react'
import axios from 'axios'
import { useMainContext } from '../hooks/useMainContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'



/* ette page permet aux administrateurs de mettre à jour les informations des utilisateurs
, telles que leurs adresses e-mail de responsable de rapport (RO) et de remplacement (CO) */

function UpdateUserInfoPage() {
    const {currentEditUser, fetchUserList, validateEmail} = useMainContext()

    const [newReportingEmail, setNewReportingEmail] = useState()
    const [newCoveringEmail, setNewCoveringEmail] = useState()
    const [activeUpdateButton, setActiveUpdateButton] = useState(true)
    const [updateBtnLoading, setUpdateBtnLoading] = useState()
    const [deleteBtnLoading, setDeleteBtnLoading] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleDeleteClick = () => {
        setDeleteBtnLoading("loading")
       if(window.confirm("Delete user?")){
           setIsLoading(true)
           const deleteUserData = {
               email: currentEditUser.email
           }

           axios
            .post(`${process.env.REACT_APP_BACKENDURL}/admin/delete-user`, deleteUserData)
            .then((resp) => {
                toast.success(`${currentEditUser.email}'s account deleted!`)
                setIsLoading(false)
                console.log(resp)
                fetchUserList()
                navigate('/user-management')
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
       }
    }

    const handleReportingEmailUpdate = (e) => {
        setNewReportingEmail(e.target.value)
        console.log(newReportingEmail)
        setActiveUpdateButton(false)
    }

    const handleCoveringEmailUpdate = (e) => {
        setNewCoveringEmail(e.target.value)
        setActiveUpdateButton(false)
    }


    const validateAndSubmitUpdateData = (e) => {
        e.preventDefault()
        setUpdateBtnLoading("loading")
        if(window.confirm(`Confirm changes?`
            )){
            const url = `${process.env.REACT_APP_BACKENDURL}/admin/update-user`
            if(newReportingEmail && !validateEmail(newReportingEmail)){
                setUpdateBtnLoading("")
                return toast.error("Invalid reporting email!")
            }
            if(newCoveringEmail && !validateEmail(newCoveringEmail)){
                setUpdateBtnLoading("")
                return toast.error("Invalid covering email!")
            }
            setIsLoading(true)
            const updateData = {
                userEmail: currentEditUser.email,
                newReportingEmail: newReportingEmail,
                newCoveringEmail: newCoveringEmail
            }
    
            axios
            .post(url, updateData)
            .then(resp => {
                setIsLoading(false)
                fetchUserList()
                console.log(resp)
                toast.success("Update successful")
                navigate('/user-management')
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
                toast.warning(`failed to update user info`)
            })

        }

    }
    return (
        <form className="w-full flex flex-col justify-start items-center" onSubmit={validateAndSubmitUpdateData}>
            <p className='text-slate-600 text-3xl my-8'>Update <span className="text-sky-500">User Info</span> </p>
            <div>
                <label htmlFor="name" className="text-sm font-weight-900 -ml-1 label">Name</label>
                <input 
                    id="name" 
                    type="text" 
                    disabled 
                    className="input input-bordered input-primary"
                    style={{ width:"250px" }}   
                    value={currentEditUser.name}/>
            </div>
            <div className="">
                <label htmlFor="email" className="text-sm font-weight-900 -ml-1 label">Email</label>
                <input 
                    id="email" 
                    type="email" 
                    disabled 
                    className="input input-bordered input-primary"
                    style={{ width:"250px" }}   
                    value={currentEditUser.email}/>
            </div>
            <div className="">
                <label htmlFor="RO-email" className="text-sm font-weight-900 -ml-1 label">RO email</label>
                <input 
                    id="RO-email" 
                    type="text" 
                    className="input input-bordered input-primary w-full"
                    style={{ width:"250px" }}  
                    defaultValue={currentEditUser.reportingEmail}
                    onChange={(e)=> handleReportingEmailUpdate(e)}
                />
            </div>
            <div className="">
                <label htmlFor="CO-email" className="text-sm font-weight-900 -ml-1 label">CO email</label>
                <input 
                    id="CO-email" 
                    type="text" 
                    className="input input-bordered input-primary w-full max-w-xs" 
                    style={{ width:"250px" }}  
                    defaultValue={currentEditUser.coveringEmail}
                    onChange={(e)=> handleCoveringEmailUpdate(e)}
                />
            </div>
            <div className='flex flex-col'>
                <button 
                    type="submit" 
                    className={`btn btn-primary text-white px-24 text-center text-base font-semibold shadow-md rounded-lg mt-6 ${updateBtnLoading}`}
                    disabled={activeUpdateButton}
                >
                    Update
                </button>
                <button
                    type='button'
                    onClick={handleDeleteClick} 
                    className={`btn btn-error text-white px-24 text-center text-base font-semibold shadow-md rounded-lg mt-2 ${deleteBtnLoading}`}>
                        Delete
                </button>
            </div>
            {isLoading && <Loading/>}
        </form>
    )
}
/*, cette page offre une interface conviviale pour permettre aux administrateurs de mettre à 
jour les informations des utilisateurs et de gérer les comptes utilisateur de manière efficace(supprimer). */



export default UpdateUserInfoPage