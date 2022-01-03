import CustomNavbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import NotiToast from '../../utils/NotiToast'

function MainLayout(props) {
    const { children } = props

    return (
        <div>
            <CustomNavbar />
            <div style={{ minHeight: '88vh' }}>
                {children}
            </div>
            <NotiToast></NotiToast>
            <Footer />
        </div >
    )
}

export default MainLayout 