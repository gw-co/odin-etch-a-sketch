let pixels;
let pixelnum;
let primarycolor;


function create_pixels(){
    pixels.textContent = '';
    let n = parseInt(pixelnum.value);
    if(isNaN(n)) pixelnum.value = 16;
    if(n < 1)    pixelnum.value = 1;
    if(n > 64)   pixelnum.value = 64;
    n = parseInt(pixelnum.value);
    // console.log(n);
    for(let i = 0; i < n; i++){
        let row = document.createElement('div');
        row.classList.add('pixel-row');
        for(let j = 0; j < n; j++){
            let pix = document.createElement('div');
            pix.classList.add('pixel');
            pix.id = (n * i + j).toString();
            pix.addEventListener('mousedown', pixel_clicked);
            pix.addEventListener('mouseover', pixel_overed);
            row.appendChild(pix);
        }
        pixels.appendChild(row);
    }
}

function pixel_overed(e){
    // console.log(e.target.id);
    if(e.buttons == 1){
        e.target.style.backgroundColor = primarycolor;
    }
}

function pixel_clicked(e){
    // console.log(e.target.id);
    e.target.style.backgroundColor = primarycolor;
}

function color_selected(e){
    // console.log(e);
    primarycolor = e.target.value;
}

// on startup
pixelnum = document.getElementById('pixel-num');
pixelnum.value = 16;
pixels = document.querySelector('.pixels');

document.querySelectorAll('.primary-color').forEach((c) => {
    c.addEventListener('input', color_selected, false);
    c.addEventListener('click', color_selected, false);
});
primarycolor = document.querySelector('.primary-color').value;

create_pixels();