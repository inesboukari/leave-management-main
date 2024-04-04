import React from 'react'
import { useMainContext } from '../../hooks/useMainContext'

function Select({options}) {
  const {setCurrentLeaveSelection} = useMainContext()
  return (
    <select className="select select-secondary w-full max-w-xs" onChange={(e)=> setCurrentLeaveSelection(e.target.value)}>
        {options.map(leaveName => <option>{leaveName}</option>)}
    </select>
  )
}
/* ce composant permet de créer une liste déroulante avec des options dynamiques à partir d'un tableau donné. Lorsqu'une option est sélectionnée, 
elle met à jour l'état currentLeaveSelection dans le contexte principal en utilisant la fonction setCurrentLeaveSelection.
 Cela rend le composant flexible et réutilisable dans différentes parties de votre application où vous avez besoin d'une sélectio */

export default Select