import CompanyTitleCard from '../../components/Cards/CompanyTitleCard'
import CardJob from '../../components/Cards/CardJob'
import MainLayout from '../../components/Layout/MainLayout'
import {Carousel} from 'react-bootstrap'
import {useParams} from 'react-router-dom' 
import CustomPagination from '../../components/Pagination/Pagination'
import {useState, useEffect} from 'react'
import api from '../../api/api'

function EmployerPage() {
    const [page, setPage] = useState(1) 
    const [total, setTotal] = useState(0)
    const [limit, setLimit] = useState(4)
    const {id} = useParams()
    const [posts, setPosts] = useState([])
    const [company, setCompany] = useState({})
    const [images, setImages] = useState([])
    

    const fetchPosts = async() => {
        const params = {page,limit,company:id}
        try {
            const res = await api({
                url:'/post',
                method:'GET',
                params
            }) 

            if(res.success) {
                setPosts(res.data.posts)
                setTotal(res.data.total)
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    const fetchCompany = async() => {
        try {
            const res = await api({
                url:`employer/${id}`,
                method:'GET'
            }) 
            if(res.success) {
                setCompany(res.data)
                setImages(res.data.image)
            }

        } catch (e) {
            console.log(e.message)
        }
    }

    const renderPosts = (posts) => {
        if(posts.length == 0) return (<div className="mt-5 mb-5" ><h1>No job from this company...</h1></div>)
        return posts.map(post => 
            <CardJob 
                logo={post.owner.logo}
                locations={post.locations}
                key={post._id}
                title={post.title}
                salary={post.salary}
                id={post._id}
                active={post.active}
            />   
        )
    } 

    const renderImages = (images) => {
        return images.map(img => 
            <Carousel.Item>
                <img
                className="d-block w-100"
                src={img}
                />
            </Carousel.Item>
        )
    }

    const onChangePage = (page) => {
        setPage(page)
    }

    useEffect(() => {
        fetchCompany()
        fetchPosts()
    },[page, id])

    return (
        <MainLayout>
            <CompanyTitleCard 
            title={company.name}
            location={company.location}
            description={company.description}
            logo={company.logo}
            />
            <Carousel className="p-5 mr-5 ml-5">
                {renderImages(images)}
            </Carousel>

            <h3 className="ml-4">Recent Jobs</h3>
            <div className="row d-flex justify-content-start ml-3" >
                {renderPosts(posts)}
            </div> 
            <CustomPagination 
                current={page}
                total={total}
                onChangePage={onChangePage}
                limit={limit}
            />
        </MainLayout>
    )    
}
export default EmployerPage