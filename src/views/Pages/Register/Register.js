import React, { Component } from 'react';
import {
  AppHeader,
} from '@coreui/react';
import '../Register/register.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileBase64 from 'react-file-base64';
import moment from 'moment';
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
      files: [],
      image: '',
      points: '',
      imageName: '',
      imageType: '',
      isLoaded: false,
      modalIsOpen: false,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.getFiles = this.getFiles.bind(this);
  }

  handleOnChange = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      [e.target.name]: e.target.value
    });

    console.log(e.target.value)
  }

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

  onKeyPress(event) {
    console.log(event.charCode)
    if ((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122)) {
      // none
    } else {
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
        console.log(error.response.data)
        this.setState({
          isLoaded: false,
          modalIsOpen: false,
          firstName: error.response.data.request.firstName,
          lastName: error.response.data.request.lastName,
          email: error.response.data.request.email,
          password: error.response.data.request.password,
          password_confirmation: error.response.data.request.password_confirmation,
          mobileNumber: error.response.data.request.mobileNumber,
          role: error.response.data.request.role,
          image: error.response.data.request.image,
          imageName: error.response.data.request.imageName,
          imageType: error.response.data.request.imageType,
          houseNumber: error.response.data.request.houseNumber,
          street: error.response.data.request.street,
          barangay: error.response.data.request.barangay,
        });
        error.response.data.errors.map((error) => {
          toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        })
      });
  }

  render() {
    return (
      <div className="parent">
        <AppHeader fixed className="fixed-top">
          <Link to={`/login`}><i className="fa fa-arrow-left back-button" aria-hidden="true"></i></Link>
        </AppHeader>
        <div className="animated fadeIn">
          <div className="col mt-5 pr-0 pl-0">
            <div className="card profile-card-3">
              <div className="background-block">
                <img src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940" alt="profile-sample1" className="background" />
              </div>
              <div className="profile-thumb-block">
                <img src={this.state.image ? this.state.image : require('../../customer/laundries/dummy.png')} alt="profile-image" className="profile" />
              </div>
              <div className="card-content">
                <h2 className="capitalize">{`${this.state.firstName} ${this.state.lastName}`}</h2>
                <h2><small>{this.state.role}</small></h2>
                <h2><small>{this.state.email}</small></h2>
                <h2><small>{this.state.mobileNumber}</small></h2>
                {/* <div className="icon-block"><a href="#"><i className="fa fa-facebook"></i></a><a href="#"> <i className="fa fa-twitter"></i></a><a href="#"> <i className="fa fa-google-plus"></i></a></div> */}
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Registration</h2>
                <h3><p className="mt-3 w-100 float-left mb-3"><strong>Personal Information</strong></p></h3>
                <hr />
                <div className="information">
                  <form>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlFile1">Upload Profile Photo</label>
                      <FileBase64
                        multiple={false}
                        onDone={this.getFiles.bind(this)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="role">Role <span className="text-danger">*</span></label>
                      <select name="role" id="role" className="form-control" onChange={this.handleOnChange} required>
                        <option value="">--Select Role--</option>
                        <option value="customer">Customer</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="fname">First Name <span className="text-danger">*</span></label>
                      <input type="text" name="firstName" onKeyPress={event => this.onKeyPress(event)} className="form-control" id="fname" placeholder="Enter First Name" onChange={this.handleOnChange} value={this.state.firstName} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lname">Last Name <span className="text-danger">*</span></label>
                      <input type="text" name="lastName" onKeyPress={event => this.onKeyPress(event)} className="form-control" id="lname" placeholder="Enter Last Name" onChange={this.handleOnChange} value={this.state.lastName} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lEmail">Email address <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" name="email" id="lEmail" onChange={this.handleOnChange} placeholder="Enter email" value={this.state.email} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lpassword">Password <span className="text-danger">*</span></label>
                      <input type="password" className="form-control" name="password" id="lpassword" onChange={this.handleOnChange} placeholder="Enter password" value={this.state.password} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lpassword_confirmation">Confirm Password <span className="text-danger">*</span></label>
                      <input type="password" className="form-control" name="password_confirmation" id="lpassword_confirmation" onChange={this.handleOnChange} placeholder="Enter confirmation password" value={this.state.password_confirmation} />
                    </div>


                    <div className="form-group">
                      <label htmlFor="mnumber">Mobile Number <span className="text-danger">*</span></label>
                      <input type="number" name="mobileNumber" className="form-control" id="mnumber" placeholder="Enter Mobile Number" onChange={this.handleOnChange} value={this.state.mobileNumber} />
                    </div>
                    <h3><p className="mt-3 mb-3 w-100 float-left"><strong>Address</strong></p></h3>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-6">
                          <label htmlFor="houseNumber">House #</label>
                          <input type="text" className="form-control" name="houseNumber" id="houseNumber" onChange={this.handleOnChange} placeholder="House #" value={this.state.houseNumber} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="street">Street <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" name="street" id="street" onChange={this.handleOnChange} placeholder="Street" value={this.state.street} />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="barangay">Barangay <span className="text-danger">*</span></label>
                      <select name="barangay" className="form-control" onChange={this.handleOnChange}>
                        <option value="">--Select Barangay--</option>
                        {barangays.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <div className="col-12">
                          <button type="button" onClick={this.openModal} className="ui inverted primary button w-100">Create Account</button>
                      </div>
                    </div>
                  </form>
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    ariaHideApp={false}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <div className="modal-header">
                      <span>Terms and Conditions</span>
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
            </div>
          </div>
        </div>
      </div>

    );

  }
}

export default Register;
