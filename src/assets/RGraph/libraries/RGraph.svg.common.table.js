
window.RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};window.RGraph.SVG=window.RGraph.SVG||{};window.RGraph.SVG.HTMLTable={};(function(win,doc,undefined)
{RGraph.SVG.HTMLTable.AJAX=function()
{var args=RGraph.SVG.HTMLTable.getArgs(arguments,'url,callback');if(win.XMLHttpRequest){var httpRequest=new XMLHttpRequest();}else if(win.ActiveXObject){var httpRequest=new ActiveXObject("Microsoft.XMLHTTP");}
httpRequest.onreadystatechange=function()
{if(this.readyState==4&&this.status==200){this.__user_callback__=callback;this.__user_callback__(this.responseText);}}
httpRequest.open('GET',args.url,true);httpRequest.send();};RGraph.SVG.HTMLTable.AJAX.getString=function()
{var args=RGraph.SVG.HTMLTable.getArgs(arguments,'url,callback');RGraph.SVG.HTMLTable.AJAX(args.url,function()
{var str=String(this.responseText);args.callback(str);});};RGraph.HTMLTable=RGraph.SVG.HTMLTable=function()
{this.fetch=function()
{this.parseTable();this.callback(this);};this.parseTable=function()
{if(this.id.substr(0,7)==='string:'){this.id=this.id.substr(7);var template=doc.createElement('template');html=this.id.trim();template.innerHTML=html;var table=template.content.firstChild;}else{var table=doc.getElementById(this.id.replace(/^#/,''));}
var rows=table.getElementsByTagName('tr');for(var i=0;i<rows.length;++i){var row=rows[i].getElementsByTagName('td');if(!row.length){var row=rows[i].getElementsByTagName('th');}
this.data[i]=[];for(var j=0;j<row.length;++j){var cell=row[j];var data=cell.innerHTML;if(data.match(/^[ 0-9]+$/)){data=parseInt(data.trim());}else if(data.match(/^[ 0-9.]+$/)){data=parseFloat(data.trim());}
this.data[i][j]=data;this.numrows=this.data.length;this.numcols=this.data[0].length;}}};this.row=this.getRow=function(index)
{var row=[],start=parseInt(arguments[1])||0,length=arguments[2];if(typeof index==='string'){for(var i=0;i<this.data.length;++i){if(this.data[i][0].trim()===index.trim()){var found=true;index=i;break;}}
if(!found){return null;}}
if(start<0){row=this.data[index].slice(this.data[index].length-Math.abs(start));}else{row=this.data[index].slice(start);}
if(typeof length==='number'&&length===0){row=[];}else{if(typeof length==='number'&&length>0){row=row.slice(0,length)}else if(typeof length==='number'&&length<0){for(var i=0;i<Math.abs(length);++i){row.pop();}}}
return row;};this.col=this.column=this.getColumn=this.getCol=function(index)
{var col=[],start=arguments[1]||0,length=arguments[2];if(typeof index==='string'){for(var i=0;i<this.data.length;++i){if(this.data[0][i].trim()===index.trim()){var found=true;index=i;break;}}
if(!found){return null;}}
if(start>=0){for(var i=start;i<this.data.length;i+=1){if(this.data[i]){col.push(this.data[i][index]);}else{col.push(null);}}}else{for(var i=(this.data.length-Math.abs(start));i<this.data.length;i+=1){if(this.data[i]){col.push(this.data[i][index]);}else{col.push(null);}}}
if(typeof length==='number'&&length===0){col=[];}else{if(typeof length==='number'&&length>0){col=col.slice(0,length)}else if(typeof length==='number'&&length<0){for(var i=0;i<Math.abs(length);++i){col.pop();}}}
return col;};var args=RGraph.SVG.HTMLTable.getArgs(arguments,'id,callback');this.id=args.id.replace(/^#/,'');this.callback=args.callback;this.data=[];this.fetch();};RGraph.SVG.HTMLTable.getArgs=function(args,names)
{var ret={};var count=0;names=names.trim().split(/ *, */);if(args&&args[0]&&args.length===1&&typeof args[0][names[0]]!=='undefined'){for(var i=0;i<names.length;++i){if(typeof args[0][names[i]]==='undefined'){args[0][names[i]]=null;}}
return args[0];}else{for(var i in names){ret[names[i]]=typeof args[count]==='undefined'?null:args[count];count+=1;}}
return ret;};})(window,document);