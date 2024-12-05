import React, { Component } from 'react';
import { Loading } from '../util/staticMessages'
import { getTotalImages, getImageResult, DisplayImage } from '../util/images';
import { ErrorCard } from '../util/cards';

const Successful = <></>
const Unsuccessful = <ErrorCard message={"Couldn't retrieve history"} description={"Server error (Try reloading the page)"} />

export class History extends Component {
    static displayName = History.name;

    constructor(props) {
      super(props);
      this.state = { message: Loading, images: [] }
    }

    componentDidMount() {
        this.loadImages();
    }

    static displayImageArray(obj, images) {
        // sort images
        images.sort((x, y) => {
            const d1 = new Date(x.DateUploaded);
            const d2 = new Date(y.DateUploaded);
            if(d1 < d2) return 1;
            else if(d1 > d2) return -1;
            else return 0;
        });

        return (
            <div style={{display: "inline-block", maxHeight: "70vh", overflow: "scroll"}}>
                { 
                    images.map((image, i) => {
                        i++;
                        return (
                            <a key={i} href={`/result/${i}`} style={{color: "black"}}>
                                <div className="hover" style={{display: "inline-block", border: "2px black solid", borderRadius: "4px", padding: "1%", marginBottom: "1em", marginRight: "1em"}}>
                                    <p>Date Uploaded: { image.DateUploaded }</p>
                                    <p>Liquid Amount: { image.LiquidAmount } ml</p>
                                    <DisplayImage img={image.ImageSrc} />
                                </div>    
                            </a>
                        );
                        }) 
                }
            </div>
        );
    }

    render() {
        const message = this.state.message;
        let images = <></>
        switch(message) {
            case Successful:
                images = History.displayImageArray(this, this.state.images);
                break;
            default:
                break;

        }
        return (
            <div style={{display: "flex-col", margin: "auto"}}>
                <h1>Result History</h1>
                { message }
                { images }
            </div>
        );
    }

    async loadImages() {
        getTotalImages().then(x => {
            for(let i = 0; i < x; i++) {
                getImageResult(i + 1).then(result => {
                    const arr = this.state.images;
                    arr[i] = result;
                    if(i + 1 === x) {
                        this.setState({ message: Successful, images: arr });
                    } else this.setState({ images: arr });
                })
            }
        }).catch(() => {
            this.setState({ message: Unsuccessful, images: [] });
        });
    }

}