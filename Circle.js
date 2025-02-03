class Circle {
    constructor() {
        this.type = 'circle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 12; 
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw
        var d = this.size / 200.0;  

        let transformedCenter = this.applyMatrix(centerPt);
        let transformedPt1 = this.applyMatrix(vec1);
        let transformedPt2 = this.applyMatrix(vec2);

        // Draw triangles to create the circle
        let angleStep = 360 / this.segments;
        for (var angle = 0; angle < 360; angle += angleStep) {
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            
            // Calculate vertices for the triangle
            let vec1 = [
                Math.cos(angle1 * Math.PI / 180) * d, 
                Math.sin(angle1 * Math.PI / 180) * d
            ];
            let vec2 = [
                Math.cos(angle2 * Math.PI / 180) * d, 
                Math.sin(angle2 * Math.PI / 180) * d
            ];
            
            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
            
            
            drawTriangle([
                xy[0], xy[1],      
                pt1[0], pt1[1],    
                pt2[0], pt2[1],
                transformedCenter[0], transformedCenter[1],      
                transformedPt1[0], transformedPt1[1],    
                transformedPt2[0], transformedPt2[1]      
            ]);
        }
    }
}