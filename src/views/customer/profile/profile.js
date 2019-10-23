import React, { Component } from 'react';

import '../profile/profile.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileBase64 from 'react-file-base64';
import Loading from '../loading';
import moment from 'moment';

class Profile extends Component {
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
        this.handleOnChange = this.handleOnChange.bind(this);
        this.getFiles = this.getFiles.bind(this);
        this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
    }

    handleOnChange = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            [e.target.name]: e.target.value
        });
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

    handleProfileUpdate = (e) => {
        e.preventDefault();

        this.setState({ isLoaded: true });
        toast.configure();
        axios.post('https://stockwatch.site/public/api/update/customer', {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            mobileNumber: this.state.mobileNumber,
            image: this.state.image,
            imageName: this.state.imageName,
            imageType: this.state.imageType,
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status == 200) {
                    let fullName = result.data.user.firstName + " " + result.data.user.lastName;
                    this.setState({
                        user: result.data.user,
                        firstName: result.data.user.firstName,
                        lastName: result.data.user.lastName,
                        email: result.data.user.email,
                        mobileNumber: result.data.user.mobileNumber,
                        image: result.data.user.image,
                        image: this.state.image,
                        isLoaded: false,
                    });

                    sessionStorage.setItem('firstName', this.state.user.firstName)
                    sessionStorage.setItem('lastName', this.state.user.lastName)
                    sessionStorage.setItem('fullName', fullName)
                    sessionStorage.setItem('user_id', this.state.user.id)
                    sessionStorage.setItem('email', this.state.user.email)
                    sessionStorage.setItem('role', this.state.user.role)
                    sessionStorage.setItem('created_at', this.state.user.created_at)
                    sessionStorage.setItem('image', this.state.user.image)
                    sessionStorage.setItem('mobileNumber', this.state.user.mobileNumber)


                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    window.location.reload();
                }

            })
            .catch(error => {
                this.setState({ isLoaded: false });
                error.response.data.errors.map((error) => {
                    toast.error(error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
            });
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

        const BookTable = () => (

            this.state.books.map((book, i) => (
                <tr key={i}>
                    <td><Link to={`/user/book/${book.id}`}>{moment(book.created_at).format('YYYY-MM-DD')}</Link></td>
                    <td>{book.laundry_shop.shopName}</td>
                    <td>{book.amount}</td>
                    <td>{book.status}</td>
                </tr>
            )
            )
        )

        return (
            <div className="animated fadeIn">
                <div className="col mt-5 pr-0 pl-0">
                    <div className="card profile-card-3">
                        <div className="background-block">
                            <img src={window.location.origin + '/assets/img/bubbles.png'} alt="profile-sample1" className="background" />
                        </div>
                        <div className="profile-thumb-block">
                            <img src={`https://stockwatch.site/public/storage/avatar/${sessionStorage.getItem('image')}`} alt="profile-image" className="profile" />
                        </div>
                        <div className="card-content">
                            <h2>{`${this.state.user.firstName} ${this.state.user.lastName}`}<small>{this.state.user.role}</small></h2>
                            {/* <div className="icon-block"><a href="#"><i className="fa fa-facebook"></i></a><a href="#"> <i className="fa fa-twitter"></i></a><a href="#"> <i className="fa fa-google-plus"></i></a></div> */}
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h3><p className="mt-3 w-100 float-left"><strong>Information</strong></p></h3>
                            <hr />
                            <div className="information">
                                <form onSubmit={this.handleProfileUpdate}>
                                    <div className="form-group">
                                        <label htmlFor="fname">First Name</label>
                                        <input type="text" name="firstName" className="form-control" id="fname" placeholder="Enter First Name" onChange={this.handleOnChange} value={this.state.firstName} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="lname">Last Name</label>
                                        <input type="text" name="lastName" className="form-control" id="lname" placeholder="Enter Last Name" onChange={this.handleOnChange} value={this.state.lastName} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lEmail">Email address</label>
                                        <input type="email" className="form-control" name="email" id="lEmail" onChange={this.handleOnChange} placeholder="Enter email" value={this.state.email} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="mnumber">Mobile Number</label>
                                        <input type="number" name="mobileNumber" className="form-control" id="mnumber" placeholder="Enter Mobile Number" onChange={this.handleOnChange} value={this.state.mobileNumber} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlFile1">Upload Profile Photo</label>
                                        <FileBase64
                                            multiple={false}
                                            onDone={this.getFiles.bind(this)} />
                                    </div>
                                    <button type="submit" onClick={this.submit} className="ui inverted primary button float-right">Update</button>

                                </form>
                            </div>
                        </div>
                    </div>
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
                    <h3><p className="mt-3 w-100 float-left"><strong>Books</strong></p></h3>
                    <div className="book-table">
                        <div className="card mt-5">
                            <div className="card-header">
                                <strong>Books</strong>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Laundry Shop</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <BookTable />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Profile;
