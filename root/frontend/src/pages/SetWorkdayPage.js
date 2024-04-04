import React, { useState } from 'react'
import { Calendar } from "react-multi-date-picker"
import { toast } from 'react-toastify';
import axios from 'axios';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { useMainContext } from '../hooks/useMainContext';
import Loading from '../components/Loading';


/* Les administrateurs peuvent sélectionner les jours de travail en cliquant sur les dates dans le calendrier affiché */
/*les administrateurs peuvent sélectionner les jours fériés en cliquant sur les dates dans le deuxième calendrier affiché */
/* Une fois que les administrateurs ont sélectionné les jours de travail et les jours fériés souhaités, ils peuvent appuyer sur ce bouton pour soumettre les modifications.
 Cela déclenche l'envoi des données mises à jour au serveur. */

function SetWorkdayPage() {
    const {currentHolidaySelection, setCurrentHolidaySelection, currentWorkdaySelection, setCurrentWorkdaySelection} = useMainContext()
    const date = new Date()

    const [disableUpdateButton, setDisableUpdateButton] = useState(true)
    const [updateBtnLoading] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [initialHolidaySelection, setInitialHolidaySelection] = useState(currentHolidaySelection)
    const [initialWorkdaySelection, setInitialWorkdaySelection] = useState(currentWorkdaySelection)

    const handleWorkDaySelection = (date) => {
        setCurrentWorkdaySelection(date)
        setDisableUpdateButton(false)
    }
    
    const handleHolidaySelection = (date) => {
        // console.log("updated holiday dates: ", date)
        setCurrentHolidaySelection(date)
        setDisableUpdateButton(false)
    }

    // console.log("currentWorkdaySelection: ",currentWorkdaySelection)
    // console.log("currentHolidaySelection: ",currentHolidaySelection)
    const handleSubmitChange = () => {

        const url = `${process.env.REACT_APP_BACKENDURL}/admin/set-work-day`

        const workdayData = {
            initialWorkdaySelection: initialWorkdaySelection,
            initialHolidaySelection: initialHolidaySelection,
            currentWorkdaySelection: currentWorkdaySelection,
            currentHolidaySelection: currentHolidaySelection,
            entity: "chengdu" 
        }
        
        console.log("workdayData: ", workdayData)

        if(window.confirm("Update changes?")){
            setIsLoading(true)
            
            setTimeout(()=> {
                axios
                .post(url, workdayData)
                .then((res => {
                    setIsLoading(false)
                    // set new initial workday and holiday after updated selection is successfully sent to server
                    setInitialWorkdaySelection(currentWorkdaySelection)
                    setInitialHolidaySelection(currentHolidaySelection)
                    console.log(res)
                    toast.success("Update successful")
                    }))
                .catch(err => {
                    setIsLoading(false)
                    if(err.response.status === 400){
                        setIsLoading(false)
                        return toast.error("A day cannot be both a workday and holiday!")
                    }
                    console.log("err: ", err)
                    toast.warning("Update failed")
                })
            }, 1000)
            setDisableUpdateButton(true)
        }
    }

    return (
    <div className=''>
        <div className='flex flex-col justify-start items-center'>
            <h1 className='text-xl mt-6 text-center'>Work Days 补休</h1>
            <p className='my-2 text-center'>The following days are work days in {date.getFullYear()}:</p>
            <Calendar
                
                multiple
                numberOfMonths={3}
                format='DD MMM YYYY'
                value={currentWorkdaySelection}
                onChange={handleWorkDaySelection}
                className=''
                plugins={[<DatePanel position="left" sort="date" header={`Work Days (${currentWorkdaySelection.length})`}/>]} 
            />
        </div>
        <div className='flex flex-col justify-start items-center'>
            <h1 className='text-xl mt-6 text-center'>Public Holidays</h1>   
            <p className='mt-2 mb-4'>The following days are rest days / off in lieu in {date.getFullYear()}:</p>
                <Calendar
                    multiple
                    numberOfMonths={3}
                    format='DD MMM YYYY'
                    value={currentHolidaySelection}
                    onChange={handleHolidaySelection}
                    plugins={[<DatePanel 
                                position="left" 
                                sort="date" 
                                header={`Off in lieu (${currentHolidaySelection.length})`}
                            />]}
                />
        </div>

        <div className='flex flex-col justify-start items-center'>
                <button 
                    type="submit" 
                    className={`btn text-white px-32 text-center text-base font-semibold shadow-md rounded-lg mt-6 ${updateBtnLoading}`}
                    disabled={disableUpdateButton}
                    onClick={handleSubmitChange}
                >
                    Update
                </button>
        </div>
        {isLoading && <Loading/>}
    </div>
    )
}

export default SetWorkdayPage