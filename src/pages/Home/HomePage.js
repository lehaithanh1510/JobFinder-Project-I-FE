import SearchBar from '../../components/SearchBar/SearchBar' 
import CardJob from '../../components/Cards/CardJob'
import MainLayout from '../../components/Layout/MainLayout'
import api from '../../api/api'
import {useState,useEffect} from 'react'
import CustomPagination from '../../components/Pagination/Pagination'

function HomePage() {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1) 
    const [total, setTotal] = useState(0)
    const [limit, setLimit] = useState(4)
    const [queries, setQueries] = useState({})

    const fetchPosts = async({skills=null, range=null,location,category}) => {
        const params = {page,limit}

        if(skills) params.key = skills
        if(range){
            params.min = range[0]
            params.max = range[1]
        }
        if(category) params.cate = category
        if(location) params.loc = location
        
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
 
    const renderPosts = (posts) => {
        if(posts.length == 0) return (<div className="mt-5 mb-5" ><h1>No job found...</h1></div>)
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

    const onChangePage = (page) => {
        setPage(page)
    }

    useEffect(() => {
        fetchPosts(queries)
    },[page,queries])

    return (
        <MainLayout>
            <SearchBar 
                filterSearch={setQueries}
            />
            <div className="row d-flex justify-content-start ml-3" >
                {renderPosts(posts.filter(post => post.active))}
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

export default HomePage 