import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'
import InfoBubble from './InfoBubble'
import { toast } from 'react-toastify'
import Loading from '../Loading'

function Table({headerType}) {/*Cela montre que ce composant de table utilise
 des données et des fonctions fournies par le contexte principal pour gérer l'état local et afficher les données*/
    const {activeTab, currentUser, currentLeaveEntitlement, fetchCurrentUserInfo, setCurrentEditUser, userList} = useMainContext()
    console.log(currentUser);
    const [isLoading, setIsLoading] = useState(false)
    const [userAddedLeaveType, setUserAddedLeaveType] = useState(currentLeaveEntitlement.filter(record => (record.addedByUser ? record.addedByUser.length > 0 : 0)))
    const currentDate = new Date()
    const currentDateUnix = currentDate.getTime()
    const currentYear = currentDate.getFullYear()
    const currentUserLeave = currentUser.leave

    // table headers
    /*Ces variables contiennent les en-têtes de différentes tables qui peuvent être utilisées dans votre application */
    const requestTableHeader = ["ID", "Leave Type", "Period ", "calendar days ", "Submitted on ", "Quota used ", "Status ", "Action " ]
    const historyTableHeader = ["ID", "Leave Type ", "Period ", "calendar days ", "Submitted on", "Quota used ", "Status ", "Action" ]
    const approvalTableHeader = ["Staff", "Leave Type", "Period", "calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const approvalHistoryTableHeader = ["Staff", "Leave Type", "Period", "calendar days", "Submitted on", "Quota used", "Status" ]
    const entitlementTableHeader = ["Leave Type ", `Entitlement (${currentYear})`, "Pending ", "Quota used ", "Available ","Note"]
    const changeLogHeader = ["Time","Operation Type", "Changes made", "Changed by"]
    const userManagementTableHeader = ["Name","Email","Created on","Last updated on","Type","RO email","CO email","Action"]
    const deleteLeaveTableHeader = ["Name", "Entitlement", "Added By", "Added On", "Action"]
    const approvalAttesatonTableHeader = ["name", "email", "grade", "matricule", "attestationTravail" ,"attestationSalaire"]
    const handleEditClick = (event) => {/* est utilisée pour gérer le clic sur un bouton ou un élément qui déclenche l'édition d'un utilisateur dans votre application*/
        // identify user's id, send user's data to update user info form
        // console.log(event.target.id)
        setCurrentEditUser(event.target.id)/*permet de stocker l'identifiant de l'utilisateur actuellement en cours d'édition dans l'état du composant*/
        fetchCurrentEditUserDetails(event.target.id)/* pour récupérer les détails de l'utilisateur sur lequel l'édition est déclenchée*/
    }

    const fetchCurrentEditUserDetails = (userEmail) => {
        const url = `${process.env.REACT_APP_BACKENDURL}/admin/get-user-info-by-email/${userEmail}`
        axios
        .get(url)
        .then(resp => {
            setCurrentEditUser(resp.data)
        })
        .catch(err => {
            console.log(err)
            toast.warning(`failed to get user info by email`)
        })
    };

        


    const handleDeleteLeaveType = (e) => {/*Cette fonction est appelée lorsqu'un utilisateur clique sur un bouton pour supprimer un type de congé*/
        e.preventDefault()
        

        if(window.confirm(`
        This action might lead to data inconsistencies if existing user 
        has already applied ${e.target.name}

        Delete leave?
        `
        )){
            setIsLoading(true)
            const url = `${process.env.REACT_APP_BACKENDURL}/admin/delete-leave-type`
            axios
                .post(url, {leaveName: e.target.name})
                .then(resp => {
                    if(resp.status === 200){
                        setIsLoading(false)
                        window.location.reload()
                      }
                })
                .catch(err => {
                    setIsLoading(false)
                    return toast.warning("failed to delete leave type")
                })
        }
    }

    const handleActionClick = (e) => {/*est utilisée pour gérer les actions effectuées sur les congés des membres du personnel par un administrateur*/
        e.preventDefault()
        const staffEmail= e.target.id
        const dateRange = e.target.name
        const action = e.target.value

        if (window.confirm(`${action} leave? `))/*Une boîte de dialogue de confirmation est affichée pour demander
         à l'utilisateur de confirmer l'action (par exemple, "Approuver le congé ?").*/
        {
            setIsLoading(true)/*Si l'utilisateur confirme l'action, l'application passe en mode de chargement (setIsLoading(true)*/
            const url = `${process.env.REACT_APP_BACKENDURL}/admin/${action}-leave`

            const targetStaffLeave = currentUser.staffLeave.filter(entry => (entry.staffEmail === staffEmail && entry.timePeriod === dateRange))
            // console.log("targetStaffLeave: ",targetStaffLeave)
            const leaveData = {
                staffEmail: targetStaffLeave[0].staffEmail,
                coveringEmail: targetStaffLeave[0].coveringEmail,
                reportingEmail: currentUser.email,
                dateRange: targetStaffLeave[0].timePeriod,
                leaveType: targetStaffLeave[0].leaveType,
                leaveStatus: targetStaffLeave[0].status,
                numOfDaysTaken: targetStaffLeave[0].quotaUsed,
                submittedOn: targetStaffLeave[0].submittedOn,
                startDateUnix: targetStaffLeave[0].startDateUnix,
                endDateUnix: targetStaffLeave[0].endDateUnix,
                start: new Date(targetStaffLeave[0].startDateUnix),
                end: new Date(targetStaffLeave[0].endDateUnix),
                staffName: targetStaffLeave[0].staffName,
                leaveClassification: targetStaffLeave[0].leaveClassification
            }
            // console.log("leaveData: ", leaveData)

            axios
                .post(url, leaveData)
                .then(resp => {
                    if(resp.status === 200){
                        // console.log(resp)
                        setIsLoading(false)
                        if (action === "Approve") toast.success(`Leave approved`)
                        else toast.success(`Leave rejected`)
    
                        fetchCurrentUserInfo(currentUser)
                    }
                })
                .catch(err => {
                    if (err.response.status === 488){
                        setIsLoading(false)
                        toast.warning(`sendgrid error!`)
                        console.log(err)
                    }
                    else{
                        setIsLoading(false)
                        toast.warning(`failed to ${action} leave`)
                        console.log(err)
                    }
                })
        }
    }


    const tableHeaderSelection = (headerType) => {
        switch (headerType) {
            case "approval":
                return approvalTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "approvalHistory":
                return approvalHistoryTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "change-log":
                return changeLogHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
           case "approve-attestation":
                return dashboardTableHeader.map((headerName,index) => <th className='whitespace-pre-line' key={index}>{headerName}</th>)
            case "entitlement":
                return entitlementTableHeader.map((headerName,index) => <th className='whitespace-pre-line' key={index}>{headerName}</th>)
            case "request":
                return requestTableHeader.map((headerName,index) => <th className='whitespace-pre-line' key={index}>{headerName}</th>)
            case "history":
                return historyTableHeader.map((headerName,index) => <th className='whitespace-pre-line' key={index}>{headerName}</th>)
            case "user-management":
                return userManagementTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "delete-leave-type":
                return deleteLeaveTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
        
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    const statusBadgeSelection = (status) => {/*Cette fonction permet de rendre visuellement les différents statuts 
    des congés sous forme de badges avec des couleurs et des étiquettes appropriées*/
        switch (status) {
            case "approved":
                return <span className='badge badge-success py-3 text-white font-semibold'>{status.toUpperCase()}</span>
            {/*case "cancellation approved":
                   return <span className='badge badge-success py-5 text-white font-semibold whitespace-pre-line'>{"CANCELLATION\nAPPROVED"}</span>*/}
            case "cancelled":
                      return <span className='badge badge-warning py-3 text-white font-semibold'>{status.toUpperCase()}</span>*/}
            case "pending":
                      return <span className='badge badge-info py-3 text-white font-semibold'>{status.toUpperCase()}</span>
           {/* case "pending cancellation":
              return <span className='badge badge-info py-5 text-white font-semibold whitespace-pre-line'>{"PENDING\nCANCELLATION"}</span>*/}
            {/*case "cancellation rejected":
                 return <span className='badge badge-error py-5 text-white font-semibold whitespace-pre-line'>{"cancellation\nrejected"}</span>*/}
            case "rejected":
                return <span className='badge badge-error py-3 text-white font-semibold'>{status.toUpperCase()}</span>
            default:
                console.log("invalid status header provided!")
                break;
        }
    
    
    const tableDataSelection = (headerType) => {/*est utilisée pour sélectionner et générer les données de tableau appropriées en fonction du type de tableau fourni en entrée*/
        switch (headerType) {
            case "approval":
                return (currentUser.staffLeave.filter(entry => entry.status === "pending" || entry.status === "pending cancellation")).length ?
                    currentUser.staffLeave
                        .filter(entry => entry.status === "pending" || entry.status === "pending cancellation")
                        .sort((a,b)=> a.startDateUnix - b.startDateUnix)
                        .map((subLeave,index) => 
                        <tr>
                            <td>{subLeave.staffEmail}</td>
                            <td>{subLeave.leaveType}</td>
                            <td>{subLeave.timePeriod}</td>
                            <td>{subLeave.quotaUsed}</td>
                            <td>{subLeave.submittedOn}</td>
                            <td>{subLeave.quotaUsed}</td>
                            <td>{statusBadgeSelection(subLeave.status)}</td>
                            <td>
                                <button 
                                    id={subLeave.staffEmail} 
                                    name={subLeave.timePeriod}
                                    onClick={(e) => handleActionClick(e)} 
                                    className="btn btn-sm px-2 rounded-md text-white mr-4"
                                    value="Approve">Approve
                                </button>
                                <button 
                                    id={subLeave.staffEmail} 
                                    name={subLeave.timePeriod}
                                    onClick={(e) => handleActionClick(e)} 
                                    className="btn btn-sm btn-error px-2 rounded-md text-white"
                                    value="Reject">Reject
                                </button>
                            </td>
                        </tr>
                ) : <td>No leave application to approve. Great!</td>
            case "approvalHistory":
                return (currentUser.staffLeave.filter(entry => entry.status === "approved" || entry.status === "rejected").length) ?
                 currentUser.staffLeave
                    .filter(entry => 
                            entry.status === "approved" || 
                            entry.status === "rejected" || 
                            entry.status === "cancellation approved" ||
                    entry.status === "cancellation rejected")
                    .sort((a,b)=> b.startDate - a.startDate)
                    .map((subLeave,index) => 
                    <tr>
                        <td>{subLeave.staffEmail}</td>
                        <td>{subLeave.leaveType}</td>
                        <td>{subLeave.timePeriod}</td>
                        <td>{subLeave.quotaUsed}</td>
                        <td>{subLeave.submittedOn}</td>
                        <td>{subLeave.quotaUsed}</td>
                        <td>{statusBadgeSelection(subLeave.status)}</td>
                    </tr>
                )
                : <td>No approval leave history yet</td>
            case "change-log":
                 return changeLogData.map((list, index) => <tr key={index}>{list.map(listItem => <td>{listItem}</td>)}</tr>)
            case "dashboard":
                return userList
                    .filter(entry => entry.isAdmin === "user")
                    .map((user,index) => 
                    <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        {/* fetch from global entitlement collection */}
                        <td>{currentLeaveEntitlement.find(record => record.name === "Annual Leave").entitlement - user.leave[0].used}</td> 
                    </tr>)
            case "entitlement":
                const fetchLeaveEntitlement = (leaveName) => {
                    /* fetch from global entitlement collection */
                    return currentLeaveEntitlement.find(record => record.name === leaveName).entitlement
                }
                return currentUserLeave?.map((leave,index) => 
                    <tr key={index}>
                        <td>{leave.name}</td>
                        <td>{(leave.name === `Annual Leave (${currentYear-1})`) ? leave.entitlement : fetchLeaveEntitlement(leave.name)}</td>
                        <td>{leave.pending}</td>
                        <td>{leave.used}</td>
                        <td>{(leave.name === `Annual Leave  (${currentYear-1})`) ? leave.entitlement : fetchLeaveEntitlement(leave.name) - leave.pending - leave.used}</td>
                        <td><InfoBubble info={leave.note}/></td>
                    </tr>)
            case "request":
                return (currentUser?.leaveHistory?.filter(entry => entry.startDateUnix > currentDateUnix).length) ?
                currentUser.leaveHistory
                    .filter(entry => entry.startDateUnix > currentDateUnix)
                    .sort((a,b)=> a.startDateUnix - b.startDateUnix)
                    .map((leave,index)=>
                            <tr key={index}>
                                <td className='text-sm'>{leave._id}</td>
                                <td>{leave.leaveType}</td>
                                <td>{leave.timePeriod}</td>
                                <td>{leave.quotaUsed}</td>
                                <td>{leave.submittedOn}</td>
                                <td>{leave.quotaUsed}</td>
                                <td>
                                    {statusBadgeSelection(leave.status)}
                                </td>
                                <td>
                                    {(leave.status === "approved" || leave.status === "pending") ?
                                    <button 
                                        id={leave._id} 
                                        name={leave.leaveType}
                                        onClick={(e) => handleCancelClick(e)} 
                                        className="btn btn-sm btn-error px-2 rounded-md text-white">cancel 
                                    </button>
                                    : <></>
                                    }
                                </td>
                                {/* <td><button className='btn-error px-2 rounded-md text-white'>Cancel</button></td> */}
                            </tr>
                        )
                    : <td>No upcoming leave request / </td>
            case "history":
                return (currentUser?.leaveHistory?.filter(entry => entry.startDateUnix <= currentDateUnix).length) ?
                    currentUser.leaveHistory
                        .filter(entry => entry.startDateUnix <= currentDateUnix)
                        .sort((a,b)=> b.startDateUnix - a.startDateUnix)
                        .map((leave,index)=>
                                <tr key={index}>
                                    <td className='text-sm'>{leave._id}</td>
                                    <td>{leave.leaveType}</td>
                                    <td>{leave.timePeriod}</td>
                                    <td>{leave.quotaUsed}</td>
                                    <td>{leave.submittedOn}</td>
                                    <td>{leave.quotaUsed}</td>
                                    <td>
                                        {statusBadgeSelection(leave.status)}
                                    </td>
                                    <td>
                                    {(leave.status === "pending" || leave.status === "approved") ?
                                    <button 
                                        id={leave._id} 
                                        name={leave.leaveType}
                                        onClick={(e) => handleCancelClick(e)} 
                                        className="btn btn-sm btn-error px-2 rounded-md text-white">cancel
                                    </button>
                                    : <></>
                                    }
                                </td>
                                </tr>
                        )
                : 
                <td>No leave history / </td>
            case "delete-leave-type":
                console.log(currentLeaveEntitlement, userAddedLeaveType)
                return (userAddedLeaveType) ?
                userAddedLeaveType
                        .map((leave,index)=>
                                <tr key={index}>
                                    <td>{leave.name}</td>
                                    <td>{leave.entitlement}</td>
                                    <td>{leave.addedByUser}</td>
                                    <td>{leave.addedOn}</td>
                                    <td>
                                        <button 
                                            name={leave.name}
                                            onClick={(e) => handleDeleteLeaveType(e)} 
                                            className="btn btn-sm btn-error px-2 rounded-md text-white">Delete
                                        </button>
                                    </td>
                                </tr>
                        )
                : <td>No records</td>
            case "user-management":
                return userList.map((list, index) => 
                        (
                                <tr key={index}>
                                    <td>{list.name}</td>
                                    <td>{list.email}</td>
                                    <td>{list.createdOn}</td>
                                    <td>{list.lastUpdatedOn}</td>
                                    <td>{list.isAdmin}</td>
                                    <td>{list.reportingEmail}</td>
                                    <td>{list.coveringEmail}</td>
                                    <td>
                                        <Link to ="/update-user">
                                            <button id={list.email} className='btn btn-xs btn-neutral' onClick={handleEditClick}>
                                                edit
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                        ))
                        case "approve-attestation":
                            return userList.map((list, index) => 
                                    (
                                            <tr key={index}>
                                                <td>{list.name}</td>
                                                <td>{list.email}</td>
                                                <td>{list.grade}</td>
                                                <td>{list.matricule}</td>
                                                <td>{list.attestationTravail}</td>
                                                <td>{list.attestationSalaire}</td>
                                    
                                                <td>
                                                    <Link to ="/attestation-form">
                                                        <button id={list.email} className='btn btn-xs btn-neutral' onClick={handleEditClick}>
                                                            edit
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                    ))
                                
                    
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    return (
    <div className="overflow-x-auto">
        <table className="table hover w-full">
            {/* <!-- head --> */}
            <thead>
            <tr>
                {tableHeaderSelection(headerType)}
            </tr>
            </thead>
            <tbody>
                {userList.length > 0 && tableDataSelection(headerType)}
            </tbody>
        </table>
        {isLoading && <Loading/>}
    </div>
    )
};

export default Table;