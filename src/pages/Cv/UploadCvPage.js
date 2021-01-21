import CustomNavbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import {Form, Button} from 'react-bootstrap'
import { useState, useContext } from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {AuthContext} from '../../App'
import storage from '../../firebase/firebase'
import api from '../../api/api'
import {verifyUploadCV} from '../../utils/verifyForm'
import Swal from 'sweetalert2'

function UploadCvPage(){ 
    const [form,setForm] = useState({title:"",file:{name:"Attach your CV"}})
    const {user, role, setResumes, resumes} = useContext(AuthContext)
    const history = useHistory()

    if(role==='employer') return <Redirect to="/" />

    const onChangeForm = (e) => {
        const {name, value} = e.target
        setForm({ 
            ...form,
            [name]:value
        })
    }

    const handleSubmitForm = async(e) => {
        e.preventDefault()
        if(!user) return history.push('/signin')
        if(!verifyUploadCV(form.file.name)) return Swal.fire('Oops...', 'CV must be in type of pdf, doc or docx', 'error')
        if(form.title && form.file){
            const fileUrl = await uploadToFirebase(form.file)
            if(fileUrl){    
                let customForm = {...form}
                delete customForm.file 
                customForm.link = fileUrl
                const res = await api({
                    url:'/resume',
                    method:'POST',
                    data:customForm
                })
                if(res.success) {
                    setResumes([...resumes,res.data])
                    history.push('/profile')
                }    
            }
        }
    }

    const uploadToFirebase = (file) => {
        return new Promise((resolve, reject) => {
            const task = storage.child(file.name).put(file)

            task.on('state_changed', function onProgress(){}, function onError(error){
                reject(error)
            }, function onSuccess(){
                task.snapshot.ref.getDownloadURL().then((url) => {
                    resolve(url)
                })
            })
        })
    }

    const onChangeFile = async(e) => {
        setForm({
            ...form,
            file:e.target.files[0]
        })
    }

    return (
        <div>
            <CustomNavbar />
            <Form className="p-5 mt-5" onSubmit={handleSubmitForm}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label><strong>Curriculum Vitae title</strong></Form.Label>
                    <Form.Control type="text" 
                    placeholder="Enter CV name" 
                    required
                    name="title"
                    value={form.title}
                    onChange={onChangeForm}
                    />
                </Form.Group>

                <Form.Group>
                <Form.Label><strong>Upload your CV (.doc,.docx,.pdf)</strong></Form.Label>
                    <Form.File 
                        id="custom-file"
                        label={form.file.name}
                        accept=".doc,.docx,.pdf"
                        name="file"
                        onChange={(e) => onChangeFile(e)}
                        custom
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Footer />
        </div>
    )
}

export default UploadCvPage