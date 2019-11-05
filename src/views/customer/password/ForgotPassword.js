import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading';
import {
    AppHeader,
} from '@coreui/react';
import '../password/css/password.css';
class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            token: '',
            password:'',
            confirm_password:'',
            isVerified: false,
            isFinal: false,
            type: 'password',
            isLoaded: false,
        }
        this.handleOnChange = this.handleOnChange.bind(this);
        this.showHide = this.showHide.bind(this);
    }


    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    showHide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            type: this.state.type === 'input' ? 'password' : 'input'
        })
    }

    handleEmail = (e) => {
        e.preventDefault();
        this.setState({ isLoaded: true });
        toast.configure();
        axios.post('https://labubbles.online/api/send/email', {
            email: this.state.email,
        }, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    this.setState({
                        isLoaded: false,
                        isVerified: true
                    })
                }
            })
            .catch(error => {
                this.setState({
                    isLoaded: false,
                });
                toast.error(error.response.data.error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            });
    }

    handleToken = (e) => {
        e.preventDefault();
        this.setState({ isLoaded: true });
        toast.configure();
        axios.post('https://labubbles.online/api/validate/token', {
            token: this.state.token,
        }, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(result => {
                if (result.status == 200) {
                    this.setState({
                        isLoaded: false,
                        isVerified: true,
                        isFinal: true
                    })
                }
            })
            .catch(error => {
                this.setState({
                    isLoaded: false,
                    isVerified: true,
                    isFinal: false
                });
                toast.error(error.response.data.error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            });
    }

    handleValidate = (e) => {
        e.preventDefault();
        this.setState({ isLoaded: true });
        toast.configure();
        axios.post(`https://labubbles.online/api/password/reset/${this.state.token}`, {
            password: this.state.password,
            confirm_password: this.state.confirm_password,
        }, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(result => {
                if (result.status == 200) {
                    this.setState({
                        isLoaded: false,
                    })

                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    //redirect to login page
                    this.props.history.push(`/login`);
                }
            })
            .catch(error => {
                this.setState({
                    isLoaded: false,
                });
                toast.error(error.response.data.error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            });
    }



    render() {
        if (this.state.isLoaded) {
            return (
                <Loading />
            )
        }
        return (
            <div className="forgot_container">
                <AppHeader fixed className="fixed-top">
                    <Link to={`/login`}><i className="fa fa-arrow-left back-button" aria-hidden="true"></i></Link>
                </AppHeader>
                <div className="app flex-row align-items-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                                <div className="card card-signin my-5">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">Forgot Password</h5>
                                        {this.state.isFinal ? (
                                            <form className="form-signin" onSubmit={this.handleValidate}>
                                                <div className="form-label-group">
                                                    <input type={this.state.type} placeholder="Password"  className="form-control" name="password" id="inputPassword" autoComplete="current-password" onChange={this.handleOnChange} required />
                                                    <i onClick={this.showHide} className={this.state.type === 'input' ? 'fa fa-eye fa-lg mt-2' : 'fa fa-eye-slash fa-lg mt-2'} style={{ position: 'absolute', right: '6px', zIndex: '99999', top: '9px' }}></i>
                                                    <label htmlFor="inputPassword">New Password</label>
                                                </div>
                                                <div className="form-label-group">
                                                    <input type={this.state.type} placeholder="Password"  className="form-control" name="confirm_password" id="inputConfirm" autoComplete="password-password" onChange={this.handleOnChange} required />
                                                    <i onClick={this.showHide} className={this.state.type === 'input' ? 'fa fa-eye fa-lg mt-2' : 'fa fa-eye-slash fa-lg mt-2'} style={{ position: 'absolute', right: '6px', zIndex: '99999', top: '9px' }}></i>
                                                    <label htmlFor="inputConfirm">Confirm New Password</label>
                                                </div>
                                                <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                                            </form>
                                        ) : !this.state.isVerified ? (
                                            <form className="form-signin" onSubmit={this.handleEmail}>
                                                <div className="form-label-group">
                                                    <input type="email" name="email" onChange={this.handleOnChange} id="inputEmail" className="form-control" placeholder="Email address" required />
                                                    <label htmlFor="inputEmail">Email address</label>
                                                </div>
                                                <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Submit</button>
                                            </form>
                                        ) : (
                                                    <form className="form-signin" onSubmit={this.handleToken}>
                                                        <div className="form-label-group">
                                                            <input type="text" name="token" onChange={this.handleOnChange} id="inputToken" className="form-control" placeholder="Code" required />
                                                            <label htmlFor="inputToken">Code</label>
                                                        </div>

                                                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Submit</button>
                                                    </form>
                                                )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgotPassword;
