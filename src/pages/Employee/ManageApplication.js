import CustomNavbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import {ListGroup, Nav, Badge, DropdownButton, Dropdown} from 'react-bootstrap'
import {Redirect, useHistory} from 'react-router-dom'
import {AuthContext} from '../../App'
import api from '../../api/api'
import CustomPagination from '../../components/Pagination/Pagination'
import {useContext, useState, useEffect} from 'react'
import {parseISO} from 'date-fns'

function ManageApplication(){
    const [apps, setApps] = useState([])
    const [page, setPage] = useState(1) 
    const [total, setTotal] = useState(0)
    const [limit, setLimit] = useState(8)
    const [filter, setFilter] = useState("all")
    const {user, role} = useContext(AuthContext)
    const history = useHistory()

    const fetchApplications = async() => {
        const params = {page,limit}
        const res = await api({
            url:'/application',
            method:'GET',
            params
        })
        if(res.success) {
            setApps(res.data.applications)
            setTotal(res.data.total)
        }
    }

    const onChangePage = (page) => {
        setPage(page)
    }

    const renderApplications = (applications) => {
        return applications.map(application => <ListGroup.Item key={application._id}>
            <div onClick={() => history.push(`/post/${application.job._id}`)}><h3 style={{ cursor:"pointer"}}>{application.job.title}</h3></div>
            <strong>Your CV: </strong><Nav.Link href={application.resume.link} target="_blank">{application.resume.title}</Nav.Link>
            <div><strong>Submited At: </strong> {parseISO(application.createdAt).toString()}</div>
            <strong>Status: </strong>
            {application.active === 'pending' && <Badge variant='warning'>Pending</Badge>}
            {application.active === 'rejected' && <Badge variant='secondary'>Rejected</Badge>}
            {application.active === 'shortlisted' && <Badge variant='success'>Shortlisted</Badge>}
        </ListGroup.Item>
        )
    }
    
    useEffect(() => {
        fetchApplications()
    },[page])
    
    if(!user || role === 'employer') return <Redirect to='/' />
    
    return(
        <>
            <CustomNavbar />
                <div className="d-flex justify-content-end">
                    <DropdownButton variant="secondary" title="Filter Applications" className="ml-5 mr-5 mt-5 pl-5 pr-5 pt-5">
                        <Dropdown.Item onClick={() => {setFilter("all")}}>All Applications</Dropdown.Item>
                        <Dropdown.Item onClick={() => {setFilter("pending")}}>Pending Applications</Dropdown.Item>
                        <Dropdown.Item onClick={() => {setFilter("rejected")}}>Rejected Applications</Dropdown.Item>
                        <Dropdown.Item onClick={() => {setFilter("shortlisted")}}>Shortlisted Applications</Dropdown.Item>
                    </DropdownButton>
                </div>
                <ListGroup className='ml-5 mr-5 p-5' variant="flush">
                    {filter === "all" && renderApplications(apps)}
                    {filter === "pending" && renderApplications(apps.filter(app => app.active === 'pending'))}
                    {filter === "rejected" && renderApplications(apps.filter(app => app.active === 'rejected'))}
                    {filter === "shortlisted" && renderApplications(apps.filter(app => app.active === 'shortlisted'))}
                </ListGroup>
                <CustomPagination
                    current={page}
                    total={total}
                    onChangePage={onChangePage}
                    limit={limit}
                />
            <Footer />
        </>
    )
}

export default ManageApplication