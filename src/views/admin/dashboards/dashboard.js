import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import './dashboard.css';
import Chart from 'react-apexcharts'

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
            books: [],
            chartDailySales: [],
            chartMonthlySales: [],
            chartYearlySales: [],
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

    handleChartChange = (status) => {
        
        this.setState({
            daily: [],
            totalDaily: [],
            monthly: [],
            totalMonthly: [],
            yearly: [],
            totalYearly: []
        });

        if(status === 'daily'){
            this.state.chartDailySales.map((sale) => {
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
            this.state.chartMonthlySales.map((sale) => {
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
            this.state.chartYearlySales.map((sale) => {
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
                        chartDailySales: result.data.dailySales,
                        chartMonthlySales: result.data.monthlySales,
                        chartYearlySales: result.data.yearlySales
                    })

                    this.state.chartDailySales.map((sale) => {
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