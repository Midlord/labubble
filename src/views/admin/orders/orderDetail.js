import React, { Component } from 'react';

import './ownerBook.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../../customer/loading';
import Moment from 'moment';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '25%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0',
        width: '85%',
        transform: 'translate(-50%, -50%)'
    }
};


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
            modalIsOpen: false,
            isOtw: false,
        };
        console.log(props.match.params.id)
        this.goBack = this.goBack.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleProcessOrder = this.handleProcessOrder.bind(this);


    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleProcessOrder = (e) => {

        toast.configure();

        this.setState({
            isloaded: true
        });
        axios.get(`https://stockwatch.site/public/api/delivery/process/order/${this.props.match.params.id}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result.data.deliveryOrders)
                if (result.status === 200) {
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    this.setState({
                        deliveryOrders: result.data.deliveryOrders,
                        isloaded: false,
                    });

                    this.props.history.push(`/deliveries/orders`);

                }
                // console.log(this.state.deliveryOrders)
            })
            .catch(error => {
                this.setState({
                    isloaded: true
                });

                console.log(error)
            });

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
                        laundry: result.data.book.laundry_shop,
                        wash: parseFloat(result.data.book.laundry_shop.washPrice) * parseInt(result.data.book.wash),
                        dry: parseFloat(result.data.book.laundry_shop.dryPrice) * parseInt(result.data.book.dry),
                        user: result.data.user,
                        address: result.data.address,
                        services: result.data.services,
                        isloaded: false,
                        kilosWashAmount: parseFloat(result.data.book.laundry_shop.price) * parseInt(result.data.book.kiloWash),
                        kilosDryAmount: parseFloat(result.data.book.laundry_shop.price) * parseInt(result.data.book.kiloDry),
                        deliveryCharge: result.data.deliveryCharge.amount,
                        isOtw: result.data.isOtw
                    })

                    if (result.data.book.laundry_shop.type === 'kilos') {
                        if (result.data.book.kiloDry === null || result.data.book.kiloDry === "") {
                            this.setState({
                                kilosDryAmount: 0
                            });
                        } else if (result.data.book.kiloWash === null || result.data.book.kiloWash === "") {
                            this.setState({
                                kilosWashAmount: 0
                            });
                        } else {
                            this.setState({
                                subTotal: parseInt(this.state.kilosWashAmount) + parseInt(this.state.kilosDryAmount) + parseInt(result.data.total)
                            });
                        }
                    } else {
                        this.setState({
                            subTotal: (parseInt(this.state.wash) + parseInt(this.state.dry)) + parseInt(result.data.total)
                        });
                    }

                    this.setState({
                        total: parseInt(this.state.deliveryCharge) + parseInt(this.state.subTotal),
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

    handleReAssign = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        axios.get(`https://stockwatch.site/public/api/delivery/reassign/${this.props.match.params.id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        deliveryOrders: result.data.deliveryOrders,
                        isloaded: false,
                        modalIsOpen: false,
                    })

                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    this.props.history.push(`/delivery/orders`);
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: false
                });

                console.log(error)
            });
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

        const DryWash = () => {
            return (
                <div className="parent">
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 className="my-0">Wash</h6>
                            {/* <small className="text-muted">Brief description</small> */}
                        </div>
                        <span className="text-muted">{`P ${this.state.wash}`}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 className="my-0">Dry</h6>
                            {/* <small className="text-muted">Brief description</small> */}
                        </div>
                        <span className="text-muted">{`P ${this.state.dry}`}</span>
                    </li>
                </div>
            )
        }

        const Kilos = () => (
            <div className="parent">
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                        <h6 className="my-0">Kilo Wash</h6>
                        {/* <small className="text-muted">Brief description</small> */}
                    </div>
                    <span className="text-muted">{`P ${parseFloat(this.state.kilosWashAmount).toFixed(2)}`}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                        <h6 className="my-0">Kilo Dry</h6>
                        {/* <small className="text-muted">Brief description</small> */}
                    </div>
                    <span className="text-muted">{`P ${parseFloat(this.state.kilosDryAmount).toFixed(2)}`}</span>
                </li>
            </div>
        )
        const LaundryInfo = () => (
            <div className="parent">
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                        <h6 className="my-0">Shop Name</h6>
                        {/* <small className="text-muted">Brief description</small> */}
                    </div>
                    <span className="text-muted">{this.state.book.laundry_shop.shopName}</span>
                </li>
            </div>
        )
        if (this.state.isloaded) {
            return (
                <div><Loading /></div>
            );
        }

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-6 col-6 col-12  mb-4">
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
                                <span className="text-muted">{` ${this.state.book.address.houseNumber === null ? '' : this.state.book.address.houseNumber} ${this.state.book.address.street} ${this.state.book.address.barangay} ${this.state.book.address.city}`}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 col-6 col-12  mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-bold">Laundry Shop Info</span>
                        </h4>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">Shop Name</h6>
                                </div>
                                <span className="text-muted">{`${this.state.laundry.shopName}`}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">Mobile Number</h6>
                                </div>
                                <span className="text-muted">{` ${this.state.laundry.user.mobileNumber}`}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">Address</h6>
                                </div>
                                <span className="text-muted">{` ${this.state.laundry.houseNumber === null ? '' : this.state.laundry.houseNumber} ${this.state.laundry.street} ${this.state.laundry.barangay} ${this.state.book.address.city}`}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 col-6 col-12">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-bold">Booked Services</span>

                        </h4>
                        <ul className="list-group mb-3">
                            <LaundryInfo />
                            <BookedServices />
                            {this.state.book.laundry_shop.type === 'loads' ? (
                                <DryWash />
                            ) : (<Kilos />
                                )}

                            <li className="list-group-item d-flex justify-content-between">
                                <span>SubTotal</span>
                                <strong>{`P ${parseFloat(this.state.subTotal).toFixed(2)}`} </strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between bg-light">
                                <div className="text-danger">
                                    <h6 className="my-0">Delivery Charges</h6>
                                </div>
                                <span className="text-success">P {this.state.deliveryCharge}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total</span>
                                <strong>{`P ${parseFloat(this.state.total).toFixed(2)}`} </strong>
                            </li>
                        </ul>
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            ariaHideApp={false}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <div className="modal-header">
                                {/* <span>{`${this.state.book.user.firstName} ${this.state.book.user.lastName} `}</span> */}
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to Reject this order?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                <button type="button" onClick={this.handleReAssign} className="btn btn-primary">Yes</button>
                            </div>
                        </Modal>
                        {this.state.isOtw ? '' :
                            (
                                <div className="actions mb-3">
                                    <div className="col-12 text-right">
                                        <button onClick={this.handleProcessOrder} className="btn btn-primary">OTW</button>
                                        <button onClick={this.openModal} className="btn btn-danger ml-2">Reject</button>
                                    </div>
                                </div>
                            )}

                    </div>
                </div>
            </div>
        );
    }
}

export default OrderDetail;
