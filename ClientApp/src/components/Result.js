import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../util/staticMessages'
import { getImageResult, DisplayResult } from '../util/images';
import { ErrorCard } from '../util/cards';

// Used to load custom result id
export default function ResultWrapper() {
    const { id } = useParams();
    return <Result resultId={id} />;
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
            <div>
                <a href="/upload-image"><button>Go back to upload page</button></a>
            </div>
        );
    }

    render() {
        const uploadPageButton = Result.backToUploadPage();
        const message = this.state.message;
        const image = message === Successful ? <DisplayResult imageResult={this.state.imageResult} /> : <></>
        return (
            <div>
                <h1>Result Page</h1>
                { message }
                <div style={{marginBottom: "1em"}}>
                    { image }
                </div>
                { uploadPageButton }
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