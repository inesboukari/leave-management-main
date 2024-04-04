import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {useMainContext} from '../../hooks/useMainContext'


function Tab() {/*Ce composant React, appelé Tab, est utilisé pour afficher des onglets de navigation basés sur l'URL de la page*/
    const {activeTab, setActiveTab} = useMainContext()
    const homePageTabs = ["Home 主页", "Entitlement 年额", "History 历史"]/*tableau*/
    const approvalPageTabs = ["Pending", "Approved"]/*tableau*/
    const location = useLocation()/*est utilisé pour obtenir l'URL de la page actuelle.*/

    const handleActiveTabClick = (event) => {/* Cette fonction est appelée lorsqu'un onglet est cliqué*/
        setActiveTab(event.target.id)
    }

    const activePageTabs = () => {/*Cette fonction détermine les onglets à afficher en fonction de l'URL de la page actuelle*/
        switch (location.pathname) {
            case "/":
                return (    
                <div className="tabs">
                    {homePageTabs.map(tab => <Link /*Les onglets sont affichés en utilisant des éléments Link de React Router*/                        to='' 
                        key={tab} 
                        id={tab} 
                        className={activeTab === tab ? 'tab tab-lifted tab-active text-lg' : 'tab tab-lifted text-lg'} 
                        onClick={handleActiveTabClick}>{tab}</Link> )}
                </div>)
            case "/approve-leave":
                return (    
                    <div className="tabs">
                        {approvalPageTabs.map(tab => <Link 
                            to='' 
                            key={tab} 
                            id={tab} 
                            className={activeTab === tab ? 'tab tab-lifted tab-active text-lg' : 'tab tab-lifted text-lg'} 
                            onClick={handleActiveTabClick}>{tab}</Link> )}
                    </div>)
            default:
                console.log("tab not found!")
                break;
        }
    }

    return (
        <>
            {activePageTabs()}
        </>
    )/*Le composant retourne les onglets actifs pour la page actuelle*/
}

export default Tab