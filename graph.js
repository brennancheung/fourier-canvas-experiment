$(document).ready(function() {
    function fun1(x) {return Math.cos(2*x) + Math.cos(3*x);  }
    function fun2(x) {return Math.cos(x);}
    function fun3(x) { return (Math.cos(2*x) + Math.cos(3*x)) * Math.cos(2.4*x) }

    function draw() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var x_axis = document.getElementById("x_axis");

        var axes={};
        axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
        axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
        axes.scale = 60;                 // 40 pixels from x=0 to x=1
        axes.doNegativeX = true;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(0, 0, 0)";
        for (var k=0; k<8; k+=0.01) {
            var sum = 0;
            for (var x=0; x<1000; x++) {
                var y = (Math.cos(2*x) + Math.cos(3*x)) * Math.cos(k*x);
                sum += y;
            }
            sum = sum / 500;
            ctx.moveTo(k*300, 100);
            ctx.lineTo(k*300, 100-sum*100);
        }
        ctx.stroke();

        canvas.addEventListener("mousemove", function(e){
            var freq = (e.x/300).toFixed(2);
            // x_axis.value = ((e.x - axes.x0) / axes.scale*2).toFixed(2);
            ctx.fillStyle = "black";
            ctx.font = "bold 36px Arial";
            ctx.clearRect(0, 130, 1920, 1280);
            ctx.fillText(freq + " Hz", e.x-36, axes.y0 - 470);
            showAxes(ctx,axes);
            funGraph(ctx,axes,fun1,"rgb(0,0,0)",1);
            // funGraph(ctx,axes,fun2,"rgb(66,44,255)",2);
            var fun3 = function(x) { return (Math.cos(2*x) + Math.cos(3*x)) * Math.cos(freq*x); }
            funGraph(ctx,axes,fun3,"rgb(0,0,255)",4);
            var posSum = 0, negSum = 0;
            for (var x=0; x<1000; x++) {
                var y = fun3(x);
                if (y > 0) posSum += y;
                if (y < 0) negSum += y;
            }
        });


    }

    function funGraph (ctx,axes,func,color,thick) {
        var xx, yy, dx=1, x0=axes.x0, y0=axes.y0, scale=axes.scale;
        var iMax = Math.round((ctx.canvas.width-x0)/dx);
        var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
        ctx.beginPath();
        ctx.lineWidth = thick;
        ctx.strokeStyle = color;

        for (var i=iMin;i<=iMax;i++) {
            xx = dx*i; yy = scale*func(xx/scale);
            if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
            else         ctx.lineTo(x0+xx,y0-yy);
        }
        ctx.stroke();
    }

    function showAxes(ctx,axes) {
        var x0=axes.x0, w=ctx.canvas.width;
        var y0=axes.y0, h=ctx.canvas.height;
        var xmin = axes.doNegativeX ? 0 : x0;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(128,128,128)";
        ctx.lineWidth = 1;
        ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
        ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
        ctx.stroke();
    }

    draw();

});
