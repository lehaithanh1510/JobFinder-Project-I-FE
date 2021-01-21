import CustomNavbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import {Form, Button, ListGroup, Nav} from 'react-bootstrap'
import {AuthContext} from '../../App'
import { useContext, useState } from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import api from '../../api/api'

function UpdateProfile(){
    const {user, role, resumes, setResumes} = useContext(AuthContext)
    const [name,setName] = useState('')
    const history = useHistory()

    const deleteCv = async (id) => {
        const res = await api({
            url:`/resume/${id}`,
            method:'DELETE',
        })
        if(res.success){
            setResumes(resumes.filter(resume => resume._id !== id))
            history.push('/profile')
        }
    }

    const handleSubmitForm = async() => {
        const res = await api({
            url:`/employee`,
            method:'PATCH',
            data:{name}
        })
        if(res.success){
            history.push('/')
        }
    }

    if(!user || role==='employer') return <Redirect to='/'/>

    const renderResumes = (resumes) => {
        if(!resumes || resumes.length == 0) return <ListGroup.Item><Nav.Link href='/uploadcv'>Let upload some CV</Nav.Link></ListGroup.Item>
        return resumes.map(resume => <ListGroup.Item 
            key={resume._id}
            className='d-flex justify-content-between'
            >
                <Nav.Link href={resume.link}>{resume.title}</Nav.Link>
                <Button variant='danger' onClick={() => deleteCv(resume._id)}> X </Button>
            </ListGroup.Item>
        )
    } 

    return(
        <>
            <CustomNavbar />
            <Form className="p-5 mt-5" onSubmit={handleSubmitForm}>
                <Form.Group>
                    <Form.Label><strong>Email</strong></Form.Label>
                    <Form.Control type="text" 
                    
                    readOnly
                    defaultValue={user.email}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label><strong>Your Name</strong></Form.Label>
                    <Form.Control type="text" 
                    placeholder={user.name ? user.name : "Enter your name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label><strong>Your CVs</strong></Form.Label>
                    <ListGroup variant="flush">
                        {renderResumes(resumes)}
                    </ListGroup>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
            <Footer />
        </>
    )
}

export default UpdateProfile