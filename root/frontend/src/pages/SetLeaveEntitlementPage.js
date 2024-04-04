import axios from 'axios'
import React, { useState } from 'react'
import Loading from '../components/Loading'
import { useMainContext } from '../hooks/useMainContext'
import { toast } from 'react-toastify'


/* permet aux administrateurs de mettre à jour les quotas(nbre de jour de congé pour un utilisateur) de congé pour différents types de congé */




function SetLeaveEntitlementPage() {
    const {currentLeaveEntitlement, fetchLeaveEntitlement} = useMainContext()
    const [isLoading, setIsLoading] = useState(false)
    const [disableUpdateButton, setDisableUpdateButton] = useState(true)
    const [updateBtnLoading, setUpdateBtnLoading] = useState()
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)
    
    const handleUpdate = (e) => {
        setDisableUpdateButton(false)
    }
    
    const validateAndSubmitData = (e) => {
        e.preventDefault()
        console.log("form submission fx executed")
        console.log("currentLeaveEntitlement length: ", currentLeaveEntitlement.length)
        const updatedValues = []
        for(let i=0;i<currentLeaveEntitlement.length;i++){
            const currentLeaveName = currentLeaveEntitlement[i].name
            const currentInput = document.getElementById(currentLeaveName)

            if(currentInput.value){
                // if currentInput.value is a number, that means user updated the value
                updatedValues.push({
                        name: currentLeaveName, 
                        entitlement: +currentInput.value
                    })
            }
            else{
                // if currentInput.value is undefined, user did not update the value, we will fallback on existing value
                updatedValues.push({
                    name: currentLeaveName, 
                    entitlement: +currentLeaveEntitlement[i].entitlement
                })
            }
        }

        if(!checkBoxStatus){
            setUpdateBtnLoading("")
            return toast.error("Acknowledge checkbox not checked!")
        }

        if(window.confirm(`
            Update leave entitlement?

            WARNING: Current action will affect all user's leave 
            entitlement, are you sure?`)){
            setIsLoading(true)
            setUpdateBtnLoading(true)
            const url = `${process.env.REACT_APP_BACKENDURL}/admin/post-leave-entitlement`
            axios
                .post(url, {updatedLeaveEntitlement: updatedValues})
                .then(resp => {
                        setUpdateBtnLoading(false)
                        setIsLoading(false)
                        fetchLeaveEntitlement()
                        return toast.success("Leave Entitlement Updated")
                })
                .catch(err => {
                    setIsLoading(false)
                    setUpdateBtnLoading(false)
                    return toast.warning("failed to update entitlement")
                })
        }

    }

    console.log("currentLeaveEntitlement: ", currentLeaveEntitlement)

  return (
    <div className=''>
        <div className='grid place-items-center mt-6'>
            <p className='text-slate-600 text-3xl'>Leave <span className="text-sky-500">Entitlement</span> </p>
            <form className='grid grid-cols-3 gap-x-8 mt-12 items-center' onSubmit={validateAndSubmitData}>
                {currentLeaveEntitlement && currentLeaveEntitlement.map(leave => {
                    return <div>
                                <label htmlFor={leave.name} className="text-sm font-weight-900 -ml-1 label">{leave.name}</label>
                                <input 
                                    id={leave.name} 
                                    name={leave.name}
                                    type="number" 
                                    className="input input-bordered input-primary w-full max-w-xs" 
                                    style={{ width:"250px" }}  
                                    defaultValue={leave.entitlement}
                                    onChange={(e)=> handleUpdate(e)}
                                />
                            </div>
                })}
                <div className='grid col-span-3 mt-10'>
                    <div className="flex items-center">
                        <input type="checkbox" checked={checkBoxStatus} onClick={() => setCheckBoxStatus(!checkBoxStatus)} className="checkbox checkbox-primary mr-2" />
                        <p className="label-text mt-4 mb-2">{`I confirm that CN government made amendments to their national leave policy and have run through these changes with CG.`}</p>
                    </div>
                    <button 
                            type="submit" 
                            className={`btn btn-primary text-white px-24 text-center text-base font-semibold shadow-md rounded-lg mt-6 ${updateBtnLoading}`}
                            disabled={disableUpdateButton}
                        >
                            Update
                    </button>
                </div>
            </form>
    </div>
        
        {isLoading && <Loading/>}
    </div>
  )
}

export default SetLeaveEntitlementPage