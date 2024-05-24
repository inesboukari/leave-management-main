import React from 'react'
import { Link } from 'react-router-dom'
import { useMainContext } from '../hooks/useMainContext'

{/* hook useMainContext pour obtenir l'objet currentUser contenant les informations sur l'utilisateur actuellement connecté. */}
{/*Exactement, cette page est conçue pour afficher le profil de l'utilisateur actuellement connecté. Elle affiche les informations spécifiques à cet utilisateur */}
function ProfilePage() {
    const {currentUser} = useMainContext()
    return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-8 mb-6'>
                    <p className='text-slate-600 text-3xl'>Profile <span className="text-sky-500">Page</span> </p>
                    <p className='text-slate-600 text-3xl'> <span className="text-sky-500"></span> </p>
                </div>
                <div className="grid h-58 card rounded-box place-items-center my-1">
                    <div className="form-control w-full max-w-xs">
                        <label className="label text-sm">Email</label>
                        <input type="text" className="input input-bordered w-full max-w-xs" disabled value={currentUser.email}/>
                        <label className="label text-sm">Role </label>
                        <input type="text" className="input input-bordered w-full max-w-xs" disabled value={currentUser.isAdmin}/>
                        {/* <label className="label text-sm">Reporting Officer </label>
                        <input type="text" className="input input-bordered w-full max-w-xs" disabled value={currentUser.ro}/> */}
                        <label className="label text-sm">Reporting Officer Email </label>
                        <input type="text" className="input input-bordered w-full max-w-xs" disabled value={currentUser.reportingEmail}/>
                        {/* <label className="label text-sm">Covering Officer </label>
                        <input type="text" className="input input-bordered w-full max-w-xs" disabled value={currentUser.co}/> */}
                        <label className="label text-sm">Covering Officer Email </label>
                        <input type="text" className="input input-bordered w-full max-w-xs" disabled value={currentUser.coveringEmail}/>
                    </div>
                </div>
            </div>
        </div>
        )
}

export default ProfilePage