import {Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../../App'
import {useContext} from 'react'

function CustomNavbar(){
    const {user,role,signout} = useContext(AuthContext)
    const history = useHistory()
    const handleLogout = () => {
        signout()
        history.push('/')
    }  
    return(
        <Navbar bg="dark" variant="dark" className="pr-5 pl-5 pt-2" fixed="top">
            <Navbar.Brand href="#"><h3>Job Finder</h3></Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>          
            </Nav>
            <Nav>
            {!user && (    
                <Nav.Link href="/signin">Sign in</Nav.Link>
            )}
            {user && (
                <> 
                    <NavDropdown title={`Hello, ${user.email}`} >
                        <NavDropdown.Item href='/profile'>Update Profile</NavDropdown.Item>
                        {role==='employee' && 
                        <>
                            <NavDropdown.Item href='/uploadcv'>Upload your CV</NavDropdown.Item>
                            <NavDropdown.Item href='/applications'>Manage Applications</NavDropdown.Item>
                        </>
                        }
                        {role==='employer' && 
                        <>
                            <NavDropdown.Item href={`/company/${user._id}`}>Company Page</NavDropdown.Item>
                            <NavDropdown.Item href='/applications'>Manage Job Posts</NavDropdown.Item>
                            <NavDropdown.Item href='/create'>Create New Job</NavDropdown.Item>
                        </>
                        }
                    </NavDropdown>
                    <Nav.Link onClick={handleLogout}>Sign out</Nav.Link>
                </>
            )}
            </Nav>
        </Navbar>

    )
}

export default CustomNavbar