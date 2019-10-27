import React, { Component, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './dashboard.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
            isLoggedIn: false,
            delivered: 0,
            pending: 0,
            pickedUp: 0,
            cancelled: 0,
            total: 0,
            registeredCustomers: 0,
            books: []
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    onRadioBtnClick(radioSelected) {
        this.setState({
            radioSelected: radioSelected,
        });
    }

    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://stockwatch.site/public/api/owner/recent/transactions`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
                if (result.status === 200) {
                    this.setState({
                        books: result.data.books,
                        isloaded: false,
                        delivered: result.data.bookDelivered,
                        pending: result.data.bookPending,
                        pickedUp: result.data.bookPickedUp,
                        cancelled: result.data.bookCancelled,
                        registeredCustomers: result.data.registeredCustomers.length
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



    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    render() {
        return (
            <div className="animated fadeIn">
                <div className="dashboard-cards mt-5">
                    <div className="row mb-2">
                        <div className="col-12">
                            <div className="card-counter  shadow">
                                <i className="fa fa-location-arrow" aria-hidden="true"></i>
                                <span className="checktime">{moment(sessionStorage.getItem('created_at')).format('hh:mm A')}</span>
                                <span className="count-name">Checked in </span>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-6 pr-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-clock-o" aria-hidden="true"></i>
                                <span className="count-numbers">12</span>
                                <span className="count-name">Appointments</span>
                            </div>
                        </div>

                        <div className="col-6 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-money" aria-hidden="true"></i>
                                <span className="count-numbers">P {this.state.total}</span>
                                <span className="count-name">Total Sales</span>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-6 pr-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-book" aria-hidden="true"></i>
                                <span className="count-numbers">{this.state.pending}</span>
                                <span className="count-name">Pending Books</span>
                            </div>
                        </div>

                        <div className="col-6 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-times" aria-hidden="true"></i>
                                <span className="count-numbers">{this.state.cancelled}</span>
                                <span className="count-name">Cancelled Books</span>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-6 pr-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-users" aria-hidden="true"></i>
                                <span className="count-numbers">{this.state.registeredCustomers}</span>
                                <span className="count-name">Registered Customers</span>
                            </div>
                        </div>

                        <div className="col-6 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-truck" aria-hidden="true"></i>
                                <span className="count-numbers">{this.state.pickedUp}</span>
                                <span className="count-name">Approved</span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.books.length > 0 ? (
                    <div className="card">
                        <div className="card-body">
                            <div className="latest-books">
                                <h3>Pending Orders</h3>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>LaundryShop</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.books.map((book, i) => (
                                            <tr key={i}>
                                                <td><Link to={book.isCheckedOut === "1" ? `/user/book/${book.id}` : `/user/laundry/${book.laundry_shop.id}/book/${book.id}`}>{moment(book.created_at).format('YYYY-MM-DD')}</Link></td>
                                                <td>{book.laundry_shop.shopName}</td>
                                                <td>{book.amount}</td>
                                                <td>{book.isCheckedOut === "1" ? book.status : 'Check Out'}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : ''}
            </div>
        );
    }
}

export default Dashboard;
