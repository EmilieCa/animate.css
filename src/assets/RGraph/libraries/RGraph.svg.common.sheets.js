
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};(function(win,doc,undefined)
{RGraph.Sheets=function()
{var args=RGraph.Sheets.getArgs(arguments,'oauth,key,worksheet,callback');if(arguments.length===1){}else if(arguments.length===3){args.oauth=args.oauth;args.key=args.key;args.callback=args.worksheet;args.worksheet='Sheet1';}else if(arguments.length===4){args.worksheet=args.worksheet;}
var worksheet=args.worksheet,callback=args.callback,letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ',key=args.key,oauth=args.oauth;var url=('https://sheets.googleapis.com/v4/spreadsheets/[KEY]/values/[WORKSHEET]?alt=json&key=[OAUTH_KEY]').replace(/\[KEY\]/,args.key).replace(/\[WORKSHEET\]/,encodeURIComponent(args.worksheet)).replace(/\[OAUTH_KEY\]/,args.oauth)
this.load=function(url,userCallback)
{var obj=this;RGraph.Sheets.AJAX.getJSON(url,function(json)
{var grid=json.values;var rows=grid.length;var cells=0;for(var i=0;i<grid.length;++i){cells=Math.max(cells,grid[i].length);}
for(var i=0;i<grid.length;++i){for(var j=grid[i].length;j<cells;++j){grid[i][j]='';}}
for(var i=0;i<grid.length;++i){for(var j=0;j<cells;++j){if(grid[i][j].match(/^[0-9]+$/)){grid[i][j]=parseInt(grid[i][j]);}else if(grid[i][j].match(/^[0-9.]+$/)){grid[i][j]=parseFloat(grid[i][j]);}}}
obj.data=grid;userCallback(obj);});};this.row=function(index,start)
{var opt={},row;if(!this.data[index-1]){return[];}
start=start||1;if(arguments&&typeof arguments[2]==='object'&&typeof arguments[2].trim==='boolean'){opt.trim=arguments[2].trim;}else{opt.trim=true;}
row=this.data[index-1].slice(start-1);if(opt.trim){row=RGraph.Sheets.arrayRTrim(row);}
return row;};this.col=function(index,start)
{var opt={},col=[];start=start||1;if(arguments&&typeof arguments[2]==='object'&&typeof arguments[2].trim==='boolean'){opt.trim=arguments[2].trim;}else{opt.trim=true;}
for(var i=0;i<this.data.length;++i){col.push(this.data[i][index-1]);}
if(opt.trim){col=RGraph.Sheets.arrayRTrim(col);}
col=col.slice(start-1);return col;};this.getIndexOfLetters=function(l)
{var parts=l.split('');if(parts.length===1){return letters.indexOf(l)+1;}else if(parts.length===2){var idx=((letters.indexOf(parts[0])+1)*26)+(letters.indexOf(parts[1])+1);return idx;}};this.get=function(str)
{str=str.toUpperCase();if(str.match(/^\s*([a-z]+)\s*$/i)){str=RegExp.$1;if(str.length===1){var index=letters.indexOf(str)+1;return this.col(index,1,arguments[1]);}else if(str.length===2){var index=((letters.indexOf(str[0])+1)*26)+letters.indexOf(str[1])+1;return this.col(index,1,arguments[1]);}}
if(str.match(/^\s*[0-9]+\s*$/i)){return this.row(str,null,arguments[1]);}
if(str.match(/^\s*([a-z]{1,2})([0-9]+)\s*$/i)){var letter=RegExp.$1,number=RegExp.$2,col=this.get(letter,{trim:false});return col[number-1];}
if(str.match(/^\s*([a-z]{1,2})([0-9]+)\s*:\s*([a-z]{1,2})([0-9]+)\s*$/i)){var letter1=RegExp.$1,letter2=RegExp.$3,number1=parseInt(RegExp.$2),number2=parseInt(RegExp.$4)
if(letter1===letter2){var cells=[],index=this.getIndexOfLetters(letter1),col=this.col(index,null,{trim:false});for(var i=(number1-1);i<=(number2-1);++i){cells.push(col[i]);}}else if(number1===number2){var cells=[],row=this.row(number1,null,{trim:false}),index1=this.getIndexOfLetters(letter1),index2=this.getIndexOfLetters(letter2)
for(var i=(index1-1);i<=(index2-1);++i){cells.push(row[i]);}}else if(letter1!==letter2&&number1!==number2){var cells=[],index1=this.getIndexOfLetters(letter1),index2=this.getIndexOfLetters(letter2),row=[];for(var i=number1;i<=number2;++i){row=this.row(i).slice(index1-1,index2);cells.push(row);}}
if(arguments[1]&&arguments[1].trim===false){}else{cells=RGraph.Sheets.arrayRTrim(cells);}
return cells;}};this.load(url,args.callback);};RGraph.Sheets.arrayRTrim=function(arr)
{var out=[],content=false;for(var i=(arr.length-1);i>=0;i--){if(arr[i]||content){out.push(arr[i]);content=true;}}
arr=out.reverse();return out;};RGraph.Sheets.getArgs=function(args,names)
{var ret={};var count=0;names=names.trim().split(/ *, */);if(args&&args[0]&&args.length===1&&typeof args[0][names[0]]!=='undefined'){for(var i=0;i<names.length;++i){if(typeof args[0][names[i]]==='undefined'){args[0][names[i]]=null;}}
return args[0];}else{for(var i in names){ret[names[i]]=typeof args[count]==='undefined'?null:args[count];count+=1;}}
return ret;};RGraph.Sheets.AJAX=function()
{var args=RGraph.Sheets.getArgs(arguments,'url,callback');if(window.XMLHttpRequest){var httpRequest=new XMLHttpRequest();}else if(window.ActiveXObject){var httpRequest=new ActiveXObject("Microsoft.XMLHTTP");}
httpRequest.onreadystatechange=function()
{if(this.readyState==4&&this.status==200){this.__user_callback__=args.callback;this.__user_callback__(this.responseText);}}
httpRequest.open('GET',args.url,true);if(httpRequest&&httpRequest.setRequestHeader){httpRequest.setRequestHeader('Cache-Control','no-cache');}
httpRequest.send();};RGraph.Sheets.AJAX.getJSON=function()
{var args=RGraph.Sheets.getArgs(arguments,'url,callback');RGraph.Sheets.AJAX(args.url,function()
{var json=eval('('+this.responseText+')');args.callback(json);});};})(window,document);