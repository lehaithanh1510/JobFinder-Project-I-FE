import { useContext } from 'react'
import {Button} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../../App'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import FolderIcon from '@material-ui/icons/Folder'
import VpnKeyIcon from '@material-ui/icons/VpnKey'

function JobTitleCard({title,logo,location,salary,id,keywords,categories,owner,active}){
    const {user,role} = useContext(AuthContext)
    const history = useHistory()
 
    const handleClick = () => {
        if(!user) return history.push("/signin")
        history.push(`/apply/${id}`)
    }

    const redirectCompany = () => {
        history.push(`/company/${owner}`)
    }

    const renderItems = (items) => {
        if(!items) return <p></p>
        return items.map((item,index) => (
            index !== items.length-1 ? <p className="ml-2" key={index}>{item}, </p> : <p className="ml-2" key={index}>{item} </p>
        ))
    }
 
    return(
        <>
            <div className="row pb-2" style={{ borderBottom: "0.5px solid black", marginTop: "6rem" }}>
                <div className="col-md-3">
                    <img src={logo} style={{ width: '100%' }}/>
                </div>
                <div className="col-md-9">
                    <div className="d-flex justify-content-start">
                        <h2>{title}</h2>
                    </div>
                    <div className="d-flex justify-content-start mb-2">
                        <AttachMoneyIcon />
                        {salary}
                    </div>
                    <div className="d-flex justify-content-start">
                        <LocationOnIcon />
                        {renderItems(location)}
                    </div>
                    <div className="d-flex justify-content-start">
                        <FolderIcon />
                        {renderItems(categories)}
                    </div>
                    <div className="d-flex justify-content-start">
                        <VpnKeyIcon />
                        {renderItems(keywords)}
                    </div>
                    {((role!=='employer' || !role) && active) && <Button variant="primary" onClick={handleClick}>Apply Job</Button>}
                    <Button variant="info" className="ml-3" onClick={redirectCompany}>View Company</Button>
                </div>
            </div>
        </>
    )
}

export default JobTitleCard