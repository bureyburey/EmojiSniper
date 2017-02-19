function init(){
    var scoreboard = new Scoreboard();
    var introMsg="Welcome to 'Emoji Sniper'!\n\nTilt the phone on its axis for movement, and use the right side slider for angle adjustment of the vertical movement";
       
    if(window.DeviceMotionEvent){
        window.addEventListener("devicemotion", motion, false);
    }else{
      console.log("DeviceMotionEvent is not supported");
    }
    
    function borderCorrection(){
        // re-position cursor if went out of canvas borders
        if(cursor.x<0)
            cursor.x=0;
        if(cursor.x>myCanvas.width-cursor.radius/2)
            cursor.x=myCanvas.width-cursor.radius/2;
        if(cursor.y<0)
            cursor.y=0;
        if(cursor.y>myCanvas.height)
            cursor.y=myCanvas.height;
    }
    
    function updateMovement(value,axis){
        // ypdate movement of cursor and make corrections (borderCorrection)
        if(!status.gamePaused && sensorEnabled){
            if(axis==='x'){
                cursor.x-=(value)*1.0;
            }
            if(axis==='y'){
                cursor.y-=(value)*1.0-(cursor.yOffset);
            }
            borderCorrection();
        }
    }
    
    function motion(event){
        // make movement on x and y axes
        updateMovement(event.accelerationIncludingGravity.x,'x');
        updateMovement(event.accelerationIncludingGravity.z,'y');
       
      /*console.log("Accelerometer: "
        + event.accelerationIncludingGravity.x + ", "
        + event.accelerationIncludingGravity.y + ", "
        + event.accelerationIncludingGravity.z
      );*/
    }
    ////// EXPLOSION METHODS START
    function Particle (){
    /*
     * A single explosion particle
     */
        this.scale = 1.0;
        this.x = 0;
        this.y = 0;
        this.radius = 20;
        this.color = "#000";
        this.velocityX = 0;
        this.velocityY = 0;
        this.scaleSpeed = 0.5;
    
        this.update = function(ms)
        {
            // shrinking
            this.scale -= this.scaleSpeed * ms / 1000.0;
    
            if (this.scale <= 0)
            {
                this.scale = 0;
            }
            // moving away from explosion center
            this.x += this.velocityX * ms/1000.0;
            this.y += this.velocityY * ms/1000.0;
        };
    
        this.draw = function(context2D){
            // translating the 2D context to the particle coordinates
            context2D.save();
            context2D.translate(this.x, this.y);
            context2D.scale(this.scale, this.scale);
    
            // drawing a filled circle in the particle's local space
            context2D.beginPath();
            context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
            context2D.closePath();
    
            context2D.fillStyle = this.color;
            context2D.fill();
    
            context2D.restore();
        };
    }
    function createExplosion(x, y, color){
    /*
     * Advanced Explosion effect
     * Each particle has a different size, move speed and scale speed.
     * 
     * Parameters:
     *     x, y - explosion center
     *     color - particles' color
     */
        var minSize = 10;
        var maxSize = 30;
        var count = 10;
        var minSpeed = 60.0;
        var maxSpeed = 200.0;
        var minScaleSpeed = 1.0;
        var maxScaleSpeed = 4.0;
    
        for (var angle=0; angle<360; angle += Math.round(360/count)){
            var particle = new Particle();
            particle.x = x;
            particle.y = y;
            particle.radius = randVal(minSize, maxSize);
            particle.color = color;
            particle.scaleSpeed = randVal(minScaleSpeed, maxScaleSpeed);
            var speed = randVal(minSpeed, maxSpeed);
            particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
            particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
            particles.push(particle);
        }
    }
    
    function updateExplosions(frameDelay)
    {
        // update and draw particles
        for (var i=0; i<particles.length; i++){
            var particle = particles[i];
    
            particle.update(frameDelay);
            particle.draw(ctx);
            if(particle.scale===0){
                particles.splice(i,1);
            }
        }
    }
    
    function randVal(min, max) {
        // method is needed for particle explosions
        return (Math.floor(Math.random()*(max - min + 1) + min));
    }
    var particles=[];
    ////// EXPLOSION METHODS END
    
    function randFloat(min, max) {
        return (Math.random()*(max - min + 1) + min);
    }

    // set width/height ratio multiplier for the canvas
    var widthRatio=0.85;
    var heightRatio=0.70;
    
    var canvasContainer=document.getElementById("canvasContainer");
    var myCanvas=document.getElementById("myCanvas");
    myCanvas.width = window.innerWidth*widthRatio;
    myCanvas.height = window.innerHeight*heightRatio;
    ctx = myCanvas.getContext("2d");
    
    var sensorEnabled=true;
    var firstShot=false;

    var status={
       gamePaused:false,
       gameOver:false
    }
    
    var gameStatsDefault={
       score:0,
       shotsFired:0,
       shotsHit:0,
       targetsSpawned:0
    }
    
    var gameStats=Object.create(gameStatsDefault);
    
    var cursor={
       x: myCanvas.width*0.5,
       y: myCanvas.height*0.5,
       yOffset:-2,
       radius:20,
       zoom:2,
       isScoped:false
    }
    
    var keys={
        up:false,
        left:false,
        down:false,
        right:false
    }
    
    function handleKeyboardUp(key){
        if(key===38 || key===87){
            // move Up
            keys.up=false;
        }
        if(key===40 || key===83){
            // move Down
            keys.down=false;
        }
        if(key===37 || key===65){
            // move Left
            keys.left=false;
        }
        if(key===39 || key===68){
            // move Right
            keys.right=false;
        }
    }
    function handleKeyboardDown(key){
        // handle key pressed
        /* key codes
        32 - spacebar
        38 - Up Arrow
        40 - Down Arrow
        37 - Left Arrow
        39 - Right Arrow
        87 - W
        83 - S
        65 - A
        68 - D
        13 - Enter
        */
        if(key===32){
            // fire
            fire();
        }
        if(key===13){
            // enter pressed
    
        }
        if(key===38 || key===87){
            // move Up
            keys.up=true;
        }
        if(key===40 || key===83){
            // move Down
            keys.down=true;
        }
        if(key===37 || key===65){
            // move Left
            keys.left=true;
        }
        if(key===39 || key===68){
            // move Right
            keys.right=true;
        }
    }
    
    function keysMovementUpdate(){
        // handle key released
        if(keys.up){
            cursor.y-=7;
        }
        if(keys.down){
            cursor.y+=7;
        }
        if(keys.left){
            cursor.x-=7;
        }
        if(keys.right){
            cursor.x+=7;
        }
        borderCorrection();
    }
    
    window.onkeyup = function(evt) {
        // keyboard event handler
        evt = evt || window.event;
        handleKeyboardUp(evt.keyCode);
    }
    
    window.onkeydown = function(evt) {
        // keyboard event handler
        evt = evt || window.event;
        handleKeyboardDown(evt.keyCode);
    }
    
    setVerticalOffset(); // set initial vertical offset as the value in the slider
    document.getElementById("yOffset").onchange = setVerticalOffset;
    
    function setVerticalOffset(){
        // sets the vertical offset for diffferent angles of holding the device
        cursor.yOffset=parseInt(document.getElementById("yOffset").value);
        document.getElementById("yOffsetLabel").innerHTML = String(document.getElementById("yOffset").value);
    }
    
    // target related variables
    var targetDefault={
       hitRadius:35,
       maxTargets:10,
       xMaxSpeed:3,
       yMaxSpeed:2,
       stock:["😬","🤗","😈","💩","😘","😱","😂","😎","😗","😇","😭","😜","😛","😝","😤","😵","😁","😑","😚","😍"],
       active:[]
    }
    
    var target=Object.create(targetDefault);
    // animation interval related variables
    var interval={
        game:null,
        gameFrameDelay:33,
        spawnTarget:null,
        spawnTargetDelay:1000,
        timer:null
    }
    
    // timer related variables
    var timer={
        on:false,
        second:1000,
        time:60000,
        timeOver:false
    }
    
    var floatingMessagesSettings={
        ttl:(5*timer.second*interval.gameFrameDelay),
        font:"Times New Roman",
        fontSize:22,
        color:"green"
    }
    var floatingMessages=[];
    
    document.getElementById("showScoreboard").onclick=function(){
        scoreboard.showScoreBoard();
    }
    
    
    document.getElementById("equipScope").onchange=function(){
        if(document.getElementById("equipScope").checked){
            cursor.isScoped=true;
        }else{
            cursor.isScoped=false;
        }
    }
    
    function fire(){
        firstShot=true; // mark first shot as done (clears welcome message)
        drawShot(); // draw the shot on the center of the cursor
        checkHit(cursor.x,cursor.y); // check if the shot hit anything
        floatingMessages.push({
                    x:cursor.x+cursor.radius*0.9,
                    y:cursor.y+cursor.radius*0.3,
                    font:"Times New Roman",
                    fontSize:15,
                    fontColor:"black",
                    ttl:floatingMessagesSettings.ttl,
                    msg:("•")
                });
    }
    
    myCanvas.onclick=fire; // bind canvas click to fire function
     document.getElementById("targetSizeSelect").onchange=function(){
    val=document.getElementById("targetSizeSelect").value;
       target.hitRadius=parseInt(val);
    }
    
    function newGame(){
        // initialize a new game by clearing target list, resetting game stats and starting the timer
      document.getElementById("targetSizeSelect").options[0].selected = true; document.getElementById("targetSizeSelect").disabled=true; document.getElementById("startGame").disabled=true;
        target=Object.create(targetDefault);
        target.active=[];
        floatingMessages=[];
        firstShot=true;
         gameStats=Object.create(gameStatsDefault);
        // clearInterval(interval.game);
        // interval.game=setInterval(gameLoop,interval.gameFrameDelay);
        startTimer(60);
    }
    
    function gameOver(){
        // submit the score and reset the game stats
        scoreboard.submitNewScoreDialog(gameStats.score);
        gameStats=Object.create(gameStatsDefault);
       document.getElementById("targetSizeSelect").disabled=false; document.getElementById("startGame").disabled=false;
    }
      document.getElementById("startGame").onclick=newGame;
    
    function checkHit(x,y){
        // check if a shot hit any of the target
        // in case of multiple hits with a single shot, activate combo shot message
        gameStats.shotsFired++;
        count=0;
        xHit=0;
        yHit=0;
        for(i=0;i<target.active.length;i++){
           tar=target.active[i]; // get current target
           r=tar.size*0.75; // get current target hit radius
           if(x>=tar.x-r&&x<=tar.x+r && y>=tar.y-r&&y<=tar.y+r){
               // if all conditions have met, the shot was inside acceptable hit range
                count++; // raise current shot hits counter
                gameStats.shotsHit++; // raise total hits counter
                // save x,y coordinates of current hit
                xHit=tar.x;
                yHit=tar.y;
                // create an explosion in the location
                createExplosion(tar.x,tar.y,"yellow");
                createExplosion(tar.x,tar.y,"orange");
                createExplosion(tar.x,tar.y,"red");
                target.active.splice(i,1); // remove emoji
                i--; // balancer decrement
                addScore(1); // add point for each hit
           }
        }
        if(count>1){
            // more than one emoji hit with a single shot
            // display COMBO message and award extra points count^count
            floatingMessages.push({
                x:xHit,
                y:yHit,
                font:"Times New Roman",
                fontSize:22,
                fontColor:"green",
                ttl:floatingMessagesSettings.ttl,
                msg:(count+"x COMBO!")
            });
            if(timer.on){
                floatingMessages.push({
                    x:xHit,
                    y:yHit+floatingMessagesSettings.fontSize,
                    font:"Times New Roman",
                    fontSize:15,
                    fontColor:"black",
                    ttl:floatingMessagesSettings.ttl,
                    msg:("+"+count+" Seconds")
                });
                timer.time+=(count*timer.second)
            }
            addScore(Math.pow(count,count));
        }
    }
    
    function addScore(score){
       gameStats.score+=score; 
    }
    
    function spawnTarget(){
        // spawns new target if active amount have not passed allowed amount
        if(target.active.length<target.maxTargets){
            // increase total emoji spawned counter
            gameStats.targetsSpawned++;
            // randomize x,y coordinates for spawn location
            x=randFloat(0,myCanvas.width);
            y=randFloat(0,myCanvas.height);
            // create explosion on the coordinates
            createExplosion(x,y,"black");
            createExplosion(x,y,"white");
            // randomize target
            tar=target.stock[randVal(0,target.stock.length-1)];
            // add the new target to the active list, randomizing its speed settings
            target.active.push({
                tar:tar,
                x:x,
                y:y,
                dx:randFloat(-target.xMaxSpeed,target.xMaxSpeed),
                dy:randFloat(-target.yMaxSpeed,target.yMaxSpeed),
                size:target.hitRadius
            });
        }
    }
    
    function drawBackground(){
        // re-assign width/height settings and fill the entire canvas with background color
        myCanvas.width = window.innerWidth*widthRatio;
        myCanvas.height = window.innerHeight*heightRatio;
        ctx.beginPath();
        ctx.fillStyle="lightblue";
        ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
        ctx.closePath();
    }
    
    function drawShot(){
        ctx.beginPath();
        ctx.fillStyle="orange";
        ctx.arc(cursor.x,cursor.y,cursor.radius*0.8,0,2*Math.PI,false);
        ctx.fill();
        ctx.closePath();
    }
    
    function scaleImageData(imageData, scale) {
        var scaled = ctx.createImageData(imageData.width * scale, imageData.height * scale);
        var subLine = ctx.createImageData(scale, 1).data;
        
        for (var row = 0; row < imageData.height; row++) {
            for (var col = 0; col < imageData.width; col++) {

                var sourcePixel = imageData.data.subarray(
                    (row * imageData.width + col) * 4,
                    (row * imageData.width + col) * 4 + 4
                );
                for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4)
                for (var y = 0; y < scale; y++) {
                    var destRow = row * scale + y;
                    var destCol = col * scale;
                    
                    scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
                }
            }
        }
        return scaled;
    }
    
    function drawCursor(){
        
        if(cursor.isScoped){
         imgData=ctx.getImageData(cursor.x-cursor.radius*0.5,cursor.y-cursor.radius*0.5,cursor.radius,cursor.radius);
        
         ctx.putImageData(scaleImageData(imgData,cursor.zoom),cursor.x-cursor.radius,cursor.y-cursor.radius);
        
        // oGrd = ctx.createRadialGradient(cursor.x,cursor.y,cursor.radius,cursor.x,cursor.y,cursor.radius-1);
        // oGrd.addColorStop(0.8, "rgba(0, 0, 0, 1.0)");
        // oGrd.addColorStop(1.0, "rgba(0, 0, 0, 0.2)");
        // ctx.fillStyle = oGrd;
        // ctx.beginPath();
        // ctx.rect(cursor.x-cursor.radius,cursor.y-cursor.radius,cursor.radius*2,cursor.radius*2);
        // ctx.closePath();
        // ctx.fill();
        }
        // draw the cursor circle
        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.lineWidth=3;
        if(cursor.isScoped){
            ctx.rect(cursor.x-cursor.radius,cursor.y-cursor.radius,cursor.radius*2,cursor.radius*2);
        }else{
            ctx.arc(cursor.x,cursor.y,cursor.radius,0,2*Math.PI,false);
        }
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.strokeStyle="red";
        ctx.lineWidth=1;
        ctx.arc(cursor.x,cursor.y,cursor.radius*0.2,0,2*Math.PI,false);
        ctx.stroke();
        ctx.closePath();
        
        // draw crosshair lines
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.moveTo(cursor.x-cursor.radius,cursor.y);
        ctx.lineTo(cursor.x-cursor.radius*0.3,cursor.y);
        ctx.moveTo(cursor.x+cursor.radius,cursor.y);
        ctx.lineTo(cursor.x+cursor.radius*0.3,cursor.y);
        ctx.moveTo(cursor.x,cursor.y-cursor.radius);
        ctx.lineTo(cursor.x,cursor.y-cursor.radius*0.3);
        ctx.moveTo(cursor.x,cursor.y+cursor.radius);
        ctx.lineTo(cursor.x,cursor.y+cursor.radius*0.3);
        ctx.stroke();
        ctx.closePath();
    }
    
    function drawTargets(){
        // draw all targetss
       for(i=0;i<target.active.length;i++){
           tar=target.active[i];
           ctx.font = tar.size+"px Times New Roman";
           ctx.fillStyle = 'black';
           ctx.fillText(tar.tar, tar.x-tar.size*0.5, tar.y+tar.size*0.5);
           
        /*
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(tar.x,tar.y,3,0,2*Math.PI,false);
        ctx.fill();
        ctx.closePath();
        */
       }
    }
    
    function moveTargets(){
        // update all of the targets positions
        for(i=0;i<target.active.length;i++){
           tar=target.active[i];
           tar.x+=tar.dx;
           tar.y+=tar.dy;
           if(tar.x<0&&tar.dx<0){
              tar.dx=Math.abs(tar.dx);
           }
           if(tar.x>myCanvas.width&&tar.dx>0){
              tar.dx=Math.abs(tar.dx)*(-1);
           }
           if(tar.y<0&&tar.dy<0){
              tar.dy=Math.abs(tar.dy);
           }
           if(tar.y>myCanvas.height&&tar.dy>0){
              tar.dy=Math.abs(tar.dy)*(-1);
           }
       }
    }
    
    function updateDisplayValues(){
        // update game statistics display
        document.getElementById("scoreValue").innerHTML=gameStats.score;
        document.getElementById("hrValue").innerHTML=gameStats.shotsHit+"/"+gameStats.shotsFired;
        
        hrPercent=parseInt((gameStats.shotsHit/gameStats.shotsFired)*100);
        if(isNaN(hrPercent))
            hrPercent="0"

        document.getElementById("hrPercent").innerHTML=hrPercent+"%";
    }
    
    function displayWelcomeMsg(){
        // display a welcome message (removed once first shot is made)
        ctx.font = "22px Times New Roman";
        ctx.fillStyle = 'red';
        ctx.fillText("Emoji Sniper!",myCanvas.width*0.01,myCanvas.height*0.1);
        ctx.font = "15px Times New Roman";
        ctx.fillStyle = 'green';
        ctx.fillText("Coded by Burey",myCanvas.width*0.01,myCanvas.height*0.15);
        ctx.font = "22px Times New Roman";
        ctx.fillStyle = 'blue';
        ctx.fillText("Tilt phone to move",myCanvas.width*0.01,myCanvas.height*0.3);
        ctx.fillText("Click on screen to fire",myCanvas.width*0.01,myCanvas.height*0.4);
        ctx.fillText("PC: use arrows/spacebar",myCanvas.width*0.01,myCanvas.height*0.6);
        ctx.fillStyle = 'green';
        ctx.fillText("Press 'Start' for Timed game",myCanvas.width*0.01,myCanvas.height*0.8);
    }
    
    function displayFloatingMessages(){
        // display floating messages on locations
        
        
        for(i=0;i<floatingMessages.length;i++){
            ctx.font = floatingMessages[i].fontSize+"px "+floatingMessages[i].font;
            ctx.fillStyle = floatingMessages[i].fontColor;
            
            ctx.fillText(floatingMessages[i].msg ,floatingMessages[i].x-20,floatingMessages[i].y);
            floatingMessages[i].ttl-=1000;
            if(floatingMessages[i].ttl<0)
                floatingMessages.splice(i,1);
        }
    }
    
    /////// TIMER FUNCTIONS
    function updateTimer(){
        timer.time-=timer.second;
        if(timer.time<0)
            stopTimer();
    }
    
    function startTimer(time){
        // time is in seconds
        timer.on=true;
        timer.time=time*timer.second;
        interval.timer=setInterval(updateTimer,timer.second);
    }
    
    function stopTimer(){
        timer.on=false;
        clearInterval(interval.timer);
        interval.timer=null;
        gameOver();
    }
    
    function displayTimer(){
        if(!interval.timer)
            return;
        ctx.font = "15px Times New Roman";
        ctx.fillStyle = 'black';
        ctx.fillText("Time: "+timer.time/1000,myCanvas.width*0.01,myCanvas.height*0.05);
    }
    /////// TIMER FUNCTIONS END
    
    function gameLoop(){
        // main game loop
        // call each function in turn to update graphics and events
        drawBackground();
        if(timer.on)
            displayTimer();
        
        displayFloatingMessages();
        
        if(!firstShot){
            displayWelcomeMsg();
        }
        moveTargets();
        drawTargets();
        updateExplosions(interval.gameFrameDelay);
        keysMovementUpdate();
        drawCursor();
        updateDisplayValues();
        
    }
    alert(introMsg);
    interval.spawnTarget=setInterval(spawnTarget,interval.spawnTargetDelay);
    interval.game=setInterval(gameLoop,interval.gameFrameDelay);
}

window.onload=init;
