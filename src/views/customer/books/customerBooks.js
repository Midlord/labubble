import React, { Component } from 'react';
import BootstrapTable from 'reactjs-bootstrap-table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading';
import moment from 'moment';


class CustomerBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloaded: false,
      books: []
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentWillMount() {
    this.setState({
      isloaded: true
    });
    axios.get(`https://stockwatch.site/public/api/books/user`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
      .then(result => {
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

    return (
      <div className="animated fadeIn">

        <div className="card mt-5">
          <div className="card-header">
            <strong>Orders</strong>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Laundry Shop</th>
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

export default CustomerBooks;
