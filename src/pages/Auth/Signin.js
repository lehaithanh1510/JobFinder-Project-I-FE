import { Form, Button, Container } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../../App'
import api from '../../api/api'
import Swal from 'sweetalert2'
import './Signin.css'

function Signin() {
    const [form, setForm] = useState({ email: '', password: '', role: 'employee' })
    const { user, signin } = useContext(AuthContext)

    const onChangeForm = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
        console.log(form)
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        try {

            const { role } = form
            delete form.role
            const res = await api({
                url: `/${role}/signin`,
                method: 'POST',
                data: form
            })

            if (res.success) {
                localStorage.setItem('role', role)
                signin(res.data)
            }

        } catch (e) {
            console.log(e)
            Swal.fire('Oops...', 'Email or password is incorrect!', 'error')
        }
    }

    if (user) return <Redirect to="/" />

    return (
        <div className='bodyAuth' >
            <Container>
                <Form className="p-5" onSubmit={handleSubmitForm}>
                    <div className="d-flex justify-content-center">
                        <h2 style={{ color: '#ffffff' }} >Login to continue</h2>
                    </div>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label><strong style={{ color: '#ffffff' }}>Email address</strong></Form.Label>
                        <Form.Control className='inputplace' type="email"
                            placeholder="Enter email"
                            name="email"
                            value={form.email}
                            onChange={onChangeForm}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label><strong style={{ color: '#ffffff' }}>Password</strong></Form.Label>
                        <Form.Control type="password" className='inputplace'
                            placeholder="Password"
                            name="password"
                            value={form.password}
                            onChange={onChangeForm}
                        />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label><strong style={{ color: '#ffffff' }}>Select role</strong></Form.Label>
                        <Form.Control className='inputplace' as="select"
                            name="role"
                            value={form.role}
                            onChange={onChangeForm}
                        >
                            <option value="employee">Employee</option>
                            <option value="employer">Company</option>
                        </Form.Control>
                    </Form.Group>
                    <div className='d-flex'>
                        <Button className="mt-4" variant="primary" type="submit">
                            Login
                        </Button>

                        <div className="ml-2 mt-4 d-flex align-items-center" style={{ color: '#ffffff' }}>
                            Don't have an account?
                            <Link to="/signup" style={{ color: 'black' }}>
                                <strong style={{ color: '#ffffff' }}> Signup</strong>
                            </Link>
                        </div>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default Signin