export function WarningCard({message, description}) {
    return (
        <div style={{display: "inline-block", background: "rgba(218,165,32,0.1)", border: "rgba(218,165,32,0.8) solid 2px", borderRadius: 4, padding: "1%"}}>
            <h5 style={{margin: "auto"}}>{ message }</h5>
            <p style={{margin: "auto"}}><em>{ description }</em></p>
        </div>
    );
}

export function SuccessCard({message}) {
    return (
        <div style={{display: "inline-block", background: "rgba(0,255,0,0.3)", border: "rgba(0,255,0,1) solid 2px", borderRadius: 4, padding: "1%"}}>
            <h5 style={{margin: "auto"}}>{ message }</h5>
        </div>
    );
}

export function ErrorCard({message, description}) {
    return (
        <div style={{display: "inline-block", background: "rgba(255,182,193,0.6)", border: "rgb(255, 0, 0, 0.5) solid 2px", borderRadius: 4, padding: "1%"}}>
            <h5 style={{margin: "auto"}}>{ message }</h5>
            <p style={{margin: "auto"}}><em>{ description }</em></p>
        </div>
    );
}