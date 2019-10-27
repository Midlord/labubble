import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import moment from 'moment';
import './ownerBook.css';
import { _ } from 'core-js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class OwnerBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloaded: false,
      books: [],
      isApproved: false,
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changeCaseFirstLetter = (params) => {
    if (typeof params === 'string') {
      return params.charAt(0).toUpperCase() + params.slice(1);
    }
    return null;
  }


  componentWillMount() {
    this.setState({
      isloaded: true
    });
    axios.get(`https://stockwatch.site/public/api/owner/book`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
      .then(result => {
        console.log(result)
        if (result.status === 200) {
          this.setState({
            books: result.data.book,
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


  render() {

    const BookTable = () => (

      this.state.books.map((book, i) => (
        <tr key={i}>
          <td><Link to={book.isCheckedOut === "1" ? `/user/book/${book.id}` : `/user/laundry/${book.laundry_shop.id}/book/${book.id}`}>{moment(book.created_at).format('YYYY-MM-DD')}</Link></td>
          <td>{book.laundry_shop.shopName}</td>
          <td>{book.amount}</td>
          <td>{book.isCheckedOut === "1" ? book.status : 'Check Out'}</td>
        </tr>
      )
      )
    )

    if (this.state.isloaded) {
      return (
        <Loading />
      );
    }
    return (
      <div className="animated fadeIn">

        <div className="card mt-5">
          <div className="card-header">
            <strong>Recent Orders</strong>
          </div>
          <div className="table-responsive">
            <table className="table table-responsive-sm table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <BookTable />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default OwnerBooks;
