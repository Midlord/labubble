import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../deliveries/loading';
import moment from 'moment';
import { _ } from 'core-js';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloaded: false,
      deliveryOrders: [],
    };
    this.handleProcessOrder = this.handleProcessOrder.bind(this);
  }

  handleProcessOrder = (book_id) => {

    toast.configure();
    
    this.setState({
      isloaded: true
    });
    axios.get(`https://stockwatch.site/public/api/delivery/process/order/${book_id}`, {
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
    axios.get(`https://stockwatch.site/public/api/delivery/orders`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
      .then(result => {
        console.log(result.data.deliveryOrders)
        if (result.status === 200) {
          this.setState({
            deliveryOrders: result.data.deliveryOrders,
            isloaded: false,
          })
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
    const deliveryOrders = this.state.deliveryOrders;

    if (this.state.isloaded) {
      return (
        <Loading />
      )
    }
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
              <i className="fa fa-align-justify"></i> Orders</div>
              <div className="card-body">
                <ReactTable
                  data={deliveryOrders}
                  filterable
                  defaultSortDesc={true}
                  defaultPageSize={10}
                  columns={[
                    {
                      columns: [
                        {
                          Header: 'Date',
                          Cell: row => (
                            <Link to={`/admin/order/${row.original.book.id}`}>{moment(row.original.book.created_at).format('YYYY-MM-DD')}</Link>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Order #',
                          accessor: 'id',
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Customer Name',
                          Cell: row => (
                            <span>{row.original.book.user.firstName} {row.original.book.user.lastName}</span>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Mobile Number',
                          Cell: row => (
                            <span>{row.original.book.user.mobileNumber}</span>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Status',
                          Cell: row => (
                            <span className={`badge badge-${row.original.book.status === 'cancelled' ? 'danger' : row.original.book.status === 'pending' ? 'warning' : 'success'}`}>{row.original.book.status == 'approved' ? 'Approved' : row.original.book.status}</span>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Action',
                          Cell: row => (
                            <button onClick={() => this.handleProcessOrder(row.original.book.id)} className="btn btn-primary">OTW</button>
                          ),
                          headerClassName: 'text-left'
                        }
                      ]
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Orders;
