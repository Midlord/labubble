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
      errorMessage: '',
      passwordStrength: '',
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

  measureStrength = (password) => {
    let score = 0
    let passwordStrength
    let regexPositive = [
      "[A-Z]",
      "[a-z]",
      "[0-9]",
      "\\W",
    ]
    regexPositive.forEach((regex, index) => {
      if (new RegExp(regex).test(password)) {
        score += 1
      }
    })
    switch (score) {
      case 0:
      case 1:
        passwordStrength = "Weak"
        break;
      case 2:
      case 3:
        passwordStrength = "Good"
        break;
      case 4:
      case 5:
        passwordStrength = "Strong"
        break;
    }
    this.setState({
      passwordStrength
    })
  }

  validate = (e) => {
    let password = e.target.value
    let errorMessage
    let capsCount, smallCount, numberCount, symbolCount
    if (password.length < 8) {
      this.setState({
        errorMessage: "Password must be 8 Characters",
      })
    }
    else {
      capsCount = (password.match(/[A-Z]/g) || []).length
      smallCount = (password.match(/[a-z]/g) || []).length
      numberCount = (password.match(/[0-9]/g) || []).length
      symbolCount = (password.match(/\W/g) || []).length
      if (capsCount < 1) {
        errorMessage = "Must contains Uppercase"
      }
      else if (smallCount < 1) {
        errorMessage = "Must contains Lowercase"
      }
      else if (numberCount < 1) {
        errorMessage = "Must contains Numbers"
      }
      else if (symbolCount < 1) {
        errorMessage = "Must contains Special Characters"
      }
      this.setState({
        errorMessage
      })
      this.measureStrength(password)
    }
  }

  handleOnChangePassword = (e) => {
    this.validate(e)
    this.setState({ password: e.target.value })
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
    axios.post('http://localhost:8000/api/register', {
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
                      <input type="password" className="form-control" name="password" id="lpassword" onChange={this.handleOnChangePassword} placeholder="Enter password" value={this.state.password} />
                    </div>
                    {this.state.password !== '' ? (
                      <div className="form-group">
                        <div>
                          <p>{this.state.errorMessage}</p>
                        </div>
                        <div>
                          <p className={`text-${this.state.passwordStrength === 'Weak'
                            ? 'danger' :
                            this.state.passwordStrength === 'Good' ? 'primary' :
                              this.state.passwordStrength === 'Strong' ? 'primary' : ''
                            }`}>{this.state.passwordStrength}</p>
                        </div>
                      </div>
                    ) : ''}

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
                        <h1>Terms and Conditions ("Terms") </h1>


                        <p>Last updated: November 11, 2019</p>


                        <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the  website (the "Service") operated by  ("us", "we", or "our").</p>

                        <p> Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service. </p>

                        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. </p>


                        <h2>Accounts</h2>

                        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

                        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

                        <p>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>


                        <h2>Termination</h2>

                        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                        <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>

                        <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>


                        <h2>Governing Law</h2>

                        <p>These Terms shall be governed and construed in accordance with the laws of Philippines, without regard to its conflict of law provisions.</p>

                        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p>


                        <h2>Changes</h2>

                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 15 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

                        <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>


                        <h2>Contact Us</h2>

                        <p>If you have any questions about these Terms, please contact us.</p>
                        <p>EMAIL ADDRESS <br />
                          labubbles.app@gmail.com  <br />
                          MOBILE NO. <br />
                          +63 9368574083 <br />
                          +63 9239233987 <br />
                        </p>

                        <p><strong>Disclaimers:</strong></p>
                        <ul>
                          <li>The services inside this application are only available for customers and laundry shops in Angeles City.</li>
                          <li>Delivery services are only available from 8:00 am &ndash; 8:00 pm.</li>
                          <li>For Customers:
<ul>
                              <li>You must be available and present during the pick and drop of the laundry.</li>
                              <li>Payment will be collected upon the pickup of your laundry.</li>
                            </ul>
                          </li>
                          <li>For Laundry Shop:
<ul>
                              <li>You must be available and present during the pick and drop of the laundry.</li>
                              <li>Payment will be given upon the pickup of the completed order.</li>
                              <li>You are liable for any damages or lost items during the time that an orders is under your provision.</li>
                            </ul>
                          </li>
                        </ul>
                        <p><strong>&nbsp;</strong></p>
                        <p><strong>Privacy Policy</strong></p>
                        <p>This section is used to inform possible users regarding the policies with the collection, use, and disclosure of Personal Information if anyone decided to use this application.</p>
                        <p>If you choose to use this Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that this application collect is used for providing and improving the Service. Your information will not be shared to anyone.</p>
                        <p>For a better experience, while using our Service, We may require you to provide us with certain personally identifiable information, including but not limited to Name, Address, Contact No., and Email Address. The information that we request will be retained on your device and is not collected in any way.</p>

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
