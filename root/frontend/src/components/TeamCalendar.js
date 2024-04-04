import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment-timezone'
import { useMainContext } from '../hooks/useMainContext'

function TeamCalendar() {/* afficher un calendrier avec les congés de l'équipe*/
    const {teamCalendar} = useMainContext()/*pour accéder aux données du calendrier de l'équipe (teamCalendar).*/

    const approvedTeamLeave = teamCalendar.filter(entry => entry.status === "approved")
    moment.tz.setDefault('Asia/Singapore')
    const localizer = momentLocalizer(moment)/*pour configurer la localisation des dates avec moment*/

    const eventPropGetter = (event) => {/*qui attribue une couleur de fond différente en fonction du type d'événement .*/
        let backgroundColor;
        switch (event.type) {
            case "holiday":
                backgroundColor = '#37C399'
                break;
            case "workday":
                backgroundColor = '#F77272'
                break;
            default:
                backgroundColor = '#3ABEF8';
        }
        return { style: { backgroundColor } }
    }

    return (
        <div className="flex flex-col justify-start items-center mt-[3%]">
            <Calendar /*propriétés nécessaires de calendar*/
            localizer={localizer}
            events={approvedTeamLeave}
            startAccessor="start"
            endAccessor="end"
            showAllEvents
            style={{ height: 700, width: "80%"}}/*hauteur ,largeur de calendar*/
            view='month' views={['month']}
            eventPropGetter={eventPropGetter}
            />
        </div>
    )
}

export default TeamCalendar