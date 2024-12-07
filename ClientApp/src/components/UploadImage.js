import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../util/staticMessages';
import { uploadImage } from '../util/images';
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
      textAlign: 'center',
    }}
  ></div>
);

const SuccessfulUpload = <SuccessCard message={"Image uploaded successfully!"} />;
const UnsuccessfulUpload = <ErrorCard message={"Image upload failed..."} description={"Server error"} />;
const ImageTooLargeError = (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      color: '#234b8d',
      alignItems: 'center',
      width: '100%',
    }}
  >
    <h2>Upload an image</h2>
    <WarningCard message={"Image too large"} description={"Max image size 10 mb"} />
  </div>
);

const ResultsButton = ({ id, isFromUpload }) => {
  const navigate = useNavigate();

  function handleClick() {
    return navigate(`/result/${id}/${isFromUpload}`);
  }

  if (id <= 0) return <></>;

  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
      <button className='cta-button' onClick={handleClick}>View Result</button>
    </div>
  );
};

export class UploadImage extends Component {
  static displayName = UploadImage.name;

  constructor(props) {
    super(props);
    this.state = {
      message: ReadyToUpload,
      inputFile: null,
      resultId: 0,
      modeInt: 0,
      imageSrc: null,
    };
    this.webcamRef = React.createRef();
  }

  render() {
    let message = this.state.message;
    let resultId = this.state.resultId;
    let contents = <></>;

    switch (message) {
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
        <div style={{ width: '45%', margin: 'auto' }}>
          <div style={{ marginBottom: '5%' }}>{message}</div>
          {contents}
          {/* <ResultsButton id={resultId} isFromUpload={true} /> */}
        </div>
      </div>
    );
  }

  handlePhoto = (imageSrc) => {
    this.setState({
      showCamera: false,
      capturedImage: imageSrc,
      inputFile: null,
    });
  };

  resetForNewCapture = () => {
    this.setState({
      message: ReadyToUpload,
      inputFile: null,
      showCamera: true,
      capturedImage: null,
    });
  };

  static renderUploadImage(obj) {
    function handleUploadClick() {
      if (obj.state.inputFile == null) return;
      const file = obj.state.inputFile;
      if (file == null) return;

      if (obj.state.modeInt === 1) {
        obj.handleUploadImage(file);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          obj.handleUploadImage(reader.result);
        },
        false
      );

      reader.readAsDataURL(file);
    }

    function handleInput(element) {
      console.log('Inputting file...');
      const file = element.target.files[0];
      if (file.size > MaxImageSize) {
        obj.setState({ message: ImageTooLargeError, inputFile: null });
      } else {
        obj.setState({ message: ReadyToUpload, inputFile: file });
      }
    }

    function handleGoBack() {
      obj.setState({ modeInt: 0, inputFile: null });
    }

    if (obj.state.modeInt === 0) {
      function cameraChoice() {
        obj.setState({ modeInt: 1 });
      }

      function uploadChoice() {
        obj.setState({ modeInt: 2 });
      }

      return (
        <div className='cta-container'>
          <h2>Upload Image</h2>
          <button onClick={cameraChoice} className='cta-button'>Take a Photo</button>
          <button onClick={uploadChoice} className='cta-button'>Upload a File</button>
        </div>
      );
    } else if (obj.state.modeInt === 1) {
      function capturePhoto() {
        const imageSrc = obj.webcamRef.current.getScreenshot();
        obj.setState({ inputFile: imageSrc, imageSrc: imageSrc });
      }

      function retryPhoto() {
        obj.setState({ inputFile: null });
      }

      if (obj.state.inputFile === null) {
        return (
          <div className='cta-container'>
            <button onClick={handleGoBack} className='cta-button'>Go back</button>
            <Webcam
              audio={false}
              ref={obj.webcamRef}
              screenshotFormat='image/jpeg'
              mirrored={false}
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={capturePhoto} className='cta-button'>Capture</button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="cta-container" style={{ minHeight: 'auto' }}>
            <img src={obj.state.imageSrc} alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={handleUploadClick} className="cta-button">Upload</button>
              <button onClick={retryPhoto} className="cta-button">Retry</button>
            </div>
          </div>
        );
        
      }
    } else if (obj.state.modeInt === 2) {
      const upload = obj.state.inputFile !== null ? (
        <button className='cta-button' onClick={handleUploadClick}>Upload</button>
      ) : (
        <></>
      );
      return (
        <div className='cta-container'>
          <button onClick={handleGoBack} className='cta-button'>Go back</button>
          <input
            onInput={handleInput}
            id='image'
            type='file'
            accept='image/*'
            style={{ marginBottom: '10px' }}
          />
          {upload}
        </div>
      );
    }
  }

  static renderSuccessfulUpload(obj) {
    function handleClick() {
      obj.setState({ message: ReadyToUpload, inputFile: null, modeInt: 0, resultId: 0 });
    }
  
    return (
      <div className='cta-container'>
        <h2 style={{ textAlign: 'center' }}>Image uploaded successfully!</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center' }}>
          <button className='cta-button' onClick={handleClick}>Upload Again</button>
          <ResultsButton id={obj.state.resultId} isFromUpload={true} />
        </div>
      </div>
    );
  }
  
  static renderFailedUpload(obj) {
    function handleClick() {
      obj.setState({ message: ReadyToUpload, inputFile: null });
    }
  
    return (
      <div className='cta-container'>
        <h2 style={{ textAlign: 'center' }}>Upload failed</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center' }}>
          <button className='cta-button' onClick={handleClick}>Retry</button>
          <ResultsButton id={obj.state.resultId} isFromUpload={true} />
        </div>
      </div>
    );
  }
  

  async handleUploadImage(img) {
    this.setState({ message: Loading });
    uploadImage(img)
      .then((x) => {
        if (x === -1) throw new Error();
        this.setState({ message: SuccessfulUpload, resultId: x, inputFile: null });
      })
      .catch(() => {
        this.setState({ message: UnsuccessfulUpload, resultId: 0 });
      });
  }
}
  