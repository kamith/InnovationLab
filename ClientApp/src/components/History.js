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

    static displayImageArray(images) {
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
                            <a key={i} href={`/result/${i}/false`} style={{color: "black"}}>
                                <div className="hover" style={{display: "inline-block", border: "2px black solid", borderRadius: "16px", padding: "1%", marginBottom: "1em", marginRight: "1em"}}>
                                    <div style={{ marginBottom: "0.5em", display: "flex", alignItems: "center" }}>
                                        <span className="labels">Date Uploaded:</span>
                                        <span> { image.DateUploaded}</span>
                                    </div>
                                    {/* <DisplayImage img={image.ImageSrc} /> */}
                                            {/* <DisplayImage
                                                //  src={image.ImageSrc}
                                                
                                                img={image.ImageSrc}
                                                style={{
                                                    maxHeight: 350,
                                                    maxWidth: 350,
                                                    borderRadius: "16px",  
                                                }}
                                                alt="Result"
                                                
                                            /> */}
                                    <DisplayImage
                                        img={image.ImageSrc}
                                        style={{
                                            maxHeight: 350,
                                            maxWidth: 350,
                                            borderRadius: "16px", // This will now work
                                        }}
                                        alt="Result"
                            />
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
                images = History.displayImageArray(this.state.images);
                break;
            default:
                break;

        }
        return (
            <div style={{
                display: "flex",
                flexDirection: "column", // Stack items vertically
                alignItems: "center",    // Center items horizontally
                justifyContent: "center", // Optional: center vertically
                textAlign: "center",     // Center text inside elements
                width: "100%",           // Ensure full-width container
            }}>
                <div
        style={{
            display: "flex",
            flexWrap: "wrap",      // Wrap images if they overflow
            justifyContent: "center", // Center images horizontally
            gap: "1rem",          // Add spacing between images
            width: "100%",        // Ensure images span the container width
        }}
    ></div>
                    <h1 >Scan History</h1>
                    {message}
                    {images}
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