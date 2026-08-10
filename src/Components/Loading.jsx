import React from 'react'
import img from '../assets/car_loading.gif'


function Loading() {
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%",}}>
        <img src={img} alt="Loading img" />
    </div>
  )
}

export default Loading