import { Form, Button, ListGroup, Nav } from 'react-bootstrap'
import { AuthContext } from '../../App'
import { useContext, useState, useNavigate } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import api from '../../api/api'
import MainLayout from '../../components/Layout/MainLayout'
import NotiToast, { notify } from '../../utils/NotiToast'

function UpdateProfile() {
    const { user, role, resumes, setResumes } = useContext(AuthContext)
    const [name, setName] = useState('')

    const deleteCv = async (id) => {
        const res = await api({
            url: `/resume/${id}`,
            method: 'DELETE',
        })
        if (res.success) {
            setResumes(resumes.filter(resume => resume._id !== id))
            notify('Update profile success', window.location.reload())
        }
    }

    const handleSubmitForm = async () => {
        const res = await api({
            url: `/employee`,
            method: 'PATCH',
            data: { name }
        })
        if (res.success) {
            notify('Update profile success', window.location.reload())
        }
    }

    if (!user || role === 'employer') return <Redirect to='/' />

    const renderResumes = (resumes) => {
        if (!resumes || resumes.length === 0) return <ListGroup.Item><Nav.Link href='/uploadcv'>Let upload some CV</Nav.Link></ListGroup.Item>
        return resumes.map(resume => <ListGroup.Item
            key={resume._id}
            className='d-flex justify-content-between'
        >
            <Nav.Link href={resume.link}>{resume.title}</Nav.Link>
            <Button variant='danger' onClick={() => deleteCv(resume._id)}> X </Button>
        </ListGroup.Item>
        )
    }

    return (
        <MainLayout>
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
            <NotiToast />
        </MainLayout>
    )
}

export default UpdateProfile