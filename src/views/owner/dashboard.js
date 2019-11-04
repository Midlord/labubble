import React, { Component, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './dashboard.css';
import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts'
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
            books: [],
            dailySales: [],
            monthlySales: [],
            yearlySales: [],
            daily:[],
            monthly: [],
            yearly:[],
            totalDaily: [],
            totalMonthly: [],
            totalYearly: [],
            options: {
                chart: {
                  id: 'apexchart-example',
                  width: "100%",
                  height: 380
                },
                xaxis: {
                  categories: []
                }
              },
            series: [{
                name: 'Sales: ',
                data: []
            }],
            responsive: [
                {
                  breakpoint: 1000,
                  options: {
                    plotOptions: {
                      bar: {
                        horizontal: false
                      }
                    },
                    legend: {
                      position: "bottom"
                    }
                  }
                }
              ]
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
        axios.get(`https://labubbles.online/api/owner/recent/transactions`, {
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
                        registeredCustomers: result.data.registeredCustomers.length,
                        dailySales: result.data.dailySales,
                        monthlySales: result.data.monthlySales,
                        yearlySales: result.data.yearlySales
                    });

                    this.state.dailySales.map((sale) => {
                        this.state.daily.push(sale.date);
                        this.state.totalDaily.push(sale.total);
                    });

                    this.setState(prevState => ({
                        options: {
                          ...this.state.options,
                          xaxis: {
                            ...this.state.options.xaxis,
                            categories: this.state.daily
                          }
                        },
                        series: prevState.series.map(
                            obj => Object.assign(obj.data, { data: this.state.totalDaily })
                      )
                      }))
                    //   this.setState(prevState => ({
                    //         series: prevState.series.map(
                    //         obj => Object.assign(obj.data, { data: this.state.totalDaily })
                    //   )
                    // }));
                      
                    console.log(this.state.daily)
                    console.log(this.state.totalDaily)
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

    handleChartChange = (status) => {
       
        if(status === 'daily'){

             this.setState({
                daily: [],
                totalDaily: []
            });

            this.state.dailySales.map((sale) => {
                this.state.daily.push(sale.date);
                this.state.totalDaily.push(sale.total);
            });
    
            this.setState(prevState => ({
                options: {
                  ...this.state.options,
                  xaxis: {
                    ...this.state.options.xaxis,
                    categories: this.state.daily
                  }
                },
                series: prevState.series.map(
                    obj => Object.assign(obj.data, { data: this.state.totalDaily })
              )
              }));
        }else if(status === 'monthly'){
            this.setState({
                monthly: [],
                totalMonthly: []
            });
            this.state.monthlySales.map((sale) => {
                this.state.monthly.push(sale.date);
                this.state.totalMonthly.push(sale.total);
            });
    
            this.setState(prevState => ({
                options: {
                  ...this.state.options,
                  xaxis: {
                    ...this.state.options.xaxis,
                    categories: this.state.monthly
                  }
                },
                series: prevState.series.map(
                    obj => Object.assign(obj.data, { data: this.state.totalMonthly })
              )
              }));

        }else{

            this.setState({
                yearly: [],
                totalYearly: []
            });

            this.state.yearlySales.map((sale) => {
                this.state.yearly.push(sale.date);
                this.state.totalYearly.push(sale.total);
            });
    
            this.setState(prevState => ({
                options: {
                  ...this.state.options,
                  xaxis: {
                    ...this.state.options.xaxis,
                    categories: this.state.yearly
                  }
                },
                series: prevState.series.map(
                    obj => Object.assign(obj.data, { data: this.state.totalYearly })
              )
              }));


        }



        
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
                                            book.isCheckedOut === 1 ?
                                                <tr key={i}>
                                                    <td><Link to={`/owner/pending/book/${book.id}`}>{moment(book.created_at).format('YYYY-MM-DD')}</Link></td>
                                                    <td>{book.laundry_shop.shopName}</td>
                                                    <td>{book.amount}</td>
                                                    <td>{book.status}</td>
                                                </tr>
                                                : ''
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : ''}
                <div className="bg-light">
                    <div className="card">
                        <div className="col-12 mt-3">
                            <div className="row">
                                <div className="col-4 pr-0 pl-0">
                                    <button className="btn btn-primary w-100" onClick={(e) => this.handleChartChange('daily')}>Daily</button>
                                </div>
                                <div className="col-4 pr-0 pl-0">
                                    <button className="btn btn-primary w-100" onClick={(e) => this.handleChartChange('monthly')}>Monthly</button>
                                </div>
                                <div className="col-4 pr-0 pl-0">
                                    <button className="btn btn-primary w-100" onClick={(e) => this.handleChartChange('yearly')}>Yearly</button>
                                </div>
                            </div>
                        </div>
                        <Chart options={this.state.options} series={this.state.series} responsive={this.state.responsive} type="bar" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
