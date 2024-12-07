import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import myImage from './bradyCorpLogo.png';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <header>
        <Navbar
          style={{ backgroundColor: '#19336e' }}
          className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
          container
          light
        >
          <NavbarBrand style={{ color: 'white', display: 'flex', alignItems: 'center' }} tag={Link} to="/">
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                height: '40px',
                marginRight: '10px',
                filter: 'invert(1) brightness(10)',
              }}
            />
            PhotoScanner
          </NavbarBrand>
          <NavbarToggler
            onClick={this.toggleNavbar}
            className="navbar-dark mr-2"
            variant="light"
          />
          <Collapse
            className="d-sm-inline-flex flex-sm-row-reverse"
            isOpen={!this.state.collapsed}
            navbar
          >
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-light" to="/" onClick={() => this.toggleNavbar()} >
                  Home 
                  
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-light" to="/upload-image" onClick={() => this.toggleNavbar()} >
                  Upload image
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-light" to="/history" onClick={() => this.toggleNavbar()}>
                  History
                </NavLink>
              </NavItem>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
