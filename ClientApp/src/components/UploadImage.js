import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../util/staticMessages';
import { getFileFromResponse, uploadImage } from '../util/images';
import { ErrorCard, SuccessCard, WarningCard } from '../util/cards';
import Webcam from 'react-webcam';
import './UploadImage.css';

// 10mb = 100,000,000 bytes, images must be <= this size
const MaxImageSize = 100000000;

const ReadyToUpload = (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#234b8d',
      padding: '10px',
      width: '100%',
      textAlign: 'center', // Centers text in case of multiline content
    }}
  >
    <h2 style={{ margin: 0 }}>Upload Image</h2>
  </div>
);


const SuccessfulUpload = <SuccessCard message={"Image uploaded successfully!"} />
const UnsuccessfulUpload = <ErrorCard message={"Image upload failed..."} description={"Server error"} />
const ImageTooLargeError = 
                            <div style ={{display: 'flex', 
                              justifyContent: 'center', 
                              color: '#234b8d',
                              alignItems: 'center', 
                              width: '100%'}}>
                              <h2>Upload an image</h2>
                              <WarningCard message={"Image too large"} description={"Max image size 10 mb"} />
                            </div>

const ResultsButton = ({ id, isFromUpload }) => {
  const navigate = useNavigate();

  function handleClick() {
    return navigate(`/result/${id}/${isFromUpload}`);
  }

  // Only display if id is greater than 0
  if(id <= 0) return <></>

  return (
    <div style={{marginTop: '10px', display: "flex", flexDirection: "column"}}>
    <button className='cta-button' onClick={handleClick}>View Result</button>
    </div>
  );
}

export class UploadImage extends Component {
  static displayName = UploadImage.name;

  constructor(props) {
    super(props);
    this.state = { 
      message: ReadyToUpload, 
      inputFile: null, 
      resultId: 0,
      modeInt: 0,
      imageSrc: null
    };
    this.webcamRef = React.createRef();
  }

  render() {
    let message = this.state.message;
    let resultId = this.state.resultId;
    let contents = UploadImage.renderUploadImage(this);

    return (
      <div>
        <div style={{width: "45%", margin: "auto"}}>
          <div style={{marginBottom: "15%"}}>
            { message }
          </div>
          { contents }
          <ResultsButton id={resultId} />
        </div>
      </div>
    );
  }

  handlePhoto = (imageSrc) => {
    this.setState({ 
      showCamera: false,
      capturedImage: imageSrc,
      inputFile: null  // Clear any previously selected file
    });
  }

  resetForNewCapture = () => {
    this.setState({
      message: ReadyToUpload,
      inputFile: null,
      showCamera: true,
      capturedImage: null
    });
  }

  
  static renderUploadImage(obj) {

    function handleUploadClick() {
      if(obj.state.inputFile == null) return;
      const file = obj.state.inputFile;
      if(file == null) return;

      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          obj.handleUploadImage(reader.result);
        },
        false
      );

      reader.readAsDataURL(file);
    }

    function handleInput(element) {
      console.log("Inputting file...");
      const file = element.target.files[0];
      if(file.size > MaxImageSize) {
        obj.setState({ message: ImageTooLargeError, inputFile: null });
      } else {
        obj.setState({ message: ReadyToUpload, inputFile: file });
      }
    }

    function handleGoBack() {
      obj.setState({ modeInt: 0, inputFile: null });
    }

    if(obj.state.modeInt === 0) {
      // haven't chosen file upload or camera
      function cameraChoice() {
        obj.setState({ modeInt: 1 });
      }

      function uploadChoice() {
        obj.setState({ modeInt: 2});
      }

      return (
        <div style={{display: "flex", gap: "10px", justifyContent: "center", width: "100%"}}>
          <button onClick={cameraChoice} className='cta-button'>Take a photo</button>
          <button onClick={uploadChoice} className='cta-button'>Upload a file</button>
        </div>
      );
    } else if(obj.state.modeInt === 1) {
      function capturePhoto() {
        const imageSrc = obj.webcamRef.current.getScreenshot();
        getFileFromResponse(imageSrc).then(blob => {
          const file = new File([blob], "image");
          obj.setState({ inputFile: file, imageSrc: imageSrc });
        });
      }

      function retryPhoto() {
        obj.setState({ inputFile: null });
      }

      // Camera is open
      const capture = obj.state.inputFile === null
                    ? <button onClick={capturePhoto} className='cta-button'>Capture</button>
                    : <button className='cta-button' onClick={handleUploadClick}>Upload</button>

      const retry = obj.state.inputFile === null
                    ? <></>
                    : <button onClick={retryPhoto} className='cta-button'>Retry</button>

      if(obj.state.inputFile === null) {
        return (
          <div>
            <button onClick={handleGoBack} style={{ marginBottom: "10%" }} className='cta-button'>Go back</button>
            <Webcam
            audio={false}
            ref={obj.webcamRef}
            screenshotFormat='image/jpeg'
            mirrored={false}
            style={{width: "150%"}}
            />
            <div style={{gap: "10px", display: "flex"}} className='cta'>
              { capture }
              { retry }
            </div>
          </div>
        );
      } else {
        return(
          <div>
            <img src={obj.state.imageSrc} alt="Uploaded" />
            <div style={{gap: "10px", display: "flex"}} className='cta'>
              { capture }
              { retry }
            </div>
          </div>
        );
      }
    } else if(obj.state.modeInt === 2) {
      // file upload mode
      const upload = obj.state.inputFile !== null
                    ? <button className='cta-button' onClick={handleUploadClick}>Upload</button>
                    : <></>
      return (
        <div>
          <button onClick={handleGoBack} style={{ marginBottom: "10%" }} className='cta-button'>Go back</button>
          <input style={{ marginBottom: "10%" }} onInput={handleInput} id="image" type="file" accept="image/*" />
          { upload }
        </div>
      );
    }
  }  

  static renderSuccessfulUpload(obj) {
    function handleClick() {
      obj.setState({ message: ReadyToUpload, inputFile: null,  modeInt: 0, resultId: 0 });
    }

    return (
      <div>
        <button className='cta-button' onClick={handleClick}>Upload Again</button>
      </div>
    );
  }

  static renderFailedUpload(obj) {
    function handleClick() {
      obj.setState({ message: ReadyToUpload, inputFile: null });
    }

    return (
      <div>
        <button className='cta-button' onClick={handleClick}>Retry</button>
      </div>
    );
  }

  render() {
    let message = this.state.message;
    let resultId = this.state.resultId;
    let contents = <></>

    switch(message) {
      case ReadyToUpload:
      case ImageTooLargeError:
        contents = UploadImage.renderUploadImage(this);
        break;
      case SuccessfulUpload:
        contents = UploadImage.renderSuccessfulUpload(this);
        break;
      case UnsuccessfulUpload:
        contents = UploadImage.renderFailedUpload(this);
        break;
      default:
        break;
    }

    return (
      <div>
        <div style={{width: "45%", margin: "auto"}}>
          <div style={{ marginBottom: "5%" }}>
            { message }
          </div>
          { contents }
          <ResultsButton id={resultId} isFromUpload={true} />
        </div>
      </div>
    );
  }

  // Could change this to redirect instead of staying on page for successful upload
  async handleUploadImage(img) {
    this.setState({ message: Loading });
    uploadImage(img).then(x => {
      if(x === -1) throw new Error();
      this.setState({ message: SuccessfulUpload, resultId: x, inputFile: null });
    }).catch(() => {
      this.setState({ message: UnsuccessfulUpload, resultId: 0 });
    });
  }
}