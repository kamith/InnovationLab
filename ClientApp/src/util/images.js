export function DisplayImage({img}) {
    if(img == null) return <></>
    return (
        <div>
            <img src={img} style={{maxHeight: 350, maxWidth: 350}} alt="Result"></img>
        </div>
    );
}

export function DisplayResult({imageResult}) {
    return (
        <div style={{display: "inline-block", border: "2px black solid", borderRadius: "4px", padding: "1%"}} >
            <p>Liquid Amount: {imageResult.LiquidAmount} ml</p>
            <DisplayImage img={imageResult.ImageSrc} />
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
    if(response.status !== 200) return -1;
    const body = await response.text();
    return parseInt(body);
}

export async function getTotalImages() {
    const response = await fetch("images/total-results");
    if(response.status !== 200) throw new Error();
    const body = await response.text();
    return parseInt(body);
}

export async function getImageResult(id) {
    const response = await fetch(`images/result/${id}`);
    if(response.status !== 200) return null;
    const body = await response.text();
    const result = JSON.parse(body);
    const blob = await getFileFromResponse(result.ImageData);
    const url = URL.createObjectURL(blob);
    const ans = {};
    ans.ImageSrc = url;
    ans.LiquidAmount = result.LiquidAmount;
    ans.DateUploaded = result.DateUploaded;
    return ans;
}

export async function getFileFromResponse(data) {
    const result = await fetch(data);
    const blob = await result.blob();
    return blob;
}