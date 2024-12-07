import React, { useState, useEffect } from 'react';
import './labels.css'

export function DisplayImage({ img }) {
    if (img == null) return <></>;

    // Define responsive styles
    const desktopStyle = {
        maxHeight: 350,
        maxWidth: 350,
        borderRadius: "16px",
    };

    const mobileStyle = {
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        borderRadius: "16px",
    };

    const containerMobileStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    };

    // Use a media query to determine which styles to apply
    const isMobile = window.matchMedia("(max-width: 570px)").matches;

    return (
        <div>
            <img
                src={img}
                style={isMobile ? mobileStyle : desktopStyle}
                alt="Result"
            />
        </div>
    );
}


export function DisplayResult({imageResult}) {

    const formattedDate = imageResult.DateUploaded
        ? new Date(imageResult.DateUploaded).toLocaleDateString()
        : 'Unknown';

    return (
        <div style={{
            display: "inline-block", 
            border: "2px black solid", 
            borderRadius: "16px", 
            padding: "1%", 
            textAlign: "left" 
        }}>
            <div style={{ marginBottom: "0.5em", display: "flex", alignItems: "center" }}>
                <span className="labels">Captured By:</span>
                <span>{imageResult.CapturedBy}</span>
            </div>
            <div style={{ marginBottom: "0.5em", display: "flex", alignItems: "center" }}>
                <span className="labels">Date Uploaded:</span>
                <span>{formattedDate}</span>
            </div>
            <div style={{ marginBottom: "0.5em", display: "flex", alignItems: "center" }}>
                <span className="labels">Liquid Amount:</span>
                <span>{imageResult.LiquidAmount} ml</span>
            </div>
            <div>
            <img
                src={imageResult.ImageSrc}
                style={{
                    maxHeight: 350,
                    maxWidth: 350,
                    borderRadius: "16px",  
                }}
                alt="Result"
            />
        </div>
        </div>
        
    );
}

export async function uploadImage(img) {
    const response = await fetch('images/upload-image', {
        method: 'POST',
        headers: {
            "Content-Type": img.type
        },
        body: img
    });
    if (response.status !== 200) return -1;
    const body = await response.text();
    return parseInt(body);
}

export async function getTotalImages() {
    const response = await fetch("images/total-results");
    if (response.status !== 200) throw new Error();
    const body = await response.text();
    return parseInt(body);
}

export async function getImageResult(id) {
    const response = await fetch(`images/result/${id}`);
    if (response.status !== 200) return null;
    const body = await response.text();
    const result = JSON.parse(body);
    const blob = await getFileFromResponse(result.ImageData);
    const url = URL.createObjectURL(blob);
    const ans = {};
    ans.ImageSrc = url;
    ans.LiquidAmount = result.LiquidAmount;
    ans.DateUploaded = result.DateUploaded;
    ans.CapturedBy = result.CapturedBy;
    return ans;
}

export async function getFileFromResponse(data) {
    const result = await fetch(data);
    const blob = await result.blob();
    return blob;
}