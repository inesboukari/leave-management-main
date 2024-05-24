import React from 'react'
import { Link } from 'react-router-dom'
import Tab from '../components/layout/Tab'
import Table from '../components/layout/Table'
import { useMainContext } from '../hooks/useMainContext'

function Homepage() {
    {/* useMainContext pour déterminer le contenu à afficher en fonction de l'onglet actif sélectionné */}
    {/* activeTabSelection utilise  pour obtenir les valeurs de activeTab et currentUser */}
    const {activeTab, currentUser} = useMainContext()

    const activeTabSelection = (activeTab) => {
        switch (activeTab) {
            case "Home ":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave Request </h1>
                    <Table headerType="request"/>
                </>)
            case "Entitlement":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave Entitlement </h1>
                    <Table headerType="entitlement"/>
                </>)
            case "History ":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave History </h1>
                    <Table headerType="history"/>
                </>)
            default:
                console.log("tab not found!")
                break;
        }
    }

    return (
    <div>
        <div className='flex justify-between'> 
        {/*s'il est administrateur (admin), le bouton est désactivé  */}
            <Tab/>  
            {currentUser.isAdmin === "admin" ? 
                <button className='btn btn-disabled rounded-md mt-6 mr-6 px-6 text-lg'>Apply Leave </button>
            :   <Link to="/apply-leave"><button className='btn bg-black rounded-md mt-6 mr-6 px-6 text-lg'>Apply Leave </button></Link>
            }
        </div>
        {/* apply leave un bouton pour demander un congé */}
        {/* based on user action, display active tab in homepage */}
        {
            activeTabSelection(activeTab)
        }

    </div>
    )
}

export default Homepage