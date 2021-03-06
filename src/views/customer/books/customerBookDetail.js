import React, { Component } from 'react';

import '../books/book.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../loading';
import moment from 'moment';
import Modal from 'react-modal';
import BeautyStars from 'beauty-stars';
import {
    Input,
} from 'reactstrap';
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

const customStyleDelivered = {
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
Modal.setAppElement('#root')
class CustomerBookDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isloaded: false,
            book: [],
            bookRemarks: [],
            user: [],
            laundry: [],
            address: [],
            services: [],
            personnel: [],
            selectedLaundryOptions: [],
            selectedDeliveryOptions: [],
            wash: 0,
            dry: 0,
            total: 0,
            deliveryCharge: 0,
            subTotal: 0,
            modalIsOpen: false,
            modalReport: false,
            kilosWashAmount: 0,
            kilosDryAmount: 0,
            isDelivered: false,
            isRated: false,
            isModalDelivered: false,
            value: 0,

        };
        console.log(props)
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    openModal() {
        this.setState({
            modalIsOpen: true,
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            isModalDelivered: false,
            modalReport: false
        });
    }

    handleSelectCustomerChange = (e) => {
        let target = e.target

        let name = target.name

        let valueCustomer = Array.from(target.selectedOptions, option => option.value);

        this.setState({
            [name]: valueCustomer
        });
        let valueAddress = Array.from(target.selectedOptions, option => option.value);

        this.setState({
            [name]: valueAddress
        });

        console.log(this.state.selectedLaundryOptions)
        console.log(this.state.selectedDeliveryOptions)

    }
    handleCancelOrder = (e) => {
        e.preventDefault();
        this.setState({
            isloaded: true
        });
        axios.post(`http://localhost:8000/api/customer/cancel/order/${this.props.match.params.id}`, {
            remarks: this.state.remarks
        }, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        modalIsOpen: false,
                        isLoaded: false
                    })
                    this.props.history.push(`/user/books`);
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: true
                });

                console.log(error)
            });
    }

    handleRatings = (e) => {
        e.preventDefault();
        this.setState({
            isloaded: true
        });
        toast.configure();
        axios.post(`http://localhost:8000/api/laundry/rating/store`, {
            laundry_shop_id: this.state.book.laundry_shop_id,
            message: this.state.message,
            stars: this.state.value
        }, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        isModalDelivered: false,
                        isLoaded: false
                    })

                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    this.props.history.push(`/laundry/${this.state.book.laundry_shop_id}`);
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: true
                });

                console.log(error)
            });
    }

    openModalReport = () => {
        this.setState({
            modalReport: true
        });
    }

    reportOwner = (e) => {
        e.preventDefault();

    }

    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`http://localhost:8000/api/book/${this.props.match.params.id}/get/${sessionStorage.getItem('user_id')}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        book: result.data.book,
                        bookRemarks: result.data.bookRemarks,
                        laundry: result.data.book.laundry_shop,
                        wash: parseFloat(result.data.book.laundry_shop.washPrice) * parseInt(result.data.book.wash),
                        dry: parseFloat(result.data.book.laundry_shop.dryPrice) * parseInt(result.data.book.dry),
                        user: result.data.user,
                        address: result.data.address,
                        services: result.data.services,
                        personnel: result.data.personnel !== null ? result.data.personnel.user : null,
                        isloaded: false,
                        kilosWashAmount: parseFloat(result.data.book.laundry_shop.price) * parseInt(result.data.book.kiloWash),
                        kilosDryAmount: parseFloat(result.data.book.laundry_shop.price) * parseInt(result.data.book.kiloDry),
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

                    if (this.state.book.isRedeemed === 1) {
                        this.setState({
                            total: parseInt(this.state.subTotal),
                        })
                    } else {
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

        axios.get(`http://localhost:8000/api/laundry/${this.props.match.params.id}/rated`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        isRated: result.data.ratings.length === 0 ? true : false,
                        isDelivered: result.data.book.length === 0 ? true : false
                    });

                    if (this.state.isRated && !this.state.isDelivered) {
                        this.setState({
                            isModalDelivered: true
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
    }

    handleReportOrder = (e) => {
        e.preventDefault();

        toast.configure();

        this.setState({
            isloaded: true
        });
        axios.post(`http://localhost:8000/api/customer/report/order/${this.props.match.params.id}`,{
            laundryReport: this.state.selectedLaundryOptions.join(', '),
            deliveryReport: this.state.selectedDeliveryOptions.join(', '),
        }, {
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

                    this.props.history.push(`/customer/orders`);

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

        const BookRemarksTable = () => (

            this.state.bookRemarks.map((bookRemark, i) => (
                <tr key={i}>
                    <td>{moment(bookRemark.created_at).format('YYYY-MM-DD hh:mm A')}</td>
                    <td>{bookRemark.remarks}</td>
                </tr>
            )
            )
        )

        const RateLaundry = () => {
            return (
                <div className="rating-section mb-5">
                    <form className="ui reply form">
                        <div className="field">
                            <label htmlFor="">Ratings:</label>
                            <BeautyStars
                                value={this.state.value}
                                onChange={value => this.setState({ value })} />

                        </div>
                        <div className="field">
                            <label htmlFor="">Comment:</label>
                            <Input type="textarea" name="message" onChange={this.onChange} className="form-control" id="message" rows="4"
                                placeholder="Content..." />
                        </div>
                    </form>
                </div>
            )
        }
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
        if (this.state.isloaded) {
            return (
                <div><Loading /></div>
            );
        }

        return (
            <div className={`animated fadeIn ${this.state.book.status === 'cancelled' ? 'mt-5' : ''}`}>
                <div className={`order-tracking mt-5 ${this.state.book.status === 'cancelled' ? 'd-none' : ''}`}>
                    <div className="card card-layout pb-5">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12">
                                    <div className="order-icons">
                                        <h5 className="card-title">Status of your order: #{this.state.book.code}</h5>
                                        <hr />
                                        <div className="row tracking-text">
                                            <div className="col-3">
                                                <i className={`fa fa-flag tracking-size ${this.state.book.status === 'pending' ? 'active-status' : ''}`} aria-hidden="true"></i>

                                                <span className="font-weight-bold">Pending</span>
                                            </div>
                                            <div className="col-3">
                                                <i className={`fa fa-check tracking-size ${this.state.book.status === 'approved' ? 'active-status' : ''}`} aria-hidden="true"></i>
                                                <span className="font-weight-bold">Approved</span>
                                            </div>
                                            <div className="col-3">
                                                <i className={`fas fa-dumpster-fire tracking-size ${this.state.book.status === 'processing' ? 'active-status' : ''}`} aria-hidden="true"></i>
                                                <span className="font-weight-bold">Processing</span>
                                            </div>
                                            <div className="col-3">
                                                <i className={`fa fa-truck tracking-size ${this.state.book.status === 'delivered' ? 'active-status' : ''}`} aria-hidden="true"></i>
                                                <span className="font-weight-bold">Delivered</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-process">
                                        <div className="content-line">
                                            <span className="line"></span>
                                        </div>
                                        <div className="pending">
                                            {/* fa-dot-circle-o */}
                                            <i className={`fa fa-circle ${this.state.book.status === 'pending' ? 'active-status' : ''}`} aria-hidden="true"></i>
                                        </div>
                                        <div className="picked-up">
                                            <i className={`fa fa-circle ${this.state.book.status === 'approved' ? 'active-status' : ''}`} aria-hidden="true"></i>
                                        </div>
                                        <div className="done">
                                            <i className={`fa fa-circle ${this.state.book.status === 'processing' ? 'active-status' : ''}`} aria-hidden="true"></i>
                                        </div>
                                        <div className="delivered">
                                            <i className={`fa fa-circle ${this.state.book.status === 'delivered' ? 'active-status' : ''}`} aria-hidden="true"></i>
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
                            {this.state.book.isReported === 0 && this.state.book.status === 'delivered' ? (
                                <div className="col-12 pl-0 pr-0">
                                <div className="row">
                                    <div className="col-6">
                                    </div>
                                    <div className="col-6">
                                        <button type="button" onClick={this.openModalReport} className="btn btn-danger w-100">Report</button>
                                    </div>
                                </div>
                            </div>
                            ): ''}
                            <h4 className="d-flex justify-content-between align-items-center">
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
                {this.state.personnel === null ? '' : (
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
                                                    <img src="" alt="" className="img-thumbnail" src={`http://localhost:8000/storage/avatar/${this.state.personnel.image}`} />
                                                </div>
                                            </div>
                                            <div className="col-8">
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
                    </div>)}
                <div className="row">
                    <div className="content col">
                        <div className="order-md-2">
                            <div className="col order-md-2 mb-4 pr-0 pl-0">
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
                                {this.state.book.status === 'cancelled' || this.state.book.status === 'approved' || this.state.book.status === 'processing' || this.state.book.status === 'delivered' ? '' : (
                                    <div>
                                        <div className="col-12 text-right pr-0">
                                            <button onClick={this.openModal} type="button" className="ui inverted primary button">Cancel Order</button>
                                        </div>
                                    </div>
                                )}
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
                                        <p>Are you sure you want to Cancel this order?</p>
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="reason">Reason</label>
                                                <textarea name="reason"
                                                    id="reason"
                                                    onChange={this.onChange}
                                                    placeholder="Enter Reason."
                                                    className="form-control">
                                                </textarea>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                        <button type="button" onClick={this.handleCancelOrder} className="btn btn-primary">Yes</button>
                                    </div>
                                </Modal>
                                <Modal
                                    isOpen={this.state.isModalDelivered}
                                    onRequestClose={this.closeModal}
                                    style={customStyleDelivered}
                                    contentLabel="CheckOut"
                                >

                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel"></h5>
                                        {/* <span>{`${this.state.book.user.firstName} ${this.state.book.user.lastName} `}</span> */}
                                        <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <form className="ui reply form" onSubmit={this.handleRatings}>
                                        <div className="modal-body">
                                            <div className="rating-section mb-5">
                                                <div className="field">
                                                    <label htmlFor="">Ratings:</label>
                                                    <BeautyStars
                                                        value={this.state.value}
                                                        onChange={value => this.setState({ value })} />

                                                </div>
                                                <div className="field">
                                                    <label htmlFor="">Comment:</label>
                                                    <Input type="textarea" name="message" onChange={this.onChange} className="form-control" id="message" rows="4"
                                                        placeholder="Content..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </form>
                                </Modal>
                                <Modal
                            isOpen={this.state.modalReport}
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
                            <form onSubmit={this.handleReportOrder}>
                                <div className="modal-body">
                                    <div className="parent">
                                        <div className="form-group">
                                            <label htmlFor="role">Laundry Service </label>
                                            <select name="selectedLaundryOptions" value={this.state.selectedLaundryOptions} id="selectedCustomerOptions" className="form-control" onChange={this.handleSelectCustomerChange} multiple>
                                                <option value="Smelly Clothes">Smelly Clothes</option>
                                                <option value="Damaged Clothes">Damaged Clothes</option>
                                                <option value="Missing Clothes">Missing Clothes</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="role">Delivery Service </label>
                                            <select name="selectedDeliveryOptions" value={this.state.selectedDeliveryOptions} id="selectedAddressOptions" className="form-control" onChange={this.handleSelectCustomerChange} multiple>
                                                <option value="Late pick up">Late pick up</option>
                                                <option value="Late Delivery">Late Delivery</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </div>
                            </form>
                        </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomerBookDetail;
