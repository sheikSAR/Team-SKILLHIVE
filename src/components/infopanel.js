import React from 'react'
import {Button} from 'react-bootstrap'
import '../styles/InfoPanel.css'

function InfoPanel({address,name}){
    return(
        <div className="info-panel">
        <div className="panel-left">
            <h4 className="welcome-text">Welcome {name || null}</h4>
            <p className="address-text">Address: {address || null}</p>
        </div>
    </div>
    )
}

export default InfoPanel
