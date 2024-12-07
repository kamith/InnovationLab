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
   

    <div class="container">
        

        <section class="cta">
            <a href="/upload-image" class="cta-button">Get Started Now!</a>
        </section>
    </div>

    <footer>
        <div class="container">
            <p>UWM Group of Innovation</p>
        </div>
    </footer>
</body>
    );
  }
}
