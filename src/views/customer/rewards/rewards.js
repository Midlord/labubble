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
            firstName: '',
            lastName: '',
            mobileNumber: '',
            email: '',
            files: [],
            image: '',
            points: '',
            imageName: '',
            imageType: '',
            isLoaded: false,
        };
    }

    componentDidMount() {
        this.setState({ isLoaded: true });
        axios.get(`https://stockwatch.site/public/api/customer/info/${sessionStorage.getItem('user_id')}`, {
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
                    points: result.data.points,
                    isloaded: false
                })
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
                    <div className="col-12">
                        <h3><p className="mt-3 w-100 float-left"><strong>Rewards</strong></p></h3>
                        <div className="ratings">
                            <div className="mt-5">
                                <div className="card border-info shadow text-info p-3 my-card">
                                    <span className="fa fa-trophy trophy-size" aria-hidden="true"></span>
                                    <div className="text-info text-center mt-3"><h4>Points</h4></div>
                                    <div className="text-info text-center mt-2"><h1>{this.state.points}</h1></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Rewards;
