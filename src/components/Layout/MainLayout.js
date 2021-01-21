import CustomNavbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

function MainLayout(props){
    const {children} = props
    
    return(
        <div>
            <CustomNavbar />
            <div>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout 