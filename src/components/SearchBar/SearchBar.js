import { Col, Form, Button} from 'react-bootstrap'
import {useState} from 'react'
import {Typography, Slider} from '@material-ui/core'
import Data from '../../utils/data'
import convertVND from '../../utils/convertVND'

function SearchBar({filterSearch}){
    const [form,setForm] = useState({skills:"", category:"", location:"", range:null})
    const [display,setdisplay] = useState(false)
    const [value, setValue] = useState([5000000, 20000000]);

    const handleChange = (e,newValue) => {
        setValue(newValue)
        setForm({
            ...form,
            'range':newValue
        })
    }; 

    const onChangeForm = (e) => {
        const {name, value} = e.target
        setForm({ 
            ...form,
            [name]:value
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()
        filterSearch(form)
    }

    return( 
        <Form className="p-5 mt-3" style={{ backgroundColor: '#353a40' }} onSubmit={handleSubmitForm}>
            <div className="d-flex justify-content-start mb-3">
                <h1 style={{ color: 'white' }}>
                    5000+ IT Jobs for developers
                </h1>
            </div>
            <Form.Row className="align-items-center d-flex justify-content-center ml-1">
                <Col sm={3} className="my-1">
                    <Form.Control placeholder="Search Keywords skill" 
                    name="skills"
                    value={form.skills}
                    onChange={onChangeForm}
                    />
                </Col>

                <Col sm={3} className="my-1">
                    <Form.Control
                        as="select"
                        className="mr-sm-2"
                        custom
                        name="location"
                        value={form.location}
                        onChange={onChangeForm}
                    >
                        {Data.locationData.map((data,index) => <option key={index}>{data}</option>)}
                    </Form.Control>
                </Col>

                <Col xs="auto" className="my-1">
                    <Button type="submit">Find Jobs</Button>
                </Col>
                {!display &&
                    <Col xs="auto" className="my-1">
                        <Button type="button" variant="success" onClick={(e) => {
                            setdisplay(true)
                            handleChange(e, [5000000,20000000])
                        }}>Advanced Search</Button>
                    </Col>
                }
            </Form.Row>
            {display && 
                <Form.Row className="align-items-center d-flex justify-content-center mr-5">
                    <Col sm={3} className="my-1">
                    <Typography id="range-slider" gutterBottom color="secondary">
                        Salary range
                    </Typography>
                    <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="off"
                    color="secondary"   
                    name="range"
                    min={1000000}
                    step={500000}
                    max={50000000}
                    />
                    <p style={{ color: 'white' }}>Min: {value && convertVND(value[0])}</p>
                    <p style={{ color: 'white' }}>Max: {value && convertVND(value[1])}</p>
                    </Col>

                    <Col sm={3} className="my-1">
                        <Form.Control
                            as="select"
                            className="mr-sm-2 mb-5"
                            custom
                            name="category"
                            value={form.category}
                            onChange={onChangeForm}
                        >
                            {Data.categoryData.map((data,index) => <option key={index}>{data}</option>)}
                        </Form.Control>
                    </Col>

                    <Col xs="auto" className="my-1">
                        <Button type="button" variant="danger" className="mb-5" onClick={(e) => {
                            setdisplay(false)
                            handleChange(e, null)
                            setForm({
                                ...form,
                                category:""
                            })
                        }}> X </Button>
                    </Col>
                </Form.Row>
            }
            
        </Form>
    )
}

export default SearchBar