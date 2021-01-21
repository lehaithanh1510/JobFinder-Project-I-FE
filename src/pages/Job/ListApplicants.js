import MainLayout from '../../components/Layout/MainLayout'
import {useParams, Redirect} from 'react-router-dom'
import {ListGroup, Nav, Button, DropdownButton, Dropdown, Badge} from 'react-bootstrap'
import api from '../../api/api'
import { useEffect, useState, useContext } from 'react'
import {AuthContext} from '../../App'
import {parseISO} from 'date-fns'

function ListApplicants(){
    const {user} = useContext(AuthContext)
    const {id} = useParams()
    const [post,setPost] = useState(null)
    const [filter, setFilter] = useState("all")

    const getDetailPost = async(id) => {
        try {
            const res = await api({
                url:`/post/private/${id}`,
                method:'GET'
            }) 
            if(res.success){
                setPost(res.data)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const rejectApplication = async (appId) => {
        try {
            const res = await api({
                url:`/application/${appId}`,
                method:'PATCH',
                data:{active:'rejected'}
            }) 
            if(res.success){
                getDetailPost(id)
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    const shortlistApplication = async (appId) => {
        try {
            const res = await api({
                url:`/application/${appId}`,
                method:'PATCH',
                data:{active:'shortlisted'}
            }) 
            if(res.success){
                getDetailPost(id)
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    const renderPosts = (posts) => {
        return posts.map((post,index) => <ListGroup.Item key={index}>
            <div>
                <strong>Applicant message:</strong> 
                <p className="mt-2">{post.message}</p>
            </div>
            <div>
                <strong>Applicant CV:</strong>
                <Nav.Link href={post.resume.link} target="_blank">Click here to download</Nav.Link>
            </div>
            <div>Created At: {parseISO(post.createdAt).toString()}</div>
            <div>
                {post.active === 'pending' && 
                    <div className="d-flex mt-2">
                        <Button className="mr-4" variant="danger" onClick={() => rejectApplication(post._id)}>Reject this application</Button>
                        <Button variant="info" onClick={() => shortlistApplication(post._id)}>Shortlist Application</Button>
                    </div>
                }
                {post.active === 'rejected'  && <Badge variant="secondary">Rejected</Badge>}
                {post.active === 'shortlisted' &&  <Badge variant="success">Shortlisted</Badge>}
            </div>
        </ListGroup.Item>
        )
    }

    useEffect(() => {

        getDetailPost(id)

    },[])

    if(post && post.owner !== user._id) return <Redirect to='/' />

    return(
        <MainLayout>
            <div className="d-flex justify-content-end">
                <DropdownButton variant="secondary" title="Filter Applications" className="ml-5 mr-5 mt-5 pl-5 pr-5 pt-5">
                    <Dropdown.Item onClick={() => {setFilter("all")}}>All Applications</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setFilter("active")}}>Pending Applications</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setFilter("rejected")}}>Rejected Applications</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setFilter("shortlisted")}}>Shortlisted Applications</Dropdown.Item>
                </DropdownButton>
            </div>
            <ListGroup className="ml-5 mr-5 p-5" variant="flush">
                <h2>{post && post.title}</h2>
                <div className="list-applicants">
                    {(post && filter === "all") && renderPosts(post.applications)}
                    {(post && filter === "active") && renderPosts(post.applications.filter(app => app.active === 'pending'))}
                    {(post && filter === "rejected") && renderPosts(post.applications.filter(app => app.active === 'rejected'))}
                    {(post && filter === "shortlisted") && renderPosts(post.applications.filter(app => app.active === 'shortlisted'))}
                </div>
            </ListGroup>
        </MainLayout>
    )
}

export default ListApplicants