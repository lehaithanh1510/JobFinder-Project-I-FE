import JobTitleCard from '../../components/Cards/JobTitleCard'
import {useParams} from 'react-router-dom' 
import {useState, useEffect} from 'react'
import api from '../../api/api'
import CustomNavbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import parse from 'html-react-parser'

function DetailJob(){
    const {id} = useParams()
    const [post,setPost] = useState(null)
    
    function convertVND(value) {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        })
        
        return formatter.format(value)
    }

    const fetchPost = async(postId) => {
        try {
            const res = await api({
                url: `/post/${postId}`,
                method: 'GET'
            })
            if(res.success) {
                setPost(res.data)
                console.log(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPost(id)
    },[id])

    return (
        <div>
            <CustomNavbar />
            {post ? 
                <>
                <JobTitleCard 
                logo={post.owner.logo}
                title={post.title}
                categories={post.categories}
                keywords={post.keywords}
                salary={convertVND(post.salary)}
                id={post._id}
                location={post.locations}
                owner={post.owner._id}
                active={post.active}
                />
                <div className="p-5" style={{ borderBottom: "0.5px solid black"}}>
                    <h2>Job Description</h2>
                    <p>{post.description && parse(post.description)}</p>
                </div>
                <div className="p-5">
                    <h2>Job Requirements</h2>
                    <p>{post.requirements && parse(post.requirements)}</p>
                </div>
                </>
            
                : <div>No job found...</div>
            }

            <Footer />
        </div>
    )
}

export default DetailJob