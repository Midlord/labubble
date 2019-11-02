import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading';
import moment from 'moment';
import { _ } from 'core-js';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '20%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0',
        width: '20%',
        transform: 'translate(-50%, -50%)'
    }
};

class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloaded: false,
      deliveryOrders: [],
      book_id: '',
      modalIsOpen: false,
    };
    this.handleProcessOrder = this.handleProcessOrder.bind(this);
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

  closeModal = (id) => {
    console.log(id)
    this.setState({
        modalIsOpen: false,
        book_id: id
    });
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

  handleReAssign = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toast.configure();
    axios.get(`https://stockwatch.site/public/api/delivery/reassign/${this.state.book_id}`, {
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
                            <Link to={`/admin/order/${row.original.book_id}`}>{moment(row.original.book.created_at).format('YYYY-MM-DD')}</Link>
                          ),
                          headerClassName: 'text-left'
                        },
                        {
                          Header: 'Order #',
                          accessor: 'book.code',
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
                        }
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Orders;
