import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import moment from 'moment';
import { _ } from 'core-js';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Select from 'react-select';
import './orders.css';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '20%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '0',
    width: '40%',
    transform: 'translate(-50%, -50%)'
  }
};


class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloaded: false,
      book_id: '',
      modalIsOpen: false,
      books: [],
      user_id: '',
      book_id: '',
      users: []
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal = (id) => {
    console.log(id)
    this.setState({
      modalIsOpen: true,
      book_id: id
    });
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    });
  }

  handleChange = (user_id) => {
    this.setState({
      user_id
    })
  }


  componentWillMount() {
    this.setState({
      isloaded: true
    });
    axios.get(`https://stockwatch.site/public/api/admin/getOrders`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
      .then(result => {
        // console.log(result.data.books.data)
        if (result.status === 200) {
          console.log(result)
          this.setState({
            books: result.data.books,
            users: result.data[1],
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

  }

  handleAssignOrder = (user_id) => {
    this.setState({
      isloaded: true
    });
    toast.configure();
    axios.post(`https://stockwatch.site/public/api/admin/assign/order/${this.state.book_id}`,{
      user_id: user_id.value
    },{
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
    })
      .then(result => {
        if (result.status === 200) {
          this.setState({
            books: result.data.books,
            isloaded: false,
            modalIsOpen: false
          })

          toast.success(result.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
      })
      .catch(error => {
        this.setState({
          isloaded: true
        });

        console.log(error)
      });
  }

  render() {
    const books = this.state.books;

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
                  data={books}
                  filterable
                  defaultSortDesc={true}
                  defaultPageSize={10}
                  columns={[
                    {
                      columns: [
                        {
                          Header: 'Date',
                          Cell: row => (
                            moment(row.original.created_at).format('YYYY-MM-DD')
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Order #',
                          accessor: 'book.code',
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Personnel Name',
                          accessor: 'fullName',
                          Cell: row => (
                            <span>{row.original.fullName}</span>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Customer Name',
                          accessor: 'fullName',
                          Cell: row => (
                            <span>{row.original.book.user.fullName}</span>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Mobile Number',
                          accessor: 'user.mobileNumber',
                          Cell: row => (
                            <span>{row.original.user.mobileNumber}</span>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Status',
                          accessor: 'status',
                          Cell: row => (
                            <div className="text-center">
                                <span className={`badge order_status badge-${row.original.book.status === 'cancelled' ? 'danger' : row.original.book.status === 'pending' ? 'warning' : 'success'}`}>{row.original.book.status == 'approved' ? 'Approved' : row.original.book.status}</span>
                            </div>
                          ),
                          headerClassName: 'text-left'
                        },
                        // {
                        //   Header: 'Action',
                        //   Cell: row => (
                        //     <button onClick={() => this.openModal(row.original.id)} className={`btn btn-primary ${row.original.book.status !== 'pending' ? '' : 'hideButton'}`}>Assign</button>
                        //   ),
                        //   headerClassName: 'text-left'
                        // },
                      ]
                    }
                  ]}
                />
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={this.closeModal}
                  ariaHideApp={false}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div className="modal-header">
                    <span>Assign Order</span>
                    <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <label htmlFor="deliveries">Delivery: </label>
                    <Select
                      value={this.state.user_id}
                      name="user_id"
                      onChange={this.handleChange}
                      options={this.state.users}
                      placeholder="Select Delivery User"
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                    <button type="button" onClick={(e) => this.handleAssignOrder(this.state.user_id)} className="btn btn-primary">Submit</button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Orders;
