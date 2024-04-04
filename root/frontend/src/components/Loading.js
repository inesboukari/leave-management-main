import React from 'react'
import pandaslide from '../components/assets/pandaslide.gif'

function Loading() {
  return (
    <div style={{ position: "absolute", left:"0px", right:"0px", top:"0px", bottom:"0px", height: "120%", alignItems:"center", justifyContent:"center", zIndex: "998", backgroundColor: "#68AE9B", opacity: "0.8"}}>
        <img
        src={pandaslide}
        alt='Loading...'
        style={{ width: '400px', margin: "auto", marginTop: "15%" }}
        />
        <p className='text-center -mt-10 text-lg'>loading...</p>
    </div>
  )
}

export default Loading