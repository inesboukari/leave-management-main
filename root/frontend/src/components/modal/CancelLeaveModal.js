import axios from 'axios'
import React, { useState } from 'react'
import { useMainContext } from '../../hooks/useMainContext'

function CancelLeaveModal({handleCancelClick}) {/*est un composant modal qui permet à l'utilisateur de confirmer ou d'annuler une demande d'annulation de congé*/
    const {currentUser} = useMainContext()
    
    // console.log("leaveId: ", leaveId)

    return (
    <div>        
        <label
            htmlFor="my-modal-3" 
            className="btn btn-sm modal-button btn-error px-2 rounded-md text-white"

        >
            cancel 取消
        </label>
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box w-88 relative">
                <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                <h3 className="text-lg font-bold text-center">Cancel Leave?</h3>
                <h3 className="text-lg font-bold text-center">确定取消？</h3>

                <form className='flex justify-center gap-8 mt-4'>
                    <button type="submit" className='btn btn-error px-8 py-2 text-white'>Yes, 取消</button>
                    <button onClick={(e) => handleCancelClick(e)} type="button" className='btn btn-outline btn-error'>No, 不取消</button>
                </form>
            </div>
        </div>
    </div>
    )
}

export default CancelLeaveModal