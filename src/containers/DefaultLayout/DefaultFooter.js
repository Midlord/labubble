import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        {sessionStorage.getItem('role') === 'customer' ? (
          <nav className="navbar fixed-bottom navbar-light bg-light">
            <div className="col-12">
              <div className="row">
                <div className="col-3 text-center">
                  <Link to={`/customer/dashboard`}><i className="fa fa-home bottom-nav" aria-hidden="true"></i></Link>
                </div>
                <div className="col-3 text-center">
                  <Link to={`/home`}><i className="fa fa-search bottom-nav" aria-hidden="true"></i></Link>
                </div>
                <div className="col-3 text-center">
                  <Link to={`/user/books`}><i className="fa fa-book bottom-nav" aria-hidden="true"></i></Link>
                </div>
                <div className="col-3 text-center">
                  <Link to={'/rewards'}><i className="fa fa-trophy bottom-nav" aria-hidden="true"></i></Link>
                </div>
              </div>
            </div>
          </nav>
        ) : sessionStorage.getItem('role') === 'owner' ? (
          <nav className="navbar fixed-bottom navbar-light bg-light">
            <div className="col-12">
              <div className="row">
                <div className="col-4 text-center">
                  <Link to={`/owner/dashboard`}><i className="fas fa-home bottom-nav" aria-hidden="true"></i></Link>
                </div>
                <div className="col-4 text-center">
                  {sessionStorage.getItem('isHasShop') == "true" ?(
                    <Link to={`/owner/laundry`}><i className="fas fa-store bottom-nav" aria-hidden="true"></i></Link>
                  ) : (
                    <Link to={`/owner/laundry/add`}><i className="fas fa-plus bottom-nav" aria-hidden="true"></i></Link>
                  ) }
                  
                </div>
                <div className="col-4 text-center">
                {sessionStorage.getItem('isHasShop') == "true" ?(
                    <Link to={`/owner/pendingBooks`}><i className="fas fa-book bottom-nav" aria-hidden="true"></i></Link>
                  ) : (
                    <Link to={`/owner/dashboard`}><i className="fas fa-book bottom-nav" aria-hidden="true"></i></Link>
                  ) }
                  
                </div>
              </div>
            </div>
          </nav>
        ) : ''}
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
