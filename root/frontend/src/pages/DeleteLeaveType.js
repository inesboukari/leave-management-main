import React from 'react'
import Table from '../components/layout/Table'

/*supprimer type de congé */

function DeleteLeaveType() {
    return (
        <div>
            <div className='text-2xl mt-8 mb-12 text-center'>Manage Leave Added By Admin</div>
            <Table headerType="delete-leave-type"/>
            <p className='text-center text-red-500 text-xl mt-20'>WARNING: Deleting a leave type already applied or consumed by staff will lead to inconsistencies and audit issues</p>
            <p className='text-center text-red-500 text-xl'>By deleting, you acknowledge and accept the risk as stated above</p>
        </div>
        )
}

export default DeleteLeaveType