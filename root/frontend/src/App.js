import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";/* Composants de react-router-dom pour la gestion des routes. */
import Navbar from "./components/layout/Navbar";/*a barre de navigation de l'application */
import ApplyLeavePage from "./pages/ApplyLeavePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";/*l'importation  de tous les pages d'app*/
import UserManagementPage from "./pages/UserManagementPage";
import UpdateUserInfoPage from "./pages/UpdateUserInfoPage";
import CreateUserPage from "./pages/CreateUserPage";
import ChangeLogPage from "./pages/ChangeLogPage";
import AdminRoute from "./components/private/AdminRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMainContext } from "./hooks/useMainContext";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";
import CreateNewLeave from "./pages/CreateNewLeave";
import ApproveLeavePage from "./pages/ApproveLeavePage";
import SkeletonLoader from "./components/layout/SkeletonLoader";
import LoggedInRoute from "./components/private/LoggedInRoute";
import NotFoundPage from "./pages/NotFoundPage";
import SetWorkdayPage from "./pages/SetWorkdayPage";
import DashboardPage from "./pages/DashboardPage";
import TeamCalendarPage from "./pages/TeamCalendarPage";
import LoginRoute from "./components/private/LoginRoute";
import ResetDatabasePage from "./pages/ResetDatabasePage";
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import SetLeaveEntitlementPage from "./pages/SetLeaveEntitlementPage";
import DeleteLeaveType from "./pages/DeleteLeaveType";

{/* vérifie si l'application est en mode production */}
{/*disableReactDevTools() semble être une fonction personnalisée qui désactive les outils de développement de React. */}
 {/* authStata pour obtenir l'état d'authentification de l'utilisateur*/}
 
if (process.env.NODE_ENV === 'production') { disableReactDevTools() }
function App() {
  const {authState} = useMainContext()  
  
  return (
    <>
      {!authState && <SkeletonLoader/>}{/* si authState est faux, le composant <SkeletonLoader/> sera rendu, sinon il ne le sera pas. */}
      {authState && (
        <Router>
          <Navbar/>
          <Routes>
            <Route path = '/change-password' element={<ChangePasswordPage/>}/>
            <Route path = '/set-new-password/:token' element={<SetNewPasswordPage/>}/>
            <Route path = '/*' element={<NotFoundPage/>}/>

            {/* logged in routes */}
            <Route path = '/login' element={<LoginRoute/>}>{/*est défini une seule fois */}
              <Route path = '/login' element={<LoginPage/>}/>{/* */}
            </Route>

            <Route path = '/' element={<LoggedInRoute/>}>
              <Route path = '/' element={<Homepage/>}/>
            </Route>

            <Route path = '/apply-leave' element={<LoggedInRoute/>}>
              <Route path = '/apply-leave' element={<ApplyLeavePage/>}/>
            </Route>
            <Route path = '/profile' element={<LoggedInRoute/>}>
              <Route path = '/profile' element={<ProfilePage/>}/>
            </Route> {/*deux routes distinctes sont définies pour le même chemin'/apply-leave',et chacune rendra son propre élément */}
            <Route path = '/team' element={<LoggedInRoute/>}>
              <Route path = '/team' element={<TeamCalendarPage/>}/>
           </Route>

            {/* adm0in routes */}
            <Route path = '/create-user' element={<AdminRoute/>}>
              <Route path = '/create-user' element={<CreateUserPage/>}/>
            </Route>
            <Route path = '/change-log' element={<AdminRoute/>}>
              <Route path = '/change-log' element={<ChangeLogPage/>}/>
            </Route>
            <Route path = '/update-user' element={<AdminRoute/>}>
              <Route path = '/update-user' element={<UpdateUserInfoPage/>}/>
            </Route>
            <Route path = '/user-management' element={<AdminRoute/>}>
              <Route path = '/user-management' element={<UserManagementPage/>}/>
            </Route>
            <Route path = '/create-new-leave' element={<AdminRoute/>}>
              <Route path = '/create-new-leave' element={<CreateNewLeave/>}/>
            </Route>
            <Route path = '/create-new-leave' element={<AdminRoute/>}>
              <Route path = '/create-new-leave' element={<CreateNewLeave/>}/>
            </Route>
            <Route path = '/delete-leave-type' element={<AdminRoute/>}>
              <Route path = '/delete-leave-type' element={<DeleteLeaveType/>}/>
            </Route>
            <Route path = '/approve-leave' element={<AdminRoute/>}>
              <Route path = '/approve-leave' element={<ApproveLeavePage/>}/>
            </Route>
            <Route path = '/set-work-day' element={<AdminRoute/>}>
              <Route path = '/set-work-day' element={<SetWorkdayPage/>}/>
            </Route>
            <Route path = '/set-leave-entitlement' element={<AdminRoute/>}>
              <Route path = '/set-leave-entitlement' element={<SetLeaveEntitlementPage/>}/>
            </Route>
            <Route path = '/dashboard' element={<AdminRoute/>}>
              <Route path = '/dashboard' element={<DashboardPage/>}/>
            </Route>
            <Route path = '/clean-slate' element={<AdminRoute/>}>
              <Route path = '/clean-slate' element={<ResetDatabasePage/>}/>
            </Route>
          </Routes>
        </Router>
      )}
        <ToastContainer/>{/*composont utilisé pour afficher les notifications ou les toasts dans votre application */}
    </>
  );
}

export default App;
