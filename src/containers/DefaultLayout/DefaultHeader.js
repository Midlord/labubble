import React, { Component } from 'react';
// import { Link, NavLink } from 'react-router-dom';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  render() {


    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const isHome = window.location.hash;
    return (
      <React.Fragment>
        {/* isHome === '#/customer/dashboard' ||  isHome === '#/admin/dashboard' || isHome === '#/owner/dashboard' */}
        {sessionStorage.getItem('role') === 'admin'  ? (<AppSidebarToggler className="d-lg-none" display="md" mobile />) : isHome === '#/customer/dashboard' || isHome === '#/owner/dashboard'  ? (<span></span>) : (<span className="back-button" onClick={e => this.props.onBackHistory(e)} ><i className="fa fa-arrow-left back-button" aria-hidden="true"></i></span>)}
        {/* <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        /> */}
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="" navbar>
          {/* {sessionStorage.getItem('role') === 'customer' ? (<form className="form-inline search-top">
            <input className="form-control search-w" type="search" placeholder="Search" aria-label="Search" />
            <span><i className="fa fa-search search-relative"></i></span>
          </form>) : '' } */}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>

              <img src={sessionStorage.getItem('image') == null ? '../../assets/img/avatars/6.jpg' : `http://localhost:8000/storage/avatar/${sessionStorage.getItem('image')}`} className="img-avatar" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>{sessionStorage.getItem('fullName') ? sessionStorage.getItem('fullName') : 'Super Admin'}</strong></DropdownItem>
              <Link to="/profile"><DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem></Link>
              <Link to="/matrix"><DropdownItem><i className="fa fa-user"></i> Delivery Charge Matrix</DropdownItem></Link>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
