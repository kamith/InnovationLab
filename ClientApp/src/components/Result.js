import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../util/staticMessages'
import { getImageResult, DisplayResult } from '../util/images';
import { ErrorCard } from '../util/cards';

// Used to load custom result id
export default function ResultWrapper() {
    const { id, isFromUpload } = useParams();
    return <Result resultId={id} isFromUpload={isFromUpload} />;
}

const Unsuccessful = <ErrorCard message={"Couldn't retrieve result"} description={"Server error"} />
const Successful = <></>

export class Result extends Component {

    static displayName = Result.name;

    constructor(props) {
      super(props);
      this.state = { message: Loading, imageResult: null };
    }

    componentDidMount() {
        const { resultId } = this.props;
        this.loadImageResult(resultId);
    }

    static backToUploadPage() {
        return (
            <a href="/upload-image" className="cta-button">
                Back To Upload
            </a>

        );
    }
    
    static backToHistory() {
        return (
            <a href="/history" className="cta-button">
                Back To History
            </a>
        );
    }

    render() {
            let { isFromUpload } = this.props
            isFromUpload = isFromUpload === "true";
            const navButton = isFromUpload ? Result.backToUploadPage() : Result.backToHistory();
            const message = this.state.message;
            const image = message === Successful ? <DisplayResult imageResult={this.state.imageResult} /> : <></>

            return (
                <div style={{ position: "relative", padding: "1em", textAlign: 'center' }}>
                    <h1>Result Page</h1>
                    <div>{message}</div>
                    <div style={{ marginBottom: "1em" }}>{image}</div>
                    
                    {/* Container for buttons */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <span style={{ textAlign: "right" }}>{navButton}</span>
                    </div>
                </div>
            );
        }

    async loadImageResult(id) {
        getImageResult(id).then((result) => {
            console.log(result);
            this.setState({ message: Successful, imageResult: result });
        }).catch(() => {
            this.setState({ message: Unsuccessful })
        });
    }
}