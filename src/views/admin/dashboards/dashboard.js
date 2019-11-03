import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import './dashboard.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

        this.state = {
            numberOfOwners:0,
            numberOfCustomers:0,
            total: 0,
            dailySales:0,
            monthlySales:0,
            yearlySales:0,
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
        axios.get(`https://labubbles.online/api/dashboard`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
                if (result.status === 200) {
                    console.log(result);
                    this.setState({
                        numberOfOwners: result.data.numberOfOwners,
                        numberOfCustomers: result.data.numberOfCustomers,
                        dailySales: result.data.deliveryDaily,
                        monthlySales: result.data.deliveryMonthly,
                        yearlySales: result.data.deliveryYearly,
                        totalSales: result.data.totalSales,
                        isloaded: false,
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
                        <div className="col-4 pr-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-users" aria-hidden="true"></i>
                                <span className="count-numbers">{this.state.numberOfCustomers}</span>
                                <span className="count-name">Customers</span>
                            </div>
                        </div>

                        <div className="col-4 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-users" aria-hidden="true"></i>
                                <span className="count-numbers">{this.state.numberOfOwners}</span>
                                <span className="count-name">Owners</span>
                            </div>
                        </div>
                        <div className="col-4 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-money" aria-hidden="true"></i>
                                <span className="count-numbers">P {this.state.totalSales}</span>
                                <span className="count-name">Total Sales</span>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 pr-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-money" aria-hidden="true"></i>
                                <span className="count-numbers">P {this.state.dailySales}</span>
                                <span className="count-name">Daily Sales</span>
                            </div>
                        </div>

                        <div className="col-4 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-money" aria-hidden="true"></i>
                                <span className="count-numbers">P {this.state.monthlySales}</span>
                                <span className="count-name">Monthly Sales</span>
                            </div>
                        </div>
                        <div className="col-4 pl-0">
                            <div className="card-counter shadow">
                                <i className="fa fa-money" aria-hidden="true"></i>
                                <span className="count-numbers">P {this.state.yearlySales}</span>
                                <span className="count-name">Yearly Sales</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;