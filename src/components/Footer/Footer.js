import { Navbar, Nav } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="footer pr-5 pl-5 pt-2"
      sticky="bottom"
    >
      <Nav className="mr-auto">
        <Nav.Link href="/">About us</Nav.Link>
      </Nav>
      <Nav></Nav>
    </Navbar>
  );
}

export default Footer;
