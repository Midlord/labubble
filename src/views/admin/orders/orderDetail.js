import React, { Component } from 'react';

import './ownerBook.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../../customer/loading';
import moment from 'moment';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
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
            bookRemarks: [],
            reward: [],
            wash: '',
            dry: '',
            kiloWashQty: '',
            kiloDryQty: '',
            loadsWashQty: '',
            loadsDryQty: '',
            total: 0,
            deliveryCharge: 0,
            subTotal: 0,
            remarks: '',
            modalIsOpen: false,
            modalUpdateOpen: false,
            isOtw: false,
            isCollect: false,
            isEndLaundry: false,
            isDelivered: 0,
        };
        console.log(props.match.params.id)
        this.goBack = this.goBack.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openModalOrder = this.openModalOrder.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleProcessOrder = this.handleProcessOrder.bind(this);


    }

    openModalOrder = () => {
        this.setState({
            modalUpdateOpen: true,
            kiloDryQty: this.state.book.kiloDry,
            kiloWashQty: this.state.book.kiloWash,
            loadsDryQty: this.state.book.wash,
            loadsWashQty: this.state.book.dry
        });
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false, modalUpdateOpen: false });
    }

    handleOnChange = (e) => {
        // e.target.validity.valid ?
        //     this.setState({
        //         [e.target.name]: e.target.value <= 0 ? "" : e.target.value
        //     })
        //     :
        //     e.target.value.replace(/\D/, '')
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleProcessOrder = (e) => {

        toast.configure();

        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/delivery/process/order/${this.props.match.params.id}`, {
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

                    this.props.history.push(`/delivery/orders`);

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
        axios.get(`https://labubbles.online/api/book/${this.props.match.params.id}/get/${sessionStorage.getItem('user_id')}`, {
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
                        isOtw: result.data.isOtw,
                        isCollect: result.data.isCollect,
                        bookRemarks: result.data.deliveryBookRemarks,
                        isDelivered: result.data.book.isDelivered,
                        isEndLaundry: result.data.isEndLaundry
                    }); 

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

                    if(this.state.book.isRedeemed === 1){
                        this.setState({
                            total: parseInt(this.state.subTotal),
                        })
                    }else{
                        this.setState({
                            total: parseInt(this.state.deliveryCharge) + parseInt(this.state.subTotal),
                        })
                    }
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

    handleDelivered = (e) => {
        toast.configure();

        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/delivery/delivered/order/${this.props.match.params.id}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result.data.book)
                if (result.status === 200) {
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    this.setState({
                        book: result.data.book,
                        isDelivered: result.data.book.isDelivered,
                        isloaded: false,
                    });
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

    handleUpdateOrder = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            isloaded: true
        });
        toast.configure();
        axios.post(`https://labubbles.online/api/delivery/book/${this.props.match.params.id}/update`, {
            kiloWashQty: this.state.kiloWashQty,
            kiloDryQty: this.state.kiloDryQty,
            loadsWashQty: this.state.loadsWashQty,
            loadsDryQty: this.state.loadsDryQty
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        }).then(result => {
            if (result.status === 200) {
                this.setState({
                    book: result.data.book,
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

    handleCollect = (e) => {
        toast.configure();

        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/delivery/collect/order/${this.props.match.params.id}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
                if (result.status === 200) {
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    this.setState({
                        books: result.data.books,
                        isloaded: false,
                    });

                    this.props.history.push(`/delivery/orders`);

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
    handleReAssign = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        axios.get(`https://labubbles.online/api/delivery/reassign/${this.props.match.params.id}`, {
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
                    {this.state.book.wash > 0 ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <h6 className="my-0">Wash</h6>
                                {/* <small className="text-muted">Brief description</small> */}
                            </div>
                            <span className="text-muted">{`${this.state.book.wash} x ${this.state.laundry.washPrice}`}</span>
                            <span className="text-muted"> = </span>
                            <span className="text-muted">{`P ${parseFloat(this.state.wash).toFixed(2)}`}</span>
                        </li>
                    ) : ''}

                    {this.state.book.dry > 0 ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <h6 className="my-0">Dry</h6>
                                {/* <small className="text-muted">Brief description</small> */}
                            </div>
                            <span className="text-muted ml-adjust">{`${this.state.book.dry} x ${this.state.laundry.dryPrice}`}</span>
                            <span className="text-muted"> = </span>
                            <span className="text-muted">{`P ${parseFloat(this.state.dry).toFixed(2)}`}</span>
                        </li>
                    ) : ''}

                </div>
            )
        }

        const Kilos = () => (
            <div className="parent">
                {this.state.book.kiloWash > 0 ? (
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 className="my-0">Kilo Wash</h6>
                            {/* <small className="text-muted">Brief description</small> */}
                        </div>
                        <span className="text-muted">{` ${this.state.book.kiloWash} x ${this.state.laundry.price}`}</span>
                        <span className="text-muted"> = </span>
                        <span className="text-muted">{`P ${parseFloat(this.state.kilosWashAmount).toFixed(2)}`}</span>
                    </li>
                ) : ''}

                {this.state.book.kiloDry > 0 ? (
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 className="my-0">Kilo Dry</h6>
                            {/* <small className="text-muted">Brief description</small> */}
                        </div>
                        <span className="text-muted">{` ${this.state.book.kiloDry} x ${this.state.laundry.price}`}</span>
                        <span className="text-muted"> = </span>
                        <span className="text-muted">{`P ${parseFloat(this.state.kilosDryAmount).toFixed(2)}`}</span>
                    </li>
                ) : ''}

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

        const BookRemarksTable = () => (

            this.state.bookRemarks.map((bookRemark, i) => (
                <tr key={i}>
                    <td>{moment(bookRemark.created_at).format('YYYY-MM-DD hh:mm A')}</td>
                    <td>{bookRemark.remarks}</td>
                </tr>
            )
            )
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
                    <div className="col-6 col-12">
                        <div className="order-md-2">
                            <h4 className="d-flex justify-content-between align-items-cente">
                                <span className="text-bold">Order Tracking</span>
                            </h4>
                            <div className="card card-signin">
                                <div className="row">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="w-50">Date and Time</th>
                                                        <th className="w-50">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <BookRemarksTable />
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <Modal
                            isOpen={this.state.modalUpdateOpen}
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
                            <form onSubmit={this.handleUpdateOrder}>
                                <input type="hidden" name="type" value={this.state.laundry.type} />
                                <div className="modal-body">
                                    {this.state.laundry.type === 'kilos' ? (
                                        <div className="parent">
                                            <div className="form-group">
                                                <label htmlFor="mnumber">Kilo Wash <span className="text-danger">*</span></label>
                                                <input type="number" name="kiloWashQty" className="form-control" id="mnumber" onChange={this.handleOnChange} value={this.state.kiloWashQty} pattern="[0-9]*" required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="mnumber">Kilo Dry <span className="text-danger">*</span></label>
                                                <input type="number" name="kiloDryQty" className="form-control" id="mnumber" onChange={this.handleOnChange} value={this.state.kiloDryQty} pattern="[0-9]*" required />
                                            </div>
                                        </div>
                                    ) : (
                                            <div className="parent">
                                                <div className="form-group">
                                                    <label htmlFor="mnumber">Kilo Wash <span className="text-danger">*</span></label>
                                                    <input type="number" name="loadsWashQty" className="form-control" id="mnumber" onChange={this.handleOnChange} value={this.state.loadsWashQty} pattern="[0-9]*" required />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="mnumber">Kilo Dry <span className="text-danger">*</span></label>
                                                    <input type="number" name="loadsDryQty" className="form-control" id="mnumber" onChange={this.handleOnChange} value={this.state.loadsDryQty} pattern="[0-9]*" required />
                                                </div>
                                            </div>
                                        )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </div>
                            </form>
                        </Modal>
                        {this.state.isOtw ? (
                            !this.state.isCollect ?
                                <div className="actions mb-3">
                                    <div className="col-12 text-right pr-0">
                                        <button onClick={this.handleCollect} className="btn btn-primary">Collect</button>
                                        <button onClick={this.openModalOrder} className="btn btn-primary ml-3">Edit</button>
                                    </div>
                                </div> : ''
                        ) :
                            (
                                <div className="actions mb-3">
                                    <div className="col-12 text-right">
                                        <button onClick={this.handleProcessOrder} className="btn btn-primary">OTW</button>
                                        <button onClick={this.openModal} className="btn btn-danger ml-2">Reject</button>
                                    </div>
                                </div>
                            )}
                        {this.state.isDelivered === 0 ?
                            this.state.isEndLaundry ? (
                                <div className="actions mb-3">
                                    <div className="col-12 text-right">
                                        <button onClick={this.handleDelivered} className="btn btn-primary">Delivered</button>
                                    </div>
                                </div>
                            ) : ''
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
}

export default OrderDetail;
