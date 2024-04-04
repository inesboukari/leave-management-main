import React from 'react'
import { useMainContext } from '../../hooks/useMainContext';

function RadioSelection({id, radioType}) {/*génère un groupe de boutons radio en fonction du type de radio spécifié */
    const {setIsAdmin} = useMainContext()
    const leaveDateRadio = ["AM", "PM", "Full Day"]
    const accountTypeRadio = ["user", "admin"]
    let radioContent;

    switch (radioType) {/*leaveDateRadio et accountTypeRadio: Ce sont des tableaux contenant les options possibles pour les boutons radio en fonction du type spécifié.*/
        case "leaveDateRadio":
            radioContent = leaveDateRadio
            break;
        case "accountTypeRadio":
            radioContent = accountTypeRadio
            break;
        default:
            console.log("invalid table header provided!")
            break;
    }

    return (
    <div id={id} className="form-control">
        {radioContent.map((content) => 
        (<div className='flex mt-1'>
            <input type="radio" name={id} className="radio-sm required" value={content} onChange={(e) => setIsAdmin(content)}/>
            <span className="label-text">{content}</span> 
        </div>)
        )}
    </div>
    )/*Lorsqu'un bouton radio est sélectionné, il appelle la fonction setIsAdmin du contexte principal avec la valeur correspondante.*/
}/*. on déclenche l'événement onChange qui appelle la fonction setIsAdmin avec la valeur correspondante du bouton radio sélectionné.*/

export default RadioSelection