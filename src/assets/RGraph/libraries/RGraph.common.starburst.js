
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.starburst=RGraph.Starburst=RGraph.StarBurst=function(conf)
{var id=conf.id,canvas=document.getElementById(id);this.id=id;this.canvas=canvas;this.context=this.canvas.getContext('2d');this.type='starburst';this.imageCache=[];this.frame=1;this.rotatedAngle=(0-(Math.PI/2));this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.properties={colors:['white','#666'],radius:500,delay:null,segments:12,centerx:null,centery:null,callback:null,animationStep:0.0005,radiusMultiplier:0,radiusIncrement:0.01,image:null,imageHalign:'center',imageValign:'center',imageScale:1,imageX:null,imageY:null,imageW:null,imageH:null,imageShadow:false,imageShadowOffsetx:3,imageShadowOffsety:3,imageShadowColor:'#666',imageShadowBlur:3,};var prop=this.properties;var properties=this.properties;this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
properties[name]=value;return this;};this.get=function(name)
{return properties[name];}
this.draw=function()
{var start=(0-(Math.PI/2))+((properties.frame/(180/Math.PI)/10));if(this.isNull(properties.centerx))properties.centerx=canvas.width/2;if(this.isNull(properties.centery))properties.centery=canvas.height/2;this.context.clearRect(-5,-5,this.canvas.width+10,this.canvas.height+10);var grad=this.context.createRadialGradient(properties.centerx,properties.centery,0,properties.centerx,properties.centery,properties.radius);grad.addColorStop(0,properties.colors[0]);for(var i=1,len=properties.colors.length;i<len;++i){grad.addColorStop((1/(len-1))*i,properties.colors[i]);}
for(var i=0;i<(properties.segments*2);++i){this.startAngle=this.rotatedAngle+(((360/(properties.segments*2))*i)/(180/Math.PI));this.endAngle=this.startAngle+(((360/(properties.segments*2)))/(180/Math.PI)),color=(i%2===0?grad:'rgba(0,0,0,0)');this.startAngle+=this.frame*properties.animationStep;this.endAngle+=this.frame*properties.animationStep;this.context.beginPath();this.context.fillStyle=color;this.context.moveTo(properties.centerx,properties.centery);this.context.arc(properties.centerx,properties.centery,properties.radius*(properties.animationStep===0?1:properties.radiusMultiplier),this.startAngle,this.endAngle,false);this.context.fill();}
if(properties.image){if(properties.image&&!this.imageCache[properties.image]){this.imageCache[properties.image]=new Image();this.imageCache[properties.image].src=properties.image;var obj=this;this.imageCache[properties.image].onload=function()
{obj.draw();};return;}
var frameMultiplier=Math.min(1,properties.frame);if(!this.imageCoordsCalculated){var imageX=properties.centerx,imageY=properties.centery,imageW=this.imageCache[properties.image].width*properties.imageScale,imageH=this.imageCache[properties.image].height*properties.imageScale;if(typeof properties.imageX==='number')imageX=properties.imageX;if(typeof properties.imageY==='number')imageY=properties.imageY;if(typeof properties.imageW==='number')imageW=properties.imageW;if(typeof properties.imageH==='number')imageH=properties.imageH;if(properties.imageHalign==='right'){imageX=imageX-imageW;}else if(properties.imageHalign==='left'){imageX=imageX;}else{imageX=imageX-(imageW/2);}
if(properties.imageValign==='bottom'){imageY=imageY-imageH;}else if(properties.imageValign==='top'){imageY=imageY;}else{imageY=imageY-(imageH/2);}
properties.imageX=imageX;properties.imageY=imageY;properties.imageW=imageW;properties.imageH=imageH;this.imageCoordsCalculated=true;}
if(properties.imageShadow){this.context.shadowOffsetX=properties.imageShadowOffsetx;this.context.shadowOffsetY=properties.imageShadowOffsety;this.context.shadowColor=properties.imageShadowColor;this.context.shadowBlur=properties.imageShadowBlur;}
this.context.drawImage(this.imageCache[properties.image],properties.imageX,properties.imageY,properties.imageW,properties.imageH);if(properties.imageShadow){this.context.shadowOffsetX=0;this.context.shadowOffsetY=0;this.context.shadowColor='rgba(0,0,0,0)';this.context.shadowBlur=0;}}
if(typeof properties.callback==='function'){var callbackReturn=properties.callback(this);}
this.frame=++this.frame;if(properties.radiusMultiplier<1){properties.radiusMultiplier+=properties.radiusIncrement;}
if(callbackReturn!==false&&properties.animationStep!==0){var obj=this;if(window.requestAnimationFrame&&this.isNull(properties.delay)){window.requestAnimationFrame(function()
{obj.draw();})}else{setTimeout(function()
{obj.draw();},properties.delay);}}
return this;}
this.isNull=function(arg)
{if(arg==null||typeof arg==='object'&&!arg){return true;}
return false;};for(var i in conf.options){if(typeof i==='string'){this.set(i,conf.options[i]);}}
return this;};