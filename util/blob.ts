/*
  Adapted from Random SVG Blob Shape Generator (Angular version), by Sergey Rudenko
  code + step by step :
  https://medium.com/better-programming/random-svg-blob-shape-generator-e3d5b9a55f50
  demo: 
  https://stackblitz.com/edit/ionic-v4-angular-tabs-1x83k4?file=src%2Fapp%2Fapp.component.html
*/

 

  
  
function generateCoords(radius:number, hh:number) {
    const centerX = radius/2
    const centerY = hh/2
    const vertixCountFactor = 0.45
    const pathCoordinates = []
    for (let i = 0; i < 2*Math.PI; i+=vertixCountFactor) {
      let x = (radius/4*Math.cos(i) + centerX) + getRandomRadiusModifier();
      let y = (radius/4*Math.sin(i) + centerY) + getRandomRadiusModifier();
      pathCoordinates.push({x,y});
      if (i+vertixCountFactor >= 2*Math.PI) {
        pathCoordinates.push(pathCoordinates[0])
      };
    };

    return pathCoordinates
  }

function getRandomRadiusModifier() {
    let num = Math.floor(Math.random()*10) + 1;
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    return num;
  }

function catmullRom2bezier(pathCoordinates: {
    x: number;
    y: number;
}[]) {

    let d = "";
    pathCoordinates.forEach((coord,index, array) => {
      let p = [];
      if (index === 0) {
        d += `M${coord.x},${coord.y} `;
        p.push(array[array.length - 3]);
        p.push(array[index]);
        p.push(array[index+1]);
        p.push(array[index+2]);
      } else if (index === array.length - 2) {
        p.push(array[index-1]);
        p.push(array[index]);
        p.push(array[index+1]);
        p.push(array[0]);
      } else if (index === array.length - 1) {
        return
      } else {
        p.push(array[index-1]);
        p.push(array[index]);
        p.push(array[index+1]);
        p.push(array[index+2]);
      }
      let bp = [];
      bp.push( { x: p[1].x,  y: p[1].y } );
      bp.push( { x: ((-p[0].x + 6*p[1].x + p[2].x) / 6), y: ((-p[0].y + 6*p[1].y + p[2].y) / 6)} );
      bp.push( { x: ((p[1].x + 6*p[2].x - p[3].x) / 6),  y: ((p[1].y + 6*p[2].y - p[3].y) / 6) } );
      bp.push( { x: p[2].x,  y: p[2].y } );
      d += "C" + bp[1].x + "," + bp[1].y + " " + bp[2].x + "," + bp[2].y + " " + bp[3].x + "," + bp[3].y + " ";

    })

    return d;
  }




export function generateBlob(radius:number, hh:number){
  
    // generateCoords(radius);
    return  catmullRom2bezier(generateCoords(radius, hh))
}

