import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  ListGroup, ListGroupItem,
  Row,
} from 'reactstrap';

import '../customer/home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../customer/loading';

const barangays = [
  "Agapito Del Rosario",
  "Amsic",
  "Anunas",
  "Balibago",
  "Capaya",
  "Claro M. Recto",
  "Cuayan",
  "Cutcut",
  "Cutud",
  "Lourdes North West",
  "Lourdes Sur",
  "Lourdes Sur East",
  "Malabañas",
  "Margot",
  "Marisol",
  "Mining",
  "Pampang",
  "Pandan",
  "Pulungbulu",
  "Pulung Cacutud",
  "Pulung Maragul",
  "Salapungan",
  "San Jose",
  "San Nicolas",
  "Sta. Teresita",
  "Sta. Trinidad",
  "Sto. Cristo",
  "Sto. Domingo",
  "Sto. Rosario",
  "Sapalibutad",
  "Sapangbato",
  "Tabun",
  "Virgen Delos Remedios"
];


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      laundryShops: [],
      city: 'Angeles City',
      isloaded: false,
      searchFilter: ''
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleLaundrySearch = this.handleLaundrySearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

  }

  handleOnChange = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentWillMount() {
    this.setState({
      isloaded: true
    })
    axios.get(`https://labubbles.online/api/search/top`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })
      .then(result => {

        console.log(result);
        if (result.status == 200) {
          this.setState({
            laundryShops: result.data.laundryShops,
            isloaded: false
          })
        }
      })
      .catch(error => {
        console.log(error.response)
        this.setState({
          isloaded: false
        })
        toast.error(error.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
  }


  handleLaundrySearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.configure();

    this.setState({
      isloaded: true
    });

    if (this.state.searchFilter !== '') {
      axios.post(`https://labubbles.online/api/laundryShops/search`,{
        searchFilter: this.state.searchFilter
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      })
        .then(result => {

          console.log(result);
          if (result.status == 200) {
            if (!result.data.laundryShops.length) {
              toast.error('Not Found.', {
                position: toast.POSITION.BOTTOM_RIGHT
              });
              this.setState({
                isloaded: false
              })
            } else {
              this.setState({
                laundryShops: result.data.laundryShops,
                isloaded: false,
              })
            }
          }
        })
        .catch(error => {
          console.log(error.response)
          this.setState({
            isloaded: false,
          });
          toast.error(error.response.data.error, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        });
    }
  }

  handleSearch = (filter) => {
    // e.preventDefault();
    // e.stopPropagation();
    toast.configure();
    // alert(filter);
    this.setState({
      isloaded: true
    })

    axios.get(`https://labubbles.online/api/${filter === "recommended" ? 'search/barangay' :'search/top'}`,{
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
      .then(result => {

        console.log(result);
        if (result.status == 200) {
          if (!result.data.laundryShops.length) {
            toast.error('Not Recommended Found.', {
              position: toast.POSITION.BOTTOM_RIGHT
            });
            this.setState({
              isloaded: false,
              laundryShops: result.data.laundryShops,
            })
          } else {
            this.setState({
              laundryShops: result.data.laundryShops,
              isloaded: false,
            })
          }
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          isloaded: false,
        });
        // toast.error(error.response.data.error, {
        //   position: toast.POSITION.BOTTOM_RIGHT
        // });
      });

  }

  render() {

    const CreateRatings = (stars) => {
      let ratings = []
      let children = []
      //Inner loop to create children
      for (let j = 0; j < parseInt(stars.stars, 10); j++) {
        children.push(<i className="fa fa-star color-star" key={j}></i>)
      }
      //Create the parent and add the children
      ratings.push(children)

      return ratings
    }

    const LaundryShop = () => {
      return (
        <Row>
        <Col sm="12" xl="6">
          <Card>
            <CardHeader>
              <strong>Laundry Shops</strong>
            </CardHeader>
            <CardBody>
              <div className="mb-3">
                <div className="col-12">
                  <div className="row">
                    <div className="col-6">
                      <button type="submit" onClick={(e) => this.handleSearch("recommended")} className="btn btn-primary w-100 text-center">Recommended</button>
                    </div>
                    <div className="col-6">
                      <button type="submit" onClick={(e) =>this.handleSearch("topShops")} className="btn btn-primary w-100 text-center">Top Shops</button>
                    </div>
                  </div>
                </div>
              </div>
              <ListGroup>
                {this.state.laundryShops.map((item, i) => (
                  <ListGroupItem className="justify-content-between" key={i}><Link to={`laundry/${item.id}`}>{item.shopName}</Link>
                    <div className="float-right"><CreateRatings stars={item.avgRatings} /></div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
      )
    }

    if (this.state.isloaded) {
      return (
        <Loading />
      )
    }
    return (
      <div className="animated fadeIn">
        <div className="card mt-4">
          <div className="card-header">
            Search for Laundry Shop
          </div>
          <div className="card-body">
            <div className="col-12-mt-3">
              <form onSubmit={this.handleLaundrySearch}>
                <div className="row">
                  <div className="col-10">
                    <input type="text" className="form-control" id="searchByBrangay" name="searchFilter" onChange={this.handleOnChange} placeholder="Barangay or Laundry Shop." required />
                  </div>
                  <div className="col-2 pl-0">
                    <button type="submit" className="btn btn-primary"><i className="fa fa-search" aria-hidden="true"></i></button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <LaundryShop />
      </div>
    );
  }
}

export default Home;
