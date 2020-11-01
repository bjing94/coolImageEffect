function displayImageInParticles(canvID, src, num, detail, useColor) {


    const image = new Image(); //create new image
    image.src = src;

    image.addEventListener('load', function () {
        const canvas = document.querySelector(canvID);
        const ctx = canvas.getContext('2d'); //GetRendring info from canvas
        canvas.width = image.width;
        canvas.height = image.height;

        let particlesArray = []; //Array of particles to move. fall n shit
        const numberOfParticles = num;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height); //Add image to canvas
        const pixels = (ctx.getImageData(0, 0, canvas.width, canvas.height)); //Get pixels from image.
        ctx.clearRect(0, 0, canvas.width, canvas.height); //Remove original image
        let grid = [];
        let GridColors = [];
        for (let y = 0; y < canvas.height; y += detail) {
            let row = [];
            let rowColors = [];
            for (let x = 0; x < canvas.width; x += detail) {
                const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
                const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
                const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
                const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                const brightness = caclulateBrightness(red, green, blue) / 100; //Calculate brightness based on color.

                row.push(brightness);
                rowColors.push(color);

            }
            grid.push(row); //Grid of lightning;
            GridColors.push(rowColors);
        }
        class Particle {
            constructor() {
                this.x = 0;
                this.y = Math.random() * canvas.height;
                this.speed = 0;
                this.color = "rgb(0,0,0)";
                this.velocity = Math.random() * 1.5;
                this.size = Math.random() * 1 + 0.1;
            }
            update() {
                let posRow = Math.floor(this.y / detail);
                let posCol = Math.floor(this.x / detail);
                if(posRow>=canvas.height)
                {
                    posRow=canvas.height-2;
                }
                // this.speed = grid[posRow][posCol];
                this.speed = grid[posRow][posCol];
                this.color = GridColors[posRow][posCol];
                // this.speed = grid[Math.floor(this.y / detail)][Math.floor(this.x / detail)];
                let movement = (2.5 - this.speed) + this.velocity;
                // this.y += movement*(-1);
                // if (this.y <= 0) {
                //     this.y = canvas.height;
                //     this.x = Math.random() * canvas.width;
                // }
                this.x+=movement;
                if(this.x>=canvas.width){
                    this.x=0;
                    this.y=Math.random()*canvas.height;
                }

            }
            draw() {
                ctx.beginPath();
                if(useColor)
                {
                    ctx.fillStyle = this.color;
                }else
                {
                    ctx.fillStyle='white';
                }
                
                ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }

        }
        init();

        function animate() {
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.2;
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                ctx.globalAlpha = particlesArray[i].speed * 0.3;
                particlesArray[i].draw();

            }
            requestAnimationFrame(animate);

        }
        animate();

        function caclulateBrightness(red, green, blue) {
            return Math.sqrt((red * red) * 0.299 +
                (green * green) * 0.587 +
                (blue * blue) * 0.114
            );
        }
        //https://codepen.io/franksLaboratory/pen/vYKRpvE ахуеть эффект
    });



}


displayImageInParticles('#myCanvas', "images/arthas.png", 32000, 1, false);
//Idea: create function to fill image with particles.