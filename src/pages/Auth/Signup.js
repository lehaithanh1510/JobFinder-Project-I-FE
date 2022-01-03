import { Form, Button, Container } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../../App'
import api from '../../api/api'
import { verifySignUp } from '../../utils/verifyForm'
import Swal from 'sweetalert2'
import './Signin.css'

function Signup() {
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', role: 'employee' })
    const { user, signin } = useContext(AuthContext)

    const onChangeForm = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        if (!verifySignUp(form)) return Swal.fire('Oops...', 'Please enter valid email or password with at least 6 characters include a number!', 'error')

        try {

            const signUpRole = form.role

            delete form.role

            const res = await api({
                url: `/${signUpRole}/signup`,
                method: 'POST',
                data: form
            })

            if (res.success) {
                localStorage.setItem('role', signUpRole)
                signin(res.data)
            }

        } catch (e) {
            console.log(e.message)
            Swal.fire('Oops...', 'Cannot create account! Please try again later or validate your inputs...', 'error')
        }
    }

    if (user) return <Redirect to="/" />

    return (
        <div className='bodyAuth' >
            <Container>
                <Form className="p-5" onSubmit={handleSubmitForm}>
                    <div className="d-flex justify-content-center">
                        <h2 style={{ color: '#ffffff' }}>Register to start</h2>
                    </div>

                    <Form.Group>
                        <Form.Label><strong style={{ color: '#ffffff' }}>Email address</strong></Form.Label>
                        <Form.Control className='inputplace' type="email"
                            placeholder="Enter email"
                            name="email"
                            value={form.email}
                            onChange={onChangeForm}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label style={{ color: '#ffffff' }}><strong>Password</strong></Form.Label>
                        <Form.Control className='inputplace' type="password"
                            placeholder="Password"
                            name="password"
                            value={form.password}
                            onChange={onChangeForm}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label style={{ color: '#ffffff' }}><strong>Confirm password</strong></Form.Label>
                        <Form.Control className='inputplace' type="password"
                            placeholder="Password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={onChangeForm}
                        />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label style={{ color: '#ffffff' }}><strong>Select role</strong></Form.Label>
                        <Form.Control className='inputplace' as="select"
                            name="role"
                            value={form.role}
                            onChange={onChangeForm}
                        >
                            <option value="employee">Employee</option>
                            <option value="employer">Company</option>
                        </Form.Control>
                    </Form.Group>

                    <Button className="mt-1" variant="primary" type="submit">
                        Sign Up
                    </Button>

                    <span style={{ color: '#ffffff' }} className="ml-2">
                        Already have an account?
                        <Link to="/signin" style={{ color: 'white' }}>
                            <strong> Signin</strong>
                        </Link>
                    </span>

                </Form>
            </Container>
        </div>
    )
}

export default Signup