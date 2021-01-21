import CustomNavbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import {Form, Button} from 'react-bootstrap'
import { useState, useContext, useEffect } from 'react'
import {Redirect, Link, useParams, useHistory} from 'react-router-dom'
import {AuthContext} from '../../App'
import api from '../../api/api' 
import Swal from 'sweetalert2'

function ApplyJobPage(){
    const {user,role,resumes} = useContext(AuthContext)
    const {id} = useParams()
    const [post,setPost] = useState(null)
    const [form,setForm] = useState({resume:"",message:""})
    const history = useHistory()

    const fetchPost = async(postId) => {
        try {
            const res = await api({
                url: `/post/${postId}`,
                method: 'GET'
            })
            if(res.success) setPost(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPost(id)
    },[])

    
    const renderResume = (resumes) => {
            
        return resumes.map((resume,index) => <option key={resume._id} value={resume._id}>{resume.title}</option>)
    }

    const onChangeForm = (e) => {
        const {name, value} = e.target
        setForm({ 
            ...form,
            [name]:value
        })
    }

    const handleSubmitForm = async(e) => {
        e.preventDefault()
        if(!form.resume){
            Swal.fire('Oops...', 'You need to attach a CV.', 'error')
        }
        else{
            const customForm = {...form}
            customForm.job = id
            const res = await api({
                url:'/application',
                method:'POST',
                data:customForm
            })
            if(res.success) history.push('/applications')
        }
    }
        
    if(!user || role==='employer') return <Redirect to="/" /> 

    return(
        <div>
            <CustomNavbar />
            <Form className="p-5 mt-5" onSubmit={handleSubmitForm}>
                <Form.Label><h2>{post && post.title}</h2></Form.Label>
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label><strong>Attach your CV</strong></Form.Label>
                    <Form.Control as="select"
                    required
                    name="resume"
                    onChange={onChangeForm}
                    >
                        <option disabled selected>Select a CV</option>
                        {renderResume(resumes)}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Link to="/uploadcv"><strong>...Or upload new CV?</strong></Link>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label><strong>Message to employer</strong></Form.Label>
                    <Form.Control as="textarea" rows={3} 
                    name="message"
                    value={form.message}
                    onChange={onChangeForm}
                    maxLength="100"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
            <Footer />
        </div>
    )
}

export default ApplyJobPage