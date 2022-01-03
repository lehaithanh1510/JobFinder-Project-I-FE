import MainLayout from '../../components/Layout/MainLayout';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { Redirect, useHistory } from 'react-router-dom';
import { AuthContext } from '../../App';
import { useContext, useState } from 'react';
import CKEditor from 'ckeditor4-react';
import { makeStyles, IconButton } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import storage from '../../firebase/firebase'
import api from '../../api/api';
import Data from '../../utils/data';
import { validateImageFile } from '../../utils/verifyForm';
import Swal from 'sweetalert2';
import { notify } from '../../utils/NotiToast';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

function UpdateProfile() {
  const { user, setUser, role } = useContext(AuthContext);
  const [currenImgs, setCurrentImgs] = useState(user.image);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [locations, setLocations] = useState([]);
  const [logo, setLogo] = useState(undefined);
  const [logoUrl, setLogoUrl] = useState(user.logo);
  const history = useHistory();
  const classes = useStyles();

  const renderImages = (images) => {
    return images.map((image, index) => (
      <Col xs={2} key={index}>
        <Image src={image.url} rounded height="171" width="180" />
        <Button
          variant="danger"
          size="sm"
          style={{ position: 'absolute', top: '0px', right: '5px' }}
          onClick={() => deleteUploadImage(image.url)}
        >
          X
        </Button>
      </Col>
    ));
  };

  const renderCurrentImgs = (images) => {
    return images.map((image, index) => (
      <Col xs={2} key={index}>
        <Image src={image} rounded height="171" width="180" />
        <Button
          variant="danger"
          size="sm"
          style={{ position: 'absolute', top: '0px', right: '5px' }}
          onClick={() => deleteCurrentImg(image)}
        >
          X
        </Button>
      </Col>
    ));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!validateImageFile(file.type))
      return Swal.fire('Oops...', 'Must upload image file only!', 'error');
    const url = URL.createObjectURL(file);
    file.url = url;
    setImages([...images, file]);
  };

  const handleUploadLogo = (e) => {
    const newLogo = e.target.files[0];
    if (!validateImageFile(newLogo.type))
      return Swal.fire('Oops...', 'Must upload image file only!', 'error');
    const url = URL.createObjectURL(newLogo);
    setLogoUrl(url);
    setLogo(newLogo);
  };

  const deleteUploadImage = (url) => {
    setImages(images.filter((image) => image.url !== url));
  };

  const deleteCurrentImg = (url) => {
    setCurrentImgs(currenImgs.filter((link) => link !== url));
  };

  const handleChangeDescription = (e) => {
    setDescription(e.editor.getData());
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeLocations = (e) => {
    setLocations(
      Array.from(e.target.selectedOptions, (option) => option.value),
    );
  };

  const uploadToFirebase = (file) => {
    return new Promise((resolve, reject) => {
      const task = storage.child(file.name).put(file)

      task.on('state_changed', function onProgress() { }, function onError(error) {
        reject(error)
      }, function onSuccess() {
        task.snapshot.ref.getDownloadURL().then((url) => {
          resolve(url)
        })
      })
    })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const linkImages = [];

    if (images.length > 0) {
      const customImages = images.map((image) => {
        delete image.url;
        return image;
      });
      for (let image of customImages) {
        const link = await uploadToFirebase(image)
        linkImages.push(link)
      }
    }

    const form = {};

    if (logo) {
      let imgUrl = await uploadToFirebase(logo)
      form.logo = imgUrl
    }

    if (description) form.description = description;
    if (name) form.name = name;
    if (locations.length > 0) form.location = locations;

    form.image = currenImgs.concat(linkImages);

    const res = await api({
      url: '/employer',
      method: 'PATCH',
      data: form,
    });
    if (res.success) {
      setUser(res.data);
      notify(`Update company's profile successed`, history.push(`/company/${user._id}`))
    } else console.log(res.message);
  };

  if (!user || role === 'employee') return <Redirect to="/" />;

  return (
    <MainLayout>
      <Form className="p-5 mt-5" onSubmit={handleSubmitForm}>
        <Form.Group>
          <Form.Label>
            <strong>Company email</strong>
          </Form.Label>
          <Form.Control type="text" readOnly defaultValue={user.email} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Company Logo</strong>
          </Form.Label>
          <Row className="mb-2">
            <Col xs={2}>
              <Image src={logoUrl} rounded height="171" width="180" />
              <Button
                variant="danger"
                size="sm"
                style={{ position: 'absolute', top: '0px', right: '5px' }}
                onClick={() => {
                  setLogo(undefined);
                  setLogoUrl('');
                }}
              >
                X
              </Button>
            </Col>
          </Row>
          <div className={classes.root}>
            <input
              accept="image/*"
              className={classes.input}
              id="logo-button-file"
              type="file"
              onChange={handleUploadLogo}
            />
            <label htmlFor="logo-button-file">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Company Name</strong>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder={user.name || 'Enter company name'}
            onChange={onChangeName}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Description</strong>
          </Form.Label>
          <CKEditor
            data="<p>Let people know about your company!</p>"
            onChange={handleChangeDescription}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Location</strong>
          </Form.Label>
          <Form.Control as="select" multiple onChange={onChangeLocations}>
            {Data.locationData.map((data, index) => (
              <option key={index}>{data}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Current Images</strong>
          </Form.Label>
          <Row>{renderCurrentImgs(currenImgs)}</Row>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Upload Images</strong>
          </Form.Label>
          <Row className="mb-2">{renderImages(images)}</Row>
          <div className={classes.root}>
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={handleUploadImage}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </MainLayout>
  );
}

export default UpdateProfile;
