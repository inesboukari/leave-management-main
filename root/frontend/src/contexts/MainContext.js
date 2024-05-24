import { createContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';/*fichier JavaScript indique que le développeur prévoit d'utiliser Axios, pour effectuer des requêtes HTTP*/ 
import { toast } from 'react-toastify'
import openSocket from 'socket.io-client'/* indique que le développeur prévoit d'utiliser Socket.IO pour établir une connexion en temps réel entre le client et le serveur.*/

export const MainContext = createContext()/*pour utiliser d'autre partie d'app*/

export const MainContextProvider = ({ children }) => {/*le composant MainContextProvider en tant que composant fonctionnel. Il reçoit les children en tant que prop */
  const [activeTab, setActiveTab] = useState("Home") 
  const [currentUser, setCurrentUser] = useState()
  const [userList, setUserList] = useState([])
  const [isAdmin, setIsAdmin] = useState()

  const [currentLeaveSelection, setCurrentLeaveSelection] = useState("Annual Leave ")
  const [currentEditUser, setCurrentEditUser] = useState()
  const [sessionToken, setSessionToken] = useState(() => {
    let token =  sessionStorage.getItem('leaveMgtToken')
    if(token) return token
    else return ""
  })

  const [authState, setAuthState] = useState(false) /*useState=etat*/;

  const [currentLeaveEntitlement, setCurrentLeaveEntitlement] = useState()/* État utilisé pour stocker les droits actuels aux congés*/

  const isFirstRender = useRef(true) /*Référence utilisée pour suivre si le composant est rendu pour la première fois ou non.*/

  const fetchUserList = async () => {/*Fonction utilisée pour récupérer la liste des utilisateurs à partir du backend */
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getAllUsers`)
      .then(resp =>{ 
        setUserList(resp.data)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("failed to retrieve all users info")
      })
  }


  const fetchCurrentUserInfo = async (currentUser) =>{/*fonction  utilisée pour récupérer les informations de l'utilisateur actuellement connecté à partir du backend*/
      console.log("fetchCurrentUserInfo triggered")
      axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getUser/${currentUser._id}`)
      .then(resp =>{
        console.log(resp)
        setCurrentUser(resp.data)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("Failed to fetch current user info")
      })
  }

  const fetchLeaveEntitlement = () => {/* fonction utilisée pour récupérer les informations sur les congés disponibles à partir du backend*/
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/admin/get-leave-entitlement`)
      .then(resp =>{ 
        console.log("resp from fetching leave entitlement: ", resp)
        setCurrentLeaveEntitlement(resp.data.leaveEntitlement)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("failed to retrieve leave entitlement data")
      })
  }

  const validateSession = () => {/*Cette fonction est utilisée pour valider la session de l'utilisateur*/
    if(sessionToken){
      const url = `${process.env.REACT_APP_BACKENDURL}/validate-session`
      axios
      .post(url, {sessionId: sessionToken})
      .then((user) => {
          // set user as current user
          setCurrentUser(user.data)
        })
        .catch(err => console.log(err))
      }
      setTimeout( () => setAuthState(true), 1000)
      // setAuthState(true)
  }

  const openSocketConnection = (teamCalendar) => {/* fonction utilisée pour ouvrir une connexion Socket.IO avec le backend de l'application*/
      console.log("open socket fx executed!")
      console.log("teamcalendar", teamCalendar)
      const socket = openSocket(process.env.REACT_APP_BACKENDURL)

      socket.on('calendar', data => {
        if(data.action === 'create'){
          // console.log("socket data", data)
          // console.log("team calendar (before addition): ", teamCalendar)
          setTeamCalendar((teamCalendar) => [...teamCalendar, data.calendarRecord])
          // console.log("team calendar (after): ", teamCalendar)
        }

        if(data.action === 'delete'){
          // console.log("deleted data", data)
          const deletedRecord = data.calendarRecord
          console.log("deletedRecord: ", deletedRecord)
          console.log("teamCalendar: ", teamCalendar)
          const deletedCalendarRecord = teamCalendar.filter(record => 
                                                              (record.startDateUnix === deletedRecord.startDateUnix &&
                                                              record.endDateUnix === deletedRecord.endDateUnix &&
                                                              record.staffName === deletedRecord.staffName)
                                                            )
          console.log("deletedCalendarRecord: ", deletedCalendarRecord)                                                      
          // console.log("updatedCalendarRecord: ", teamCalendar.filter(record => record.id !== deletedCalendarRecord[0].id))
          // console.log("team calendar (before deleting): ", teamCalendar)

          if (deletedCalendarRecord.length){
            setTeamCalendar((teamCalendar) => teamCalendar.filter(record => record.id !== deletedCalendarRecord[0].id))                                     
          }
          else{
            window.location.reload();
          }
          // console.log("team calendar (after): ", teamCalendar)
        }
      })
    }

  const validateEmail = (email) => {/*Cette fonction est utilisée pour valider le format d'une adresse e-mail*/
    let regex = /\S+@\S+\.\S+/;
    return regex.test(email); // returns true if email is valid
  }

  useEffect(()=>{/* le hook useEffect de React pour effectuer plusieurs opérations lorsqu'un composant est monté ou mis à jour*/
    fetchUserList()
    fetchLeaveEntitlement()
    validateSession()

    console.log("use effect triggered")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainContext.Provider value={{/*C'est le composant fourni par React pour fournir le contexte aux composants enfants*/
      activeTab, // Onglet actif dans l'interface utilisateur.
      authState,//État de l'authentification de l'utilisateur
      currentEditUser,//Utilisateur actuellement en cours d'édition
      currentLeaveSelection,//Sélection actuelle du type de congé.
      currentUser,//Utilisateur actuellement connecté.
      currentHolidaySelection,//Sélection actuelle des jours fériés
      currentLeaveEntitlement,//: Droits actuels aux congés.
      isAdmin,// Indique si l'utilisateur est un administrateur
      sessionToken,
      userList,
      currentWorkdaySelection,
      //Fonctions utiles à utiliser dans les composants enfants.
      fetchCurrentUserInfo,
      fetchLeaveEntitlement,
      fetchUserList,
      openSocketConnection,
      //Fonctions pour mettre à jour les états correspondants
      setActiveTab,
      setCurrentEditUser,
      setCurrentLeaveSelection,
      setCurrentUser,
      setCurrentHolidaySelection,
      setIsAdmin,
      setSessionToken,
      setCurrentWorkdaySelection,
      validateEmail

     }}>
  
      { children }
    </MainContext.Provider>
  )//C'est l'endroit où les composants enfants encapsulés par MainContextProvider seront rendus

}

export default MainContext