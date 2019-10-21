import React, { Component } from 'react';
import { Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import {
  AppHeader,
} from '@coreui/react';
import './register.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, BrowserHistory } from 'react-router-dom';
import Loading from '../../customer/loading';
import FileBase64 from 'react-file-base64';
import Modal from 'react-modal';


const customStyles = {
  content: {
    top: '54%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '0',
    width: '92%',
    transform: 'translate(-50%, -50%)'
  }
};
const barangays = [
  "Agapito Del Rosario",
  "Amsic",
  "Anunas",
  "Balibago",
  "Capaya",
  "Claro M. Recto",
  "Cuayan",
  "Cutcut",
  "Cutud",
  "Lourdes North West",
  "Lourdes Sur",
  "Lourdes Sur East",
  "Malabañas",
  "Margot",
  "Marisol",
  "Mining",
  "Pampang",
  "Pandan",
  "Pulungbulu",
  "Pulung Cacutud",
  "Pulung Maragul",
  "Salapungan",
  "San Jose",
  "San Nicolas",
  "Sta. Teresita",
  "Sta. Trinidad",
  "Sto. Cristo",
  "Sto. Domingo",
  "Sto. Rosario",
  "Sapalibutad",
  "Sapangbato",
  "Tabun",
  "Virgen Delos Remedios"
];

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password_confirmation: '',
      mobileNumber: '',
      houseNumber: '',
      street: '',
      barangay: '',
      role: '',
      errors: {},
      isLoggedIn: false,
      isDeleted: '',
      type: 'password',
      files: [],
      image: '',
      imageName: '',
      imageType: '',
      isLoaded: false,
      modalIsOpen: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  openModal = () => {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    });
  }


  // Callback~
  getFiles(files) {

    toast.configure();
    if (files.type !== 'image/jpeg' && files.type !== 'image/png') {
      toast.error('You must upload png or jpeg image format.', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      this.setState({
        files: '',
        image: '',
        imageName: '',
        imageType: '',
      });
    } else {
      this.setState({
        files: files,
        image: files.base64,
        imageName: files.name,
        imageType: files.type
      })

    }
  }

  onKeyPress(event) {
    console.log(event.charCode)
    if((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122)){
      // none
    }else{
      event.preventDefault();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoaded: true });
    toast.configure();
    axios.post('https://stockwatch.site/public/api/register', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
      mobileNumber: this.state.mobileNumber,
      role: this.state.role,
      image: this.state.image,
      imageName: this.state.imageName,
      imageType: this.state.imageType,
      houseNumber: this.state.houseNumber,
      street: this.state.street,
      barangay: this.state.barangay,
    }, {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(result => {
        if (result.status == 200) {
          toast.success(result.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT
          });

          sessionStorage.removeItem('token')
          sessionStorage.removeItem('firstName')
          sessionStorage.removeItem('lastName')
          sessionStorage.removeItem('fullName')
          sessionStorage.removeItem('user_id')
          sessionStorage.removeItem('email')
          sessionStorage.removeItem('role')
          sessionStorage.removeItem('created_at')
          sessionStorage.removeItem('image')
          sessionStorage.removeItem('mobileNumber')
          sessionStorage.removeItem('isActive')

          this.setState({ isLoaded: false });
          this.props.history.push(`/login`);
        }
      })
      .catch(error => {
        this.setState({
          isLoaded: false,
          firstName: error.response.data.firstName,
          lastName: error.response.data.lastName,
          email: error.response.data.email,
          password: error.response.data.password,
          password_confirmation: error.response.data.password_confirmation,
          mobileNumber: error.response.data.mobileNumber,
          role: error.response.data.role,
          image: error.response.data.image,
          imageName: error.response.data.imageName,
          imageType: error.response.data.imageType,
          houseNumber: error.response.data.houseNumber,
          street: error.response.data.street,
          barangay: error.response.data.barangay,
        });
        error.response.data.errors.map((error) => {
          toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        })
      });
  }

  render() {

    if (this.state.isLoaded) {
      return (
        <Loading />
      )
    }

    return (
      <div className="app flex-row align-items-center">
        <AppHeader fixed>
          <Link to={`/login`}><i className="fa fa-arrow-left back-button" aria-hidden="true"></i></Link>
        </AppHeader>
        <Container className="register-container">
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6" className="mb-4 mt-5">
              <div className="card card-signin my-5">
                <div className="card-body">
                  <div className="mb-3">
                    <h1>Register</h1>
                  </div>
                  <Form>
                    {/* First Name */}
                    <div className="form-row">
                      <div className="col-6">
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="firstName" onKeyPress={event => this.onKeyPress(event)} placeholder="First Name" autoComplete="off" onChange={this.onChange} required />
                        </InputGroup>
                      </div>
                      <div className="col-6">
                        {/* Last Name */}
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="lastName" onKeyPress={event => this.onKeyPress(event)} placeholder="Last Name" autoComplete="off" onChange={this.onChange} required />
                        </InputGroup>
                      </div>
                    </div>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="email" placeholder="Email" autoComplete="email" onChange={this.onChange} required />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="password" placeholder="Password" autoComplete="new-password" onChange={this.onChange} required />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="password_confirmation" placeholder="Repeat password" autoComplete="new-password" onChange={this.onChange} required />
                    </InputGroup>

                    <div className="row">
                      <div className="col-6 pr-0">
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-address-card"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="houseNumber" placeholder="House Number" autoComplete="off" onChange={this.onChange} />
                        </InputGroup>
                      </div>
                      <div className="col-6">
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-address-card"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="street" placeholder="Street" autoComplete="off" onChange={this.onChange} required />
                        </InputGroup>
                      </div>
                    </div>




                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-address-card"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <select name="barangay" className="form-control" onChange={this.onChange} required>
                        <option value="">Select Barangay</option>
                        {barangays.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </InputGroup>

                    {/* Address */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-phone"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="number" 
                      name="mobileNumber"
                             placeholder="Mobile Number" 
                             autoComplete="off" 
                             onChange={this.onChange} 
                             required />
                    </InputGroup>

                    <div className="mb-3 input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fa fa-user"></i>
                        </span>
                      </div>
                      <select name="role" id="" className="form-control" onChange={this.onChange} required >
                        <option value="">Select Role</option>
                        <option value="customer">Customer</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                    <div className="mb-3 input-group">
                      <FileBase64
                        multiple={false}
                        onDone={this.getFiles.bind(this)} />
                    </div>
                    <div className="mb-3 text-center">
                      <img src={this.state.image ? this.state.image : require('../../customer/laundries/dummy.png')} width="200" height="200 " />
                    </div>

                    <button className="btn btn-md btn-primary btn-block" type="button" onClick={this.openModal}>Create Account</button>

                  </Form>
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    ariaHideApp={false}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <div className="modal-header">
                      <span>Assign Order</span>
                      <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="scroll-terms">
                        <p>Terms and conditions These terms and conditions ("Terms", "Agreement") are an agreement between Mobile Application Developer ("Mobile Application Developer", "us", "we" or "our") and you ("User", "you" or "your").</p>
                        <p>This Agreement sets forth the general terms and conditions of your use of the LABUBBLES mobile application and any of its products or services (collectively, "Mobile Application" or "Services").</p>
                        <p>If you create an account in the Mobile Application, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.</p>
                        <p>We may monitor and review new accounts before you may sign in and use our Services.These are the following condition you should follow: For Customer:</p>
                        <ul>
                          <li>As customer, you should use the Mobile app or services approprietly.</li>
                          <li>you should in your house once your laundry is delivered.</li>
                          <li>Payment will be collected upon the pickup of the laundry.</li>
                          <li>there is limited cancellation of transaction. You only have 5 times of cancellation of transactaion. In First 3 cancellations you will be warning and in the 5th cancellation we will banned your account. For Owner:</li>
                          <li>Every transaction must be updated. if there is any changes in your services, you must be update it</li>
                          <li>It is your liabilty when the items has been damage under your laundry process. We may banned your account if we determine that you have violated any provision of this conditions and will not access the mobile application.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                      <button type="button" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
                    </div>
                  </Modal>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
