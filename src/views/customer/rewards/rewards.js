import React, { Component } from 'react';

import '../profile/profile.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileBase64 from 'react-file-base64';
import Loading from '../loading';
import moment from 'moment';

class Rewards extends Component {
    constructor(props) {
        super(props);

        this.state = {
            laundry: [],
            books: [],
            user: [],
            userCodes: [],
            firstName: '',
            lastName: '',
            mobileNumber: '',
            email: '',
            files: [],
            image: '',
            points: '',
            imageName: '',
            imageType: '',
            isloaded: false,
        };
    }

    componentDidMount() {
        this.setState({ isLoaded: true });
        axios.get(`https://labubbles.online/api/customer/info/${sessionStorage.getItem('user_id')}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result.data)
                this.setState({
                    user: result.data.user,
                    firstName: result.data.user.firstName,
                    lastName: result.data.user.lastName,
                    email: result.data.user.email,
                    mobileNumber: result.data.user.mobileNumber,
                    image: result.data.user.image,
                    books: result.data.books,
                    points: result.data.user.points,
                    userCodes: result.data.userCodes,
                    isloaded: false
                })
            })
            .catch(error => {
                console.log(error)
            });
    }

    handleGenerate = () => {
        this.setState({ isLoaded: true });
        toast.configure();
        axios.get(`https://labubbles.online/api/customer/generate/code`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result.data)
                toast.success(result.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  });
                this.setState({
                    userCodes: result.data.userCodes,
                    points: result.data.userCodes.user.points,
                    isloaded: false
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        if (this.state.isloaded) {
            return (
                <Loading />
            );
        }
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-12 mb-3">
                        <h3><strong>Rewards</strong></h3>
                        <div className="ratings">
                            <div>
                                <div className="card border-info shadow p-3 my-card">
                                    <span className="fa fa-trophy trophy-size" aria-hidden="true"></span>
                                    <div className="text-center mt-3"><h4>Points</h4></div>
                                    <div className="text-center mt-3 mb-3"><h1>{this.state.points}</h1></div>
                                    <p><strong>Note: </strong> You need to earn at least 50 points to redeem. </p>
                                </div>
                            </div>
                        </div>
                        {this.state.points >= 50.00 ? (
                            <div className="text-right">
                                <button className="btn btn-primary" onClick={this.handleGenerate}>Generate</button>
                            </div>
                        ) : ''}
                    </div>
                    {this.state.userCodes ? (
                        <div className="col-12">
                            <h2><strong>Coupons</strong></h2>
                            <div className="ratings">
                                <div>
                                    <div className="card border-info shadow p-3 my-card">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.userCodes.map((code, i) => (
                                                    <tr key={i}>
                                                        <td>{code.code}</td>
                                                        <td>{code.isUsed === 0 ? 'Active' : 'Inactive'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </div>

        );
    }
}

export default Rewards;
