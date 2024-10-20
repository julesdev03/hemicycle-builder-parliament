class HemycicleBuilder {
    constructor(data) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.radiusStep = 23;
        this.lengthData = data.length;
        this.dotsElements = [];
        // Determine the start row length, dots size
        this.startRow = 18;
        this.sizeDot = 9;
        // Get dots per row
        this.getDotsPerRow();
        
        // Determine size svg
        let sizeSvg = 140 + this.baseDotsPerRow.length * (this.radiusStep+1);
        this.centerX = sizeSvg;
        this.centerY = sizeSvg;
        this.svgElement.setAttribute('viewBox', `0 0 ${sizeSvg*2} ${sizeSvg}`);
        
        // Set up the seats positions, and sort them based on position from left to right
        this.getSeatsPosition();

        // Draw the hemycicle
        this.drawPointHemycicle(data);
    }

    getElement(){
        return this.svgElement;
    }

    getDotsPerRow() {
        let baseDotsPerRow = [];
        let dotsInThisRow = this.startRow;
        let countCurrentRow = 0;
        for(let i=0; i < this.lengthData; i++) {
            // Add mep if inferior to dotsIntThisRow
            countCurrentRow++;
            if (countCurrentRow == dotsInThisRow) {
                baseDotsPerRow.push(countCurrentRow);
                countCurrentRow = 0;
                dotsInThisRow+=3;
                continue
            } else if (i == this.lengthData-1) {
                // If there is only row, do not distribute to the first row but to a second one
                if(baseDotsPerRow.length == 1) {
                    baseDotsPerRow[1] = countCurrentRow;
                    break
                } else if (baseDotsPerRow.length == 0) {
                    baseDotsPerRow[0] = countCurrentRow;
                    break
                } else {
                    // When reaching last dot, distribute equally among the rows
                    const remainingPerRow = Math.floor(countCurrentRow / baseDotsPerRow.length);
                    const remainingLast = countCurrentRow % baseDotsPerRow.length;
                    for(let k=0; k<baseDotsPerRow.length; k++) {
                        baseDotsPerRow[k] += remainingPerRow;
                        if(remainingLast > k){
                            baseDotsPerRow[k]++
                        }
                    }
                }                              
            }
        }
        // Store the dots per row in the variable
        this.baseDotsPerRow = baseDotsPerRow;
    }

    getSeatsPosition() {
        // Draw the hemicycle
        let positions = []; // Store polar and cartesian coordinates here
        const pi = Math.PI;
        const numRows = this.baseDotsPerRow.length;
        
        // Calculate seat positions
        for (let row = 0; row < numRows; row++) {
            const radius = 140 + row * this.radiusStep; // Polar radius increases with each row
            const numDotsInRow = this.baseDotsPerRow[row]; // Dynamic number of dots per row
            const angleStep = pi / numDotsInRow; // Angle step in radians (for polar θ)

            for (let dotIndex = 0; dotIndex < numDotsInRow; dotIndex++) {
                let seat = {};

                // Polar coordinates
                seat.polar = {
                    r: radius,                       // Polar radius (distance from center)
                    teta: -pi + angleStep * (dotIndex + 0.5) // Polar angle (from -π to π)
                };

                // Cartesian coordinates
                seat.cartesian = {
                    x: this.centerX + seat.polar.r * Math.cos(seat.polar.teta), // Convert polar to Cartesian (x)
                    y: this.centerY + seat.polar.r * Math.sin(seat.polar.teta)  // Convert polar to Cartesian (y)
                };

                // Push both polar and cartesian coordinates
                positions.push(seat);
            }
        }
        // Sort coordinates in order to process them from left to right
        positions.sort(function(t, r) {
            return t.polar.teta - r.polar.teta || r.polar.r - t.polar.r;
        });

        this.coordinatesPoints = positions;
    }

    drawPointHemycicle(data) {
        let index = 0;
        this.coordinatesPoints.forEach( seat => {
            // Create a circle element for each dot
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", seat.cartesian.x);
            dot.setAttribute("cy", seat.cartesian.y);
            dot.setAttribute("r", this.sizeDot); // Radius of each dot
            // Provide fill style if there is one
            dot.style.fill = data[index].fill ? data[index].fill : null;
            index++;
            this.svgElement.appendChild(dot);
            this.dotsElements.push(dot);
        });
    }

}