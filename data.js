const  updateProgress = (oEvent) => {

    let percentComplete
    oEvent.lengthComputable ?
        percentComplete = oEvent.loaded / oEvent.total * 100 :
        console.log('Unable to compute progress information since the total size is unknown')
}

function transferComplete (e) {
    renderForm(this.response, '#main__order-form')
    renderShoppingCart()
}

const transferFailed = () => {
    console.log('An error occured whle transferring the file')
}

const transferCancelled = () => {

    console.log('The transfer has been cancelled by the user')
}

const loadData = (fileUrl) => {
    let responseObject = null
    var oReq = new XMLHttpRequest();
    oReq.responseType = "json"
    oReq.addEventListener("load", transferComplete);
    oReq.addEventListener("progress", updateProgress)
    oReq.addEventListener("error", transferFailed)
    oReq.addEventListener("abort", transferCancelled)
    oReq.open("GET", fileUrl);
    oReq.send();
}
