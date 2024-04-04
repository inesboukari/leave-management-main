import MainContext from "../contexts/MainContext"
import { useContext } from "react"

export const useMainContext = () => {
  const context = useContext(MainContext)

  if(!context) {
    throw Error('useMainContext must be used inside MainContextProvider')
  }

  return context
}
/*Ce hook personnalisé (useMainContext) simplifie l'accès au contexte principal dans les composants de l'application,
 en cachant la logique de récupération du contexte et en fournissant une interface simple pour y accéder.*/

/*Les hooks sont des fonctions spéciales fournies par React qui permettent aux développeurs d'utiliser l'état 
et d'autres fonctionnalités de React à l'intérieur des composants fonctionnels*/