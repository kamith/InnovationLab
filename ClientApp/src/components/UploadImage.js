import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../util/staticMessages';
import { uploadImage } from '../util/images';
import { ErrorCard, SuccessCard, WarningCard } from '../util/cards';

// 10mb = 100,000,000 bytes, images must be <= this size
const MaxImageSize = 100000000;

// Display messages
const ReadyToUpload = <h2>Upload an image</h2>
const SuccessfulUpload = <SuccessCard message={"Image uploaded successfully!"} />
const UnsuccessfulUpload = <ErrorCard message={"Image upload failed..."} description={"Server error"} />
const ImageTooLargeError = 
                            <div>
                              <h2>Upload an image</h2>
                              <WarningCard message={"Image too large"} description={"Max image size 10 mb"} />
                            </div>

const ResultsButton = ({ id }) => {
  const navigate = useNavigate();

  function handleClick() {
    return navigate(`/result/${id}`);
  }

  // Only display if id is greater than 0
  if(id <= 0) return <></>

  return (
    <button onClick={handleClick}>View Result</button>
  );
}

export class UploadImage extends Component {
  static displayName = UploadImage.name;

  constructor(props) {
    super(props);
    this.state = { message: ReadyToUpload, inputFile: null, resultId: 0 };
  }
  
  static renderUploadImage(obj) {

    function handleClick() {
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

    return (
          <div style={{display: "flex", flexDirection: "column"}}>
            <input onInput={handleInput} type="file" id="image" accept="image/*" />
            <button onClick={handleClick}>Upload</button>
          </div>
    );
  }

  static renderSuccessfulUpload(obj) {
    function handleClick() {
      obj.setState({ message: ReadyToUpload, inputFile: null });
    }

    return (
      <div>
        <button onClick={handleClick}>Upload Again</button>
      </div>
    );
  }

  static renderFailedUpload(obj) {
    function handleClick() {
      obj.setState({ message: ReadyToUpload, inputFile: null });
    }

    return (
      <div>
        <button onClick={handleClick}>Retry</button>
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
      <div style={{width: "40%", margin: "auto"}}>
        <div style={{marginBottom: "10px"}}>
          { message }
        </div>
        { contents }
        <ResultsButton id={resultId} />
      </div>
    );
  }

  // Could change this to redirect instead of staying on page for successful upload
  async handleUploadImage(img) {
    this.setState({ message: Loading });
    uploadImage(img).then(x => {
      if(x === -1) throw new Error();
      this.setState({ message: SuccessfulUpload, resultId: x });
    }).catch(() => {
      this.setState({ message: UnsuccessfulUpload, resultId: 0 });
    });
  }
}