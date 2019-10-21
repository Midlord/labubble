import React, { Component } from 'react';

import './ownerBook.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../../customer/loading';
import Moment from 'moment';

class OrderDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isloaded: false,
            book: [],
            user: [],
            laundry: [],
            address: [],
            services: [],
            transaction: [],
            reward: [],
            wash: 0,
            dry: 0,
            total: 0,
            deliveryCharge: 0,
            subTotal: 0,
            remarks: '',
            modalIsOpen: false
        };
        console.log(props.match.params.id)
        this.goBack = this.goBack.bind(this);

    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    // afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     this.subtitle.style.color = '#f00';
    // }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }


    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://stockwatch.site/public/api/book/${this.props.match.params.id}/get`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        book: result.data.book,
                        laundry: result.data.book.laundry,
                        wash: parseFloat(result.data.book.laundry_shop.washPrice) * parseInt(result.data.book.wash),
                        dry: parseFloat(result.data.book.laundry_shop.dryPrice) * parseInt(result.data.book.dry),
                        user: result.data.user,
                        address: result.data.address,
                        services: result.data.services,
                        isloaded: false,
                        deliveryCharge: result.data.deliveryCharge.amount,
                        total: result.data.book.amount,
                    })
                    this.setState({
                        subTotal: parseFloat(result.data.book.amount) + parseFloat(result.data.deliveryCharge.amount),
                    })
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: true
                });

                console.log(error)
            });

        // console.log('services', this.state.services)
    }

    goBack = (e) => {
        this.props.history.goBack()
    }

    render() {
        const BookedServices = () => (
            this.state.services.map((service, i) => (
                <li className="list-group-item d-flex justify-content-between lh-condensed" key={i}>
                    <div>
                        <h6 className="my-0">{service.title}</h6>
                        {/* <small className="text-muted">Brief description</small> */}
                    </div>
                    <span className="text-muted">{`P ${service.price}`}</span>
                </li>
            ))
        )
        if (this.state.isloaded) {
            return (
                <div><Loading /></div>
            );
        }

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-6  mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-bold">User Info</span>
                        </h4>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">Name</h6>
                                </div>
                                <span className="text-muted">{`${this.state.book.user.firstName} ${this.state.book.user.lastName}`}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">Email</h6>
                                </div>
                                <span className="text-muted">{` ${this.state.book.user.email}`}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">Mobile Number</h6>
                                </div>
                                <span className="text-muted">{` ${this.state.book.user.mobileNumber}`}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">Address</h6>
                                </div>
                                <span className="text-muted">{` ${this.state.book.address.houseNumber} ${this.state.book.address.street} ${this.state.book.address.barangay} ${this.state.book.address.city}`}</span>
                            </li>


                        </ul>
                    </div>
                    <div className="col-6">
                        <div className="col  mb-4">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-bold">Booked Services</span>
                                <span className="badge badge-secondary badge-pill">{this.state.services.length}</span>
                            </h4>
                            <ul className="list-group mb-3">
                                <BookedServices />

                                <li className="list-group-item d-flex justify-content-between lh-condensed">
                                    <div>
                                        <h6 className="my-0">Wash</h6>

                                    </div>
                                    <span className="text-muted">{`P ${this.state.wash}`}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between lh-condensed">
                                    <div>
                                        <h6 className="my-0">Dry</h6>

                                    </div>
                                    <span className="text-muted">{`P ${this.state.dry}`}</span>
                                </li>

                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total</span>
                                    <strong>{`P ${parseFloat(this.state.total).toFixed(2)}`} </strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <div className="text-danger">
                                        <h6 className="my-0">Delivery Charges</h6>
                                    </div>
                                    <span className="text-success">P {this.state.deliveryCharge}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Sub Total</span>
                                    <strong>{`P ${parseFloat(this.state.subTotal).toFixed(2)}`} </strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default OrderDetail;
