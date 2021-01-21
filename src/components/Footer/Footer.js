import {Navbar, Nav} from 'react-bootstrap'

function Footer(){
    return(
        <Navbar bg="dark" variant="dark" className="pr-5 pl-5 pt-2" fixed="bottom">
            <Nav className="mr-auto">
                <Nav.Link href="/">About us</Nav.Link>          
            </Nav>
            <Nav>
            </Nav>
        </Navbar>
    )
}

export default Footer