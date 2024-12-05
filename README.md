# Project Name Innovation Labs

## Overview

This is a React application with a .NET backend. The project structure includes a frontend in a `ClientApp` folder and a backend server running .NET. This README will guide you through the setup and installation process, including all prerequisites for both Windows and macOS.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
   - [Git Installation](#git-installation)
   - [Node.js and npm Installation](#nodejs-and-npm-installation)
   - [Python Installation](#python-installation)
   - [Dotnet SDK Installation](#dotnet-sdk-installation)
2. [Project Setup](#project-setup)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
3. [Running the Application](#running-the-application)
4. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
5. [License](#license)

---

## Prerequisites

### 1. Git Installation

#### Windows

1. Download and install Git for Windows from [https://git-scm.com/download/win](https://git-scm.com/download/win).
2. Run the installer and follow the instructions, selecting your preferred options.
3. After installation, open a terminal (Command Prompt or PowerShell) and verify by running:
   ```bash
   git --version
   ```

#### macOS

1. Open the Terminal and install Git by running:
   ```bash
   xcode-select --install
   ```
2. Confirm installation by running:
   ```bash
   git --version
   ```

#### GitHub Desktop (Optional)

GitHub Desktop is an alternative way to work with repositories if you prefer a graphical interface. You can download it from [https://desktop.github.com/](https://desktop.github.com/).

### 2. Node.js and npm Installation

Node.js and npm (Node Package Manager) are required for the React application. The latest stable version is recommended.

#### Windows and macOS

1. Download the latest LTS version of Node.js from [https://nodejs.org/](https://nodejs.org/).
2. Run the installer and follow the setup instructions.
3. Confirm installation by opening a terminal and running:
   ```bash
   node -v
   npm -v
   ```

> **Note:** npm is included with Node.js, so installing Node.js will also install npm.

### 3. Python Installation

Python is sometimes required for certain npm packages to build correctly.

#### Windows

1. Download Python from [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/).
2. During installation, check the box **"Add Python to PATH"**.
3. Confirm installation by running:
   ```bash
   python --version
   ```

#### macOS

1. macOS comes with Python pre-installed. However, you can install the latest version via Homebrew if desired:
   ```bash
   brew install python
   ```
2. Verify installation:
   ```bash
   python3 --version
   ```

### 4. .NET SDK Installation

The .NET SDK is required for the backend.

#### Windows and macOS

1. Download and install the latest .NET SDK from [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).
2. Confirm installation by running:
   ```bash
   dotnet --version
   ```

---

## Project Setup

### 1. Clone the Repository

You can clone this repository using Git (command line) or GitHub Desktop.

#### Command Line

```bash
git clone <repository-url>
cd <repository-folder>
```

#### GitHub Desktop

1. Open GitHub Desktop and sign in to your GitHub account.
2. Go to **File > Clone Repository**.
3. Enter the repository URL and choose a local path to clone to.

### 2. Install Dependencies

Navigate to the `ClientApp` directory in the project to install the frontend dependencies:

```bash
cd ClientApp
npm install
```

---

## Running the Application

### Backend (.NET)

1. In the project root, open a terminal and run:
   ```bash
   dotnet run
   ```
   This will start the .NET backend server.

### Frontend (React)

1. After installing dependencies, build the React app:
   ```bash
   npm run build
   ```
2. Start the React app:
   ```bash
   npm start
   ```
3. The React app should now be running and can be accessed at `http://localhost:3000`.

> **Note:** The frontend and backend will need to be configured to communicate with each other. Adjust the API endpoint URLs in the frontend to match the backend's URL if necessary.

---

## Common Issues and Troubleshooting

- **Node.js Compatibility**: Ensure you're using a stable version of Node.js.
- **Port Conflicts**: If ports 3000 or 5000 are already in use, modify the ports in the configuration files.
- **Permissions Errors**: Ensure you have the necessary permissions for executing commands and writing to directories.

---

## License

This project is licensed under the MIT License.

---