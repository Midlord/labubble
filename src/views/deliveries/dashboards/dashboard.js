import React, { Component, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './css/dashboard.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
            total: 0,
            registeredCustomers: 0,
            pending:0,
            cancelled:0,
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
        axios.get(`https://stockwatch.site/public/api/delivery/dashboard`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
                if (result.status === 200) {
                    this.setState({
                        isloaded: false,
                        total: result.data.sum,
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
                        <div className="col-12">
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
                                <span className="count-name">Pending Orders</span>
                            </div>
                        </div>
                        <div className="col-6 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-times" aria-hidden="true"></i>
                                <span className="count-numbers">{this.state.cancelled}</span>
                                <span className="count-name">Rejected Orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
