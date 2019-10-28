import React, { Component } from 'react';

import '../books/book.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../loading';
import { _ } from 'core-js';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0',
        width: '80%',
        height: '178px',
        transform: 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root')
class Book extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isloaded: false,
            book: [],
            user: [],
            laundry: [],
            address: [],
            services: [],
            delivery_charge_id: '',
            wash: 0,
            kilosWashAmount: 0,
            kilosDryAmount: 0,
            dry: 0,
            total: 0,
            deliveryCharge: 0,
            subTotal: 0,
            modalIsOpen: false
        };
        console.log(props.match.params.id)
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    openModal() {
        this.setState({
            modalIsOpen: true,
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }


    openModalCancelled() {
        this.setState({
            modalIsOpenApproved: false,
            modalIsOpenCancelled: true
        });
    }

    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://stockwatch.site/public/api/book/${this.props.match.params.id}/get/${sessionStorage.getItem('user_id')}`, {
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
                        delivery_charge_id: result.data.deliveryCharge.id,
                        deliveryCharge: result.data.deliveryCharge.amount,
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


    handleCheckout = (e) => {
        e.persist();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isloaded: true
        });

        axios.post(`https://stockwatch.site/public/api/book/checkout/${this.props.match.params.id}`, {
            delivery_charge_id: this.state.delivery_charge_id,
            amount: this.state.total
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                toast.success(result.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });

                this.setState({
                    isloaded: false
                });
                this.props.history.push(`/user/book/${this.props.match.params.id}`);
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    isloaded: false
                });
                error.response.data.errors.map((error) => {
                    toast.error(error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
            });

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
                        <span className="text-muted">{`${this.state.book.wash} x ${this.state.laundry.washPrice}`}</span>
                        <span className="text-muted"> = </span>
                        <span className="text-muted">{`P ${parseFloat(this.state.wash).toFixed(2)}`}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 className="my-0">Dry</h6>
                            {/* <small className="text-muted">Brief description</small> */}
                        </div>
                        <span className="text-muted ml-adjust">{`${this.state.book.dry} x ${this.state.laundry.dryPrice}`}</span>
                        <span className="text-muted"> = </span>
                        <span className="text-muted">{`P ${parseFloat(this.state.dry).toFixed(2)}`}</span>
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
                    <span className="text-muted">{` ${this.state.book.kiloWash} x ${this.state.laundry.price}`}</span>
                    <span className="text-muted"> = </span>
                    <span className="text-muted">{`P ${parseFloat(this.state.kilosWashAmount).toFixed(2)}`}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                        <h6 className="my-0">Kilo Dry</h6>
                        {/* <small className="text-muted">Brief description</small> */}
                    </div>
                    <span className="text-muted">{` ${this.state.book.kiloDry} x ${this.state.laundry.price}`}</span>
                    <span className="text-muted"> = </span>
                    <span className="text-muted">{`P ${parseFloat(this.state.kilosDryAmount).toFixed(2)}`}</span>
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
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="content col">
                                <div className="col">
                                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-bold">Booked Services</span>

                                    </h4>
                                    <ul className="list-group mb-3">
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
                                    <form>
                                        <div className="input-group mb-5">
                                            <input type="text" className="form-control" placeholder="Promo code" />
                                            <div className="input-group-append">
                                                <button className="btn btn-secondary">Redeem</button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <button type="cancel" className="btn btn-danger">Cancel</button>
                                            <button onClick={this.openModal} type="button" className="btn btn-primary ml-3">Check Out</button>
                                        </div>
                                        <Modal
                                            isOpen={this.state.modalIsOpen}
                                            onRequestClose={this.closeModal}
                                            style={customStyles}
                                            contentLabel="CheckOut"
                                        >

                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel"></h5>
                                                {/* <span>{`${this.state.book.user.firstName} ${this.state.book.user.lastName} `}</span> */}
                                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <p>Are you sure you want to CheckOut this order?</p>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                                <button type="button" onClick={this.handleCheckout} className="btn btn-primary">Yes</button>
                                            </div>
                                        </Modal>
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

export default Book;
