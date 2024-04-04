import React from 'react'

function InfoBubble({info}) {
  return (
    <div className="tooltip tooltip-left whitespace-pre-line z-50" data-tip={info}>
            <span className="badge badge-secondary badge-outline px-2 py-0 rounded-md text-xs z-40">More Info / 更多信息 </span>
    </div>
  )
}
/*vous pouvez afficher une bulle d'information contextuelle en passant simplement le texte que 
vous souhaitez afficher en tant que prop info. */

export default InfoBubble