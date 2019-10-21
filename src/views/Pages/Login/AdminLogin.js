import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import './login.css';
class AdminLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoggedIn: false,
      role: '',
      isDeleted: '',
      type: 'password',
      isLoaded: false
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.showHide = this.showHide.bind(this);
  }

  handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toast.configure();
    this.setState({
      isLoaded: true
    });
    axios.post('https://stockwatch.site/public/api/login', {
      email: this.state.email,
      password: this.state.password
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
          let fullName = result.data.user.firstName + " " + result.data.user.lastName;

          sessionStorage.setItem('token', result.data.token)
          sessionStorage.setItem('firstName', result.data.user.firstName)
          sessionStorage.setItem('lastName', result.data.user.lastName)
          sessionStorage.setItem('fullName', fullName)
          sessionStorage.setItem('user_id', result.data.user.id)
          sessionStorage.setItem('email', result.data.user.email)
          sessionStorage.setItem('role', result.data.user.role)
          sessionStorage.setItem('created_at', result.data.user.created_at)
          sessionStorage.setItem('image', result.data.user.image)
          sessionStorage.setItem('mobileNumber', result.data.user.mobileNumber)

          this.setState({
            isLoggedIn: true,
            role: result.data.user.role,
            isDeleted: result.data.user.is_deleted,
            isLoaded: false
          })

          // if (this.state.role == 'customer') {
          //   this.props.history.push(`/customer/dashboard`);
          // }else if(this.state.role == 'owner'){
          //   this.props.history.push(`/owner/dashboard`);
          // } else {
          // }
            this.props.history.push(`/admin/dashboard`);
        }
      })
      .catch(error => {
        toast.error(error.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT
        });

        this.setState({
          isLoaded: false
        })

      });
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type == 'input' ? 'password' : 'input'
    })
  }

  componentWillMount() {
    if (sessionStorage.getItem('token')) {
      this.setState({
        isLoggedIn: true,
        role: sessionStorage.getItem('role')
      })
    }
    if (sessionStorage.getItem('token') && sessionStorage.getItem('role') === 'admin') {
      this.props.history.push(`/admin/dashboard`);
    } else if (sessionStorage.getItem('token') && sessionStorage.getItem('role') === 'owner') {
      this.props.history.push(`/owner/dashboard`);
    } else if (sessionStorage.getItem('token') && sessionStorage.getItem('role') === 'customer') {
      this.props.history.push(`/customer/dashboard`);
    } else {

      this.props.history.push(`/admin/login`);
    }
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
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
        {/* <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleLogin}>
                      <h1 className="text-center mb-3">Login</h1>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" name="email" placeholder="Email" autoComplete="email" onChange={this.handleOnChange} required />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type={this.state.type} placeholder="Password" name="password" autoComplete="current-password" onChange={this.handleOnChange} required />
                        <i onClick={this.showHide} className={this.state.type == 'input' ? 'fa fa-eye fa-lg mt-2' : 'fa fa-eye-slash fa-lg mt-2'} style={{ position: 'absolute', right: '6px', zIndex: '99999' }}></i>
                      </InputGroup>
                      <Row>
                        <Col xs="4">
                          <Button color="primary" type="submit">Login</Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="8">
                          <p>Don't have an account yet? <Link to="/register">Register</Link></p>
                        </Col>
                        <Col xs="4">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container> */}
        <div className="container">
          <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div className="card card-signin my-5">
                <div className="card-body">
                  <h5 className="card-title text-center">Administrator</h5>
                  <form className="form-signin" onSubmit={this.handleLogin}>
                    <div className="form-label-group">
                      <input type="email" name="email" onChange={this.handleOnChange} id="inputEmail" className="form-control" placeholder="Email address" required />
                      <label htmlFor="inputEmail">Email address</label>
                    </div>

                    <div className="form-label-group">
                    <Input type={this.state.type} placeholder="Password" name="password" id="inputPassword" autoComplete="current-password" onChange={this.handleOnChange} required />
                        <i onClick={this.showHide} className={this.state.type == 'input' ? 'fa fa-eye fa-lg mt-2' : 'fa fa-eye-slash fa-lg mt-2'} style={{ position: 'absolute', right: '6px', zIndex: '99999', top:'9px' }}></i>
                      <label htmlFor="inputPassword">Password</label>
                    </div>

                    <div className="custom-control custom-checkbox mb-3">
                      <input type="checkbox" className="custom-control-input" id="customCheck1" />
                      <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                    <hr className="my-4" />
                    {/* <Link className="btn btn-lg btn-facebook btn-block text-uppercase" to="/register"><i className="fa fa-registered mr-2"></i>Sign Up</Link> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminLogin;
