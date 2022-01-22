(function (factory) {
	typeof define === 'function' && define.amd ? define('rGraphSvgCommonCore', factory) :
	factory();
}((function () { 'use strict';

	RGraph = window.RGraph || {
	  isrgraph: true,
	  isRGraph: true,
	  rgraph: true
	};
	RGraph.SVG = RGraph.SVG || {};
	RGraph.SVG.FX = RGraph.SVG.FX || {};

	(function (win, doc, undefined$1) {
	  RGraph.SVG.REG = {
	    store: []
	  };
	  RGraph.SVG.OR = {
	    objects: []
	  };
	  RGraph.SVG.TRIG = {};
	  RGraph.SVG.TRIG.HALFPI = Math.PI * .4999;
	  RGraph.SVG.TRIG.PI = RGraph.SVG.TRIG.HALFPI * 2;
	  RGraph.SVG.TRIG.TWOPI = RGraph.SVG.TRIG.PI * 2;
	  RGraph.SVG.events = [];
	  RGraph.SVG.GLOBALS = {};
	  RGraph.SVG.ISFF = navigator.userAgent.indexOf('Firefox') != -1;
	  RGraph.SVG.ISOPERA = navigator.userAgent.indexOf('Opera') != -1;
	  RGraph.SVG.ISCHROME = navigator.userAgent.indexOf('Chrome') != -1;
	  RGraph.SVG.ISSAFARI = navigator.userAgent.indexOf('Safari') != -1 && !RGraph.SVG.ISCHROME;
	  RGraph.SVG.ISWEBKIT = navigator.userAgent.indexOf('WebKit') != -1;
	  RGraph.SVG.ISIE = navigator.userAgent.indexOf('Trident') > 0 || navigator.userAgent.indexOf('MSIE') > 0;
	  RGraph.SVG.ISIE9 = navigator.userAgent.indexOf('MSIE 9') > 0;
	  RGraph.SVG.ISIE10 = navigator.userAgent.indexOf('MSIE 10') > 0;
	  RGraph.SVG.ISIE11UP = navigator.userAgent.indexOf('MSIE') == -1 && navigator.userAgent.indexOf('Trident') > 0;
	  RGraph.SVG.ISIE10UP = RGraph.SVG.ISIE10 || RGraph.SVG.ISIE11UP;
	  RGraph.SVG.ISIE9UP = RGraph.SVG.ISIE9 || RGraph.SVG.ISIE10UP;
	  RGraph.SVG.MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	  RGraph.SVG.MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	  RGraph.SVG.DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	  RGraph.SVG.DAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	  RGraph.SVG.createSVG = function (opt) {
	    var container = opt.container,
	        obj = opt.object;

	    if (container.__svg__) {
	      return container.__svg__;
	    }

	    var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
	    svg.setAttribute('style', 'top: 0; left: 0; position: absolute');
	    svg.setAttribute('width', container.offsetWidth);
	    svg.setAttribute('height', container.offsetHeight);
	    svg.setAttribute('version', '1.1');
	    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", 'xmlns', 'http://www.w3.org/2000/svg');
	    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	    svg.__object__ = obj;
	    svg.__container__ = container;
	    container.appendChild(svg);
	    container.__svg__ = svg;
	    container.__object__ = obj;
	    var style = getComputedStyle(container);

	    if (style.position !== 'absolute' && style.position !== 'fixed' && style.position !== 'sticky') {
	      container.style.position = 'relative';
	    }

	    var numLayers = 10;

	    for (var i = 1; i <= numLayers; ++i) {
	      var group = RGraph.SVG.create({
	        svg: svg,
	        type: 'g',
	        attr: {
	          className: 'background' + i
	        }
	      });
	      obj.layers['background' + i] = group;
	      svg['background' + i] = group;
	    }

	    var group = RGraph.SVG.create({
	      svg: svg,
	      type: 'g',
	      attr: {
	        className: 'all-elements'
	      }
	    });
	    container.__svg__.all = group;
	    return svg;
	  };

	  RGraph.SVG.createDefs = function (obj) {
	    if (!obj.svg.defs) {
	      var defs = RGraph.SVG.create({
	        svg: obj.svg,
	        type: 'defs'
	      });
	      obj.svg.defs = defs;
	    }

	    return defs;
	  };

	  RGraph.SVG.create = function (opt) {
	    var ns = "http://www.w3.org/2000/svg",
	        tag = doc.createElementNS(ns, opt.type);

	    for (var o in opt.attr) {
	      if (typeof o === 'string') {
	        var name = o;

	        if (o === 'className') {
	          name = 'class';
	        }

	        if ((opt.type === 'a' || opt.type === 'image') && o === 'xlink:href') {
	          tag.setAttributeNS('http://www.w3.org/1999/xlink', o, String(opt.attr[o]));
	        } else {
	          if (RGraph.SVG.isNull(opt.attr[o])) {
	            opt.attr[o] = '';
	          }

	          tag.setAttribute(name, String(opt.attr[o]));
	        }
	      }
	    }

	    for (var o in opt.style) {
	      if (typeof o === 'string') {
	        tag.style[o] = String(opt.style[o]);
	      }
	    }

	    if (opt.parent) {
	      opt.parent.appendChild(tag);
	    } else {
	      opt.svg.appendChild(tag);
	    }

	    return tag;
	  };

	  RGraph.SVG.getMouseXY = function (e) {
	    if (!e.target) {
	      return;
	    }

	    var el = e.target,
	        x,
	        y;
	    x = e.offsetX;
	    y = e.offsetY;
	    x -= 2 * (parseInt(document.body.style.borderLeftWidth) || 0);
	    y -= 2 * (parseInt(document.body.style.borderTopWidth) || 0);
	    return [x, y];
	  };

	  RGraph.SVG.drawXAxis = function (obj) {
	    var properties = obj.properties;

	    if (properties.xaxis) {
	      var y = obj.type === 'hbar' ? obj.height - properties.marginBottom : obj.getYCoord(obj.scale.min < 0 && obj.scale.max < 0 ? obj.scale.max : obj.scale.min > 0 && obj.scale.max > 0 ? obj.scale.min : 0);
	      var axis = RGraph.SVG.create({
	        svg: obj.svg,
	        parent: obj.svg.all,
	        type: 'path',
	        attr: {
	          d: 'M{1} {2} L{3} {4}'.format(properties.marginLeft, y, obj.width - properties.marginRight, y),
	          fill: properties.xaxisColor,
	          stroke: properties.xaxisColor,
	          'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
	          'shape-rendering': 'crispEdges',
	          'stroke-linecap': 'square'
	        }
	      });

	      if (obj.type === 'hbar') {
	        var width = obj.graphWidth / obj.data.length,
	            x = properties.marginLeft,
	            startY = obj.height - properties.marginBottom,
	            endY = obj.height - properties.marginBottom + properties.xaxisTickmarksLength;
	      } else {
	        var width = obj.graphWidth / obj.data.length,
	            x = properties.marginLeft,
	            startY = obj.getYCoord(0) - (properties.yaxisScaleMin < 0 ? properties.xaxisTickmarksLength : 0),
	            endY = obj.getYCoord(0) + properties.xaxisTickmarksLength;

	        if (obj.scale.min < 0 && obj.scale.max <= 0) {
	          startY = properties.marginTop;
	          endY = properties.marginTop - properties.xaxisTickmarksLength;
	        }

	        if (obj.scale.min > 0 && obj.scale.max > 0) {
	          startY = obj.getYCoord(obj.scale.min);
	          endY = obj.getYCoord(obj.scale.min) + properties.xaxisTickmarksLength;
	        }

	        if (obj.mirrorScale) {
	          startY = obj.height / 2 - properties.xaxisTickmarksLength;
	          endY = obj.height / 2 + properties.xaxisTickmarksLength;
	        }
	      }

	      if (properties.xaxisTickmarks) {
	        if (properties.xaxisScale) {
	          var zeroXCoord = obj.getXCoord(0);
	          var xmincoord = obj.getXCoord(obj.min);

	          for (var i = 0; i < (typeof properties.xaxisLabelsPositionEdgeTickmarksCount === 'number' ? properties.xaxisLabelsPositionEdgeTickmarksCount : obj.scale.numlabels + (properties.yaxis && properties.xaxisScaleMin === 0 ? 0 : 1)); ++i) {
	            if (obj.type === 'hbar') {
	              var dataPoints = obj.data.length;
	            }

	            x = properties.marginLeft + (i + (properties.yaxis && properties.xaxisScaleMin === 0 && properties.yaxisPosition === 'left' ? 1 : 0)) * (obj.graphWidth / obj.scale.numlabels);

	            if (typeof properties.xaxisLabelsPositionEdgeTickmarksCount === 'number') {
	              dataPoints = properties.xaxisLabelsPositionEdgeTickmarksCount;
	              var gap = obj.graphWidth / properties.xaxisLabelsPositionEdgeTickmarksCount;
	              x = gap * i + properties.marginLeft + gap;

	              if (properties.yaxisPosition === 'right') {
	                x -= gap;
	              }
	            }

	            if (properties.yaxis && x < zeroXCoord + 2 && x > zeroXCoord - 2) {
	              continue;
	            }

	            if (properties.yaxis && obj.min > 0 && obj.max > obj.min && i === 0) {
	              continue;
	            }

	            if (properties.yaxis && obj.max < 0 && obj.min < obj.max && i === 5) {
	              continue;
	            }

	            RGraph.SVG.create({
	              svg: obj.svg,
	              parent: obj.svg.all,
	              type: 'path',
	              attr: {
	                d: 'M{1} {2} L{3} {4}'.format(x, startY, x, endY),
	                stroke: properties.xaxisColor,
	                'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
	                'shape-rendering': "crispEdges"
	              }
	            });
	          }

	          if (properties.yaxisPosition === 'right' && properties.xaxisScaleMin < 0 && properties.xaxisScaleMax > 0) {
	            RGraph.SVG.create({
	              svg: obj.svg,
	              parent: obj.svg.all,
	              type: 'path',
	              attr: {
	                d: 'M{1} {2} L{3} {4}'.format(obj.width - properties.marginRight, startY, obj.width - properties.marginRight, endY),
	                stroke: properties.xaxisColor,
	                'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
	                'shape-rendering': "crispEdges"
	              }
	            });
	          }
	        } else {
	          if (properties.xaxisLabelsPosition === 'section') {
	            if (obj.type === 'bar' || obj.type === 'waterfall') {
	              var dataPoints = obj.data.length;
	            } else if (obj.type === 'line') {
	              var dataPoints = obj.data[0].length;
	            } else if (obj.type === 'scatter') {
	              var dataPoints = properties.xaxisLabels ? properties.xaxisLabels.length : 10;
	            }

	            if (typeof properties.xaxisLabelsPositionSectionTickmarksCount === 'number') {
	              dataPoints = properties.xaxisLabelsPositionSectionTickmarksCount;
	            }

	            for (var i = 0; i < dataPoints; ++i) {
	              if (properties.yaxisPosition === 'right') {
	                x = properties.marginLeft + (properties.marginInnerLeft || 0) + i * ((obj.graphWidth - (properties.marginInnerLeft || 0) - (properties.marginInnerRight || 0)) / dataPoints);
	              } else {
	                x = properties.marginLeft + (properties.marginInnerLeft || 0) + (i + 1) * ((obj.graphWidth - (properties.marginInnerLeft || 0) - (properties.marginInnerRight || 0)) / dataPoints);
	              }

	              RGraph.SVG.create({
	                svg: obj.svg,
	                parent: obj.svg.all,
	                type: 'path',
	                attr: {
	                  d: 'M{1} {2} L{3} {4}'.format(x + 0.001, startY, x, endY),
	                  stroke: properties.xaxisColor,
	                  'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
	                  'shape-rendering': "crispEdges"
	                }
	              });
	            }

	            if (properties.yaxisPosition === 'right' && !properties.yaxis) {
	              RGraph.SVG.create({
	                svg: obj.svg,
	                parent: obj.svg.all,
	                type: 'path',
	                attr: {
	                  d: 'M{1} {2} L{3} {4}'.format(obj.width - properties.marginRight + 0.001, startY, obj.width - properties.marginRight + 0.001, endY),
	                  stroke: properties.xaxisColor,
	                  'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
	                  'shape-rendering': "crispEdges"
	                }
	              });
	            }
	          } else if (properties.xaxisLabelsPosition === 'edge') {
	            if (typeof properties.xaxisLabelsPositionEdgeTickmarksCount === 'number') {
	              var len = properties.xaxisLabelsPositionEdgeTickmarksCount;
	            } else {
	              var len = obj.data && obj.data[0] && obj.data[0].length ? obj.data[0].length : 0;
	            }

	            for (var i = 0; i < len; ++i) {
	              var gap = obj.graphWidth / (len - 1);

	              if (properties.yaxisPosition === 'right') {
	                x = properties.marginLeft + i * gap;

	                if (properties.yaxis && x > obj.width - properties.marginRight - 3 && x < obj.width - properties.marginRight + 3) {
	                  continue;
	                }
	              } else {
	                x = properties.marginLeft + (i + 1) * gap;
	              }

	              if ((!properties.yaxisPosition || properties.yaxisPosition === 'left') && x > obj.width - properties.marginRight) {
	                continue;
	              }

	              RGraph.SVG.create({
	                svg: obj.svg,
	                parent: obj.svg.all,
	                type: 'path',
	                attr: {
	                  d: 'M{1} {2} L{3} {4}'.format(x + 0.001, startY, x, endY),
	                  stroke: properties.xaxisColor,
	                  'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
	                  'shape-rendering': "crispEdges"
	                }
	              });
	            }
	          }
	        }

	        if (properties.yaxis === false || (properties.marginInnerLeft || 0) > 0) {
	          RGraph.SVG.create({
	            svg: obj.svg,
	            parent: obj.svg.all,
	            type: 'path',
	            attr: {
	              d: 'M{1} {2} L{3} {4}'.format(properties.marginLeft + (properties.marginInnerLeft || 0) + 0.001, startY, properties.marginLeft + (properties.marginInnerLeft || 0), endY),
	              stroke: obj.properties.xaxisColor,
	              'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
	              'shape-rendering': "crispEdges",
	              parent: obj.svg.all
	            }
	          });
	        }
	      }
	    }

	    var textConf = RGraph.SVG.getTextConf({
	      object: obj,
	      prefix: 'xaxisLabels'
	    });

	    if (properties.xaxisScale) {
	      if (obj.type === 'scatter') {
	        obj.xscale = RGraph.SVG.getScale({
	          object: obj,
	          numlabels: properties.xaxisLabelsCount,
	          unitsPre: properties.xaxisScaleUnitsPre,
	          unitsPost: properties.xaxisScaleUnitsPost,
	          max: properties.xaxisScaleMax,
	          min: properties.xaxisScaleMin,
	          point: properties.xaxisScalePoint,
	          round: properties.xaxisScaleRound,
	          thousand: properties.xaxisScaleThousand,
	          decimals: properties.xaxisScaleDecimals,
	          strict: typeof properties.xaxisScaleMax === 'number',
	          formatter: properties.xaxisScaleFormatter
	        });
	        var segment = obj.graphWidth / properties.xaxisLabelsCount;

	        for (var i = 0; i < obj.xscale.labels.length; ++i) {
	          var x = properties.marginLeft + segment * i + segment + properties.xaxisLabelsOffsetx;
	          var y = obj.height - properties.marginBottom + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
	          RGraph.SVG.text({
	            object: obj,
	            parent: obj.svg.all,
	            tag: 'labels.xaxis',
	            text: obj.xscale.labels[i],
	            x: x,
	            y: y,
	            halign: 'center',
	            valign: 'top',
	            font: textConf.font,
	            size: textConf.size,
	            bold: textConf.bold,
	            italic: textConf.italic,
	            color: textConf.color
	          });
	        }

	        if (properties.xaxisLabelsCount > 0) {
	          var y = obj.height - properties.marginBottom + properties.xaxisLabelsOffsety + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10),
	              str = RGraph.SVG.numberFormat({
	            object: obj,
	            num: properties.xaxisScaleMin.toFixed(properties.xaxisScaleDecimals),
	            prepend: properties.xaxisScaleUnitsPre,
	            append: properties.xaxisScaleUnitsPost,
	            point: properties.xaxisScalePoint,
	            thousand: properties.xaxisScaleThousand,
	            formatter: properties.xaxisScaleFormatter
	          });
	          var text = RGraph.SVG.text({
	            object: obj,
	            parent: obj.svg.all,
	            tag: 'labels.xaxis',
	            text: typeof properties.xaxisScaleFormatter === 'function' ? properties.xaxisScaleFormatter(this, properties.xaxisScaleMin) : str,
	            x: properties.marginLeft + properties.xaxisLabelsOffsetx,
	            y: y,
	            halign: 'center',
	            valign: 'top',
	            font: textConf.font,
	            size: textConf.size,
	            bold: textConf.bold,
	            italic: textConf.italic,
	            color: textConf.color
	          });
	        }
	      } else {
	        var segment = obj.graphWidth / properties.xaxisLabelsCount,
	            scale = obj.scale;

	        for (var i = 0; i < scale.labels.length; ++i) {
	          var x = properties.marginLeft + segment * i + segment + properties.xaxisLabelsOffsetx;
	          var y = obj.height - properties.marginBottom + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;

	          if ((obj.type === 'hbar' || obj.type === 'scatter' && properties.xaxis) && properties.yaxisPosition === 'right') {
	            x = obj.width - properties.marginRight - segment * i - segment + properties.xaxisLabelsOffsetx;
	          }

	          RGraph.SVG.text({
	            object: obj,
	            parent: obj.svg.all,
	            text: obj.scale.labels[i],
	            x: x,
	            y: y,
	            halign: 'center',
	            valign: 'top',
	            tag: 'labels.xaxis',
	            font: textConf.font,
	            size: textConf.size,
	            bold: textConf.bold,
	            italic: textConf.italic,
	            color: textConf.color
	          });
	        }

	        if (properties.xaxisLabelsCount > 0) {
	          var y = obj.height - properties.marginBottom + properties.xaxisLabelsOffsety + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10),
	              str = RGraph.SVG.numberFormat({
	            object: obj,
	            num: properties.xaxisScaleMin.toFixed(properties.xaxisScaleDecimals),
	            prepend: properties.xaxisScaleUnitsPre,
	            append: properties.xaxisScaleUnitsPost,
	            point: properties.xaxisScalePoint,
	            thousand: properties.xaxisScaleThousand,
	            formatter: properties.xaxisScaleFormatter
	          });
	          var text = RGraph.SVG.text({
	            object: obj,
	            parent: obj.svg.all,
	            tag: 'labels.xaxis',
	            text: typeof properties.xaxisScaleFormatter === 'function' ? properties.xaxisScaleFormatter(this, properties.xaxisScaleMin) : str,
	            x: properties.yaxisPosition === 'right' ? obj.width - properties.marginRight + properties.xaxisLabelsOffsetx : properties.marginLeft + properties.xaxisLabelsOffsetx,
	            y: y,
	            halign: 'center',
	            valign: 'top',
	            font: textConf.font,
	            size: textConf.size,
	            bold: textConf.bold,
	            italic: textConf.talic,
	            color: textConf.color
	          });
	        }
	      }
	    } else {
	      if (typeof properties.xaxisLabels === 'object' && !RGraph.SVG.isNull(properties.xaxisLabels)) {
	        var angle = properties.xaxisLabelsAngle;

	        if (properties.xaxisLabelsPosition === 'section') {
	          var segment = (obj.width - properties.marginLeft - properties.marginRight - (properties.marginInnerLeft || 0) - (properties.marginInnerRight || 0)) / properties.xaxisLabels.length;

	          for (var i = 0; i < properties.xaxisLabels.length; ++i) {
	            var x = properties.marginLeft + (properties.marginInnerLeft || 0) + segment / 2 + i * segment;

	            if (obj.scale.max <= 0 && obj.scale.min < obj.scale.max) {
	              var y = properties.marginTop - (RGraph.SVG.ISFF ? 5 : 10) - (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
	              var valign = 'bottom';
	            } else {
	              var y = obj.height - properties.marginBottom + (RGraph.SVG.ISFF ? 5 : 10) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
	              var valign = 'top';
	            }

	            RGraph.SVG.text({
	              object: obj,
	              parent: obj.svg.all,
	              tag: 'labels.xaxis',
	              text: properties.xaxisLabels[i],
	              x: x + properties.xaxisLabelsOffsetx,
	              y: y,
	              valign: typeof angle === 'number' && angle ? 'center' : valign,
	              halign: typeof angle === 'number' && angle ? 'right' : 'center',
	              angle: angle,
	              size: textConf.size,
	              italic: textConf.italic,
	              font: textConf.font,
	              bold: textConf.bold,
	              color: textConf.color
	            });
	          }
	        } else if (properties.xaxisLabelsPosition === 'edge') {
	          if (obj.type === 'line') {
	            var hmargin = properties.marginInner;
	          } else {
	            var hmargin = 0;
	          }

	          var segment = (obj.graphWidth - hmargin - hmargin) / (properties.xaxisLabels.length - 1);

	          for (var i = 0; i < properties.xaxisLabels.length; ++i) {
	            var x = properties.marginLeft + i * segment + hmargin;

	            if (obj.scale.max <= 0 && obj.scale.min < 0) {
	              valign = 'bottom';
	              y = properties.marginTop - (RGraph.SVG.ISFF ? 5 : 10) - (properties.xaxisTickmarksLength - 5) - (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
	            } else {
	              valign = 'top';
	              y = obj.height - properties.marginBottom + (RGraph.SVG.ISFF ? 5 : 10) + (properties.xaxisTickmarksLength - 5) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
	            }

	            RGraph.SVG.text({
	              object: obj,
	              parent: obj.svg.all,
	              tag: 'labels.xaxis',
	              text: properties.xaxisLabels[i],
	              x: x + properties.xaxisLabelsOffsetx,
	              y: y,
	              valign: typeof angle === 'number' && angle ? 'center' : valign,
	              halign: typeof angle === 'number' && angle ? 'right' : 'center',
	              angle: angle,
	              size: textConf.size,
	              italic: textConf.italic,
	              font: textConf.font,
	              bold: textConf.bold,
	              color: textConf.color
	            });
	          }
	        }
	      }
	    }

	    var labelsY = y + properties.xaxisLabelsOffsety;

	    if (properties.xaxisTitle) {
	      var textConf_labels = RGraph.SVG.getTextConf({
	        object: obj,
	        prefix: obj.type === 'hbar' ? 'yaxisLabels' : 'xaxisLabels'
	      });
	      var x = properties.marginLeft + (obj.width - properties.marginLeft - properties.marginRight) / 2 + (properties.xaxisTitleOffsetx || 0);
	      var y = labelsY + textConf_labels.size * 1.5;
	      var textConf = RGraph.SVG.getTextConf({
	        object: obj,
	        prefix: 'xaxisTitle'
	      });
	      if (typeof properties.xaxisTitleX === 'number') x = properties.xaxisTitleX;
	      if (typeof properties.xaxisTitleY === 'number') y = properties.xaxisTitleY;
	      RGraph.SVG.text({
	        object: obj,
	        parent: obj.svg.all,
	        tag: 'xaxisTitle',
	        text: String(properties.xaxisTitle),
	        x: x + (properties.xaxisTitleOffsetx || 0),
	        y: y + (properties.xaxisTitleOffsety || 0),
	        valign: typeof properties.xaxisTitleValign === 'string' ? properties.xaxisTitleValign : 'top',
	        halign: typeof properties.xaxisTitleHalign === 'string' ? properties.xaxisTitleHalign : 'center',
	        size: textConf.size,
	        italic: textConf.italic,
	        font: textConf.font,
	        bold: textConf.bold,
	        color: textConf.color
	      });
	    }
	  };

	  RGraph.SVG.drawYAxis = function (obj) {
	    var properties = obj.properties;

	    if (properties.yaxis) {
	      if (obj.type === 'hbar') {
	        var x = obj.getXCoord(properties.xaxisScaleMin > 0 ? properties.xaxisScaleMin : 0);

	        if (properties.xaxisScaleMin < 0 && properties.xaxisScaleMax <= 0) {
	          x = obj.getXCoord(properties.xaxisScaleMax);
	        }
	      } else {
	        if (properties.yaxisPosition === 'right') {
	          var x = obj.width - properties.marginRight;
	        } else {
	          var x = properties.marginLeft;
	        }
	      }

	      var axis = RGraph.SVG.create({
	        svg: obj.svg,
	        parent: obj.svg.all,
	        type: 'path',
	        attr: {
	          d: 'M{1} {2} L{3} {4}'.format(x, properties.marginTop, x, obj.height - properties.marginBottom),
	          stroke: properties.yaxisColor,
	          fill: properties.yaxisColor,
	          'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
	          'shape-rendering': "crispEdges",
	          'stroke-linecap': 'square'
	        }
	      });

	      if (obj.type === 'hbar') {
	        var height = (obj.graphHeight - properties.marginInnerTop - properties.marginInnerBottom) / (properties.yaxisLabels.length || properties.yaxisTickmarksCount),
	            y = properties.marginTop + properties.marginInnerTop,
	            len = properties.yaxisLabels.length,
	            startX = obj.getXCoord(0) + (properties.xaxisScaleMin < 0 ? properties.yaxisTickmarksLength : 0),
	            endX = obj.getXCoord(0) - properties.yaxisTickmarksLength;

	        if (properties.yaxisPosition == 'right') {
	          startX = obj.getXCoord(0) + (properties.xaxisScaleMax > 0 && properties.xaxisScaleMin < 0 ? -3 : 0);
	          endX = obj.getXCoord(0) + properties.yaxisTickmarksLength;
	        }

	        if (properties.xaxisScaleMin < 0 && properties.xaxisScaleMax <= 0) {
	          startX = obj.getXCoord(properties.xaxisScaleMax);
	          endX = obj.getXCoord(properties.xaxisScaleMax) + 5;
	        }

	        if (properties.xaxisScaleMin > 0 && properties.xaxisScaleMax > properties.xaxisScaleMin && properties.yaxisPosition === 'left') {
	          startX = obj.getXCoord(properties.xaxisScaleMin);
	          endX = obj.getXCoord(properties.xaxisScaleMin) - 3;
	        }

	        if (typeof properties.yaxisLabelsPositionSectionTickmarksCount === 'number') {
	          len = properties.yaxisLabelsPositionSectionTickmarksCount;
	          height = (obj.graphHeight - properties.marginInnerTop - properties.marginInnerBottom) / len;
	        }

	        if (properties.yaxisTickmarks) {
	          for (var i = 0; i < (len || properties.yaxisTickmarksCount); ++i) {
	            var tick = RGraph.SVG.create({
	              svg: obj.svg,
	              parent: obj.svg.all,
	              type: 'path',
	              attr: {
	                d: 'M{1} {2} L{3} {4}'.format(startX, y, endX, y + 0.001),
	                stroke: properties.yaxisColor,
	                'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
	                'shape-rendering': "crispEdges"
	              }
	            });
	            y += height;
	          }

	          if (properties.xaxis === false) {
	            if (obj.type === 'hbar' && properties.xaxisScaleMin <= 0 && properties.xaxisScaleMax < 0) {
	              var startX = obj.getXCoord(properties.xaxisScaleMax);
	              var endX = obj.getXCoord(properties.xaxisScaleMax) + properties.yaxisTickmarksLength;
	            } else {
	              var startX = obj.getXCoord(0) - properties.yaxisTickmarksLength;
	              var endX = obj.getXCoord(0) + (properties.xaxisScaleMin < 0 ? properties.yaxisTickmarksLength : 0);

	              if (properties.yaxisPosition === 'right') {
	                var startX = obj.getXCoord(0) - (obj.scale.min === 0 && !obj.mirrorScale ? 0 : properties.yaxisTickmarksLength);
	                var endX = obj.getXCoord(0) + properties.yaxisTickmarksLength;
	              }
	            }

	            var axis = RGraph.SVG.create({
	              svg: obj.svg,
	              parent: obj.svg.all,
	              type: 'path',
	              attr: {
	                d: 'M{1} {2} L{3} {4}'.format(startX, Math.round(obj.height - properties.marginBottom - parseFloat(properties.marginInnerBottom)), endX, Math.round(obj.height - properties.marginBottom - parseFloat(properties.marginInnerBottom))),
	                stroke: obj.properties.yaxisColor,
	                'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
	                'shape-rendering': "crispEdges"
	              }
	            });
	          }
	        }
	      } else {
	        var height = obj.graphHeight / properties.yaxisLabelsCount,
	            y = properties.marginTop,
	            len = properties.yaxisLabelsCount,
	            startX = properties.marginLeft,
	            endX = properties.marginLeft - properties.yaxisTickmarksLength;

	        if (properties.yaxisPosition === 'right') {
	          startX = obj.width - properties.marginRight;
	          endX = startX + properties.yaxisTickmarksLength;
	        }

	        if (typeof properties.yaxisLabelsPositionEdgeTickmarksCount === 'number') {
	          len = properties.yaxisLabelsPositionEdgeTickmarksCount;
	          height = obj.graphHeight / len;
	        }

	        if (properties.yaxisTickmarks) {
	          for (var i = 0; i < len; ++i) {
	            if (!(obj.max <= 0 && obj.min < obj.max && y === obj.properties.marginTop) && !(obj.min < 0 && obj.max > 0 && y <= obj.getYCoord(0) + 1 && y >= obj.getYCoord(0) - 1)) {
	              var axis = RGraph.SVG.create({
	                svg: obj.svg,
	                parent: obj.svg.all,
	                type: 'path',
	                attr: {
	                  d: 'M{1} {2} L{3} {4}'.format(startX, y, endX, y),
	                  stroke: properties.yaxisColor,
	                  'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
	                  'shape-rendering': "crispEdges"
	                }
	              });
	            }

	            y += height;
	          }

	          if ((properties.yaxisScaleMin !== 0 || properties.xaxis === false || obj.mirrorScale) && !(obj.scale.min > 0 && obj.scale.max > 0)) {
	            if (properties.yaxisPosition === 'right') {
	              startX = obj.width - properties.marginRight;
	              endX = startX + properties.yaxisTickmarksLength;
	            }

	            var axis = RGraph.SVG.create({
	              svg: obj.svg,
	              parent: obj.svg.all,
	              type: 'path',
	              attr: {
	                d: 'M{1} {2} L{3} {4}'.format(startX, obj.height - properties.marginBottom, endX, obj.height - properties.marginBottom),
	                stroke: properties.yaxisColor,
	                'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
	                'shape-rendering': "crispEdges"
	              }
	            });
	          }
	        }
	      }
	    }

	    var textConf = RGraph.SVG.getTextConf({
	      object: obj,
	      prefix: 'yaxisLabels'
	    });

	    if (properties.yaxisScale) {
	      var segment = (obj.height - properties.marginTop - properties.marginBottom) / properties.yaxisLabelsCount;

	      for (var i = 0; i < obj.scale.labels.length; ++i) {
	        var y = obj.height - properties.marginBottom - segment * i - segment;
	        RGraph.SVG.text({
	          object: obj,
	          parent: obj.svg.all,
	          tag: 'labels.yaxis',
	          text: obj.scale.labels[i],
	          x: properties.yaxisPosition === 'right' ? obj.width - properties.marginRight + 7 + (properties.yaxis ? properties.yaxisTickmarksLength - 3 : 0) + properties.yaxisLabelsOffsetx : properties.marginLeft - 7 - (properties.yaxis ? properties.yaxisTickmarksLength - 3 : 0) + properties.yaxisLabelsOffsetx,
	          y: y + properties.yaxisLabelsOffsety,
	          halign: properties.yaxisLabelsHalign || (properties.yaxisPosition === 'right' ? 'left' : 'right'),
	          valign: properties.yaxisLabelsValign || 'center',
	          font: textConf.font,
	          size: textConf.size,
	          bold: textConf.bold,
	          italic: textConf.italic,
	          color: textConf.color
	        });
	      }

	      var y = obj.height - properties.marginBottom,
	          str = properties.yaxisScaleUnitsPre + obj.scale.min.toFixed(properties.yaxisScaleDecimals).replace(/\./, properties.yaxisScalePoint) + properties.yaxisScaleUnitsPost;
	      str = str.replace(properties.yaxisScaleUnitsPre + '-', '-' + properties.yaxisScaleUnitsPre);
	      var text = RGraph.SVG.text({
	        object: obj,
	        parent: obj.svg.all,
	        tag: 'labels.yaxis',
	        text: typeof properties.yaxisScaleFormatter === 'function' ? properties.yaxisScaleFormatter(this, properties.yaxisScaleMin) : str,
	        x: properties.yaxisPosition === 'right' ? obj.width - properties.marginRight + 7 + (properties.yaxis ? properties.yaxisTickmarksLength - 3 : 0) + properties.yaxisLabelsOffsetx : properties.marginLeft - 7 - (properties.yaxis ? properties.yaxisTickmarksLength - 3 : 0) + properties.yaxisLabelsOffsetx,
	        y: y + properties.yaxisLabelsOffsety,
	        halign: properties.yaxisPosition === 'right' ? 'left' : 'right',
	        valign: 'center',
	        font: textConf.font,
	        size: textConf.size,
	        bold: textConf.bold,
	        italic: textConf.italic,
	        color: textConf.color
	      });
	    } else if (properties.yaxisLabels && properties.yaxisLabels.length) {
	      for (var i = 0; i < properties.yaxisLabels.length; ++i) {
	        var segment = (obj.graphHeight - (properties.marginInnerTop || 0) - (properties.marginInnerBottom || 0)) / properties.yaxisLabels.length,
	            y = properties.marginTop + (properties.marginInnerTop || 0) + segment * i + segment / 2 + properties.yaxisLabelsOffsety,
	            x = properties.marginLeft - 7 - (properties.yaxisLinewidth || 1) + properties.yaxisLabelsOffsetx,
	            halign = 'right';

	        if (properties.yaxisPosition === 'right') {
	          halign = 'left';
	          x = obj.width - properties.marginRight + 7 + (properties.yaxisLinewidth || 1) + properties.yaxisLabelsOffsetx;
	        }

	        if (obj.type === 'hbar' && (obj.scale.min < obj.scale.max && obj.scale.max <= 0 || properties.yaxisPosition === 'right')) {
	          halign = 'left';
	          x = obj.width - properties.marginRight + 7 + properties.yaxisLabelsOffsetx;
	        } else if (obj.type === 'hbar' && !properties.yaxisLabelsSpecific) {
	          var segment = (obj.graphHeight - (properties.marginInnerTop || 0) - (properties.marginInnerBottom || 0)) / properties.yaxisLabels.length;
	          y = properties.marginTop + (properties.marginInnerTop || 0) + segment * i + segment / 2 + properties.yaxisLabelsOffsety;
	        } else {
	          var segment = (obj.graphHeight - (properties.marginInnerTop || 0) - (properties.marginInnerBottom || 0)) / (properties.yaxisLabels.length - 1);
	          y = obj.height - properties.marginBottom - segment * i + properties.yaxisLabelsOffsety;
	        }

	        var text = RGraph.SVG.text({
	          object: obj,
	          parent: obj.svg.all,
	          tag: 'labels.yaxis',
	          text: properties.yaxisLabels[i] ? properties.yaxisLabels[i] : '',
	          x: x,
	          y: y,
	          halign: halign,
	          valign: 'center',
	          font: textConf.font,
	          size: textConf.size,
	          bold: textConf.bold,
	          italic: textConf.italic,
	          color: textConf.color
	        });
	      }
	    }

	    if (properties.yaxisTitle) {
	      if (obj.scale && obj.scale.labels) {
	        var textConf = RGraph.SVG.getTextConf({
	          object: obj,
	          prefix: 'yaxisLabels'
	        });
	        var maxLabelLength = RGraph.SVG.measureText({
	          text: obj.scale.labels[obj.scale.labels.length - 1],
	          bold: textConf.bold,
	          font: textConf.font,
	          size: textConf.size,
	          italic: textConf.italic
	        })[0];
	      }

	      if (obj.type === 'hbar' && properties.yaxisLabels && properties.yaxisLabels.length) {
	        maxLabelLength = function (labels) {
	          var textConf = RGraph.SVG.getTextConf({
	            object: obj,
	            prefix: 'yaxisLabels'
	          });

	          for (var i = 0, max = 0; i < labels.length; ++i) {
	            var dim = RGraph.SVG.measureText({
	              text: labels[i],
	              bold: textConf.bold,
	              font: textConf.font,
	              size: textConf.size,
	              italic: textConf.italic
	            });
	            max = Math.max(max, dim[0]);
	          }

	          return max;
	        }(properties.yaxisLabels);
	      }

	      var x = properties.yaxisPosition === 'right' ? obj.width - properties.marginRight + 5 + maxLabelLength + 10 : properties.marginLeft - 5 - maxLabelLength - 10;
	      var y = (obj.height - properties.marginTop - properties.marginBottom) / 2 + properties.marginTop;
	      if (typeof properties.yaxisTitleOffsetx === 'number') x += properties.yaxisTitleOffsetx;
	      if (typeof properties.yaxisTitleOffsety === 'number') y += properties.yaxisTitleOffsety;
	      if (typeof properties.yaxisTitleX === 'number') x = properties.yaxisTitleX;
	      if (typeof properties.yaxisTitleY === 'number') y = properties.yaxisTitleY;
	      var textConf = RGraph.SVG.getTextConf({
	        object: obj,
	        prefix: 'yaxisTitle'
	      });
	      RGraph.SVG.text({
	        object: obj,
	        parent: obj.svg.all,
	        tag: 'yaxis.title',
	        font: textConf.font,
	        size: textConf.size,
	        bold: textConf.bold,
	        italic: textConf.italic,
	        color: textConf.color,
	        x: x,
	        y: y,
	        text: properties.yaxisTitle.toString(),
	        valign: properties.yaxisTitleValign || 'bottom',
	        halign: properties.yaxisTitleHalign || 'center',
	        angle: properties.yaxisPosition === 'right' ? 270 : 90
	      });
	    }
	  };

	  RGraph.SVG.drawBackground = function (obj) {
	    var properties = obj.properties;
	    if (typeof properties.variant3dOffsetx !== 'number') properties.variant3dOffsetx = 0;
	    if (typeof properties.variant3dOffsety !== 'number') properties.variant3dOffsety = 0;

	    if (properties.backgroundColor) {
	      RGraph.SVG.create({
	        svg: obj.svg,
	        parent: obj.svg.all,
	        type: 'rect',
	        attr: {
	          x: -1 + properties.variant3dOffsetx + properties.marginLeft,
	          y: -1 - properties.variant3dOffsety + properties.marginTop,
	          width: parseFloat(obj.svg.getAttribute('width')) + 2 - properties.marginLeft - properties.marginRight,
	          height: parseFloat(obj.svg.getAttribute('height')) + 2 - properties.marginTop - properties.marginBottom,
	          fill: properties.backgroundColor
	        }
	      });
	    }

	    if (properties.backgroundImage) {
	      var attr = {
	        'xlink:href': properties.backgroundImage,
	        preserveAspectRatio: properties.backgroundImageAspect || 'none',
	        x: properties.marginLeft,
	        y: properties.marginTop
	      };

	      if (properties.backgroundImageStretch) {
	        attr.x = properties.marginLeft + properties.variant3dOffsetx;
	        attr.y = properties.marginTop + properties.variant3dOffsety;
	        attr.width = obj.width - properties.marginLeft - properties.marginRight;
	        attr.height = obj.height - properties.marginTop - properties.marginBottom;
	      } else {
	        if (typeof properties.backgroundImageX === 'number') {
	          attr.x = properties.backgroundImageX + properties.variant3dOffsetx;
	        } else {
	          attr.x = properties.marginLeft + properties.variant3dOffsetx;
	        }

	        if (typeof properties.backgroundImageY === 'number') {
	          attr.y = properties.backgroundImageY + properties.variant3dOffsety;
	        } else {
	          attr.y = properties.marginTop + properties.variant3dOffsety;
	        }

	        if (typeof properties.backgroundImageW === 'number') {
	          attr.width = properties.backgroundImageW;
	        }

	        if (typeof properties.backgroundImageH === 'number') {
	          attr.height = properties.backgroundImageH;
	        }
	      }

	      if (properties.variant === '3d') {
	        attr.x += properties.variant3dOffsetx;
	        attr.y -= properties.variant3dOffsety;
	      }

	      var img = RGraph.SVG.create({
	        svg: obj.svg,
	        parent: obj.svg.all,
	        type: 'image',
	        attr: attr,
	        style: {
	          opacity: typeof properties.backgroundImageOpacity === 'number' ? properties.backgroundImageOpacity : 1
	        }
	      });

	      if (!properties.backgroundImageStretch) {
	        var img2 = new Image();
	        img2.src = properties.backgroundImage;

	        img2.onload = function () {
	          if (properties.backgroundImageW === 'number') img.setAttribute('width', properties.backgroundImageW);
	          if (properties.backgroundImageH === 'number') img.setAttribute('height', properties.backgroundImageH);
	        };
	      }
	    }

	    if (properties.backgroundGrid) {
	      var parts = [];

	      if (properties.backgroundGridHlines) {
	        if (typeof properties.backgroundGridHlinesCount === 'number') {
	          var count = properties.backgroundGridHlinesCount;
	        } else if (obj.type === 'hbar' || obj.type === 'bipolar') {
	          if (typeof properties.yaxisLabels === 'object' && !RGraph.SVG.isNull(properties.yaxisLabels) && properties.yaxisLabels.length) {
	            var count = properties.yaxisLabels.length;
	          } else if (obj.type === 'hbar') {
	            var count = obj.data.length;
	          } else if (obj.type === 'bipolar') {
	            var count = obj.left.length;
	          }
	        } else {
	          var count = properties.yaxisLabelsCount || 5;
	        }

	        for (var i = 0; i <= count; ++i) {
	          parts.push('M{1} {2} L{3} {4}'.format(properties.marginLeft + properties.variant3dOffsetx, properties.marginTop + obj.graphHeight / count * i - properties.variant3dOffsety, obj.width - properties.marginRight + properties.variant3dOffsetx, properties.marginTop + obj.graphHeight / count * i - properties.variant3dOffsety));
	        }

	        parts.push('M{1} {2} L{3} {4}'.format(properties.marginLeft + properties.variant3dOffsetx, obj.height - properties.marginBottom - properties.variant3dOffsety, obj.width - properties.marginRight + properties.variant3dOffsetx, obj.height - properties.marginBottom - properties.variant3dOffsety));
	      }

	      if (properties.backgroundGridVlines) {
	        if (obj.type === 'line' && RGraph.SVG.isArray(obj.data[0])) {
	          var len = obj.data[0].length;
	        } else if (obj.type === 'hbar') {
	          var len = properties.xaxisLabelsCount || 10;
	        } else if (obj.type === 'bipolar') {
	          var len = properties.xaxisLabelsCount || 10;
	        } else if (obj.type === 'scatter') {
	          var len = properties.xaxisLabels && properties.xaxisLabels.length || 10;
	        } else if (obj.type === 'waterfall') {
	          var len = obj.data.length;
	        } else {
	          var len = obj.data.length;
	        }

	        var count = typeof properties.backgroundGridVlinesCount === 'number' ? properties.backgroundGridVlinesCount : len;

	        if (properties.xaxisLabelsPosition === 'edge') {
	          count--;
	        }

	        for (var i = 0; i <= count; ++i) {
	          parts.push('M{1} {2} L{3} {4}'.format(properties.marginLeft + obj.graphWidth / count * i + properties.variant3dOffsetx, properties.marginTop - properties.variant3dOffsety, properties.marginLeft + obj.graphWidth / count * i + properties.variant3dOffsetx, obj.height - properties.marginBottom - properties.variant3dOffsety));
	        }
	      }

	      if (properties.backgroundGridBorder) {
	        parts.push('M{1} {2} L{3} {4} L{5} {6} L{7} {8} z'.format(properties.marginLeft + properties.variant3dOffsetx, properties.marginTop - properties.variant3dOffsety, obj.width - properties.marginRight + properties.variant3dOffsetx, properties.marginTop - properties.variant3dOffsety, obj.width - properties.marginRight + properties.variant3dOffsetx, obj.height - properties.marginBottom - properties.variant3dOffsety, properties.marginLeft + properties.variant3dOffsetx, obj.height - properties.marginBottom - properties.variant3dOffsety));
	      }

	      var dasharray;

	      if (properties.backgroundGridDashed) {
	        dasharray = [3, 5];
	      } else if (properties.backgroundGridDotted) {
	        dasharray = [1, 3];
	      } else if (properties.backgroundGridDashArray) {
	        dasharray = properties.backgroundGridDashArray;
	      } else {
	        dasharray = '';
	      }

	      var grid = RGraph.SVG.create({
	        svg: obj.svg,
	        parent: obj.svg.all,
	        type: 'path',
	        attr: {
	          className: 'rgraph_background_grid',
	          d: parts.join(' '),
	          stroke: properties.backgroundGridColor,
	          fill: 'rgba(0,0,0,0)',
	          'stroke-width': properties.backgroundGridLinewidth,
	          'shape-rendering': "crispEdges",
	          'stroke-dasharray': dasharray
	        },
	        style: {
	          pointerEvents: 'none'
	        }
	      });
	    }

	    if (obj.type !== 'bipolar') {
	      RGraph.SVG.drawTitle(obj);
	    }
	  };

	  RGraph.SVG.isNull = function (arg) {
	    if (arg == null || typeof arg === 'object' && !arg) {
	      return true;
	    }

	    return false;
	  };

	  RGraph.SVG.getScale = function (opt) {
	    var obj = opt.object,
	        properties = obj.properties,
	        numlabels = opt.numlabels,
	        unitsPre = opt.unitsPre,
	        unitsPost = opt.unitsPost,
	        max = Number(opt.max),
	        min = Number(opt.min),
	        strict = opt.strict,
	        decimals = Number(opt.decimals),
	        point = opt.point,
	        thousand = opt.thousand,
	        originalMax = max,
	        round = opt.round,
	        scale = {
	      max: 1,
	      labels: [],
	      values: []
	    },
	        formatter = opt.formatter;

	    if (max === 0 && min === 0) {
	      var max = 1;

	      for (var i = 0; i < numlabels; ++i) {
	        var label = ((max - min) / numlabels * (i + 1) + min).toFixed(decimals);
	        scale.labels.push(unitsPre + label + unitsPost);
	        scale.values.push(parseFloat(label));
	      }
	    } else if (max <= 1 && !strict) {
	      var arr = [1, 0.5, 0.10, 0.05, 0.010, 0.005, 0.0010, 0.0005, 0.00010, 0.00005, 0.000010, 0.000005, 0.0000010, 0.0000005, 0.00000010, 0.00000005, 0.000000010, 0.000000005, 0.0000000010, 0.0000000005, 0.00000000010, 0.00000000005, 0.000000000010, 0.000000000005, 0.0000000000010, 0.0000000000005];

	      for (var i = 0; i < arr.length; ++i) {
	        if (max > arr[i]) {
	          i--;
	          break;
	        }
	      }

	      scale.max = arr[i];
	      scale.labels = [];
	      scale.values = [];

	      for (var j = 0; j < numlabels; ++j) {
	        var value = ((arr[i] - min) / numlabels * (j + 1) + min).toFixed(decimals);
	        scale.values.push(value);
	        scale.labels.push(RGraph.SVG.numberFormat({
	          object: obj,
	          num: value,
	          prepend: unitsPre,
	          append: unitsPost,
	          point: properties.yaxisScalePoint,
	          thousand: properties.yaxisScaleThousand,
	          formatter: formatter
	        }));
	      }
	    } else if (!strict) {
	      max = Math.ceil(max);
	      var interval = Math.pow(10, Math.max(1, Number(String(Number(max) - Number(min)).length - 1)));
	      var topValue = interval;

	      while (topValue < max) {
	        topValue += interval / 2;
	      }

	      if (Number(originalMax) > Number(topValue)) {
	        topValue += interval / 2;
	      }

	      if (max <= 10) {
	        topValue = Number(originalMax) <= 5 ? 5 : 10;
	      }

	      if (obj && typeof round == 'boolean' && round) {
	        topValue = 10 * interval;
	      }

	      scale.max = topValue;

	      for (var i = 0; i < numlabels; ++i) {
	        var label = RGraph.SVG.numberFormat({
	          object: obj,
	          num: ((i + 1) / numlabels * (topValue - min) + min).toFixed(decimals),
	          prepend: unitsPre,
	          append: unitsPost,
	          point: point,
	          thousand: thousand,
	          formatter: formatter
	        });
	        scale.labels.push(label);
	        scale.values.push(((i + 1) / numlabels * (topValue - min) + min).toFixed(decimals));
	      }
	    } else if (typeof max === 'number' && strict) {
	      for (var i = 0; i < numlabels; ++i) {
	        scale.labels.push(RGraph.SVG.numberFormat({
	          object: obj,
	          formatter: formatter,
	          num: ((i + 1) / numlabels * (max - min) + min).toFixed(decimals),
	          prepend: unitsPre,
	          append: unitsPost,
	          point: point,
	          thousand: thousand
	        }));
	        scale.values.push(((i + 1) / numlabels * (max - min) + min).toFixed(decimals));
	      }

	      scale.max = max;
	    }

	    scale.unitsPre = unitsPre;
	    scale.unitsPost = unitsPost;
	    scale.point = point;
	    scale.decimals = decimals;
	    scale.thousand = thousand;
	    scale.numlabels = numlabels;
	    scale.round = Boolean(round);
	    scale.min = min;

	    for (var i = 0; i < scale.values.length; ++i) {
	      scale.values[i] = parseFloat(scale.values[i]);
	    }

	    return scale;
	  };

	  RGraph.SVG.arraySum = function (arr) {
	    if (typeof arr === 'number') {
	      return arr;
	    }

	    if (RGraph.SVG.isNull(arr)) {
	      return 0;
	    }

	    var i,
	        sum,
	        len = arr.length;

	    for (i = 0, sum = 0; i < len; sum += arr[i++]);

	    return sum;
	  };

	  RGraph.SVG.arrayMax = function (arr) {
	    var max = null;

	    if (typeof arr === 'number') {
	      return arr;
	    }

	    if (RGraph.SVG.isNull(arr)) {
	      return 0;
	    }

	    for (var i = 0, len = arr.length; i < len; ++i) {
	      if (typeof arr[i] === 'number') {
	        var val = arguments[1] ? Math.abs(arr[i]) : arr[i];

	        if (typeof max === 'number') {
	          max = Math.max(max, val);
	        } else {
	          max = val;
	        }
	      }
	    }

	    return max;
	  };

	  RGraph.SVG.arrayMin = function (arr) {
	    var min = null;

	    if (typeof arr === 'number') {
	      return arr;
	    }

	    if (RGraph.SVG.isNull(arr)) {
	      return 0;
	    }

	    for (var i = 0, len = arr.length; i < len; ++i) {
	      if (typeof arr[i] === 'number') {
	        var val = arguments[1] ? Math.abs(arr[i]) : arr[i];

	        if (typeof min === 'number') {
	          min = Math.min(min, val);
	        } else {
	          min = val;
	        }
	      }
	    }

	    return min;
	  };

	  RGraph.SVG.arrayFill = RGraph.SVG.arrayPad = function (args) {
	    if (arguments.length === 1) {
	      var arr = args.array,
	          val = args.value,
	          len = args.length;
	    } else {
	      var arr = arguments[0],
	          len = arguments[1],
	          val = arguments[2];
	    }

	    if (arr.length < len) {
	      var val = typeof val !== 'undefined' ? val : null;

	      for (var i = arr.length; i < len; i += 1) {
	        arr[i] = val;
	      }
	    }

	    return arr;
	  };

	  RGraph.SVG.arraySum = function (arr) {
	    if (typeof arr === 'number') {
	      return arr;
	    }

	    if (RGraph.SVG.isNull(arr)) {
	      return 0;
	    }

	    var i,
	        sum,
	        len = arr.length;

	    for (i = 0, sum = 0; i < len; sum += arr[i++]);

	    return sum;
	  };

	  RGraph.SVG.arrayLinearize = function () {
	    var arr = [],
	        args = arguments;

	    for (var i = 0, len = args.length; i < len; ++i) {
	      if (typeof args[i] === 'object' && args[i]) {
	        for (var j = 0, len2 = args[i].length; j < len2; ++j) {
	          var sub = RGraph.SVG.arrayLinearize(args[i][j]);

	          for (var k = 0, len3 = sub.length; k < len3; ++k) {
	            arr.push(sub[k]);
	          }
	        }
	      } else {
	        arr.push(args[i]);
	      }
	    }

	    return arr;
	  };

	  RGraph.SVG.arrayShift = function (arr) {
	    var ret = [];

	    for (var i = 1, len = arr.length; i < len; ++i) {
	      ret.push(arr[i]);
	    }

	    return ret;
	  };

	  RGraph.SVG.arrayReverse = function (arr) {
	    if (!arr) {
	      return;
	    }

	    var newarr = [];

	    for (var i = arr.length - 1; i >= 0; i -= 1) {
	      newarr.push(arr[i]);
	    }

	    return newarr;
	  };

	  RGraph.SVG.clone = RGraph.SVG.arrayClone = function (obj) {
	    if (obj === null || typeof obj !== 'object') {
	      return obj;
	    }

	    if (RGraph.SVG.isArray(obj)) {
	      var temp = [];

	      for (var i = 0, len = obj.length; i < len; ++i) {
	        if (typeof obj[i] === 'number') {
	          temp[i] = function (arg) {
	            return Number(arg);
	          }(obj[i]);
	        } else if (typeof obj[i] === 'string') {
	          temp[i] = function (arg) {
	            return String(arg);
	          }(obj[i]);
	        } else if (typeof obj[i] === 'function') {
	          temp[i] = obj[i];
	        } else {
	          temp[i] = RGraph.SVG.arrayClone(obj[i]);
	        }
	      }
	    } else if (typeof obj === 'object') {
	      var temp = {};

	      for (var i in obj) {
	        if (typeof i === 'string') {
	          temp[i] = obj[i];
	        }
	      }
	    }

	    return temp;
	  };

	  RGraph.SVG.arrayInvert = function (arr) {
	    for (var i = 0, len = arr.length; i < len; ++i) {
	      arr[i] = !arr[i];
	    }

	    return arr;
	  };

	  RGraph.SVG.arrayTrim = function (arr) {
	    var out = [],
	        content = false;

	    for (var i = 0; i < arr.length; i++) {
	      if (arr[i]) {
	        content = true;
	      }

	      if (content) {
	        out.push(arr[i]);
	      }
	    }

	    out = RGraph.SVG.arrayReverse(out);
	    var out2 = [],
	        content = false;

	    for (var i = 0; i < out.length; i++) {
	      if (out[i]) {
	        content = true;
	      }

	      if (content) {
	        out2.push(out[i]);
	      }
	    }

	    out2 = RGraph.SVG.arrayReverse(out2);
	    return out2;
	  };

	  RGraph.SVG.isArray = function (obj) {
	    if (obj && obj.constructor) {
	      var pos = obj.constructor.toString().indexOf('Array');
	    } else {
	      return false;
	    }

	    return obj != null && typeof pos === 'number' && pos > 0 && pos < 20;
	  };

	  RGraph.SVG.abs = function (value) {
	    if (typeof value === 'string') {
	      value = parseFloat(value) || 0;
	    }

	    if (typeof value === 'number') {
	      return Math.abs(value);
	    }

	    if (typeof value === 'object') {
	      for (i in value) {
	        if (typeof i === 'string' || typeof i === 'number' || typeof i === 'object') {
	          value[i] = RGraph.SVG.abs(value[i]);
	        }
	      }

	      return value;
	    }

	    return 0;
	  };

	  RGraph.SVG.numberFormat = function (opt) {
	    var obj = opt.object,
	        prepend = opt.prepend ? String(opt.prepend) : '',
	        append = opt.append ? String(opt.append) : '',
	        output = '',
	        decimal_seperator = typeof opt.point === 'string' ? opt.point : '.',
	        thousand_seperator = typeof opt.thousand === 'string' ? opt.thousand : ',',
	        num = opt.num;
	    decimals_trim = opt.decimals_trim;
	    RegExp.$1 = '';

	    if (typeof opt.formatter === 'function') {
	      return opt.formatter(obj, num);
	    }

	    if (String(num).indexOf('e') > 0) {
	      return String(prepend + String(num) + append);
	    }

	    num = String(num);

	    if (num.indexOf('.') > 0) {
	      var tmp = num;
	      num = num.replace(/\.(.*)/, '');
	      decimal = tmp.replace(/(.*)\.(.*)/, '$2');
	    } else {
	      decimal = '';
	    }

	    var seperator = thousand_seperator;

	    for (i = num.length - 1, j = 0; i >= 0; j++, i--) {
	      var character = num.charAt(i);

	      if (j % 3 == 0 && j != 0) {
	        output += seperator;
	      }

	      output += character;
	    }

	    var rev = output;
	    output = '';

	    for (i = rev.length - 1; i >= 0; i--) {
	      output += rev.charAt(i);
	    }

	    if (output.indexOf('-' + thousand_seperator) == 0) {
	      output = '-' + output.substr(('-' + thousand_seperator).length);
	    }

	    if (decimal.length) {
	      output = output + decimal_seperator + decimal;
	      decimal = '';
	      RegExp.$1 = '';
	    }

	    if (decimals_trim) {
	      output = output.replace(/0+$/, '');
	      output = output.replace(/\.$/, '');
	    }

	    if (output.charAt(0) == '-') {
	      output = output.replace(/-/, '');
	      prepend = '-' + prepend;
	    }

	    return prepend + output + append;
	  };

	  RGraph.SVG.text = function (opt) {
	    for (var i in RGraph.SVG.text.defaults) {
	      if (typeof i === 'string' && typeof opt[i] === 'undefined') {
	        opt[i] = RGraph.SVG.text.defaults[i];
	      }
	    }

	    var obj = opt.object,
	        parent = opt.parent || opt.object.svg.all,
	        size = typeof opt.size === 'number' ? opt.size + 'pt' : (typeof opt.size === 'string' ? opt.size.replace(/pt$/, '') : 12) + 'pt',
	        bold = opt.bold ? 'bold' : 'normal',
	        font = opt.font ? opt.font : 'sans-serif',
	        italic = opt.italic ? 'italic' : 'normal',
	        halign = opt.halign,
	        valign = opt.valign,
	        str = opt.text,
	        x = opt.x,
	        y = opt.y,
	        color = opt.color ? opt.color : 'black',
	        background = opt.background || null,
	        backgroundRounded = opt.backgroundRounded || 0,
	        padding = opt.padding || 0,
	        link = opt.link || '',
	        linkTarget = opt.linkTarget || '_blank',
	        events = opt.events === true ? true : false,
	        angle = opt.angle;

	    if (typeof str === 'number') {
	      str = String(str);
	    }

	    if (RGraph.SVG.isNull(str)) {
	      str = '';
	    }

	    if (str && str.substr(0, 2) == '\r\n' || str.substr(0, 1) === '\n') {
	      str = "\u00A0" + str;
	    }

	    if (halign === 'right') {
	      halign = 'end';
	    } else if (halign === 'center' || halign === 'middle') {
	      halign = 'middle';
	    } else {
	      halign = 'start';
	    }

	    if (valign === 'top') {
	      valign = 'hanging';
	    } else if (valign === 'center' || valign === 'middle') {
	      valign = 'central';
	      valign = 'middle';
	    } else {
	      valign = 'bottom';
	    }

	    if (link) {
	      var a = RGraph.SVG.create({
	        svg: obj.svg,
	        type: 'a',
	        parent: parent,
	        attr: {
	          'xlink:href': link,
	          target: linkTarget
	        }
	      });
	    }

	    if (str && str.indexOf && str.indexOf("\n") === -1) {
	      var text = RGraph.SVG.create({
	        svg: obj.svg,
	        parent: link ? a : opt.parent,
	        type: 'text',
	        attr: {
	          tag: opt.tag ? opt.tag : '',
	          'data-tag': opt.tag ? opt.tag : '',
	          fill: color,
	          x: x,
	          y: y,
	          'font-size': size,
	          'font-weight': bold,
	          'font-family': font,
	          'font-style': italic,
	          'text-anchor': halign,
	          'dominant-baseline': valign
	        }
	      });
	      var textNode = document.createTextNode(str);
	      text.appendChild(textNode);

	      if (!events) {
	        text.style.pointerEvents = 'none';
	      }
	    } else if (str && str.indexOf) {
	      var dimensions = RGraph.SVG.measureText({
	        text: 'My',
	        bold: bold,
	        font: font,
	        size: size
	      });
	      var lineHeight = dimensions[1];
	      str = str.split(/\r?\n/);

	      if (valign === 'bottom') {
	        y -= str.length * lineHeight;
	      }

	      if (valign === 'center' || valign === 'middle') {
	        y -= str.length * lineHeight / 2;
	      }

	      var text = RGraph.SVG.create({
	        svg: obj.svg,
	        parent: link ? a : opt.parent,
	        type: 'text',
	        attr: {
	          tag: opt.tag ? opt.tag : '',
	          fill: color,
	          x: x,
	          y: y,
	          'font-size': size,
	          'font-weight': bold,
	          'font-family': font,
	          'font-style': italic,
	          'text-anchor': halign,
	          'dominant-baseline': valign
	        }
	      });

	      if (!events) {
	        text.style.pointerEvents = 'none';
	      }

	      for (var i = 0; i < str.length; ++i) {
	        var tspan = RGraph.SVG.create({
	          svg: obj.svg,
	          parent: text,
	          type: 'tspan',
	          attr: {
	            x: x,
	            dy: dimensions ? dimensions[1] * (i ? 1 : 0) + 3 : 0
	          }
	        });
	        var textNode = document.createTextNode(str[i]);
	        tspan.appendChild(textNode);

	        if (!events) {
	          tspan.style.pointerEvents = 'none';
	        }

	        var dimensions = RGraph.SVG.measureText({
	          text: str[i],
	          bold: bold,
	          font: font,
	          size: parseInt(size)
	        });
	      }
	    }

	    if (typeof angle === 'number' && angle && text) {
	      text.setAttribute('x', 0);
	      text.setAttribute('y', 0);
	      text.setAttribute('transform', 'translate({1} {2}) rotate({3})'.format(x, y, -1 * angle));
	    }

	    if (typeof background === 'string') {
	      var parent = link ? a : parent;
	      var bbox = text.getBBox(),
	          rect = RGraph.SVG.create({
	        svg: obj.svg,
	        parent: parent,
	        type: 'rect',
	        attr: {
	          x: bbox.x - padding,
	          y: bbox.y - padding,
	          width: bbox.width + padding * 2,
	          height: bbox.height + padding * 2,
	          fill: background,
	          rx: backgroundRounded,
	          ry: backgroundRounded
	        }
	      });

	      if (!events) {
	        rect.style.pointerEvents = 'none';
	      }

	      text.parentNode.insertBefore(rect, text);
	    }

	    if (RGraph.SVG.ISIE && valign === 'hanging' && text) {
	      text.setAttribute('y', y + text.scrollHeight / 2);
	    } else if (RGraph.SVG.ISIE && valign === 'middle' && text) {
	      text.setAttribute('y', y + text.scrollHeight / 3);
	    }

	    if (RGraph.SVG.ISFF && text) {
	      Y = y + text.scrollHeight / 3;
	    }

	    return text;
	  };

	  RGraph.SVG.text.defaults = {};

	  RGraph.SVG.text.find = function (opt) {
	    if (typeof opt.object === 'object' && opt.object.isRGraph) {
	      var svg = opt.object.svg;
	    } else if (typeof opt.svg === 'object' && opt.svg.all) {
	      var svg = opt.svg;
	      opt.object = svg.__object__;
	    }

	    var nodes = svg.getElementsByTagName('text');
	    var found = [];

	    for (var i = 0, len = nodes.length; i < len; ++i) {
	      var text = false,
	          tag = false;

	      if (typeof opt.text === 'string' && nodes[i].innerHTML === opt.text) {
	        text = true;
	      } else if (typeof opt.text === 'object' && nodes[i].innerHTML.match(opt.text)) {
	        text = true;
	      } else if (typeof opt.text === 'undefined') {
	        text = true;
	      }

	      if (typeof opt.tag === 'string' && nodes[i].getAttribute('tag') === opt.tag) {
	        tag = true;
	      } else if (typeof opt.tag === 'object' && nodes[i].getAttribute('tag').match(opt.tag)) {
	        tag = true;
	      } else if (typeof opt.tag === 'undefined') {
	        tag = true;
	      }

	      if (text === true && tag === true) {
	        found.push(nodes[i]);
	      }
	    }

	    if (typeof opt.callback === 'function') {
	      opt.callback({
	        nodes: found,
	        object: opt.object
	      });
	    }

	    return found;
	  };

	  RGraph.SVG.createUID = function () {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = Math.random() * 16 | 0,
	          v = c == 'x' ? r : r & 0x3 | 0x8;
	      return v.toString(16);
	    });
	  };

	  RGraph.SVG.isFixed = function (svg) {
	    var obj = svg.parentNode,
	        i = 0;

	    while (obj && obj.tagName.toLowerCase() != 'body' && i < 99) {
	      if (obj.style.position === 'fixed') {
	        return obj;
	      }

	      obj = obj.offsetParent;
	    }

	    return false;
	  };

	  RGraph.SVG.REG.set = function (name, value) {
	    RGraph.SVG.REG.store[name] = value;
	    return value;
	  };

	  RGraph.SVG.REG.get = function (name) {
	    return RGraph.SVG.REG.store[name];
	  };

	  RGraph.SVG.trim = function (str) {
	    return RGraph.SVG.ltrim(RGraph.SVG.rtrim(str));
	  };

	  RGraph.SVG.ltrim = function (str) {
	    return str.replace(/^(\s|\0)+/, '');
	  };

	  RGraph.SVG.rtrim = function (str) {
	    return str.replace(/(\s|\0)+$/, '');
	  };

	  RGraph.SVG.hideTooltip = function () {
	    var tooltip = RGraph.SVG.REG.get('tooltip');

	    if (tooltip && tooltip.parentNode) {
	      tooltip.parentNode.removeChild(tooltip);
	      tooltip.style.display = 'none';
	      tooltip.style.visibility = 'hidden';
	      RGraph.SVG.REG.set('tooltip', null);
	    }

	    if (tooltip && tooltip.__object__) {
	      RGraph.SVG.removeHighlight(tooltip.__object__);
	    }
	  };

	  RGraph.SVG.setShadow = function (options) {
	    var obj = options.object,
	        offsetx = options.offsetx || 0,
	        offsety = options.offsety || 0,
	        blur = options.blur || 0,
	        opacity = options.opacity || 0,
	        id = options.id;
	    var filter = RGraph.SVG.create({
	      svg: obj.svg,
	      parent: obj.svg.defs,
	      type: 'filter',
	      attr: {
	        id: id,
	        width: "130%",
	        height: "130%"
	      }
	    });
	    RGraph.SVG.create({
	      svg: obj.svg,
	      parent: filter,
	      type: 'feOffset',
	      attr: {
	        result: 'offOut',
	        'in': 'SourceGraphic',
	        dx: offsetx,
	        dy: offsety
	      }
	    });
	    RGraph.SVG.create({
	      svg: obj.svg,
	      parent: filter,
	      type: 'feColorMatrix',
	      attr: {
	        result: 'matrixOut',
	        'in': 'offOut',
	        type: 'matrix',
	        values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 {1} 0'.format(opacity)
	      }
	    });
	    RGraph.SVG.create({
	      svg: obj.svg,
	      parent: filter,
	      type: 'feGaussianBlur',
	      attr: {
	        result: 'blurOut',
	        'in': 'matrixOut',
	        stdDeviation: blur
	      }
	    });
	    RGraph.SVG.create({
	      svg: obj.svg,
	      parent: filter,
	      type: 'feBlend',
	      attr: {
	        'in': 'SourceGraphic',
	        'in2': 'blurOut',
	        mode: 'normal'
	      }
	    });
	  };

	  RGraph.SVG.sequentialIndexToGrouped = function (index, data) {
	    var group = 0,
	        grouped_index = 0;

	    while (--index >= 0) {
	      if (RGraph.SVG.isNull(data[group])) {
	        group++;
	        grouped_index = 0;
	        continue;
	      }

	      if (typeof data[group] == 'number') {
	        group++;
	        grouped_index = 0;
	        continue;
	      }

	      grouped_index++;

	      if (grouped_index >= data[group].length) {
	        group++;
	        grouped_index = 0;
	      }
	    }

	    return [group, grouped_index];
	  };

	  RGraph.SVG.groupedIndexToSequential = function (opt) {
	    var dataset = opt.dataset,
	        index = opt.index,
	        obj = opt.object;

	    for (var i = 0, seq = 0; i <= dataset; ++i) {
	      for (var j = 0; j < obj.data[dataset].length; ++j) {
	        if (i === dataset && j === index) {
	          return seq;
	        }

	        seq++;
	      }
	    }

	    return seq;
	  };

	  RGraph.SVG.arrayLinearize = function () {
	    var arr = [],
	        args = arguments;

	    for (var i = 0, len = args.length; i < len; ++i) {
	      if (typeof args[i] === 'object' && args[i]) {
	        for (var j = 0, len2 = args[i].length; j < len2; ++j) {
	          var sub = RGraph.SVG.arrayLinearize(args[i][j]);

	          for (var k = 0, len3 = sub.length; k < len3; ++k) {
	            arr.push(sub[k]);
	          }
	        }
	      } else {
	        arr.push(args[i]);
	      }
	    }

	    return arr;
	  };

	  RGraph.SVG.TRIG.toCartesian = function (options) {
	    return {
	      x: options.cx + options.r * Math.cos(options.angle),
	      y: options.cy + options.r * Math.sin(options.angle)
	    };
	  };

	  RGraph.SVG.TRIG.getHypLength = function (opt) {
	    var h = Math.abs(opt.x2 - opt.x1);
	    v = Math.abs(opt.y2 - opt.y1), r = Math.sqrt(h * h + v * v);
	    return r;
	  };

	  RGraph.SVG.TRIG.getAngleByXY = function (opt) {
	    var cx = opt.cx,
	        cy = opt.cy,
	        x = opt.x,
	        y = opt.y;
	    var angle = Math.atan((y - cy) / (x - cx));

	    if (x >= cx && y >= cy) {
	      angle += RGraph.SVG.TRIG.HALFPI;
	    } else if (x >= cx && y < cy) {
	      angle = angle + RGraph.SVG.TRIG.HALFPI;
	    } else if (x < cx && y < cy) {
	      angle = angle + RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI;
	    } else {
	      angle = angle + RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI;
	    }

	    return angle;
	  };

	  RGraph.SVG.TRIG.getArcPath = function (options) {
	    options.start -= 1.57;
	    options.end -= 1.57;
	    var start = RGraph.SVG.TRIG.toCartesian({
	      cx: options.cx,
	      cy: options.cy,
	      r: options.r,
	      angle: options.start
	    });
	    var end = RGraph.SVG.TRIG.toCartesian({
	      cx: options.cx,
	      cy: options.cy,
	      r: options.r,
	      angle: options.end
	    });
	    var diff = options.end - options.start;
	    var largeArc = '0';
	    var sweep = '0';

	    if (options.anticlockwise && diff > 3.14) {
	      largeArc = '0';
	      sweep = '0';
	    } else if (options.anticlockwise && diff <= 3.14) {
	      largeArc = '1';
	      sweep = '0';
	    } else if (!options.anticlockwise && diff > 3.14) {
	      largeArc = '1';
	      sweep = '1';
	    } else if (!options.anticlockwise && diff <= 3.14) {
	      largeArc = '0';
	      sweep = '1';
	    }

	    if (options.start > options.end && options.anticlockwise && diff <= 3.14) {
	      largeArc = '0';
	      sweep = '0';
	    }

	    if (options.start > options.end && options.anticlockwise && diff > 3.14) {
	      largeArc = '1';
	      sweep = '1';
	    }

	    if (typeof options.moveto === 'boolean' && options.moveto === false) {
	      var d = ["A", options.r, options.r, 0, largeArc, sweep, end.x, end.y];
	    } else {
	      var d = ["M", start.x, start.y, "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y];
	    }

	    if (options.array === true) {
	      return d;
	    } else {
	      return d.join(" ");
	    }
	  };

	  RGraph.SVG.TRIG.getArcPath2 = function (options) {
	    options.start -= 1.57;
	    options.end -= 1.57;
	    var start = RGraph.SVG.TRIG.toCartesian({
	      cx: options.cx,
	      cy: options.cy,
	      r: options.r,
	      angle: options.start
	    });
	    var end = RGraph.SVG.TRIG.toCartesian({
	      cx: options.cx,
	      cy: options.cy,
	      r: options.r,
	      angle: options.end
	    });
	    var diff = Math.abs(options.end - options.start);
	    var largeArc = '0';
	    var sweep = '0';

	    if (!options.anticlockwise) {
	      if (diff > RGraph.SVG.TRIG.PI) {
	        largeArc = '1';
	        sweep = '1';
	      } else {
	        largeArc = '0';
	        sweep = '1';
	      }
	    } else {
	      if (diff > RGraph.SVG.TRIG.PI) {
	        largeArc = '1';
	        sweep = '0';
	      } else {
	        largeArc = '0';
	        sweep = '0';
	      }
	    }

	    if (typeof options.lineto === 'boolean' && options.lineto === false) {
	      var d = ["M", start.x, start.y, "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y];
	    } else {
	      var d = ["M", options.cx, options.cy, "L", start.x, start.y, "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y];
	    }

	    if (options.array === true) {
	      return d;
	    } else {
	      return d.join(" ");
	    }
	  };

	  RGraph.SVG.TRIG.getArcPath3 = function (options) {
	    options.cx = Number(options.cx);
	    options.cy = Number(options.cy);
	    options.start = Number(options.start);
	    options.end = Number(options.end);

	    if (typeof options.radius === 'number') {
	      options.r = options.radius;
	    }

	    options.start -= Math.PI / 2;
	    options.end -= Math.PI / 2;
	    var start = RGraph.SVG.TRIG.toCartesian({
	      cx: options.cx,
	      cy: options.cy,
	      r: options.r,
	      angle: options.start
	    });
	    var end = RGraph.SVG.TRIG.toCartesian({
	      cx: options.cx,
	      cy: options.cy,
	      r: options.r,
	      angle: options.end
	    });
	    var diff = Math.abs(options.end - options.start);
	    var largeArc = '0';
	    var sweep = '0';

	    if (!options.anticlockwise) {
	      if (diff > RGraph.SVG.TRIG.PI) {
	        largeArc = '1';
	        sweep = '1';
	      } else {
	        largeArc = '0';
	        sweep = '1';
	      }
	    } else {
	      if (diff > RGraph.SVG.TRIG.PI) {
	        largeArc = '1';
	        sweep = '0';
	      } else {
	        largeArc = '0';
	        sweep = '0';
	      }
	    }

	    if (typeof options.lineto === 'boolean' && options.lineto === false) {
	      if (typeof options.moveto === 'boolean' && options.moveto === false) {
	        var d = ["A", options.r, options.r, 0, largeArc, sweep, end.x, end.y];
	      } else {
	        var d = ["M", start.x, start.y, "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y];
	      }
	    } else {
	      var d = ["L", start.x, start.y, "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y];
	    }

	    if (options.array === true) {
	      return d;
	    } else {
	      return d.join(" ");
	    }
	  };

	  RGraph.SVG.TRIG.getRadiusEndPoint = function (opt) {
	    if (arguments.length === 1) {
	      if (typeof opt.radius === 'number') {
	        opt.r = opt.radius;
	      }

	      var angle = opt.angle,
	          r = opt.r;
	    } else if (arguments.length === 4) {
	      var angle = arguments[0],
	          r = arguments[1];
	    }

	    var x = Math.cos(angle) * r,
	        y = Math.sin(angle) * r;
	    return [x, y];
	  };

	  RGraph.SVG.TRIG.toRadians = function (opt) {
	    return opt.degrees * (Math.PI / 180);
	  };

	  RGraph.SVG.TRIG.toDegrees = function (opt) {
	    return opt.radians * (180 / Math.PI);
	  };

	  RGraph.SVG.drawTitle = function (obj) {
	    var properties = obj.properties;
	    var x = (obj.width - properties.marginLeft - properties.marginRight) / 2 + properties.marginLeft,
	        y = properties.marginTop - 10,
	        valign = 'bottom';

	    if (!RGraph.SVG.isNull(obj.properties.key)) {
	      y -= 20;
	    }

	    if (typeof obj.properties.yaxisScaleMax === 'number' && obj.properties.yaxisScaleMax <= 0 && obj.properties.yaxisScaleMin < obj.properties.yaxisScaleMax) {
	      valign = 'top';
	      y = obj.height - obj.properties.marginBottom + 10;
	    }

	    if (typeof properties.titleX === 'number') {
	      x = properties.titleX;
	    }

	    if (typeof properties.titleY === 'number') {
	      y = properties.titleY;
	    }

	    if (typeof properties.titleOffsetx === 'number') {
	      x += properties.titleOffsetx;
	    }

	    if (typeof properties.titleOffsety === 'number') {
	      y += properties.titleOffsety;
	    }

	    if (typeof properties.titleSubtitle === 'string' || typeof properties.titleSubtitle === 'number') {
	      var titleSubtitleDim = RGraph.SVG.measureText({
	        bold: properties.titleSubtitleBold,
	        italic: properties.titleSubtitleItalic,
	        size: properties.titleSubtitleSize,
	        font: properties.titleSubtitleFont,
	        text: 'Mg'
	      });
	      y -= titleSubtitleDim[1];
	    }

	    if (properties.title) {
	      RGraph.SVG.text({
	        object: obj,
	        svg: obj.svg,
	        parent: obj.svg.all,
	        tag: 'title',
	        text: properties.title.toString(),
	        x: x,
	        y: y,
	        halign: properties.titleHalign || 'center',
	        valign: valign,
	        color: properties.titleColor || properties.textColor,
	        size: typeof properties.titleSize === 'number' ? properties.titleSize : properties.textSize + 4,
	        bold: typeof properties.titleBold === 'boolean' ? properties.titleBold : properties.textBold,
	        italic: typeof properties.titleItalic === 'boolean' ? properties.titleItalic : properties.textItalic,
	        font: properties.titleFont || properties.textFont
	      });
	    }

	    if ((typeof properties.title === 'string' || typeof properties.title === 'number') && (typeof properties.titleSubtitle === 'string' || typeof properties.titleSubtitle === 'number')) {
	      RGraph.SVG.text({
	        object: obj,
	        svg: obj.svg,
	        parent: obj.svg.all,
	        tag: 'subtitle',
	        text: properties.titleSubtitle,
	        x: x,
	        y: y + 5,
	        halign: properties.titleHalign || 'center',
	        valign: 'top',
	        size: typeof properties.titleSubtitleSize === 'number' ? properties.titleSubtitleSize : properties.textSize - 2,
	        color: properties.titleSubtitleColor || properties.textColor,
	        bold: typeof properties.titleSubtitleBold === 'boolean' ? properties.titleSubtitleBold : properties.textBold,
	        italic: typeof properties.titleSubtitleItalic === 'boolean' ? properties.titleSubtitleItalic : properties.textItalic,
	        font: properties.titleSubtitleFont || properties.textFont
	      });
	    }
	  };

	  RGraph.SVG.trim = function (str) {
	    return RGraph.SVG.ltrim(RGraph.SVG.rtrim(str));
	  };

	  RGraph.SVG.ltrim = function (str) {
	    return String(str).replace(/^(\s|\0)+/, '');
	  };

	  RGraph.SVG.rtrim = function (str) {
	    return String(str).replace(/(\s|\0)+$/, '');
	  };

	  RGraph.SVG.parseColorLinear = function (opt) {
	    var obj = opt.object,
	        color = opt.color;

	    if (!color || typeof color !== 'string') {
	      return color;
	    }

	    if (color.match(/^gradient\((.*)\)$/i)) {
	      var parts = RegExp.$1.split(':'),
	          diff = 1 / (parts.length - 1);

	      if (opt && opt.direction && opt.direction === 'horizontal') {
	        var grad = RGraph.SVG.create({
	          type: 'linearGradient',
	          parent: obj.svg.defs,
	          attr: {
	            id: 'RGraph-linear-gradient-' + obj.uid + '-' + obj.gradientCounter,
	            x1: opt.start || 0,
	            x2: opt.end || '100%',
	            y1: 0,
	            y2: 0,
	            gradientUnits: opt.gradientUnits || "userSpaceOnUse"
	          }
	        });
	      } else {
	        var grad = RGraph.SVG.create({
	          type: 'linearGradient',
	          parent: obj.svg.defs,
	          attr: {
	            id: 'RGraph-linear-gradient-' + obj.uid + '-' + obj.gradientCounter,
	            x1: 0,
	            x2: 0,
	            y1: opt.start || 0,
	            y2: opt.end || '100%',
	            gradientUnits: opt.gradientUnits || "userSpaceOnUse"
	          }
	        });
	      }

	      var stop = RGraph.SVG.create({
	        type: 'stop',
	        parent: grad,
	        attr: {
	          offset: '0%',
	          'stop-color': RGraph.SVG.trim(parts[0])
	        }
	      });

	      for (var j = 1, len = parts.length; j < len; ++j) {
	        RGraph.SVG.create({
	          type: 'stop',
	          parent: grad,
	          attr: {
	            offset: j * diff * 100 + '%',
	            'stop-color': RGraph.SVG.trim(parts[j])
	          }
	        });
	      }
	    }

	    color = grad ? 'url(#RGraph-linear-gradient-' + obj.uid + '-' + obj.gradientCounter++ + ')' : color;
	    return color;
	  };

	  RGraph.SVG.parseColorRadial = function (opt) {
	    var obj = opt.object,
	        color = opt.color;

	    if (!color || typeof color !== 'string') {
	      return color;
	    }

	    if (color.match(/^gradient\((.*)\)$/i)) {
	      var parts = RegExp.$1.split(':'),
	          diff = 1 / (parts.length - 1);
	      var grad = RGraph.SVG.create({
	        type: 'radialGradient',
	        parent: obj.svg.defs,
	        attr: {
	          id: 'RGraph-radial-gradient-' + obj.uid + '-' + obj.gradientCounter,
	          gradientUnits: opt.gradientUnits || 'userSpaceOnUse',
	          cx: opt.cx || obj.centerx,
	          cy: opt.cy || obj.centery,
	          fx: opt.fx || obj.centerx,
	          fy: opt.fy || obj.centery,
	          r: opt.r || obj.radius
	        }
	      });
	      var stop = RGraph.SVG.create({
	        type: 'stop',
	        parent: grad,
	        attr: {
	          offset: '0%',
	          'stop-color': RGraph.SVG.trim(parts[0])
	        }
	      });

	      for (var j = 1, len = parts.length; j < len; ++j) {
	        RGraph.SVG.create({
	          type: 'stop',
	          parent: grad,
	          attr: {
	            offset: j * diff * 100 + '%',
	            'stop-color': RGraph.SVG.trim(parts[j])
	          }
	        });
	      }
	    }

	    color = grad ? 'url(#RGraph-radial-gradient-' + obj.uid + '-' + obj.gradientCounter++ + ')' : color;
	    return color;
	  };

	  RGraph.SVG.resetColorsToOriginalValues = function (opt) {
	    var obj = opt.object;

	    if (obj.originalColors) {
	      for (var j in obj.originalColors) {
	        if (typeof j === 'string') {
	          obj.properties[j] = RGraph.SVG.arrayClone(obj.originalColors[j]);
	        }
	      }
	    }

	    if (typeof obj.resetColorsToOriginalValues === 'function') {
	      obj.resetColorsToOriginalValues();
	    }

	    obj.originalColors = {};
	    obj.colorsParsed = false;
	    obj.gradientCounter = 1;
	  };

	  RGraph.SVG.clear = function () {
	    if (arguments.length === 0) {
	      for (var i = 0; i < RGraph.SVG.OR.objects.length; i++) {
	        RGraph.SVG.clear(RGraph.SVG.OR.objects[i].svg);
	      }

	      return;
	    } else {
	      var svg = arguments[0];
	    }

	    if (typeof svg === 'string') {
	      var div = document.getElementById(svg);
	      var svg = div.__svg__;
	    }

	    for (var i = 1; i <= 100; ++i) {
	      if (svg && svg['background' + i]) {
	        while (svg['background' + i].lastChild) {
	          svg['background' + i].removeChild(svg['background' + i].lastChild);
	        }
	      } else {
	        break;
	      }
	    }

	    if (svg.all) {
	      while (svg.all.lastChild) {
	        svg.all.removeChild(svg.all.lastChild);
	      }

	      if (svg.all.line_tooltip_hotspots) {
	        while (svg.all.line_tooltip_hotspots.lastChild) {
	          svg.all.line_tooltip_hotspots.removeChild(svg.all.line_tooltip_hotspots.lastChild);
	        }
	      }
	    }
	  };

	  RGraph.SVG.reset = function () {
	    if (arguments.length === 0) {
	      for (var i = 0; i < RGraph.SVG.OR.objects.length; i++) {
	        RGraph.SVG.reset(RGraph.SVG.OR.objects[i].svg);
	      }

	      return;
	    } else {
	      var svg = arguments[0];
	    }

	    if (typeof svg === 'string') {
	      var div = document.getElementById(svg);
	      var svg = div.__svg__;
	    }

	    svg.parentNode.__svg__ = null;
	    RGraph.SVG.clear(svg);

	    while (svg.lastChild) {
	      svg.removeChild(svg.lastChild);
	    }

	    RGraph.SVG.OR.clear(svg);
	    svg.parentNode.removeChild(svg);
	  };

	  RGraph.SVG.addCustomEventListener = function (obj, name, func) {
	    if (typeof RGraph.SVG.events[obj.uid] === 'undefined') {
	      RGraph.SVG.events[obj.uid] = [];
	    }

	    if (name.substr(0, 2) !== 'on') {
	      name = 'on' + name;
	    }

	    RGraph.SVG.events[obj.uid].push({
	      object: obj,
	      event: name,
	      func: func
	    });
	    return RGraph.SVG.events[obj.uid].length - 1;
	  };

	  RGraph.SVG.fireCustomEvent = function (obj, name) {
	    if (obj && obj.isRGraph) {
	      var uid = obj.uid;

	      if (typeof uid === 'string' && typeof RGraph.SVG.events === 'object' && typeof RGraph.SVG.events[uid] === 'object' && RGraph.SVG.events[uid].length > 0) {
	        for (var j = 0, len = RGraph.SVG.events[uid].length; j < len; ++j) {
	          if (RGraph.SVG.events[uid][j] && RGraph.SVG.events[uid][j].event === name) {
	            RGraph.SVG.events[uid][j].func(obj);
	          }
	        }
	      }
	    }
	  };

	  RGraph.SVG.removeAllCustomEventListeners = function () {
	    var uid = arguments[0];

	    if (uid && RGraph.SVG.events[uid]) {
	      RGraph.SVG.events[uid] = {};
	    } else {
	      RGraph.SVG.events = [];
	    }
	  };

	  RGraph.SVG.removeCustomEventListener = function (obj, i) {
	    if (typeof RGraph.SVG.events === 'object' && typeof RGraph.SVG.events[obj.uid] === 'object' && typeof RGraph.SVG.events[obj.uid][i] === 'object') {
	      RGraph.SVG.events[obj.uid][i] = null;
	    }
	  };

	  RGraph.SVG.removeHighlight = function (obj) {
	    var highlight = RGraph.SVG.REG.get('highlight');

	    if (highlight && RGraph.SVG.isArray(highlight) && highlight.length) {
	      for (var i = 0, len = highlight.length; i < len; ++i) {
	        if (highlight[i].parentNode) {
	          highlight[i].parentNode.removeChild(highlight[i]);
	        }
	      }
	    } else if (highlight && highlight.parentNode) {
	      if (obj.type === 'scatter') {
	        highlight.setAttribute('stroke0width', '0');
	        highlight.setAttribute('stroke', 'transparent');
	        highlight.setAttribute('fill', 'transparent');
	      } else {
	        highlight.parentNode.removeChild(highlight);
	      }
	    }
	  };

	  RGraph.SVG.redraw = function () {
	    if (arguments.length === 1) {
	      var svg = arguments[0];

	      if (svg.parentNode) {
	        RGraph.SVG.clear(svg);
	        var objects = RGraph.SVG.OR.get('id:' + svg.parentNode.id);

	        for (var i = 0, len = objects.length; i < len; ++i) {
	          RGraph.SVG.resetColorsToOriginalValues({
	            object: objects[i]
	          });
	          objects[i].draw();
	        }
	      }
	    } else {
	      var tags = RGraph.SVG.OR.tags();

	      for (var i in tags) {
	        RGraph.SVG.redraw(tags[i]);
	      }
	    }
	  };

	  RGraph.SVG.parseDate = function (str) {
	    var d = new Date();
	    var defaults = {
	      seconds: '00',
	      minutes: '00',
	      hours: '00',
	      date: d.getDate(),
	      month: d.getMonth() + 1,
	      year: d.getFullYear()
	    };
	    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
	        months_regex = months.join('|');

	    for (var i = 0; i < months.length; ++i) {
	      months[months[i]] = i;
	      months[months[i].substring(0, 3)] = i;
	      months_regex = months_regex + '|' + months[i].substring(0, 3);
	    }

	    var sep = '[-./_=+~#:;,]+';
	    var tokens = str.split(/ +/);

	    for (var i = 0, len = tokens.length; i < len; ++i) {
	      if (tokens[i]) {
	        if (tokens[i].match(/^\d\d\d\d$/)) {
	          defaults.year = tokens[i];
	        }

	        var res = isMonth(tokens[i]);

	        if (typeof res === 'number') {
	          defaults.month = res + 1;
	        }

	        if (tokens[i].match(/^\d?\d(?:st|nd|rd|th)?$/)) {
	          defaults.date = parseInt(tokens[i]);
	        }

	        if (tokens[i].match(/^(\d\d):(\d\d):?(?:(\d\d))?$/)) {
	          defaults.hours = parseInt(RegExp.$1);
	          defaults.minutes = parseInt(RegExp.$2);

	          if (RegExp.$3) {
	            defaults.seconds = parseInt(RegExp.$3);
	          }
	        }

	        if (tokens[i].match(new RegExp('^(\\d\\d\\d\\d)' + sep + '(\\d\\d)' + sep + '(\\d\\d)$', 'i'))) {
	          defaults.date = parseInt(RegExp.$3);
	          defaults.month = parseInt(RegExp.$2);
	          defaults.year = parseInt(RegExp.$1);
	        }

	        if (tokens[i].match(new RegExp('^(\\d\\d)' + sep + '(\\d\\d)' + sep + '(\\d\\d\\d\\d)$', 'i'))) {
	          defaults.date = parseInt(RegExp.$1);
	          defaults.month = parseInt(RegExp.$2);
	          defaults.year = parseInt(RegExp.$3);
	        }
	      }
	    }

	    str = '{1}/{2}/{3} {4}:{5}:{6}'.format(defaults.year, String(defaults.month).length === 1 ? '0' + defaults.month : defaults.month, String(defaults.date).length === 1 ? '0' + defaults.date : defaults.date, String(defaults.hours).length === 1 ? '0' + defaults.hours : defaults.hours, String(defaults.minutes).length === 1 ? '0' + defaults.minutes : defaults.minutes, String(defaults.seconds).length === 1 ? '0' + defaults.seconds : defaults.seconds);
	    return Date.parse(str);

	    function isMonth(str) {
	      var res = str.toLowerCase().match(months_regex);
	      return res ? months[res[0]] : false;
	    }
	  };

	  RGraph.SVG.OR.add = function (obj) {
	    RGraph.SVG.OR.objects.push(obj);
	    return obj;
	  };

	  RGraph.SVG.OR.get = function () {
	    if (typeof arguments[0] === 'string' && arguments[0].substr(0, 3).toLowerCase() === 'id:') {
	      var ret = [];

	      for (var i = 0; i < RGraph.SVG.OR.objects.length; ++i) {
	        if (RGraph.SVG.OR.objects[i] && RGraph.SVG.OR.objects[i].id === arguments[0].substr(3)) {
	          ret.push(RGraph.SVG.OR.objects[i]);
	        }
	      }

	      return ret;
	    }

	    if (typeof arguments[0] === 'string' && arguments[0].substr(0, 4).toLowerCase() === 'type') {
	      var ret = [];

	      for (var i = 0; i < RGraph.SVG.OR.objects.length; ++i) {
	        if (RGraph.SVG.OR.objects[i].type === arguments[0].substr(5)) {
	          ret.push(RGraph.SVG.OR.objects[i]);
	        }
	      }

	      return ret;
	    }

	    if (typeof arguments[0] === 'string' && arguments[0].substr(0, 3).toLowerCase() === 'uid') {
	      var ret = [];

	      for (var i = 0; i < RGraph.SVG.OR.objects.length; ++i) {
	        if (RGraph.SVG.OR.objects[i].uid === arguments[0].substr(4)) {
	          ret.push(RGraph.SVG.OR.objects[i]);
	        }
	      }

	      return ret;
	    }

	    return RGraph.SVG.OR.objects;
	  };

	  RGraph.SVG.OR.clear = function () {
	    if (typeof arguments[0] === 'string') {
	      for (var i = 0; i < RGraph.SVG.OR.objects.length; ++i) {
	        if (RGraph.SVG.OR.objects[i].id === arguments[0]) {
	          RGraph.SVG.OR.objects[i] = null;
	        }
	      }
	    } else if (typeof arguments[0] === 'object') {
	      for (var i = 0; i < RGraph.SVG.OR.objects.length; ++i) {
	        if (RGraph.SVG.OR.objects[i].uid === arguments[0].uid) {
	          RGraph.SVG.OR.objects[i] = null;
	        }
	      }
	    } else {
	      RGraph.SVG.OR.objects = [];
	    }
	  };

	  RGraph.SVG.OR.tags = function () {
	    var tags = [];

	    for (var i = 0; i < RGraph.SVG.OR.objects.length; ++i) {
	      if (RGraph.SVG.OR.objects[i] && !tags[RGraph.SVG.OR.objects[i].svg.parentNode.id]) {
	        tags[RGraph.SVG.OR.objects[i].svg.parentNode.id] = RGraph.SVG.OR.objects[i].svg;
	      }
	    }

	    return tags;
	  };

	  RGraph.SVG.getSVGXY = function (svg) {
	    var el = svg.parentNode;

	    if (svg.getBoundingClientRect) {
	      var rect = svg.getBoundingClientRect();
	      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	      return [rect.x + scrollLeft, rect.y + scrollTop];
	    }
	  };

	  RGraph.SVG.FX.update = function (func) {
	    win.requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.mozRequestAnimationFrame || function (func) {
	      setTimeout(func, 16.666);
	    };

	    win.requestAnimationFrame(func);
	  };

	  RGraph.SVG.FX.getEasingMultiplier = function (frames, frame) {
	    var multiplier = Math.pow(Math.sin(frame / frames * RGraph.SVG.TRIG.HALFPI), 3);
	    return multiplier;
	  };

	  RGraph.SVG.measureText = function (opt) {
	    var text = opt.text || '',
	        bold = opt.bold || false,
	        italic = opt.italic || false,
	        font = opt.font || 'sans-serif',
	        size = opt.size || 12,
	        str = text + ':' + italic + ':' + bold + ':' + font + ':' + size;

	    if (typeof RGraph.SVG.measuretext_cache === 'undefined') {
	      RGraph.SVG.measuretext_cache = [];
	    }

	    if (opt.cache !== false && typeof RGraph.SVG.measuretext_cache == 'object' && RGraph.SVG.measuretext_cache[str]) {
	      return RGraph.SVG.measuretext_cache[str];
	    }

	    if (!RGraph.SVG.measuretext_cache['text-span'] || opt.cache === false) {
	      var span = document.createElement('SPAN');
	      span.style.position = 'absolute';
	      span.style.padding = 0;
	      span.style.display = 'inline';
	      span.style.top = '-200px';
	      span.style.left = '-200px';
	      span.style.lineHeight = '1em';
	      document.body.appendChild(span);
	      RGraph.SVG.measuretext_cache['text-span'] = span;
	    } else if (RGraph.SVG.measuretext_cache['text-span']) {
	      var span = RGraph.SVG.measuretext_cache['text-span'];

	      while (span.firstChild) {
	        span.removeChild(span.firstChild);
	      }
	    }

	    span.insertAdjacentHTML('afterbegin', String(text).replace(/\r?\n/g, '<br />'));
	    span.style.fontFamily = font;
	    span.style.fontWeight = bold ? 'bold' : 'normal';
	    span.style.fontStyle = italic ? 'italic' : 'normal';
	    span.style.fontSize = String(size).replace(/pt$/, '') + 'pt';
	    var sizes = [span.offsetWidth, span.offsetHeight];
	    RGraph.SVG.measuretext_cache[str] = sizes;
	    return sizes;
	  };

	  RGraph.SVG.stringsToNumbers = function (str) {
	    var sep = arguments[1] || ',';

	    if (typeof str === 'string' && str.trim().match(/^\[ *\d+$/)) {
	      str = str.replace('[', '');
	    }

	    if (typeof str === 'number') {
	      return str;
	    }

	    if (typeof str === 'string') {
	      if (str.indexOf(sep) != -1) {
	        str = str.split(sep);
	      } else {
	        str = parseFloat(str);

	        if (isNaN(str)) {
	          str = null;
	        }
	      }
	    }

	    if (typeof str === 'object' && !RGraph.SVG.isNull(str)) {
	      for (var i = 0, len = str.length; i < len; i += 1) {
	        str[i] = RGraph.SVG.stringsToNumbers(str[i], sep);
	      }
	    }

	    return str;
	  };

	  RGraph.SVG.getAdjustedNumber = function (opt) {
	    var value = opt.value,
	        prop = opt.prop;

	    if (typeof prop === 'string' && match(/^(\+|-)([0-9.]+)/)) {
	      if (RegExp.$1 === '+') {
	        value += parseFloat(RegExp.$2);
	      } else if (RegExp.$1 === '-') {
	        value -= parseFloat(RegExp.$2);
	      }
	    }

	    return value;
	  };

	  RGraph.SVG.attribution = function () {
	    return;
	  };

	  RGraph.SVG.parseGradient = function (str) {};

	  RGraph.SVG.random = function (opt) {
	    var min = opt.min,
	        max = opt.max,
	        dp = opt.dp || opt.decimals || 0,
	        r = Math.random();
	    return Number(((max - min) * r + min).toFixed(dp));
	  };

	  RGraph.SVG.arrayRandom = function (opt) {
	    var num = opt.num,
	        min = opt.min,
	        max = opt.max,
	        dp = opt.dp || opt.decimals || 0;

	    for (var i = 0, arr = []; i < num; i += 1) {
	      arr.push(RGraph.SVG.random({
	        min: min,
	        max: max,
	        dp: dp
	      }));
	    }

	    return arr;
	  };

	  RGraph.SVG.commonSetter = function (opt) {
	    var obj = opt.object,
	        name = opt.name,
	        value = opt.value;

	    if (name === 'tooltipsEvent' && value !== 'click' && value !== 'mousemove') {
	      value = 'click';
	    }

	    return {
	      name: name,
	      value: value
	    };
	  };

	  RGraph.SVG.log = function (opt) {
	    var num = opt.num,
	        base = opt.base;
	    return Math.log(num) / (base ? Math.log(base) : 1);
	  };

	  RGraph.SVG.donut = function (opt) {
	    var arcPath1 = RGraph.SVG.TRIG.getArcPath3({
	      cx: opt.cx,
	      cy: opt.cy,
	      r: opt.outerRadius,
	      start: 0,
	      end: RGraph.SVG.TRIG.TWOPI,
	      anticlockwise: false,
	      lineto: false
	    });
	    var arcPath2 = RGraph.SVG.TRIG.getArcPath3({
	      cx: opt.cx,
	      cy: opt.cy,
	      r: opt.innerRadius,
	      start: RGraph.SVG.TRIG.TWOPI,
	      end: 0,
	      anticlockwise: true,
	      lineto: false
	    });
	    var path = RGraph.SVG.create({
	      svg: opt.svg,
	      type: 'path',
	      attr: {
	        d: arcPath1 + arcPath2,
	        stroke: opt.stroke || 'transparent',
	        fill: opt.fill || 'transparent',
	        opacity: typeof opt.opacity === 'number' ? opt.opacity : 1
	      }
	    });
	    return path;
	  };

	  RGraph.SVG.getGlobals = function (obj) {
	    var properties = obj.properties;

	    for (var i in RGraph.SVG.GLOBALS) {
	      if (typeof i === 'string') {
	        obj.set(i, RGraph.SVG.arrayClone(RGraph.SVG.GLOBALS[i]));
	      }
	    }
	  };

	  RGraph.SVG.link = function (opt) {
	    var a = RGraph.SVG.create({
	      svg: bar.svg,
	      type: 'a',
	      parent: bar.svg.all,
	      attr: {
	        'xlink:href': href,
	        target: target
	      }
	    });
	    var text = RGraph.SVG.create({
	      svg: bar.svg,
	      type: 'text',
	      parent: a,
	      attr: {
	        x: x,
	        y: y,
	        fill: fill
	      }
	    });
	    text.insertAdjacentHTML('afterbegin', String(text));
	  };

	  RGraph.SVG.getErrorbarsMaxValue = function (opt) {
	    var obj = opt.object,
	        properties = obj.properties,
	        index = opt.index;

	    if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNull(properties.errorbars) && typeof properties.errorbars[index] === 'number') {
	      var value = properties.errorbars[index];
	    } else if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNull(properties.errorbars) && typeof properties.errorbars[index] === 'object' && !RGraph.SVG.isNull(properties.errorbars[index]) && typeof properties.errorbars[index].max === 'number') {
	      var value = properties.errorbars[index].max;
	    } else {
	      var value = 0;
	    }

	    return value;
	  };

	  RGraph.SVG.getErrorbarsMinValue = function (opt) {
	    var obj = opt.object,
	        properties = obj.properties,
	        index = opt.index;

	    if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNull(properties.errorbars) && typeof properties.errorbars[index] === 'object' && !RGraph.SVG.isNull(properties.errorbars[index]) && typeof properties.errorbars[index].min === 'number') {
	      var value = properties.errorbars[index].min;
	    } else {
	      var value = null;
	    }

	    return value;
	  };

	  RGraph.SVG.getErrorbarsColor = function (opt) {
	    var obj = opt.object,
	        properties = obj.properties,
	        index = opt.index;
	    var color = properties.errorbarsColor || 'black';

	    if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNull(properties.errorbars) && typeof properties.errorbars[index] === 'object' && !RGraph.SVG.isNull(properties.errorbars[index]) && typeof properties.errorbars[index].color === 'string') {
	      color = properties.errorbars[index].color;
	    }

	    return color;
	  };

	  RGraph.SVG.getErrorbarsLinewidth = function (opt) {
	    var obj = opt.object,
	        properties = obj.properties,
	        index = opt.index;
	    var linewidth = properties.errorbarsLinewidth || 1;

	    if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNull(properties.errorbars) && typeof properties.errorbars[index] === 'object' && !RGraph.SVG.isNull(properties.errorbars[index]) && typeof properties.errorbars[index].linewidth === 'number') {
	      linewidth = properties.errorbars[index].linewidth;
	    }

	    return linewidth;
	  };

	  RGraph.SVG.getErrorbarsCapWidth = function (opt) {
	    var obj = opt.object,
	        properties = obj.properties,
	        index = opt.index;
	    var capwidth = properties.errorbarsCapwidth || 10;

	    if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNull(properties.errorbars) && typeof properties.errorbars[index] === 'object' && !RGraph.SVG.isNull(properties.errorbars[index]) && typeof properties.errorbars[index].capwidth === 'number') {
	      capwidth = properties.errorbars[index].capwidth;
	    }

	    return capwidth;
	  };

	  RGraph.SVG.propertyNameAlias = function () {};

	  if (typeof RGraph.SVG.tooltip !== 'function') {
	    RGraph.SVG.tooltip = function () {
	      $a('The tooltip library has not been included!');
	    };
	  }

	  RGraph.SVG.responsive = function (conf) {
	    var obj = this;
	    conf.sort(function (a, b) {
	      var aNull = RGraph.SVG.isNull(a.maxWidth);
	      var bNull = RGraph.SVG.isNull(b.maxWidth);
	      if (aNull && bNull) return 0;
	      if (aNull && !bNull) return -1;
	      if (!aNull && bNull) return 1;
	      return b.maxWidth - a.maxWidth;
	    });

	    for (var i = 0; i < conf.length; ++i) {
	      if (conf[i + 1] && typeof conf[i + 1].maxWidth === 'number') {
	        conf[i].minWidth = conf[i + 1].maxWidth;
	      } else if (!conf[i + 1]) {
	        conf[i].minWidth = 0;
	      }
	    }

	    for (var i = 0; i < conf.length; ++i) {
	      conf[i].minWidth = RGraph.SVG.isNull(conf[i].minWidth) ? 0 : conf[i].minWidth;
	      conf[i].maxWidth = RGraph.SVG.isNull(conf[i].maxWidth) ? 100000 : conf[i].maxWidth;
	      var str = 'screen and (min-width: %1px) and (max-width: %2px)'.format(conf[i].minWidth, conf[i].maxWidth);
	      var mediaQuery = window.matchMedia(str);

	      (function (index) {
	        mediaQuery.addListener(function (e) {
	          if (e.matches) {
	            matchFunction(conf[index]);
	          }
	        });
	      })(i);

	      if (document.documentElement.clientWidth >= conf[i].minWidth && document.documentElement.clientWidth < conf[i].maxWidth) {
	        matchFunction(conf[i]);
	      }
	    }

	    function matchFunction(rule) {
	      if (typeof rule.width === 'number') {
	        obj.svg.setAttribute('width', rule.width);
	        obj.container.style.width = rule.width + 'px';
	      }

	      if (typeof rule.height === 'number') {
	        obj.svg.setAttribute('height', rule.height);
	        obj.container.style.height = rule.height + 'px';
	      }

	      if (typeof rule.options === 'object') {
	        for (var j in rule.options) {
	          if (typeof j === 'string') {
	            obj.set(j, rule.options[j]);
	          }
	        }
	      }

	      var setCSS = function (el, name, value) {
	        var replacements = [['float', 'cssFloat']];

	        for (var i = 0; i < replacements.length; ++i) {
	          if (name === replacements[i][0]) {
	            name = replacements[i][1];
	          }
	        }

	        el.style[name] = value;
	      };

	      if (typeof rule.css === 'object') {
	        for (var j in rule.css) {
	          if (typeof j === 'string') {
	            setCSS(obj.svg.parentNode, j, rule.css[j]);
	          }
	        }
	      }

	      if (typeof rule.parentCss === 'object') {
	        for (var j in rule.parentCss) {
	          if (typeof j === 'string') {
	            setCSS(obj.svg.parentNode.parentNode, j, rule.parentCss[j]);
	          }
	        }
	      }

	      RGraph.SVG.redraw();

	      if (typeof rule.callback === 'function') {
	        rule.callback(obj);
	      }
	    }

	    return obj;
	  };

	  RGraph.SVG.responsiveOld = function (conf) {
	    var opt = arguments[1] || {},
	        obj = this,
	        func = null,
	        timer = null;
	    opt.delay = typeof opt.delay === 'number' ? opt.delay : 200;

	    var func = function () {
	      var matched = false;

	      for (var i = 0; i < conf.length; ++i) {
	        if (!matched && (document.documentElement.clientWidth <= conf[i].maxWidth || RGraph.SVG.isNull(conf[i].maxWidth))) {
	          matched = true;

	          if (typeof conf[i].width === 'number') {
	            obj.svg.setAttribute('width', conf[i].width);
	            obj.container.style.width = conf[i].width + 'px';
	          }

	          if (typeof conf[i].height === 'number') {
	            obj.svg.setAttribute('height', conf[i].height);
	            obj.container.style.height = conf[i].height + 'px';
	          }

	          if (typeof conf[i].options === 'object' && typeof conf[i].options === 'object') {
	            for (var j in conf[i].options) {
	              if (typeof j === 'string') {
	                obj.set(j, conf[i].options[j]);
	              }
	            }
	          }

	          var setCSS = function (el, name, value) {
	            var replacements = [['float', 'cssFloat']];

	            for (var i = 0; i < replacements.length; ++i) {
	              if (name === replacements[i][0]) {
	                name = replacements[i][1];
	              }
	            }

	            el.style[name] = value;
	          };

	          if (typeof conf[i].css === 'object') {
	            for (var j in conf[i].css) {
	              if (typeof j === 'string') {
	                setCSS(obj.svg.parentNode, j, conf[i].css[j]);
	              }
	            }
	          }

	          if (typeof conf[i].parentCss === 'object') {
	            for (var j in conf[i].parentCss) {
	              if (typeof j === 'string') {
	                setCSS(obj.svg.parentNode.parentNode, j, conf[i].parentCss[j]);
	              }
	            }
	          }

	          RGraph.SVG.redraw();

	          if (typeof conf[i].callback === 'function') {
	            conf[i].callback(obj);
	          }
	        }
	      }
	    };

	    window.addEventListener('resize', function () {
	      if (opt.delay > 0) {
	        clearTimeout(timer);
	        timer = setTimeout(func, opt.delay);
	      } else {
	        func();
	      }
	    });
	    func();
	    return obj;
	  };

	  RGraph.SVG.getTextConf = function (args) {
	    var obj = args.object,
	        properties = obj.properties,
	        prefix = args.prefix;
	    var font = typeof properties[prefix + 'Font'] === 'string' ? properties[prefix + 'Font'] : properties.textFont,
	        size = typeof properties[prefix + 'Size'] === 'number' ? properties[prefix + 'Size'] : properties.textSize,
	        color = typeof properties[prefix + 'Color'] === 'string' ? properties[prefix + 'Color'] : properties.textColor,
	        bold = typeof properties[prefix + 'Bold'] === 'boolean' ? properties[prefix + 'Bold'] : properties.textBold,
	        italic = typeof properties[prefix + 'Italic'] === 'boolean' ? properties[prefix + 'Italic'] : properties.textItalic;
	    return {
	      font: font,
	      size: size,
	      color: color,
	      bold: bold,
	      italic: italic
	    };
	  };

	  RGraph.SVG.labelSubstitution = function (args) {
	    var text = String(args.text);

	    if (!text.match(/%{.*?}/)) {
	      return text;
	    }

	    var text = text.replace(/%%/g, '___--PERCENT--___');
	    text = text.replace(/%{index}/g, args.index);
	    var reg = /%{prop(?:erty)?:([_a-z0-9]+)\[([0-9]+)\]}/i;

	    while (text.match(reg)) {
	      var property = RegExp.$1,
	          index = parseInt(RegExp.$2);

	      if (args.object.properties[property]) {
	        text = text.replace(reg, args.object.properties[property][index] || '');
	      } else {
	        text = text.replace(reg, '');
	      }

	      RegExp.lastIndex = null;
	    }

	    while (text.match(/%{property:([_a-z0-9]+)}/i)) {
	      var str = '%{property:' + RegExp.$1 + '}';
	      text = text.replace(str, args.object.properties[RegExp.$1]);
	    }

	    while (text.match(/%{prop:([_a-z0-9]+)}/i)) {
	      var str = '%{prop:' + RegExp.$1 + '}';
	      text = text.replace(str, args.object.properties[RegExp.$1]);
	    }

	    while (text.match(/%{value(?:_formatted)?}/i)) {
	      var value = args.value;

	      if (text.match(/%{value_formatted}/i)) {
	        text = text.replace('%{value_formatted}', typeof value === 'number' ? RGraph.SVG.numberFormat({
	          object: args.object,
	          num: value.toFixed(args.decimals),
	          thousand: args.thousand || ',',
	          point: args.point || '.',
	          prepend: args.unitsPre || '',
	          append: args.unitsPost || ''
	        }) : null);
	      } else {
	        text = text.replace('%{value}', value);
	      }
	    }

	    var reg = /%{global:([_a-z0-9.]+)\[([0-9]+)\]}/i;

	    while (text.match(reg)) {
	      var name = RegExp.$1,
	          index = parseInt(RegExp.$2);

	      if (eval(name)[index]) {
	        text = text.replace(reg, eval(name)[index] || '');
	      } else {
	        text = text.replace(reg, '');
	      }

	      RegExp.lastIndex = null;
	    }

	    var reg = /%{global:([_a-z0-9.]+)}/i;

	    while (text.match(reg)) {
	      var name = RegExp.$1;

	      if (eval(name)) {
	        text = text.replace(reg, eval(name) || '');
	      } else {
	        text = text.replace(reg, '');
	      }

	      RegExp.lastIndex = null;
	    }

	    var regexp = /%{function:([_A-Za-z0-9]+)\((.*?)\)}/;
	    text = text.replace(/\r/, '|CR|');
	    text = text.replace(/\n/, '|LF|');

	    while (text.match(regexp)) {
	      var str = RegExp.$1 + '(' + RegExp.$2 + ')';

	      for (var i = 0, len = str.length; i < len; ++i) {
	        str = str.replace(/\r?\n/, "\\n");
	      }

	      RGraph.SVG.REG.set('label-templates-function-object', args.object);
	      var func = new Function('return ' + str);
	      var ret = func();
	      text = text.replace(regexp, ret);
	    }

	    text = text.replace(/\|CR\|/, ' ');
	    text = text.replace(/\|LF\|/, ' ');
	    text = text.replace(/___--PERCENT--___/g, '%');
	    return text.toString();
	  };
	})(window, document);

	window.$p = function (obj) {
	  var indent = arguments[2] ? arguments[2] : '    ';
	  var str = '';
	  var counter = typeof arguments[3] == 'number' ? arguments[3] : 0;

	  if (counter >= 5) {
	    return '';
	  }

	  switch (typeof obj) {
	    case 'string':
	      str += obj + ' (' + typeof obj + ', ' + obj.length + ')';
	      break;

	    case 'number':
	      str += obj + ' (' + typeof obj + ')';
	      break;

	    case 'boolean':
	      str += obj + ' (' + typeof obj + ')';
	      break;

	    case 'function':
	      str += 'function () {}';
	      break;

	    case 'undefined':
	      str += 'undefined';
	      break;

	    case 'null':
	      str += 'null';
	      break;

	    case 'object':
	      if (RGraph.SVG.isNull(obj)) {
	        str += indent + 'null\n';
	      } else {
	        str += indent + 'Object {' + '\n';

	        for (j in obj) {
	          str += indent + '    ' + j + ' => ' + window.$p(obj[j], true, indent + '    ', counter + 1) + '\n';
	        }

	        str += indent + '}';
	      }

	      break;

	    default:
	      str += 'Unknown type: ' + typeof obj + '';
	      break;
	  }

	  if (!arguments[1]) {
	    alert(str);
	  }

	  return str;
	};

	window.$a = function (v) {
	  alert(v);
	};

	window.$c = window.$cl = function (v) {
	  return console.log(v);
	};

	String.prototype.format = function () {
	  if (arguments.length === 0) {
	    var s = this;

	    if (s.match(/{[a-z0-9]+?}/i)) {
	      var s = this.replace(/{[a-z0-9]+?}/gi, function (str, idx) {
	        str = str.substr(1);
	        str = str.substr(0, str.length - 1);
	        return window[str];
	      });
	    }

	    return s;
	  }

	  var args = arguments;
	  var s = this.replace(/{(\d+)}/g, function (str, idx) {
	    return typeof args[idx - 1] !== 'undefined' ? args[idx - 1] : str;
	  });
	  s = s.replace(/(?:%|\\)%(\d)/g, '__PPEERRCCEENNTT__$1');
	  s = s.replace(/%(\d+)/g, function (str, idx) {
	    return typeof args[idx - 1] !== 'undefined' ? args[idx - 1] : str;
	  });
	  return s.replace('__PPEERRCCEENNTT__', '%');
	};

	RGraph.SVG.isString = function (obj) {
	  return typeof obj === 'string';
	};

	RGraph.SVG.isNumber = function (obj) {
	  return typeof obj === 'number';
	};

	RGraph.SVG.isObject = function (obj) {
	  return typeof obj === 'object' && obj.constructor.toString().toLowerCase().indexOf('object') > 0;
	};

	RGraph.SVG.isFunction = function (obj) {
	  return typeof obj === 'function';
	};

	RGraph.SVG.isUndefined = function (obj) {
	  return typeof obj === 'undefined';
	};

})));
