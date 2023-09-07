const fileInput = document.querySelector(".file-input");
let filterOptions = document.querySelectorAll(".filter button");
let filterSlider = document.querySelector(".slider input");
let filterName = document.querySelector(".filter-info .name");
let filterValue = document.querySelector(".filter-info .value");
let rotateOptions = document.querySelectorAll(".rotate button");
let previewImg = document.querySelector(".preview-img img");
let chooseImgBtn = document.querySelector(".choose-img");

let resetBtn = document.querySelector(".reset-filter");
let saveBtn = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, horizontalFlip = 1, verticalFlip = 1;

const applyFilters = () => {
    // Rotate and Flip
    previewImg.style.transform = `rotate(${rotate}deg) scale(${horizontalFlip}, ${verticalFlip})`;
    // Other filters
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file)   return;
    previewImg.src = URL.createObjectURL(file);
    console.log(file);
    previewImg.addEventListener("load", () => {
        resetBtn.click();   // Reset all filters everytime you load a new image
        document.querySelector(".container").classList.remove("disable");
    });
}

// adding event listener to all the filter buttons
filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else if(option.id === "grayscale") {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    console.log(filterSlider.value);
    filterValue.innerText = `${filterSlider.value}%`;
    let selectedFilter = document.querySelector(".filter .active");

    // Storing all the filter value
    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else if(selectedFilter.id === "grayscale") {
        grayscale = filterSlider.value;
    }

    applyFilters();
}

// adding event listener to all the rotate/flip buttons
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;   // rotate 90deg clock wise
        } else if(option.id === "right") {
            rotate += 90;   // rotate 90deg anti-clock wise
        } else if(option.id === "horizontal") {
            // Horizontal flip if 1 -> -1 and vise versa
            horizontalFlip = horizontalFlip === 1 ? -1 : 1;
        } else if(option.id === "vertical") {
            // Horizontal flip if 1 -> -1 and vise versa
            verticalFlip = verticalFlip === 1 ? -1 : 1;
        }

        applyFilters();
    });
});

const resetFilters = () => {
    console.log("All filters have been reset to default");
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; horizontalFlip = 1; verticalFlip = 1;
    filterOptions[0].click();
    applyFilters() ;    // applying filters after changing values of variables
}

const saveImage = () => {
    console.log("Image saved successfully.");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width/2, canvas.height/2);
    if(rotate != 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(horizontalFlip, verticalFlip);
    ctx.drawImage(previewImg, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    // document.body.appendChild(canvas);

    const link = document.createElement("a");   // creating <a> link
    link.download = "image.jpg";    // passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL();     // passing <a> tag  href value to canvas data url
    link.click();   // Click the download link
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());

resetBtn.addEventListener("click", resetFilters);
saveBtn.addEventListener("click", saveImage);