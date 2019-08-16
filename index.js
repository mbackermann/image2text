function convertImageToHtml(imageObj, text) {
    const width = 200;
    const height = 200;
    let canvasToDraw = document.getElementById("canvasToDraw")
    canvasToDraw.html = '';
    const myCanvas = document.createElement("canvas");
    myCanvas.width = width;
    myCanvas.height = height;
    document.body.appendChild(myCanvas);

    const context = myCanvas.getContext("2d");
    context.drawImage(imageObj, 0, 0, width, height);

    let imageData;
    try {
        imageData = context.getImageData(0, 0, width, height);
    } catch (error) {
        // this is where you might see a security error
        alert(error);
    }

    const data = imageData.data;
    let allColorData = [];

    let rowData = [];
    for (var i = 0; i < data.length; i += 4) {
        // have we gone through all the pixels in this row?
        if (rowData.length === width) {
            allColorData.push(rowData);
            rowData = [];
        }

        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];

        rowData.push([red, green, blue, alpha]);
    }

    // push the very last row of data
    allColorData.push(rowData);

    // let's hide this to make some space
    myCanvas.style.display = "none";

    const stringToDisplay = text;
    const fontSize = 7;
    const squareSize = fontSize - 3;
    let characterCount = 0;
    allColorData.forEach((rowData, rowIndex) => {
        rowData.forEach((rgbaArray, columnIndex) => {
            const smallSquare = document.createElement("div");
            smallSquare.innerHTML =
                stringToDisplay[characterCount % stringToDisplay.length];

            smallSquare.style = `
        width: ${squareSize};
        height: ${squareSize};
        position: absolute;
        top: ${rowIndex * squareSize}px;
        left: ${columnIndex * squareSize}px;
        line-height: ${squareSize}px;
        vertical-align: middle;
        text-align: center;
        font-size: ${fontSize}px;
        font-weight: bold;
        font-family: Courier;
        color: rgba(${rgbaArray});
      `;

            canvasToDraw.appendChild(smallSquare);

            characterCount++;
        });
    });
    document.querySelector('.loading').style.display = 'none';
};

function checkImage() {
    let file = document.getElementById("fileName").files[0];
    let text = document.getElementById("text").value;
    if (text == '' || file == '') {
        alert("Image and Text are required!");
        return;
    }
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert("Image invalid!");
        return;
    }
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(file);
    let image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = url;
    image.onload = () => {
        if (image.width != image.height) {
            alert("Image must be square!");
            return;
        } else {
            document.querySelector('.loading').style.display = 'block';
            convertImageToHtml(image, text);
        }
    }

}

//convertImageToHtml(0, 0);