import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}>
        <h1 style={{ color: '#007acc', fontSize: '2.5em', marginBottom: '10px' }}>🌐 Hello, World!</h1>
        <p>Welcome to your new single-page application, powered by a modern tech stack:</p>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', color: '#333', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Technology</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Purpose</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Documentation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>ASP.NET Core & C#</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Cross-platform server-side code</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <a href='https://get.asp.net/' target='_blank' rel='noopener noreferrer'>ASP.NET Core</a> | 
                <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx' target='_blank' rel='noopener noreferrer'>C#</a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>React</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Client-side interactivity and UI</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <a href='https://reactjs.org/' target='_blank' rel='noopener noreferrer'>React</a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Bootstrap</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Layout and styling</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <a href='http://getbootstrap.com/' target='_blank' rel='noopener noreferrer'>Bootstrap</a>
              </td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ fontSize: '1.75em', marginTop: '30px', color: '#007acc' }}>⚙️ Features to Get You Started</h2>
        <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
          <li><strong>Client-side Navigation</strong>: Use the <em>Counter</em> tab to test navigation, then go <em>Back</em> to return here.</li>
          <li><strong>Integrated Dev Server</strong>: In development mode, <code>create-react-app</code> will hot-reload client-side resources for seamless coding.</li>
          <li><strong>Optimized Production Builds</strong>: Production mode disables dev features and bundles everything efficiently.</li>
        </ul>

        <h3 style={{ fontSize: '1.5em', marginTop: '20px' }}>📝 Working in <code>ClientApp</code></h3>
        <p>The <code>ClientApp</code> subdirectory is a full React application based on the <code>create-react-app</code> template. You can use typical React commands by opening a terminal in that folder:</p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Command</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}><code>npm install</code></td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Installs all required packages.</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}><code>npm test</code></td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Runs the test suite.</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}><code>npm start</code></td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Starts the development server.</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
