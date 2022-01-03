import MainLayout from '../../components/Layout/MainLayout'
import { Form, Button } from 'react-bootstrap'
import { Redirect, useHistory } from 'react-router-dom'
import { makeStyles, Grid, Typography, Slider } from '@material-ui/core'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CKEditor from 'ckeditor4-react'
import { useState, useContext } from 'react'
import { AuthContext } from '../../App'
import convertVND from '../../utils/convertVND'
import Data from '../../utils/data'
import api from '../../api/api'
import NotiToast, { notify } from '../../utils/NotiToast';

const useStyles = makeStyles({
    root: {
        width: 300,
    }
})

function CreateJobPage() {
    const [salary, setSalary] = useState(8000000)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [requirements, setRequirements] = useState('')
    const [keywords, setKeywords] = useState([])
    const [locations, setLocations] = useState([])
    const [categories, setCategories] = useState([])
    const { user, role } = useContext(AuthContext)
    const history = useHistory()

    const classes = useStyles();

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        let keywrds = keywords.map(key => key.toLowerCase())
        const form = { title, salary, description, requirements, keywords: keywrds, locations, categories }
        const res = await api({
            url: '/post',
            method: 'POST',
            data: form
        })
        if (res.success) {
            notify('New job is created', history.push(`/post/${res.data._id}`))
        }
    }

    if (!user || role === 'employee') return <Redirect to='/' />

    return (
        <MainLayout>
            <Form className="p-5 m-5" onSubmit={handleSubmitForm}>
                <Form.Group>
                    <Form.Label><strong>Job Title</strong></Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label><strong>Description</strong></Form.Label>
                    <CKEditor
                        onChange={(e) => setDescription(e.editor.getData())}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label><strong>Requirements</strong></Form.Label>
                    <CKEditor
                        onChange={(e) => setRequirements(e.editor.getData())}
                    />
                </Form.Group>

                <Form.Group>
                    <div className={classes.root}>
                        <Typography id="input-slider" gutterBottom>
                            <strong>Salary</strong>
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <AttachMoneyIcon />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    defaultValue={8000000}
                                    onChange={(e, newValue) => setSalary(newValue)}
                                    color='primary'
                                    step={500000}
                                    marks
                                    min={0}
                                    max={50000000}
                                />
                            </Grid>
                            <p className="ml-2 mt-2">{convertVND(salary)}</p>
                        </Grid>
                    </div>
                </Form.Group>

                <Form.Group>
                    <Form.Label><strong>Keyword Skills</strong></Form.Label>
                    <Form.Control as='select'
                        onChange={(e) => setKeywords(Array.from(e.target.selectedOptions, option => option.value))}
                        multiple
                    >
                        {Data.keywordData.map((keywrd, index) => <option key={index}>{keywrd}</option>)}
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label><strong>Categories</strong></Form.Label>
                    <Form.Control as='select'
                        multiple
                        onChange={(e) => setCategories(Array.from(e.target.selectedOptions, option => option.value))}
                    >
                        {Data.categoryData.map((data, index) => <option key={index}>{data}</option>)}
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label><strong>Locations</strong></Form.Label>
                    <Form.Control as='select'
                        multiple
                        onChange={(e) => setLocations(Array.from(e.target.selectedOptions, option => option.value))}
                    >
                        {Data.locationData.map((data, index) => <option key={index}>{data}</option>)}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Job
                </Button>
            </Form>
        </MainLayout>
    )
}

export default CreateJobPage