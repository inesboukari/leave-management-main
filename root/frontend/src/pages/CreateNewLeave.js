import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMainContext } from '../hooks/useMainContext'

/*un administrateur créer un nouveau type de congé */

function CreateNewLeave() {
    const {currentUser, fetchCurrentUserInfo} = useMainContext()
    const [leaveName, setLeaveName] = useState()
    const [leaveNameInCN, setLeaveNameInCN] = useState()
    const [leaveEntitlement, setLeaveEntitlement] = useState()
    const [leaveNote, setLeaveNote] = useState("NA")
    const [leaveNoteInCN, setLeaveNoteInCN] = useState("无")
    const navigate = useNavigate()

    const handleCreateClick = (e) => {
        e.preventDefault()
        if(
            leaveName === undefined || 
            leaveNameInCN === undefined || 
            leaveEntitlement === undefined || 
            leaveNote === undefined ||
            leaveNoteInCN === undefined
            )
            return toast.error("Fill in all blanks!")

        const createLeaveFormData = {
            leaveName: `${leaveName} ${leaveNameInCN}`,
            leaveSlug: leaveName.split(" ")[0].toLowerCase(),
            leaveEntitlement: leaveEntitlement,
            leaveRollOver: "no",
            leaveNote: `${leaveNote}/${leaveNoteInCN}`,
            userAdded: currentUser.email,
            addedOn: new Date()
        }
        console.log("createLeaveFormData: ", createLeaveFormData)

        axios
        .post(`${process.env.REACT_APP_BACKENDURL}/admin/create-new-leave`, createLeaveFormData)
        .then(resp => {
            console.log(resp)
            // fetch current user info
            fetchCurrentUserInfo()
            navigate('/delete-leave-type')
            window.location.reload()
        })
        .catch(err => {
            console.log("catch block: ", err)
            if(err.response.status === 400) return toast.error("failed to create new leave")
            if(err.response.status === 401) return toast.error("leave type already exists!")
            console.log(err.message, ": ", err.response.data)
        })
    }
    return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-8 mb-6'>
                    <p className='text-slate-600 text-3xl'>Create <span className="text-sky-500">New Leave</span> </p>
                </div>
                <div className="grid h-58 card rounded-box place-items-center my-1">
                    <form onSubmit={handleCreateClick} className="form-control w-full max-w-xs gap-y-0.5">
                        <label className="label text-sm">Leave Name (in EN)</label>
                        <input type="text" placeholder='e.g. Childcare Leave' className="input input-bordered w-full max-w-xs" onChange={(e)=> setLeaveName(e.target.value)}/>
                        <label className="label text-sm">Leave Name (in CN)</label>
                        <input type="text" placeholder='e.g. 育儿假' className="input input-bordered w-full max-w-xs" onChange={(e)=> setLeaveNameInCN(e.target.value)}/>
                        <label className="label text-sm">Leave Entitlement</label>
                        <input type="number" placeholder='e.g. 3' className="input input-bordered w-full max-w-xs" step="0.5" onChange={(e) => setLeaveEntitlement(e.target.value)}/>
                        <label className="label text-sm">Note to staff about leave type (in EN)</label>
                        <textarea 
                            id="note" 
                            className="w-80 py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                            placeholder="e.g. Can be taken on or after International Women's Day" 
                            name="comment" 
                            rows="2"
                            defaultValue={"NA"}
                            onChange={(e) => setLeaveNote(e.target.value)}
                            />
                        <label className="label text-sm">Note to staff about leave type (in CN)</label>
                        <textarea 
                            id="note" 
                            className="w-80 py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                            placeholder="e.g. 可在国际妇女节当天或之后用" 
                            name="comment" 
                            rows="2"
                            defaultValue={"无"}
                            onChange={(e) => setLeaveNoteInCN(e.target.value)}
                            />
                        <button type="submit" className="btn text-white text-center text-base font-semibold shadow-md rounded-lg mt-4">
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </div>
        )
}

/*Si la création réussit, la page est redirigée vers /delete-leave-type, une page pour supprimer des types de congés existants */

export default CreateNewLeave
