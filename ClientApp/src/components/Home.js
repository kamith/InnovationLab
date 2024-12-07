import React, { Component } from 'react';
import './Home.css';
import './UploadImage';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (

<body>
    <div className="header">
        <h1>Undisclosed Wetness Measurer</h1>
    </div>

    <div className="imagecontainer">
        <img src="/home_page_logo.png" alt="logo" style={{ width: 250, height: 250 }} />

        <section className="cta">
            <a href="/upload-image" className="cta-button">Get Started Now!</a>
        </section>
    </div>
</body>

    );
  }
}
