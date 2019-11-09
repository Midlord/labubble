import React, { Component } from 'react';

import '../books/ownerBook.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../../customer/loading';
import moment from 'moment';
import { _ } from 'core-js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0',
        width: '80%',
        transform: 'translate(-50%, -50%)'
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')
class OwnerBookDetail extends Component {
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
            personnel:[],
            reward: [],
            wash: 0,
            dry: 0,
            total: 0,
            deliveryCharge: 0,
            subTotal: 0,
            remarks: '',
            kilosWashAmount: 0,
            kilosDryAmount: 0,
            isCollect: false,
            modalIsOpenApproved: false,
            modalIsOpenCancelled: false,
        };
        this.handleApproved = this.handleApproved.bind(this);
        this.goBack = this.goBack.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModalCancelled = this.openModalCancelled.bind(this);

    }

    openModal() {
        this.setState({
            modalIsOpenApproved: true,
            modalIsOpenCancelled: false
        });
    }

    openModalCancelled() {
        this.setState({
            modalIsOpenApproved: false,
            modalIsOpenCancelled: true
        });
    }

    // afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     this.subtitle.style.color = '#f00';
    // }

    closeModal() {
        this.setState({
            modalIsOpenApproved: false,
            modalIsOpenCancelled: false
        });
    }

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
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
                        bookRemarks: result.data.ownerBookRemarks,
                        laundry: result.data.book.laundry_shop,
                        wash: parseFloat(result.data.book.laundry_shop.washPrice) * parseInt(result.data.book.wash),
                        dry: parseFloat(result.data.book.laundry_shop.dryPrice) * parseInt(result.data.book.dry),
                        user: result.data.user,
                        address: result.data.address,
                        services: result.data.services,
                        personnel: result.data.personnel.user,
                        isloaded: false,
                        isCollect: result.data.isCollect,
                        isEndLaundry: result.data.isEndLaundry,
                        kilosWashAmount: parseFloat(result.data.book.laundry_shop.price) * parseInt(result.data.book.kiloWash),
                        kilosDryAmount: parseFloat(result.data.book.laundry_shop.price) * parseInt(result.data.book.kiloDry),
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
                        total: parseInt(this.state.subTotal),
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

    handleEndOrder = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isloaded: true
        });

        axios.get(`https://labubbles.online/api/owner/end/book/${this.props.match.params.id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        book: result.data.book,
                        isloaded: false,
                        isCollect: false,
                        isEndLaundry: true,
                        modalIsOpenApproved: false,
                        modalIsOpenCancelled: false
                    })
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: false
                });

                console.log(error)
            });
    }

    handleProcessOrder = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isloaded: true
        });

        axios.get(`https://labubbles.online/api/owner/process/book/${this.props.match.params.id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        book: result.data.book,
                        isloaded: false,
                        isEndLaundry: result.data.isEndLaundry,
                        modalIsOpenApproved: false,
                        modalIsOpenCancelled: false
                    })
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: false
                });

                console.log(error)
            });
    }


    handleApproved = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isloaded: true
        });

        axios.get(`https://labubbles.online/api/owner/approved/book/${this.props.match.params.id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        book: result.data.book,
                        transaction: result.data.transaction,
                        reward: result.data.reward,
                        isloaded: false,
                        modalIsOpenApproved: false,
                        modalIsOpenCancelled: false
                    })
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    this.props.history.push(`/owner/pendingBooks`);
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: false
                });

                console.log(error)
            });
    }

    handleCancelled = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isloaded: true
        });

        axios.get(`https://labubbles.online/api/owner/cancelled/book/${this.props.match.params.id}`, {
            headers: {
                // 'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        book: result.data.book,
                        transaction: result.data.transaction,
                        reward: result.data.reward,
                        isloaded: false,
                        modalIsOpenApproved: false,
                        modalIsOpenCancelled: false
                    })
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: false
                });

                console.log(error)
            });
    }

    render() {
        const BookedServices = () => (
            this.state.services.map((service, i) => (
                <li className="list-group-item d-flex justify-content-between lh-condensed" key={i}>
                    <div>
                        <h6 className="my-0">{service.title}</h6>
                    </div>
                    <span className="text-muted">{`P ${service.price}`}</span>
                </li>
            ))
        )

        const WashAndDry = () => (
            <div className="parent">
                {this.state.book.wash > 0 ? (
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 className="my-0">Wash</h6>
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
                        </div>
                        <span className="text-muted ml-adjust">{`${this.state.book.dry} x ${this.state.laundry.dryPrice}`}</span>
                        <span className="text-muted"> = </span>
                        <span className="text-muted">{`P ${parseFloat(this.state.dry).toFixed(2)}`}</span>
                    </li>
                ) : ''}
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

        const Kilos = () => (
            <div className="parent">
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                        <h6 className="my-0">Kilo Wash</h6>
                    </div>
                    <span className="text-muted">{` ${this.state.book.kiloWash} x ${this.state.laundry.price}`}</span>
                    <span className="text-muted"> = </span>
                    <span className="text-muted">{`P ${parseFloat(this.state.kilosWashAmount).toFixed(2)}`}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                        <h6 className="my-0">Kilo Dry</h6>
                    </div>
                    <span className="text-muted ml-adjust">{` ${this.state.book.kiloDry} x ${this.state.laundry.price}`}</span>
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
                            <div className="content col mb-2 pl-0 pr-0">
                                <div className="col-12">
                                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-bold">{`Order # ${this.state.book.code}`}</span>
                                    </h4>
                                    <h4 className="d-flex">
                                        <span className="text-bold">{`${this.state.book.user.firstName} ${this.state.book.user.lastName}`}</span>
                                    </h4>
                                    <hr></hr>
                                </div>
                                <div className="col-12 mb-3">
                                    <div className="">
                                        <h4>Special Instructions: </h4>
                                        <p>{this.state.book.remarks === "" ? 'No special instructions.' : this.state.book.remarks}</p>
                                    </div>
                                </div>
                                <div className="col-12 mb-3">
                                    <div className="">
                                        <h4>Expected Delivery: </h4>
                                        <p>{moment(this.state.book.pickUpDate).format('MMMM DD, YYYY hh:mm A')}</p>
                                    </div>
                                </div>
                                <div className="col order-md-2 mb-4">
                                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-bold">Booked Services</span>

                                    </h4>
                                    <ul className="list-group mb-3">
                                        <BookedServices />
                                        {this.state.book.laundry_shop.type === 'loads' ? (
                                            <WashAndDry />
                                        ) : (<Kilos />
                                            )}

                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Total</span>
                                            <strong>{`P ${parseFloat(this.state.total).toFixed(2)}`} </strong>
                                        </li>
                                    </ul>
                                    <div className="text-right">
                                        {this.state.book.status === 'processing' ? (
                                            this.state.isEndLaundry ? '' :
                                                <button className="btn btn-primary" onClick={this.handleEndOrder}>End</button>
                                        ) : this.state.isCollect && this.state.book.isDelivered === 0 ? (
                                            <button className="btn btn-primary" onClick={this.handleProcessOrder}>Start</button>
                                        ) : ''}

                                    </div>
                                    <div className="text-right">
                                        {this.state.book.status == 'cancelled' || this.state.book.status == 'approved'
                                            || this.state.book.status == 'processing' || this.state.book.status == 'delivered' ? '' : (
                                                <div>
                                                    <button type="button" onClick={this.openModalCancelled} className="ui inverted default button">Cancel</button>
                                                    <button onClick={this.openModal} className="ui inverted primary button">Approved</button>
                                                </div>
                                            )}
                                        <Modal
                                            isOpen={this.state.modalIsOpenApproved}
                                            onRequestClose={this.closeModal}
                                            style={customStyles}
                                            contentLabel="Example Modal"
                                        >

                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Order # {this.state.book.code}</h5>
                                                {/* <span>{`${this.state.book.user.firstName} ${this.state.book.user.lastName} `}</span> */}
                                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <p>Are you sure you want to Approve this order?</p>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                                <button type="button" onClick={this.handleApproved} className="btn btn-primary">Yes</button>
                                            </div>
                                        </Modal>
                                        <Modal
                                            isOpen={this.state.modalIsOpenCancelled}
                                            onRequestClose={this.closeModal}
                                            style={customStyles}
                                            contentLabel="Example Modal"
                                        >

                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Order # {this.state.book.code}</h5>
                                                {/* <span>{`${this.state.book.user.firstName} ${this.state.book.user.lastName} `}</span> */}
                                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <p>Are you sure you want to cancel this order?</p>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                                <button type="button" onClick={this.handleCancelled} className="btn btn-primary">Yes</button>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="content col">
                                <h4 className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-bold">Personnel Information</span>
                                </h4>
                                <div className="card">
                                    <div className="body">
                                        <div className="col-12 mt-3 mb-3">
                                            <div className="row">
                                                <div className="col-4">
                                                    <div className="personnel-image">
                                                        <img src="" alt="" className="img-thumbnail" src={`https://labubbles.online/storage/avatar/${this.state.personnel.image}`} />
                                                    </div>
                                                </div>
                                                <div className="col-8 pl-0">
                                                    <div className="personnel-info">
                                                        <p><strong>Name: </strong>{this.state.personnel.firstName} {this.state.personnel.lastName}</p>
                                                        <p><strong>Email: </strong>{this.state.personnel.email}</p>
                                                        <p><strong>Contact #: </strong>{this.state.personnel.mobileNumber}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="content col">
                                <div className="order-md-2">
                                    <h4 className="d-flex justify-content-between align-items-cente">
                                        <span className="text-bold">Order Tracking</span>
                                    </h4>
                                    <div className="card card-signin">
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
                    </div>
                </div>
            </div>
        );
    }
}

export default OwnerBookDetail;
