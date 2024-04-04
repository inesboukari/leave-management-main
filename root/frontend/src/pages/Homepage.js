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
            case "Home 主页":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave Request 休假请求</h1>
                    <Table headerType="request"/>
                </>)
            case "Entitlement 年额":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave Entitlement 休假数</h1>
                    <Table headerType="entitlement"/>
                </>)
            case "History 历史":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave History 休假历史</h1>
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
                <button className='btn btn-disabled rounded-md mt-6 mr-6 px-6 text-lg'>Apply Leave 申请休假</button>
            :   <Link to="/apply-leave"><button className='btn bg-black rounded-md mt-6 mr-6 px-6 text-lg'>Apply Leave 申请休假</button></Link>
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