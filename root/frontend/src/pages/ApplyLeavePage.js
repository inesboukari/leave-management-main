
import React, { useState } from 'react'
import Select from '../components/layout/Select'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useMainContext } from '../hooks/useMainContext';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

/*page de demande de congé  */

function ApplyLeavePage() {
    
    const {currentUser, currentLeaveEntitlement, currentLeaveSelection, fetchCurrentUserInfo, setCurrentLeaveSelection} = useMainContext()

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    const [leaveOptions] = useState(currentUser?.leave?.map(leave => leave.name))
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [startDateRadioSelection, setStartDateRadioSelection] = useState("Full Day")
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [numOfDaysApplied, setNumOfDaysApplied] = useState()
    const [currentUserAppliedDates] = useState(
        // filters non-cancelled, non-rejected leave dates already applied by user
       currentUser.leaveHistory?.filter(entry => entry.status === "pending" || entry.status === "approved")?.map(entry => +(entry.startDateUnix)))
    const [applyBtnLoading, setApplyBtnLoading] = useState("")

    const userSelectedLeave = currentUser?.leave?.find((leaveType) => leaveType.name === currentLeaveSelection)
    console.log("userSelectedLeave: ", userSelectedLeave)

    const numOfSelectedLeave = // use .entitlemen if leave type is carry forward, else, fetch from leaveEntitlement
        (userSelectedLeave?.name === `Annual Leave (${currentYear-1})`) ? userSelectedLeave?.entitlement : currentLeaveEntitlement.find(leave => leave.name === userSelectedLeave?.name)?.entitlement - userSelectedLeave?.pending - userSelectedLeave?.used // refers to how many days a user is entitled for selected leave type
    
    const validateAndSubmitLeaveApplication = (e) => {
        const url = `${process.env.REACT_APP_BACKENDURL}/user/applyLeave`
        e.preventDefault()
        setApplyBtnLoading("loading")
        
        if(!currentLeaveSelection){
            setApplyBtnLoading("")
            return toast.error("leave type not selected /")
        }
        if(currentUserAppliedDates.includes(startDate)){
            setApplyBtnLoading("")
            return toast.error("You have already applied leave on this day / ")
        }
        if(startDate === undefined || endDate === undefined){
            setApplyBtnLoading("")
            return toast.error("start and end date must be selected /")
        }
        if(!startDateRadioSelection){
            setApplyBtnLoading("")
            return toast.error("Please select AM, PM Leave or Full Day / AM, PM Leave or Full Day")
        }
        // user must have enough leave 
        if(numOfDaysApplied > numOfSelectedLeave){
            setApplyBtnLoading("")
            return toast.error("Insufficient leave /")
        }
        if(!checkBoxStatus){
            setApplyBtnLoading("")
            return toast.error("Checkbox not checked! / ")
        }
    };
        // loads loading screen
        setIsLoading(true)

        const applyLeaveFormData = {
            userId: currentUser._id,
            staffName: currentUser.name,
            startDate: startDate,
            endDate: endDate,
            dateOfApplication: currentDate.getTime(),
            userEmail:currentUser.email,
            coveringEmail: currentUser.coveringEmail,
            reportingEmail: currentUser.reportingEmail,
            remarks: remarks,
            leaveType: currentLeaveSelection,
            leaveClassification: startDateRadioSelection, // am, pm or full day
            numOfDaysTaken: numOfDaysApplied,
            // file: uploadedFileData               file upload currently not supported
        }
        console.log("applyLeaveFormData: ", applyLeaveFormData)
        
        axios
            .post(url,applyLeaveFormData)
            .then((resp) =>{
                setIsLoading(false)
                console.log(resp)
                if(resp.status === 200) {
                    // call user API to get most updated info
                    fetchCurrentUserInfo(currentUser)
                    setCurrentLeaveSelection("Annual Leave ")
                    toast.success("Leave application successful!")
                    navigate('/')
                }
            })
            //la fonction qui arrête l'affichage de l'interface lorsque le backend rencontre un problème
    
           .catch(err => {
                if (err.response.status === 488){
                    setIsLoading(false)
                    toast.error("sendgrid email limit exceeded!")
                }
                else{
                    setIsLoading(false)
                    toast.warning("failed to apply leave /")
                }
                console.log(err)
            })
        
    }

    const handleStartDateSelection = (date) => {
        if(date.getTime() > endDate) {
            console.log(date.getTime(),endDate)
            setEndDate()
            setNumOfDaysApplied()
        }
        
        setStartDate(date.getTime())
        
        if(startDateRadioSelection !== "Full Day"){
           setTimeout(() => { // timeout is set because sometimes setEndDate method is called before start date is set in react
               setEndDate(date.getTime()) // if user selects AM or PM as radio selection before date, end date will automatically be equal to start date
           }, 500)
           setNumOfDaysApplied(0.5)
        }
        else{
            if (endDate) { // if end date is already selected, call date calculation function
                // console.log("day calculation triggered!")
                calculateNumOfBizDays(date.getTime(), endDate)
            }
        }
    }
    const handleEndDateSelection = (date) => {
        setEndDate(date.getTime())
        if (startDate) { // if start date is already selected, call date calculation function
            // console.log("day calculation triggered!")
            calculateNumOfBizDays(startDate, date.getTime())
        }
    }

    const calculateNumOfBizDays = (start, end) => {
        if ((start === end ) && startDateRadioSelection === "Full Day"){
            setNumOfDaysApplied(1)
        }
        else {
            const data = {
                startDate: start,
                endDate: end
            }
    
            axios
                .post(`${process.env.REACT_APP_BACKENDURL}/user/numOfDays`, data)
                .then(resp => {
                    if(resp.status === 400){
                        toast.warning("failed to call biz day calculator")
                      }
                    // console.log(resp)
                    setNumOfDaysApplied(resp.data.numOfDaysApplied)
                })
                .catch(err =>{
                    console.log(err)
                })
        }
    }

    const handleRadioSelection = (e) => {
        setStartDateRadioSelection(e.target.value)
        if(e.target.value !== "Full Day"){
            setNumOfDaysApplied(0.5)
            setEndDate(startDate)
        }
        else {
            // reset start and end date when user selects full day after selecting AM/PM prior
            setStartDate()
            setEndDate()
            // hide helping text by setting days applied to 0
            setNumOfDaysApplied()
        }
    }

    const leaveTypeMessage = () => {
        if(numOfSelectedLeave === 0){
            return (<>
                <p className='mt-4 text-sm'>You have 0 days of: {currentLeaveSelection}</p>
                <p className='text-sm'>: {currentLeaveSelection}</p>
            </>)    
        }
        if(numOfSelectedLeave){
            return (<>
                <p className='mt-4 text-sm'>You have {numOfSelectedLeave} days of: {currentLeaveSelection}</p>
                <p className='text-sm'>{numOfSelectedLeave}: {currentLeaveSelection}</p>
            </>)
        }
    
    }

  return (
    <>
    <h1>Welcome</h1>
     <form className="w-full flex flex-col justify-start items-center" onSubmit={validateAndSubmitLeaveApplication}> 

        <div className='grid place-items-center mt-6'>
            <p className='text-slate-600 text-3xl'>Apply <span className="text-sky-500">Leave</span> </p>
            <p className='text-slate-600 text-3xl'><span className="text-sky-500"></span> </p>
        </div>

        <div className="my-1 ml-8">
            <label htmlFor="typeleave" className="text-lg font-weight-900 -ml-1 label">Leave Type</label>
             <Select options={leaveOptions}/> 
             {leaveTypeMessage()} 
        </div>

        <div className='flex ml-20'>
            <div className=''>
                <label htmlFor="startDate" className="text-sm">Start Date</label>
                 <ReactDatePicker
                    dateFormat='dd MMM yyyy'
                    className='border-[1px] border-secondary w-28 h-10 rounded-sm' 
                    selected={startDate} 
                    minDate={moment().year(currentDate.getFullYear() - 1).dayOfYear(1)._d}
                    onChange={(date) => handleStartDateSelection(date)} 
                /> 
            </div>
            <div className='-ml-8'>
                <label htmlFor="endDate" className="text-sm">End Date</label>
                 <ReactDatePicker 
                    dateFormat='dd MMM yyyy' 
                    className='border-[1px] border-secondary w-28 h-10 rounded-sm' 
                    selected={(startDateRadioSelection === "Full Day") ? endDate : startDate} 
                    readOnly= {startDateRadioSelection !== "Full Day"}
                    minDate={startDate}
                    onChange={(date) => handleEndDateSelection(date)} /> 
            </div>
        </div>
            
        <div className='mt-4 mr-8 flex gap-2' onChange={(e) => handleRadioSelection(e)}> 
         <input type="radio" id="fullDay" name="dateRangeRadio" className="radio-sm required" value="Full Day" defaultChecked/> Full Day 
            <input type="radio" id="AM" name="dateRangeRadio" className="radio-sm required" value="AM"/> AM
            <input type="radio" id="PM" name="dateRangeRadio" className="radio-sm required" value="PM"/> PM
        </div>
        { {numOfDaysApplied >= 0 &&
        <>
            <p className='text-sm mt-3'>{`You have selected ： ${numOfDaysApplied} day(s) of ${currentLeaveSelection}`}</p>
            {(numOfDaysApplied <= numOfSelectedLeave) && <p className='text-sm'>Balance of / : {numOfSelectedLeave - numOfDaysApplied} day(s) of {currentLeaveSelection}</p>}
            {(numOfDaysApplied > numOfSelectedLeave) && <p className='text-sm text-red-500'>Insufficient leave / </p>}
        </>
        }}


            <div className="my-1 mr-6">
                <label htmlFor="remarks" className="text-lg font-weight-900 label">Remarks</label>
                { <textarea 
                    id="remarks" 
                    className="py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                    placeholder="Reason (optional) " 
                    name="comment" 
                    rows="2"
                    onChange={(e) => setRemarks(e.target.value)}
                    ></textarea> }
                     <textarea 
                    id="remarks" 
                    className="py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                    placeholder="Reason (optional) " 
                    name="comment" 
                    rows="2" 
                    ></textarea>
            </div>
            {<div className='ml-12'>
                <label htmlFor="upload" className="text-lg font-weight-900 label -ml-1">Supporting documents /</label>
                <p className='text-xs'> MC is compulsory / </p>
                <input 
                    id='file'
                    name="file"
                    type="file" 
                    className="text-center text-sm mt-2"
                    onChange={onFileChange}
                />
            </div> }
            <div className="my-1">
                <label htmlFor="reportingEmail" className="text-lg font-weight-900 -ml-1 label">RO email </label>
                 <input 
                    id="reportingEmail" 
                    type="text" 
                    disabled 
                    className="input input-bordered input-primary w-full max-w-xs" 
                    style={{ width:"250px" }} 
                    value={currentUser.reportingEmail}/> 
                     <input 
                    id="reportingEmail" 
                    type="text" 
                    disabled 
                    className="input input-bordered input-primary w-full max-w-xs" 
                    style={{ width:"250px" }} 
                    />
            </div>
            <div className="my-1">
                <label htmlFor="coveringEmail" className="text-lg font-weight-900 -ml-1 label">CO email</label>
                <input 
                    id="coveringEmail" 
                    type="text" 
                    disabled 
                    className="input input-bordered input-primary w-full max-w-xs"
                    style={{ width:"250px" }} 
                    value={currentUser.coveringEmail}/> 
                     <input 
                    id="coveringEmail" 
                    type="text" 
                    disabled 
                    className="input input-bordered input-primary w-full max-w-xs"
                    style={{ width:"250px" }} 
                    />
            </div>
            <div className="flex items-center">
                <label className="cursor-pointer label -ml-1">
                     <input type="checkbox" checked={checkBoxStatus} onClick={() => setCheckBoxStatus(!checkBoxStatus)} className="checkbox checkbox-primary mr-2" /> 
                    <input type="checkbox"  className="checkbox checkbox-primary mr-2" />

                </label>
                <div>   
                     <p className="label-text whitespace-pre-line mt-4 mb-2">{`I declare that my covering officer has agreed\nto cover my duties during my leave period.`}</p> 
                    <p className="label-text">。</p>
                </div>

            </div>
            <button type="submit" className={`btn text-white mt-4 px-28 text-center text-base font-semibold shadow-md rounded-lg mt-4 ${applyBtnLoading}`}>
                Apply / 
            </button> 
        
    </form>
     {isLoading && <Loading/>} 
    </>
                
);

export default ApplyLeavePage

/*C'est une mise en page bien organisée qui facilite la soumission des demandes de congé par les utilisateurs, 
tout en fournissant toutes les informations nécessaires pour une demande de congé réussie. */