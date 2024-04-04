import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

{/*utilisateurs peuvent réinitialiser ou nettoyer la base de données */}
{/*useState pour stocker la valeur de challengeToken, qui semble être un élément de sécurité pour empêcher les opérations de réinitialisation non autorisées. */}
function ResetDatabasePage() {

    const navigate = useNavigate()
    const [challengeToken, setChallengeToken] = useState()
    const validateAndSubmitData = async (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_BACKENDURL}/admin/clean-slate`
        
        if(challengeToken === undefined || challengeToken.length === 0)
            return toast.error("You shouldn't be here..")

        
        const formData = {
            challengeToken: challengeToken
        }
        axios
            .post(url, formData)
            .then(resp => {
                console.log(resp.message)
                if(resp.status === 200) {
                    toast.success("Snap successful")
                    navigate('/')
                }
            })
            .catch((err) => {
                toast.error(err.response.data)
                console.log(err.response)
            })
    }
    
    return (
    <div>
        <div className="flex flex-col w-full border-opacity-50">
            <div className='grid place-items-center mt-20 mb-8'>
                <p className='text-slate-600 text-3xl'>THANOS <span className="text-sky-500">VILLAGE</span> </p>
            </div>
            <form className="grid h-58 card rounded-box place-items-center my-1" onSubmit={validateAndSubmitData}>
                <div className="form-control w-full max-w-xs">
                    <input type="text" placeholder="Reality Is Often Disappointing" className="input input-bordered w-full max-w-xs" onChange={(event) => setChallengeToken(event.target.value)}/>
                </div>
                <button type='submit' className={`btn btn-wide bg-black my-12`}>Snap</button>
            </form>
        </div>
    </div>
    )
}

{/*permet aux utilisateurs de réinitialiser la base de données 
de l'application en saisissant un challengeToken pour confirmer leur autorisation */}

export default ResetDatabasePage