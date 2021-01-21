import 'bootstrap/dist/css/bootstrap.min.css'
import {Switch, Route} from "react-router-dom"
import {useState, useEffect, createContext, useRef} from 'react'
import {Spinner} from 'react-bootstrap'
import HomePage from './pages/Home/HomePage'
import EmployerPage from './pages/Employer/EmployerPage'
import Signin from './pages/Auth/Signin'
import Signup from './pages/Auth/Signup'
import api from './api/api'
import {io} from 'socket.io-client'
import DetailJobPage from './pages/Job/DetailJobPage'
import ApplyJobPage from './pages/Job/ApplyJobPage'
import UploadCvPage from './pages/Cv/UploadCvPage'
import EmployeeUpdateProfile from './pages/Employee/UpdateProfile'
import EmployerUpdateProfile from './pages/Employer/UpdateProfile'
import ManageApplication from './pages/Employee/ManageApplication'
import CreateJobPage from './pages/Job/CreateJobPage'
import ManageJobPosts from './pages/Employer/ManageJobPosts'
import ListApplicants from './pages/Job/ListApplicants'

export const AuthContext = createContext()
export const SocketContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resumes, setResumes] = useState(null)
  const socket = useRef(null)

  const verifyAuth = async (role) => {
    setLoading(true)
    try {
      const res = await api({
        url:`/${role}/verify`,
        method:'GET'
      })
      setLoading(false)
      if(res.success) {
        setUser(res.data)
        setRole(role)
        if(role==='employee'){
          fetchResumes()
        }
      }
    } catch (error) {
      setLoading(false) 
    }
  }

  const fetchResumes = async () => {
    const response = await api({
      url:'/resume',
      method:'GET',
    })
    if(response.success) setResumes(response.data.resume)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if(token) verifyAuth(role)
    else setLoading(false)
  }, [])

  const signin = ({user, token}) => {
    setUser(user)
    localStorage.setItem('token',token)   
    setRole(localStorage.getItem('role'))
    if(localStorage.getItem('role') === 'employee') fetchResumes()
  }

  const signout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setUser(null)
  }

  if(loading) return <Spinner animation="border" variant="dark" />

  return (
    <AuthContext.Provider value={{user,resumes,setUser,setResumes,role,signin,signout}}>
      
      <div className="App">
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Route path='/signin' exact>
            <Signin />
          </Route>
          <Route path='/signup' exact>
            <Signup />
          </Route>
          <Route path='/company/:id' exact>
            <EmployerPage />
          </Route>
          <Route path='/post/:id' exact>
            <DetailJobPage />
          </Route>
          <Route path='/post/private/:id' exact>
            <ListApplicants />
          </Route>
          <Route path='/apply/:id' exact>
            <ApplyJobPage />
          </Route>
          <Route path='/uploadcv' exact>
            {role === 'employee' && <UploadCvPage />}
          </Route>
          <Route path='/profile' exact>
            {role === 'employee' && <EmployeeUpdateProfile />}
            {role === 'employer' && <EmployerUpdateProfile />}
          </Route>
          <Route path='/applications' exact>
            {role === 'employee' && <ManageApplication />}
            {role === 'employer' && <ManageJobPosts />}
          </Route>
          <Route path='/create' exact>
            {role ==='employer' && <CreateJobPage />}
          </Route>
        </Switch>
      </div>
      
    </AuthContext.Provider>
  );
}

export default App;
