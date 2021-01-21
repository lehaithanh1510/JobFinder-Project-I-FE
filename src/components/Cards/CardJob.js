import {Card, Button, Badge} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import convertVND from '../../utils/convertVND'

function CardJob({title, salary, locations, logo, id, active}){ 
    const history = useHistory()
    
    const redirectDetail = (postId) => {
        history.push(`/post/${postId}`)
    }

    const renderItems = (items) => {
        if(!items) return <p></p>
        return items.map((item,index) => (
            index !== items.length-1 ? <p className="ml-2" style={{ fontSize: '13px' }} key={index}>{item}, </p> : <p className="ml-2" style={{ fontSize: '13px' }} key={index}>{item} </p>
        ))
    }
    
    return (
        <Card style={{ width: '18rem' }} className="ml-2 mr-2 mt-2 mb-2">
            <Card.Img variant="top" src={logo} height="200px" />
            <Card.Body>
                <Card.Title style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{title}</Card.Title>
                <Card.Text><AttachMoneyIcon /> {convertVND(salary)}</Card.Text>
                <Card.Text className="d-flex justify-content-start"><LocationOnIcon /> {renderItems(locations)}</Card.Text>
                <Card.Text>
                    {active ? <Badge pill variant="info">Open</Badge> : <Badge pill variant="danger">Closed</Badge>}
                </Card.Text>
                <Button variant="primary" onClick={() => redirectDetail(id)}>View Job</Button>
            </Card.Body>
        </Card>
    )
}

export default CardJob