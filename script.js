let pixels;
let pixelnum;

let back_color;
let primarycolor;
let tool;

function create_pixels(){
    pixels.textContent = '';
    back_color = document.getElementById('back-color').value;
    let n = parseInt(pixelnum.value);
    if(isNaN(n)) pixelnum.value = 16;
    if(n < 1)    pixelnum.value = 1;
    if(n > 64)   pixelnum.value = 64;
    n = parseInt(pixelnum.value);
    for(let i = 0; i < n; i++){
        let row = document.createElement('div');
        row.classList.add('pixel-row');
        for(let j = 0; j < n; j++){
            let pix = document.createElement('div');
            pix.classList.add('pixel');
            pix.style.backgroundColor = back_color;
            pix.id = (n * i + j).toString();
            pix.addEventListener('mousedown', pixel_clicked);
            pix.addEventListener('mouseover', pixel_clicked);
            row.appendChild(pix);
        }
        pixels.appendChild(row);
    }
}

function gaps_func(e){
    if(e.checked){
        document.querySelector('.pixels').style.gap = '1px';
    }
    else{
        document.querySelector('.pixels').style.gap = '0px';
    }
}

function add_color(e){
    let nc = document.createElement('div');
    nc.classList.add('color-container');
    let cc = document.createElement('input');
    cc.setAttribute('type', 'color');
    cc.classList.add('primary-color');
    cc.addEventListener('input', color_selected, false);
    cc.addEventListener('click', color_selected, false);
    cc.value = '#ffffff';
    nc.appendChild(cc);
    e.parentElement.insertBefore(nc, e);
}

function pixel_overed(e){
    if(e.buttons == 1){
        let c = tool.classList[1];
        switch (c) {
            case 'pen':
                e.target.style.backgroundColor = primarycolor;
                break;
        }
    }
}

function random_color(){
    let randhv = function(min = 0, max = 255) {
        return (Math.floor(Math.random() * (max - min + 1) ) + min).toString(16).padStart(2,'0');
    }
    return '#' + randhv() + randhv() + randhv();
}

function rgbtoarr(color){
    let rgb = [];
    rgb[0] = '';
    rgb[1] = '';
    rgb[2] = '';
    if(color[0] === '#'){
        rgb[0] = parseInt(color[1]+color[2], 16);
        rgb[1] = parseInt(color[3]+color[4], 16);
        rgb[2] = parseInt(color[5]+color[6], 16);
        return rgb;
    }
    let k = 0;
    for(let i = 4; i < color.length-1; i++){
        let n = color[i];
        if(n === ',') k++;
        else rgb[k] += n;
    }
    rgb[0] = Number(rgb[0]);
    rgb[1] = Number(rgb[1]);
    rgb[2] = Number(rgb[2]);
    return rgb;
}
function rgbtoarr2(color){
    let rgb = [];
    rgb[0] = '';
    rgb[1] = '';
    rgb[2] = '';
    if(color[0] === '#'){
        rgb[0] = parseInt(color[1]+color[2], 16)/255;
        rgb[1] = parseInt(color[3]+color[4], 16)/255;
        rgb[2] = parseInt(color[5]+color[6], 16)/255;
        return rgb;
    }
    let k = 0;
    for(let i = 4; i < color.length-1; i++){
        let n = color[i];
        if(n === ',') k++;
        else rgb[k] += n;
    }
    rgb[0] = Number(rgb[0])/255;
    rgb[1] = Number(rgb[1])/255;
    rgb[2] = Number(rgb[2])/255;
    return rgb;
}
function darkencolor(rgb){
    let m = Math.max(rgb[0],rgb[1],rgb[2]);
    if(m === 0) return rgb;
    rgb[0] = Math.round(255*Math.max(rgb[0]/255 - rgb[0]/m*0.1, 0));
    rgb[1] = Math.round(255*Math.max(rgb[1]/255 - rgb[1]/m*0.1, 0));
    rgb[2] = Math.round(255*Math.max(rgb[2]/255 - rgb[2]/m*0.1, 0));
    return rgb;
}
function lightencolor(rgb){
    rgb[0] = 255 - rgb[0];
    rgb[1] = 255 - rgb[1];
    rgb[2] = 255 - rgb[2];
    rgb = darkencolor(rgb);
    rgb[0] = 255 - rgb[0];
    rgb[1] = 255 - rgb[1];
    rgb[2] = 255 - rgb[2];
    return rgb;
}
function arrtorgb(rgb){
    return 'rgb('+rgb[0].toString()+','+rgb[1].toString()+','+rgb[2].toString()+')';
}

function pixel_clicked(e){
    if(e.buttons == 1){
        let c = tool.classList[1];
        switch (c) {
            case 'pen':
                this.style.backgroundColor = primarycolor;
                break;

            case 'erase':
                this.style.backgroundColor = back_color;
                break;

            case 'random':
                this.style.backgroundColor = random_color();
                break;
            
            case 'darken':{
                let rgb = rgbtoarr(this.style.backgroundColor);
                rgb = darkencolor(rgb);
                this.style.backgroundColor = arrtorgb(rgb);
                break;
            }

            case 'lighten':{
                let rgb = rgbtoarr(this.style.backgroundColor);
                rgb = lightencolor(rgb);
                this.style.backgroundColor = arrtorgb(rgb);
                break;
            }

            case 'shade':{
                let rgb1 = rgbtoarr(this.style.backgroundColor);
                let rgb2 = rgbtoarr(primarycolor);
                let cd = [];
                cd[0] = rgb2[0] - rgb1[0];
                cd[1] = rgb2[1] - rgb1[1];
                cd[2] = rgb2[2] - rgb1[2];
                let m = Math.max(Math.abs(cd[0]),Math.abs(cd[1]),Math.abs(cd[2]));
                if(m > 0.1*255){
                    rgb1[0] = Math.round(rgb1[0] + 255*0.1*cd[0]/m);
                    rgb1[1] = Math.round(rgb1[1] + 255*0.1*cd[1]/m);
                    rgb1[2] = Math.round(rgb1[2] + 255*0.1*cd[2]/m);
                    this.style.backgroundColor = arrtorgb(rgb1);
                }
                else this.style.backgroundColor = arrtorgb(rgb2);
                break;
            }
        }
    }
}

function color_selected(e){
    document.querySelector('.selected-color').classList.remove('selected-color');
    e.target.parentElement.classList.add('selected-color');
    if(e.detail !== 2) e.preventDefault();
    primarycolor = e.target.value;
}

function tool_selected(e){
    document.querySelector('.selected-tool').classList.remove('selected-tool');
    this.classList.add('selected-tool');
    tool = this;
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
document.querySelector('.primary-color').parentElement.classList.add('selected-color');
document.querySelectorAll('.tool').forEach((t) => {
    t.addEventListener('click', tool_selected, false);
});
tool = document.querySelector('.tool');
tool.classList.add('selected-tool');
back_color = document.getElementById('back-color').value

create_pixels();