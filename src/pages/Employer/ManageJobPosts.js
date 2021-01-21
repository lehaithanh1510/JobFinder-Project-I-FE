import MainLayout from '../../components/Layout/MainLayout'
import api from '../../api/api'
import {ListGroup, Button, DropdownButton, Dropdown, Badge} from 'react-bootstrap'
import {Redirect, useHistory} from 'react-router-dom'
import {useState, useEffect, useContext} from 'react' 
import {AuthContext} from '../../App'
import {parseISO} from 'date-fns'
import CustomPagination from '../../components/Pagination/Pagination'

function ManageJobPosts(){
    const [posts,setPosts] = useState([])
    const [page, setPage] = useState(1) 
    const [total, setTotal] = useState(0)
    const [limit, setLimit] = useState(12)
    const [filter, setFilter] = useState("all")
    const {user,role} = useContext(AuthContext)
    const history = useHistory()

    const fetchPosts = async() => {
        const params = {page,limit,company:user._id}
        try {
            const res = await api({
                url:'/post',
                method:'GET',
                params
            }) 
            if(res.success){
                setPosts(res.data.posts)
                setTotal(res.data.total)
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    const closeJob = async(id) => {
        try {
            const res = await api({
                url:`/post/${id}`,
                method:'PATCH',
                data:{active:false}
            })
            if(res.success){
                fetchPosts()
            }
            
        } catch (error) {
            alert("Cannot close job")
        }

    }

    const reOpenJob = async(id) => {
        try {
            const res = await api({
                url:`/post/${id}`,
                method:'PATCH',
                data:{
                    active:true,
                    createdAt: new Date().toISOString()
                }
            })
            if(res.success) fetchPosts()
        } catch (e) {
            alert("Cannot re-open job")
        }
    }

    const renderPosts = (posts) => {
        if(posts.length === 0) return (<div className="mt-5 mb-5" ><h1>No job to display...</h1></div>)
        return posts.map((post,index) => 
            <ListGroup.Item key={index}>
                <h3 style={{ cursor:"pointer", display:"inline-block" }} onClick={() => {history.push(`/post/${post._id}`)}}>
                    {post.title} 
                </h3>
                &nbsp;
                {post.active ? <Badge pill variant="primary">active</Badge> : <Badge pill variant="warning">expired</Badge>}
                <div>Created At: {parseISO(post.createdAt).toString()}</div>
                <div className="d-flex mt-2 justify-content-between">
                    <Button variant="primary" 
                    onClick={() => history.push(`/post/private/${post._id}`)}
                    >Show Applications</Button>
                    
                    {!post.active && 
                        <Button variant='info'
                        onClick={() => reOpenJob(post._id)}
                        >Re-open Job</Button>
                    }

                    {post.active && 
                        <Button variant="danger"
                        onClick={() => closeJob(post._id)}
                        >Close Job</Button>
                    }
                </div>
                
            </ListGroup.Item>
        ) 
    }

    const onChangePage = (page) => {
        setPage(page)
    }

    useEffect(() => {
        fetchPosts()
    },[page])

    if(!user || role==='employoee') return <Redirect to='/'/>

    return (
        <MainLayout>
            <div className="d-flex justify-content-end">
                <DropdownButton variant="secondary" title="Filter Posts" className="ml-5 mr-5 mt-5 pl-5 pr-5 pt-5">
                    <Dropdown.Item onClick={() => {setFilter("all")}}>All Posts</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setFilter("active")}}>Active Posts</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setFilter("expired")}}>Expired Posts</Dropdown.Item>
                </DropdownButton>
            </div>

            <ListGroup variant="flush" className="ml-5 mr-5 p-5">
                {filter === "all" && renderPosts(posts)}
                {filter === "active" && renderPosts(posts.filter(post => post.active))}
                {filter === "expired" && renderPosts(posts.filter(post => !post.active))}
            </ListGroup>

            <CustomPagination 
                current={page}
                total={total}
                onChangePage={onChangePage}
                limit={limit}
            />
        </MainLayout>
    )
}

export default ManageJobPosts