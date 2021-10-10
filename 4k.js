"use strict";
var canv,
    ctx;
var colorArr;
function init() {
    canv    = document.getElementById("canv");
    ctx     = canv.getContext("2d");
    window.addEventListener('resize', aspect); 
    window.addEventListener('keypress', fullscreen)
    aspect();
}
function aspect() {                                             // Update on window resize
    const h     = document.documentElement.clientHeight;        // Get Screen height
    const w     = document.documentElement.clientWidth;         // Get Screen width
    let unit    = gcd(w, h);                                      // Finds tile size
    canv.height = h;
    canv.width  = w;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    let lumaGrad = ctx.createLinearGradient(0, 0, w, h);
    lumaGrad.addColorStop(0, "hsl(0, 0%, 30%)");
    lumaGrad.addColorStop(1, "hsl(0, 0%, 80%)");
    ctx.fillStyle = lumaGrad;
    //ctx.fillRect(0, 0, w, h);
    //ctx.globalCompositeOperation = "color";
    colorArr = [];
    let start = Date.now();
    for (let iy = 0; iy < h; iy += unit) {
        colorArr[iy] = [];
        for (let ix = 0; ix < w; ix += unit) {
            const color = {
                h: Math.floor(360 * Math.random())+0,
                s: 100,//Math.floor(41 * Math.random())+60,
                l: 50//Math.floor(41 * Math.random())+30
            }
            let rand = 60;
            if (iy != 0 && ix != 0) {   // General Body
                let above   = colorArr[iy-unit][ix];
                let left    = colorArr[iy][ix-unit];
                if (Math.abs(above.h - left.h) >= 180) {
                    color.h = (above.h + left.h)/2 - 180
                } else {
                    color.h = (above.h + left.h)/2
                }
                color.h += Math.floor(rand * Math.random() - rand / 2);
                color.h %= 359;
            } else if (iy != 0) {       // Left Edge
                let above   = colorArr[iy-unit][ix];
                color.h     = above.h  + Math.floor(rand * Math.random() - rand / 2);
                color.h    %= 359;
            } else if (ix != 0) {       // Top Row
                let left    = colorArr[iy][ix-unit];
                color.h     = left.h + Math.floor(rand * Math.random() - rand / 2);
                color.h    %= 359;
            } else {                    //Top Corner

            }
            ctx.fillStyle = `hsl(${color.h}, ${color.s}%, ${color.l}%`;
            ctx.fillRect(ix, iy, unit, unit);
            (colorArr[iy])[ix] = color;
        }
        //if ((Date.now() - start) >= 10000) break;
    }
}

function gcd(a,b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) {
        let temp = a;
        a = b;
        b = temp;
    }
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

function fullscreen(e) {
    console.log(e.code);
    e.preventDefault();
    if (e.code == "KeyF" && !document.fullscreenElement) canv.webkitRequestFullscreen();
    if (e.code == "Space") aspect();
}