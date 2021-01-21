import parse from 'html-react-parser'
import LocationOnIcon from '@material-ui/icons/LocationOn'

function CompanyTitleCard({title,location,description,logo}){

    const renderLocations = (locations) => {
        if(!location) return <p></p>
        return locations.map((location,index) => (
            index !== locations.length-1 ? <p className="mr-2" key={index}><strong>{location}, </strong></p> : <p className="mr-2" key={index}><strong>{location} </strong></p>
        ))
    }

    return(
        <div className="row" style={{ borderBottom: "0.5px solid black", marginTop: "6rem" }}>
            <div className="col-md-3">
                <img src={logo} alt="" style={{ width: '100%' }}/>
            </div>
            <div className="col-md-9">
                <div className="d-flex justify-content-start">
                    <h1>{title}</h1>
                </div>
                <div className="d-flex justify-content-start">
                    <LocationOnIcon />
                    {renderLocations(location)}
                </div>
                <p className="mr-5">{description && parse(description)}</p>
            </div>
        </div>
    )
}

export default CompanyTitleCard