(function (factory) {
	typeof define === 'function' && define.amd ? define('rGraphSvgBar', factory) :
	factory();
}((function () { 'use strict';

	RGraph = window.RGraph || {
	  isrgraph: true,
	  isRGraph: true,
	  rgraph: true
	};
	RGraph.SVG = RGraph.SVG || {};

	(function (win, doc, undefined$1) {
	  RGraph.SVG.Bar = function (conf) {
	    this.set = function (name, value) {
	      if (arguments.length === 1 && typeof name === 'object') {
	        for (i in arguments[0]) {
	          if (typeof i === 'string') {
	            name = ret.name;
	            value = ret.value;
	            this.set(name, value);
	          }
	        }
	      } else {
	        var ret = RGraph.SVG.commonSetter({
	          object: this,
	          name: name,
	          value: value
	        });
	        name = ret.name;
	        value = ret.value;
	        this.properties[name] = value;

	        if (name === 'colors') {
	          this.originalColors = RGraph.SVG.arrayClone(value);
	          this.colorsParsed = false;
	        }
	      }

	      return this;
	    };

	    this.get = function (name) {
	      return this.properties[name];
	    };

	    this.id = conf.id;
	    this.uid = RGraph.SVG.createUID();
	    this.container = document.getElementById(this.id);
	    this.layers = {};
	    this.svg = RGraph.SVG.createSVG({
	      object: this,
	      container: this.container
	    });
	    this.isRGraph = true;
	    this.isrgraph = true;
	    this.rgraph = true;
	    this.data = conf.data;
	    this.type = 'bar';
	    this.coords = [];
	    this.coords2 = [];
	    this.stackedBackfaces = [];
	    this.originalColors = {};
	    this.gradientCounter = 1;
	    this.firstDraw = true;
	    this.data = RGraph.SVG.stringsToNumbers(this.data);
	    RGraph.SVG.OR.add(this);
	    this.container.style.display = 'inline-block';
	    this.properties = {
	      marginLeft: 35,
	      marginRight: 35,
	      marginTop: 35,
	      marginBottom: 35,
	      variant: null,
	      variant3dOffsetx: 10,
	      variant3dOffsety: 5,
	      backgroundColor: null,
	      backgroundImage: null,
	      backgroundImageAspect: 'none',
	      backgroundImageStretch: true,
	      backgroundImageOpacity: null,
	      backgroundImageX: null,
	      backgroundImageY: null,
	      backgroundImageW: null,
	      backgroundImageH: null,
	      backgroundGrid: true,
	      backgroundGridColor: '#ddd',
	      backgroundGridLinewidth: 1,
	      backgroundGridHlines: true,
	      backgroundGridHlinesCount: null,
	      backgroundGridVlines: true,
	      backgroundGridVlinesCount: null,
	      backgroundGridBorder: true,
	      backgroundGridDashed: false,
	      backgroundGridDotted: false,
	      backgroundGridDashArray: null,
	      colors: ['red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0', 'pink', 'orange', 'gray', 'black', 'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0', 'pink', 'orange', 'gray', 'black'],
	      colorsSequential: false,
	      colorsStroke: 'rgba(0,0,0,0)',
	      errorbars: null,
	      marginInner: 3,
	      marginInnerGrouped: 2,
	      marginInnerLeft: 0,
	      marginInnerRight: 0,
	      yaxis: true,
	      yaxisTickmarks: true,
	      yaxisTickmarksLength: 3,
	      yaxisColor: 'black',
	      yaxisScale: true,
	      yaxisLabels: null,
	      yaxisLabelsFont: null,
	      yaxisLabelsSize: null,
	      yaxisLabelsColor: null,
	      yaxisLabelsBold: null,
	      yaxisLabelsItalic: null,
	      yaxisLabelsOffsetx: 0,
	      yaxisLabelsOffsety: 0,
	      yaxisLabelsCount: 5,
	      yaxisScaleUnitsPre: '',
	      yaxisScaleUnitsPost: '',
	      yaxisScaleStrict: false,
	      yaxisScaleDecimals: 0,
	      yaxisScalePoint: '.',
	      yaxisScaleThousand: ',',
	      yaxisScaleRound: false,
	      yaxisScaleMax: null,
	      yaxisScaleMin: 0,
	      yaxisScaleFormatter: null,
	      yaxisTitle: '',
	      yaxisTitleBold: null,
	      yaxisTitleSize: null,
	      yaxisTitleFont: null,
	      yaxisTitleColor: null,
	      yaxisTitleItalic: null,
	      yaxisTitleOffsetx: 0,
	      yaxisTitleOffsety: 0,
	      yaxisTitleX: null,
	      yaxisTitleY: null,
	      yaxisTitleHalign: null,
	      yaxisTitleValign: null,
	      xaxis: true,
	      xaxisTickmarks: true,
	      xaxisTickmarksLength: 5,
	      xaxisLabels: null,
	      xaxisLabelsFont: null,
	      xaxisLabelsSize: null,
	      xaxisLabelsColor: null,
	      xaxisLabelsBold: null,
	      xaxisLabelsItalic: null,
	      xaxisLabelsPosition: 'section',
	      xaxisLabelsPositionSectionTickmarksCount: null,
	      xaxisLabelsOffsetx: 0,
	      xaxisLabelsOffsety: 0,
	      xaxisLabelsFormattedDecimals: 0,
	      xaxisLabelsFormattedPoint: '.',
	      xaxisLabelsFormattedThousand: ',',
	      xaxisLabelsFormattedUnitsPre: '',
	      xaxisLabelsFormattedUnitsPost: '',
	      xaxisColor: 'black',
	      xaxisTitle: '',
	      xaxisTitleBold: null,
	      xaxisTitleSize: null,
	      xaxisTitleFont: null,
	      xaxisTitleColor: null,
	      xaxisTitleItalic: null,
	      xaxisTitleOffsetx: 0,
	      xaxisTitleOffsety: 0,
	      xaxisTitleX: null,
	      xaxisTitleY: null,
	      xaxisTitleHalign: null,
	      xaxisTitleValign: null,
	      labelsAbove: false,
	      labelsAboveFont: null,
	      labelsAboveSize: null,
	      labelsAboveBold: null,
	      labelsAboveItalic: null,
	      labelsAboveColor: null,
	      labelsAboveBackground: null,
	      labelsAboveBackgroundPadding: 0,
	      labelsAboveUnitsPre: null,
	      labelsAboveUnitsPost: null,
	      labelsAbovePoint: null,
	      labelsAboveThousand: null,
	      labelsAboveFormatter: null,
	      labelsAboveDecimals: null,
	      labelsAboveOffsetx: 0,
	      labelsAboveOffsety: 0,
	      labelsAboveHalign: 'center',
	      labelsAboveValign: 'bottom',
	      labelsAboveSpecific: null,
	      textColor: 'black',
	      textFont: 'Arial, Verdana, sans-serif',
	      textSize: 12,
	      textBold: false,
	      textItalic: false,
	      linewidth: 1,
	      grouping: 'grouped',
	      tooltips: null,
	      tooltipsOverride: null,
	      tooltipsEffect: 'fade',
	      tooltipsCssClass: 'RGraph_tooltip',
	      tooltipsCss: null,
	      tooltipsEvent: 'click',
	      tooltipsFormattedThousand: ',',
	      tooltipsFormattedPoint: '.',
	      tooltipsFormattedDecimals: 0,
	      tooltipsFormattedUnitsPre: '',
	      tooltipsFormattedUnitsPost: '',
	      tooltipsFormattedKeyColors: null,
	      tooltipsFormattedKeyColorsShape: 'square',
	      tooltipsFormattedKeyLabels: [],
	      tooltipsFormattedTableHeaders: null,
	      tooltipsFormattedTableData: null,
	      tooltipsPointer: true,
	      tooltipsPositionStatic: true,
	      highlightStroke: 'rgba(0,0,0,0)',
	      highlightFill: 'rgba(255,255,255,0.7)',
	      highlightLinewidth: 1,
	      title: '',
	      titleX: null,
	      titleY: null,
	      titleHalign: 'center',
	      titleSize: null,
	      titleColor: null,
	      titleFont: null,
	      titleBold: null,
	      titleItalic: null,
	      titleSubtitle: null,
	      titleSubtitleSize: null,
	      titleSubtitleColor: '#aaa',
	      titleSubtitleFont: null,
	      titleSubtitleBold: null,
	      titleSubtitleItalic: null,
	      shadow: false,
	      shadowOffsetx: 2,
	      shadowOffsety: 2,
	      shadowBlur: 2,
	      shadowOpacity: 0.25,
	      errorbars: null,
	      errorbarsColor: 'black',
	      errorbarsLinewidth: 1,
	      errorbarsCapwidth: 10,
	      key: null,
	      keyColors: null,
	      keyOffsetx: 0,
	      keyOffsety: 0,
	      keyLabelsOffsetx: 0,
	      keyLabelsOffsety: -1,
	      keyLabelsColor: null,
	      keyLabelsSize: null,
	      keyLabelsBold: null,
	      keyLabelsItalic: null,
	      keyLabelsFont: null
	    };
	    RGraph.SVG.getGlobals(this);

	    if (RGraph.SVG.FX && typeof RGraph.SVG.FX.decorate === 'function') {
	      RGraph.SVG.FX.decorate(this);
	    }

	    this.responsive = RGraph.SVG.responsive;
	    var properties = this.properties;

	    this.draw = function () {
	      RGraph.SVG.fireCustomEvent(this, 'onbeforedraw');
	      this.width = Number(this.svg.getAttribute('width'));
	      this.height = Number(this.svg.getAttribute('height'));

	      if (properties.variant !== '3d') {
	        properties.variant3dOffsetx = 0;
	        properties.variant3dOffsety = 0;
	      } else {
	        this.svg.all.setAttribute('transform', 'skewY(5)');
	      }

	      RGraph.SVG.createDefs(this);
	      this.coords = [];
	      this.coords2 = [];
	      this.graphWidth = this.width - properties.marginLeft - properties.marginRight;
	      this.graphHeight = this.height - properties.marginTop - properties.marginBottom;
	      this.data_seq = RGraph.SVG.arrayLinearize(this.data);

	      if (properties.errorbars) {
	        for (var i = 0; i < this.data_seq.length; ++i) {
	          if (typeof properties.errorbars[i] === 'undefined' || RGraph.SVG.isNull(properties.errorbars[i])) {
	            properties.errorbars[i] = {
	              max: null,
	              min: null
	            };
	          } else if (typeof properties.errorbars[i] === 'number') {
	            properties.errorbars[i] = {
	              min: properties.errorbars[i],
	              max: properties.errorbars[i]
	            };
	          } else if (typeof properties.errorbars[i] === 'object' && typeof properties.errorbars[i].max === 'undefined') {
	            properties.errorbars[i].max = null;
	          } else if (typeof properties.errorbars[i] === 'object' && typeof properties.errorbars[i].min === 'undefined') {
	            properties.errorbars[i].min = null;
	          }
	        }
	      }

	      RGraph.SVG.resetColorsToOriginalValues({
	        object: this
	      });
	      this.parseColors();
	      var values = [];

	      for (var i = 0, max = 0; i < this.data.length; ++i) {
	        if (properties.errorbars && typeof properties.errorbars[i] === 'number') {
	          var errorbar = properties.errorbars[i];
	        } else if (properties.errorbars && typeof properties.errorbars[i] === 'object' && typeof properties.errorbars[i].max === 'number') {
	          var errorbar = properties.errorbars[i].max;
	        } else {
	          var errorbar = 0;
	        }

	        if (typeof this.data[i] === 'number') {
	          values.push(this.data[i] + errorbar);
	        } else if (RGraph.SVG.isArray(this.data[i]) && properties.grouping === 'grouped') {
	          values.push(RGraph.SVG.arrayMax(this.data[i]) + errorbar);
	        } else if (RGraph.SVG.isArray(this.data[i]) && properties.grouping === 'stacked') {
	          values.push(RGraph.SVG.arraySum(this.data[i]) + errorbar);
	        }
	      }

	      var max = RGraph.SVG.arrayMax(values);

	      if (typeof properties.yaxisScaleMax === 'number') {
	        max = properties.yaxisScaleMax;
	      }

	      if (properties.yaxisScaleMin === 'mirror' || properties.yaxisScaleMin === 'middle' || properties.yaxisScaleMin === 'center') {
	        this.mirrorScale = true;
	        var mirrorScale = true;
	        properties.yaxisScaleMin = 0;
	      }

	      this.scale = RGraph.SVG.getScale({
	        object: this,
	        numlabels: properties.yaxisLabelsCount,
	        unitsPre: properties.yaxisScaleUnitsPre,
	        unitsPost: properties.yaxisScaleUnitsPost,
	        max: max,
	        min: properties.yaxisScaleMin,
	        point: properties.yaxisScalePoint,
	        round: properties.yaxisScaleRound,
	        thousand: properties.yaxisScaleThousand,
	        decimals: properties.yaxisScaleDecimals,
	        strict: typeof properties.yaxisScaleMax === 'number',
	        formatter: properties.yaxisScaleFormatter
	      });

	      if (mirrorScale) {
	        this.scale = RGraph.SVG.getScale({
	          object: this,
	          numlabels: properties.yaxisLabelsCount,
	          unitsPre: properties.yaxisScaleUnitsPre,
	          unitsPost: properties.yaxisScaleUnitsPost,
	          max: this.scale.max,
	          min: this.scale.max * -1,
	          point: properties.yaxisScalePoint,
	          round: false,
	          thousand: properties.yaxisScaleThousand,
	          decimals: properties.yaxisScaleDecimals,
	          strict: typeof properties.yaxisScaleMax === 'number',
	          formatter: properties.yaxisScaleFormatter
	        });
	      }

	      this.max = this.scale.max;
	      this.min = this.scale.min;
	      RGraph.SVG.drawBackground(this);

	      if (properties.variant === '3d') {
	        RGraph.SVG.create({
	          svg: this.svg,
	          parent: this.svg.all,
	          type: 'path',
	          attr: {
	            d: 'M {1} {2} L {3} {4} L {5} {6} L {7} {8}'.format(properties.marginLeft, properties.marginTop, properties.marginLeft + properties.variant3dOffsetx, properties.marginTop - properties.variant3dOffsety, properties.marginLeft + properties.variant3dOffsetx, this.height - properties.marginBottom - properties.variant3dOffsety, properties.marginLeft, this.height - properties.marginBottom, properties.marginLeft, properties.marginTop),
	            fill: '#ddd',
	            stroke: '#ccc'
	          }
	        });
	        this.threed_xaxis_group = RGraph.SVG.create({
	          svg: this.svg,
	          type: 'g',
	          parent: this.svg.all,
	          attr: {
	            className: 'rgraph_3d_bar_xaxis_negative'
	          }
	        });
	        RGraph.SVG.create({
	          svg: this.svg,
	          parent: this.svg.all,
	          type: 'path',
	          attr: {
	            d: 'M {1} {2} L {3} {4} L {5} {6} L {7} {8}'.format(properties.marginLeft, this.getYCoord(0), properties.marginLeft + properties.variant3dOffsetx, this.getYCoord(0) - properties.variant3dOffsety, this.width - properties.marginRight + properties.variant3dOffsetx, this.getYCoord(0) - properties.variant3dOffsety, this.width - properties.marginRight, this.getYCoord(0), properties.marginLeft, this.getYCoord(0)),
	            fill: '#ddd',
	            stroke: '#ccc'
	          }
	        });
	      }

	      this.drawBars();

	      if (properties.xaxisLabels && properties.xaxisLabels.length) {
	        if (typeof properties.xaxisLabels === 'string') {
	          properties.xaxisLabels = RGraph.SVG.arrayPad({
	            array: [],
	            length: this.data.length,
	            value: properties.xaxisLabels
	          });
	        }

	        for (var i = 0; i < properties.xaxisLabels.length; ++i) {
	          properties.xaxisLabels[i] = RGraph.SVG.labelSubstitution({
	            object: this,
	            text: properties.xaxisLabels[i],
	            index: i,
	            value: this.data[i],
	            decimals: properties.xaxisLabelsFormattedDecimals || 0,
	            unitsPre: properties.xaxisLabelsFormattedUnitsPre || '',
	            unitsPost: properties.xaxisLabelsFormattedUnitsPost || '',
	            thousand: properties.xaxisLabelsFormattedThousand || ',',
	            point: properties.xaxisLabelsFormattedPoint || '.'
	          });
	        }
	      }

	      RGraph.SVG.drawXAxis(this);
	      RGraph.SVG.drawYAxis(this);
	      this.drawLabelsAbove();

	      if (typeof properties.key !== null && RGraph.SVG.drawKey) {
	        RGraph.SVG.drawKey(this);
	      } else if (!RGraph.SVG.isNull(properties.key)) {
	        alert('The drawKey() function does not exist - have you forgotten to include the key library?');
	      }

	      if (this.firstDraw) {
	        this.firstDraw = false;
	        RGraph.SVG.fireCustomEvent(this, 'onfirstdraw');
	      }

	      RGraph.SVG.fireCustomEvent(this, 'ondraw');
	      return this;
	    };

	    this.drawBars = function () {
	      var y = this.getYCoord(0);

	      if (properties.shadow) {
	        RGraph.SVG.setShadow({
	          object: this,
	          offsetx: properties.shadowOffsetx,
	          offsety: properties.shadowOffsety,
	          blur: properties.shadowBlur,
	          opacity: properties.shadowOpacity,
	          id: 'dropShadow'
	        });
	      }

	      for (var i = 0, sequentialIndex = 0; i < this.data.length; ++i, ++sequentialIndex) {
	        if (typeof this.data[i] === 'number') {
	          var outerSegment = (this.graphWidth - properties.marginInnerLeft - properties.marginInnerRight) / this.data.length,
	              height = (Math.abs(this.data[i]) - Math.abs(this.scale.min)) / (Math.abs(this.scale.max) - Math.abs(this.scale.min)) * this.graphHeight,
	              width = (this.graphWidth - properties.marginInnerLeft - properties.marginInnerRight) / this.data.length - properties.marginInner - properties.marginInner,
	              x = properties.marginLeft + properties.marginInner + properties.marginInnerLeft + outerSegment * i;

	          if (this.scale.min >= 0 && this.scale.max > 0) {
	            y = this.getYCoord(this.scale.min) - height;
	          } else if (this.scale.min < 0 && this.scale.max > 0) {
	            height = Math.abs(this.data[i]) / (this.scale.max - this.scale.min) * this.graphHeight;
	            y = this.getYCoord(0) - height;

	            if (this.data[i] < 0) {
	              y = this.getYCoord(0);
	            }
	          } else if (this.scale.min < 0 && this.scale.max < 0) {
	            height = (Math.abs(this.data[i]) - Math.abs(this.scale.max)) / (Math.abs(this.scale.min) - Math.abs(this.scale.max)) * this.graphHeight;
	            y = properties.marginTop;
	          }

	          var rect = RGraph.SVG.create({
	            svg: this.svg,
	            type: 'rect',
	            parent: properties.variant === '3d' && this.data[i] < 0 ? this.threed_xaxis_group : this.svg.all,
	            attr: {
	              stroke: properties.colorsStroke,
	              fill: properties.colorsSequential ? properties.colors[sequentialIndex] ? properties.colors[sequentialIndex] : properties.colors[properties.colors.length - 1] : properties.colors[0],
	              x: x,
	              y: y,
	              width: width < 0 ? 0 : width,
	              height: height,
	              'stroke-width': properties.linewidth,
	              'data-original-x': x,
	              'data-original-y': y,
	              'data-original-width': width,
	              'data-original-height': height,
	              'data-tooltip': !RGraph.SVG.isNull(properties.tooltips) && properties.tooltips.length ? properties.tooltips[i] : '',
	              'data-index': i,
	              'data-sequential-index': sequentialIndex,
	              'data-value': this.data[i],
	              filter: properties.shadow ? 'url(#dropShadow)' : ''
	            }
	          });
	          this.drawErrorbar({
	            object: this,
	            element: rect,
	            index: i,
	            value: this.data[i],
	            type: 'normal'
	          });
	          this.coords.push({
	            object: this,
	            element: rect,
	            x: parseFloat(rect.getAttribute('x')),
	            y: parseFloat(rect.getAttribute('y')),
	            width: parseFloat(rect.getAttribute('width')),
	            height: parseFloat(rect.getAttribute('height'))
	          });

	          if (!this.coords2[0]) {
	            this.coords2[0] = [];
	          }

	          this.coords2[0].push({
	            object: this,
	            element: rect,
	            x: parseFloat(rect.getAttribute('x')),
	            y: parseFloat(rect.getAttribute('y')),
	            width: parseFloat(rect.getAttribute('width')),
	            height: parseFloat(rect.getAttribute('height'))
	          });

	          if (properties.variant === '3d') {
	            this.drawTop3dFace({
	              rect: rect,
	              value: this.data[i]
	            });
	            this.drawSide3dFace({
	              rect: rect,
	              value: this.data[i]
	            });
	          }

	          if (!RGraph.SVG.isNull(properties.tooltips) && (!RGraph.SVG.isNull(properties.tooltips[sequentialIndex]) || typeof properties.tooltips === 'string')) {
	            var obj = this;

	            (function (idx, seq) {
	              rect.addEventListener(properties.tooltipsEvent.replace(/^on/, ''), function (e) {
	                obj.removeHighlight();
	                RGraph.SVG.tooltip({
	                  object: obj,
	                  index: idx,
	                  group: null,
	                  sequentialIndex: seq,
	                  text: typeof properties.tooltips === 'string' ? properties.tooltips : properties.tooltips[seq],
	                  event: e
	                });
	                obj.highlight(e.target);
	              }, false);
	              rect.addEventListener('mousemove', function (e) {
	                e.target.style.cursor = 'pointer';
	              }, false);
	            })(i, sequentialIndex);
	          }
	        } else if (RGraph.SVG.isArray(this.data[i]) && properties.grouping === 'grouped') {
	          var outerSegment = (this.graphWidth - properties.marginInnerLeft - properties.marginInnerRight) / this.data.length,
	              innerSegment = outerSegment - 2 * properties.marginInner;

	          for (var j = 0; j < this.data[i].length; ++j, ++sequentialIndex) {
	            var width = (innerSegment - (this.data[i].length - 1) * properties.marginInnerGrouped) / this.data[i].length,
	                x = outerSegment * i + properties.marginInner + properties.marginLeft + properties.marginInnerLeft + j * width + (j - 1) * properties.marginInnerGrouped;
	            x = properties.marginLeft + properties.marginInnerLeft + outerSegment * i + width * j + properties.marginInner + j * properties.marginInnerGrouped;

	            if (this.scale.min === 0 && this.scale.max > this.scale.min) {
	              var height = (this.data[i][j] - this.scale.min) / (this.scale.max - this.scale.min) * this.graphHeight,
	                  y = this.getYCoord(0) - height;
	            } else if (this.scale.max <= 0 && this.scale.min < this.scale.max) {
	              var height = (this.data[i][j] - this.scale.max) / (this.scale.max - this.scale.min) * this.graphHeight,
	                  y = this.getYCoord(this.scale.max);
	              height = Math.abs(height);
	            } else if (this.scale.max > 0 && this.scale.min < 0) {
	              var height = Math.abs(this.data[i][j]) / (this.scale.max - this.scale.min) * this.graphHeight,
	                  y = this.data[i][j] < 0 ? this.getYCoord(0) : this.getYCoord(this.data[i][j]);
	            } else if (this.scale.min > 0 && this.scale.max > this.scale.min) {
	              var height = Math.abs(this.data[i][j] - this.scale.min) / (this.scale.max - this.scale.min) * this.graphHeight,
	                  y = this.getYCoord(this.scale.min) - height;
	            }

	            var rect = RGraph.SVG.create({
	              svg: this.svg,
	              parent: properties.variant === '3d' && this.data[i][j] < 0 ? this.threed_xaxis_group : this.svg.all,
	              type: 'rect',
	              attr: {
	                stroke: properties.colorsStroke,
	                fill: properties.colorsSequential && properties.colors[sequentialIndex] ? properties.colors[sequentialIndex] : properties.colors[j],
	                x: x,
	                y: y,
	                width: width,
	                height: height,
	                'stroke-width': properties.linewidth,
	                'data-original-x': x,
	                'data-original-y': y,
	                'data-original-width': width,
	                'data-original-height': height,
	                'data-index': i,
	                'data-subindex': j,
	                'data-sequential-index': sequentialIndex,
	                'data-tooltip': !RGraph.SVG.isNull(properties.tooltips) && properties.tooltips.length ? properties.tooltips[sequentialIndex] : '',
	                'data-value': this.data[i][j],
	                filter: properties.shadow ? 'url(#dropShadow)' : ''
	              }
	            });
	            this.drawErrorbar({
	              object: this,
	              element: rect,
	              index: sequentialIndex,
	              value: this.data[i][j],
	              type: 'grouped'
	            });
	            this.coords.push({
	              object: this,
	              element: rect,
	              x: parseFloat(rect.getAttribute('x')),
	              y: parseFloat(rect.getAttribute('y')),
	              width: parseFloat(rect.getAttribute('width')),
	              height: parseFloat(rect.getAttribute('height'))
	            });

	            if (!this.coords2[i]) {
	              this.coords2[i] = [];
	            }

	            this.coords2[i].push({
	              object: this,
	              element: rect,
	              x: parseFloat(rect.getAttribute('x')),
	              y: parseFloat(rect.getAttribute('y')),
	              width: parseFloat(rect.getAttribute('width')),
	              height: parseFloat(rect.getAttribute('height'))
	            });

	            if (properties.variant === '3d') {
	              this.drawTop3dFace({
	                rect: rect,
	                value: this.data[i][j]
	              });
	              this.drawSide3dFace({
	                rect: rect,
	                value: this.data[i][j]
	              });
	            }

	            if (!RGraph.SVG.isNull(properties.tooltips) && (properties.tooltips[sequentialIndex] || typeof properties.tooltips === 'string')) {
	              var obj = this;

	              (function (idx, seq) {
	                obj.removeHighlight();
	                var indexes = RGraph.SVG.sequentialIndexToGrouped(seq, obj.data);
	                rect.addEventListener(properties.tooltipsEvent.replace(/^on/, ''), function (e) {
	                  RGraph.SVG.tooltip({
	                    object: obj,
	                    group: idx,
	                    index: indexes[1],
	                    sequentialIndex: seq,
	                    text: typeof properties.tooltips === 'string' ? properties.tooltips : properties.tooltips[seq],
	                    event: e
	                  });
	                  obj.highlight(e.target);
	                }, false);
	                rect.addEventListener('mousemove', function (e) {
	                  e.target.style.cursor = 'pointer';
	                }, false);
	              })(i, sequentialIndex);
	            }
	          }

	          --sequentialIndex;
	        } else if (RGraph.SVG.isArray(this.data[i]) && properties.grouping === 'stacked') {
	          var section = (this.graphWidth - properties.marginInnerLeft - properties.marginInnerRight) / this.data.length;
	          var y = this.getYCoord(0);

	          for (var j = 0; j < this.data[i].length; ++j, ++sequentialIndex) {
	            var height = this.data[i][j] / (this.max - this.min) * this.graphHeight,
	                width = section - 2 * properties.marginInner,
	                x = properties.marginLeft + properties.marginInnerLeft + i * section + properties.marginInner,
	                y = y - height;

	            if (j === 0 && properties.shadow) {
	              var fullHeight = RGraph.SVG.arraySum(this.data[i]) / (this.max - this.min) * this.graphHeight;
	              var rect = RGraph.SVG.create({
	                svg: this.svg,
	                parent: this.svg.all,
	                type: 'rect',
	                attr: {
	                  fill: 'white',
	                  x: x,
	                  y: this.height - properties.marginBottom - fullHeight,
	                  width: width,
	                  height: fullHeight,
	                  'stroke-width': 0,
	                  'data-index': i,
	                  filter: 'url(#dropShadow)'
	                }
	              });
	              this.stackedBackfaces[i] = rect;
	            }

	            var rect = RGraph.SVG.create({
	              svg: this.svg,
	              parent: this.svg.all,
	              type: 'rect',
	              attr: {
	                stroke: properties.colorsStroke,
	                fill: properties.colorsSequential ? properties.colors[sequentialIndex] ? properties.colors[sequentialIndex] : properties.colors[properties.colors.length - 1] : properties.colors[j],
	                x: x,
	                y: y,
	                width: width,
	                height: height,
	                'stroke-width': properties.linewidth,
	                'data-original-x': x,
	                'data-original-y': y,
	                'data-original-width': width,
	                'data-original-height': height,
	                'data-index': i,
	                'data-subindex': j,
	                'data-sequential-index': sequentialIndex,
	                'data-tooltip': !RGraph.SVG.isNull(properties.tooltips) && properties.tooltips.length ? properties.tooltips[sequentialIndex] : '',
	                'data-value': this.data[i][j]
	              }
	            });

	            if (j === this.data[i].length - 1) {
	              this.drawErrorbar({
	                object: this,
	                element: rect,
	                index: i,
	                value: this.data[i][j],
	                type: 'stacked'
	              });
	            }

	            this.coords.push({
	              object: this,
	              element: rect,
	              x: parseFloat(rect.getAttribute('x')),
	              y: parseFloat(rect.getAttribute('y')),
	              width: parseFloat(rect.getAttribute('width')),
	              height: parseFloat(rect.getAttribute('height'))
	            });

	            if (!this.coords2[i]) {
	              this.coords2[i] = [];
	            }

	            this.coords2[i].push({
	              object: this,
	              element: rect,
	              x: parseFloat(rect.getAttribute('x')),
	              y: parseFloat(rect.getAttribute('y')),
	              width: parseFloat(rect.getAttribute('width')),
	              height: parseFloat(rect.getAttribute('height'))
	            });

	            if (properties.variant === '3d') {
	              this.drawTop3dFace({
	                rect: rect,
	                value: this.data[i][j]
	              });
	              this.drawSide3dFace({
	                rect: rect,
	                value: this.data[i][j]
	              });
	            }

	            if (!RGraph.SVG.isNull(properties.tooltips) && (properties.tooltips[sequentialIndex] || typeof properties.tooltips === 'string')) {
	              var obj = this;

	              (function (idx, seq) {
	                rect.addEventListener(properties.tooltipsEvent.replace(/^on/, ''), function (e) {
	                  obj.removeHighlight();
	                  var indexes = RGraph.SVG.sequentialIndexToGrouped(seq, obj.data);
	                  RGraph.SVG.tooltip({
	                    object: obj,
	                    index: indexes[1],
	                    group: idx,
	                    sequentialIndex: seq,
	                    text: typeof properties.tooltips === 'string' ? properties.tooltips : properties.tooltips[seq],
	                    event: e
	                  });
	                  obj.highlight(e.target);
	                }, false);
	                rect.addEventListener('mousemove', function (e) {
	                  e.target.style.cursor = 'pointer';
	                }, false);
	              })(i, sequentialIndex);
	            }
	          }

	          --sequentialIndex;
	        }
	      }
	    };

	    this.getYCoord = function (value) {
	      if (value > this.scale.max) {
	        return null;
	      }

	      var y,
	          xaxispos = properties.xaxispos;

	      if (value < this.scale.min) {
	        return null;
	      }

	      y = (value - this.scale.min) / (this.scale.max - this.scale.min);
	      y *= this.height - properties.marginTop - properties.marginBottom;
	      y = this.height - properties.marginBottom - y;
	      return y;
	    };

	    this.highlight = function (rect) {
	      var x = parseFloat(rect.getAttribute('x')) - 0.5,
	          y = parseFloat(rect.getAttribute('y')) - 0.5,
	          width = parseFloat(rect.getAttribute('width')) + 1,
	          height = parseFloat(rect.getAttribute('height')) + 1;
	      var highlight = RGraph.SVG.create({
	        svg: this.svg,
	        parent: this.svg.all,
	        type: 'rect',
	        attr: {
	          stroke: properties.highlightStroke,
	          fill: properties.highlightFill,
	          x: x,
	          y: y,
	          width: width,
	          height: height,
	          'stroke-width': properties.highlightLinewidth
	        },
	        style: {
	          pointerEvents: 'none'
	        }
	      });

	      if (properties.tooltipsEvent === 'mousemove') ;

	      RGraph.SVG.REG.set('highlight', highlight);
	    };

	    this.parseColors = function () {
	      if (!Object.keys(this.originalColors).length) {
	        this.originalColors = {
	          colors: RGraph.SVG.arrayClone(properties.colors),
	          backgroundGridColor: RGraph.SVG.arrayClone(properties.backgroundGridColor),
	          highlightFill: RGraph.SVG.arrayClone(properties.highlightFill),
	          backgroundColor: RGraph.SVG.arrayClone(properties.backgroundColor)
	        };
	      }

	      var colors = properties.colors;

	      if (colors) {
	        for (var i = 0; i < colors.length; ++i) {
	          colors[i] = RGraph.SVG.parseColorLinear({
	            object: this,
	            color: colors[i]
	          });
	        }
	      }

	      properties.backgroundGridColor = RGraph.SVG.parseColorLinear({
	        object: this,
	        color: properties.backgroundGridColor
	      });
	      properties.highlightFill = RGraph.SVG.parseColorLinear({
	        object: this,
	        color: properties.highlightFill
	      });
	      properties.backgroundColor = RGraph.SVG.parseColorLinear({
	        object: this,
	        color: properties.backgroundColor
	      });
	    };

	    this.drawLabelsAbove = function () {
	      if (properties.labelsAbove) {
	        var data_seq = RGraph.SVG.arrayLinearize(this.data),
	            seq = 0;

	        for (var i = 0; i < this.coords.length; ++i, seq++) {
	          var num = typeof this.data[i] === 'number' ? this.data[i] : data_seq[seq];

	          if (properties.grouping === 'stacked') {
	            var indexes = RGraph.SVG.sequentialIndexToGrouped(i, this.data);
	            var group = indexes[0];
	            var datapiece = indexes[1];

	            if (datapiece !== this.data[group].length - 1) {
	              continue;
	            } else {
	              num = RGraph.SVG.arraySum(this.data[group]);
	            }
	          }

	          var str = RGraph.SVG.numberFormat({
	            object: this,
	            num: num.toFixed(properties.labelsAboveDecimals),
	            prepend: typeof properties.labelsAboveUnitsPre === 'string' ? properties.labelsAboveUnitsPre : null,
	            append: typeof properties.labelsAboveUnitsPost === 'string' ? properties.labelsAboveUnitsPost : null,
	            point: typeof properties.labelsAbovePoint === 'string' ? properties.labelsAbovePoint : null,
	            thousand: typeof properties.labelsAboveThousand === 'string' ? properties.labelsAboveThousand : null,
	            formatter: typeof properties.labelsAboveFormatter === 'function' ? properties.labelsAboveFormatter : null
	          });

	          if (properties.labelsAboveSpecific && properties.labelsAboveSpecific.length && (typeof properties.labelsAboveSpecific[seq] === 'string' || typeof properties.labelsAboveSpecific[seq] === 'number')) {
	            str = properties.labelsAboveSpecific[seq];
	          } else if (properties.labelsAboveSpecific && properties.labelsAboveSpecific.length && typeof properties.labelsAboveSpecific[seq] !== 'string' && typeof properties.labelsAboveSpecific[seq] !== 'number') {
	            continue;
	          }

	          var x = parseFloat(this.coords[i].element.getAttribute('x')) + parseFloat(this.coords[i].element.getAttribute('width') / 2) + properties.labelsAboveOffsetx;

	          if (data_seq[i] >= 0) {
	            var y = parseFloat(this.coords[i].element.getAttribute('y')) - 7 + properties.labelsAboveOffsety;
	            var valign = properties.labelsAboveValign;
	          } else {
	            var y = parseFloat(this.coords[i].element.getAttribute('y')) + parseFloat(this.coords[i].element.getAttribute('height')) + 7 - properties.labelsAboveOffsety;
	            var valign = properties.labelsAboveValign === 'top' ? 'bottom' : 'top';
	          }

	          var textConf = RGraph.SVG.getTextConf({
	            object: this,
	            prefix: 'labelsAbove'
	          });
	          RGraph.SVG.text({
	            object: this,
	            parent: this.svg.all,
	            tag: 'labels.above',
	            text: str,
	            x: x,
	            y: y,
	            halign: properties.labelsAboveHalign,
	            valign: valign,
	            font: textConf.font,
	            size: textConf.size,
	            bold: textConf.bold,
	            italic: textConf.italic,
	            color: textConf.color,
	            background: properties.labelsAboveBackground || null,
	            padding: properties.labelsAboveBackgroundPadding || 0
	          });
	        }
	      }
	    };

	    this.on = function (type, func) {
	      if (type.substr(0, 2) !== 'on') {
	        type = 'on' + type;
	      }

	      RGraph.SVG.addCustomEventListener(this, type, func);
	      return this;
	    };

	    this.exec = function (func) {
	      func(this);
	      return this;
	    };

	    this.removeHighlight = function () {
	      var highlight = RGraph.SVG.REG.get('highlight');

	      if (highlight && highlight.parentNode) {
	        highlight.parentNode.removeChild(highlight);
	      }

	      RGraph.SVG.REG.set('highlight', null);
	    };

	    this.drawTop3dFace = function (opt) {
	      var rect = opt.rect,
	          arr = [parseInt(rect.getAttribute('fill')), 'rgba(255,255,255,0.7)'],
	          x = parseInt(rect.getAttribute('x')),
	          y = parseInt(rect.getAttribute('y')),
	          w = parseInt(rect.getAttribute('width')),
	          h = parseInt(rect.getAttribute('height')),
	          value = parseFloat(rect.getAttribute('data-value'));
	      rect.rgraph_3d_top_face = [];

	      for (var i = 0; i < 2; ++i) {
	        var color = i === 0 ? rect.getAttribute('fill') : 'rgba(255,255,255,0.7)';
	        var face = RGraph.SVG.create({
	          svg: this.svg,
	          type: 'path',
	          parent: properties.variant === '3d' && opt.value < 0 ? this.threed_xaxis_group : this.svg.all,
	          attr: {
	            stroke: properties.colorsStroke,
	            fill: color,
	            'stroke-width': properties.linewidth,
	            d: 'M {1} {2} L {3} {4} L {5} {6} L {7} {8}'.format(x, y, x + properties.variant3dOffsetx, y - properties.variant3dOffsety, x + w + properties.variant3dOffsetx, y - properties.variant3dOffsety, x + w, y)
	          }
	        });
	        rect.rgraph_3d_top_face[i] = face;
	      }
	    };

	    this.drawSide3dFace = function (opt) {
	      var rect = opt.rect,
	          arr = [parseInt(rect.getAttribute('fill')), 'rgba(0,0,0,0.3)'],
	          x = parseInt(rect.getAttribute('x')),
	          y = parseInt(rect.getAttribute('y')),
	          w = parseInt(rect.getAttribute('width')),
	          h = parseInt(rect.getAttribute('height'));
	      rect.rgraph_3d_side_face = [];

	      for (var i = 0; i < 2; ++i) {
	        var color = i === 0 ? rect.getAttribute('fill') : 'rgba(0,0,0,0.3)';
	        var face = RGraph.SVG.create({
	          svg: this.svg,
	          type: 'path',
	          parent: properties.variant === '3d' && opt.value < 0 ? this.threed_xaxis_group : this.svg.all,
	          attr: {
	            stroke: properties.colorsStroke,
	            fill: color,
	            'stroke-width': properties.linewidth,
	            d: 'M {1} {2} L {3} {4} L {5} {6} L {7} {8}'.format(x + w, y, x + w + properties.variant3dOffsetx, y - properties.variant3dOffsety, x + w + properties.variant3dOffsetx, y + h - properties.variant3dOffsety, x + w, y + h)
	          }
	        });
	        rect.rgraph_3d_side_face[i] = face;
	      }
	    };

	    this.drawErrorbar = function (opt) {
	      var index = opt.index,
	          datapoint = opt.value,
	          linewidth = RGraph.SVG.getErrorbarsLinewidth({
	        object: this,
	        index: index
	      }),
	          color = RGraph.SVG.getErrorbarsColor({
	        object: this,
	        index: index
	      }),
	          capwidth = RGraph.SVG.getErrorbarsCapWidth({
	        object: this,
	        index: index
	      }),
	          element = opt.element,
	          type = opt.type;
	      var max = RGraph.SVG.getErrorbarsMaxValue({
	        object: this,
	        index: index
	      });
	      var min = RGraph.SVG.getErrorbarsMinValue({
	        object: this,
	        index: index
	      });

	      if (!max && !min) {
	        return;
	      }

	      if (type === 'stacked') {
	        datapoint = RGraph.SVG.arraySum(this.data[index]);
	      }

	      if (datapoint >= 0) {
	        var x1 = parseFloat(element.getAttribute('x')) + parseFloat(element.getAttribute('width')) / 2;
	        var errorbarLine = RGraph.SVG.create({
	          svg: this.svg,
	          type: 'line',
	          parent: this.svg.all,
	          attr: {
	            x1: x1,
	            y1: parseFloat(element.getAttribute('y')),
	            x2: x1,
	            y2: this.getYCoord(parseFloat(datapoint + max)),
	            stroke: color,
	            'stroke-width': linewidth
	          }
	        });
	        var errorbarCap = RGraph.SVG.create({
	          svg: this.svg,
	          type: 'line',
	          parent: this.svg.all,
	          attr: {
	            x1: parseFloat(errorbarLine.getAttribute('x1')) - capwidth / 2,
	            y1: errorbarLine.getAttribute('y2'),
	            x2: parseFloat(errorbarLine.getAttribute('x1')) + capwidth / 2,
	            y2: errorbarLine.getAttribute('y2'),
	            stroke: color,
	            'stroke-width': linewidth
	          }
	        });

	        if (typeof min === 'number') {
	          var errorbarLine = RGraph.SVG.create({
	            svg: this.svg,
	            type: 'line',
	            parent: this.svg.all,
	            attr: {
	              x1: x1,
	              y1: parseFloat(element.getAttribute('y')),
	              x2: x1,
	              y2: this.getYCoord(parseFloat(datapoint - min)),
	              stroke: color,
	              'stroke-width': linewidth
	            }
	          });
	          var errorbarCap = RGraph.SVG.create({
	            svg: this.svg,
	            type: 'line',
	            parent: this.svg.all,
	            attr: {
	              x1: parseFloat(errorbarLine.getAttribute('x1')) - capwidth / 2,
	              y1: errorbarLine.getAttribute('y2'),
	              x2: parseFloat(errorbarLine.getAttribute('x1')) + capwidth / 2,
	              y2: errorbarLine.getAttribute('y2'),
	              stroke: color,
	              'stroke-width': linewidth
	            }
	          });
	        }
	      } else if (datapoint < 0) {
	        var x1 = parseFloat(element.getAttribute('x')) + parseFloat(element.getAttribute('width')) / 2,
	            y1 = parseFloat(element.getAttribute('y')) + parseFloat(element.getAttribute('height')),
	            y2 = this.getYCoord(parseFloat(datapoint - Math.abs(max)));
	        var errorbarLine = RGraph.SVG.create({
	          svg: this.svg,
	          type: 'line',
	          parent: this.svg.all,
	          attr: {
	            x1: x1,
	            y1: y1,
	            x2: x1,
	            y2: y2,
	            stroke: color,
	            'stroke-width': linewidth
	          }
	        });
	        var errorbarCap = RGraph.SVG.create({
	          svg: this.svg,
	          type: 'line',
	          parent: this.svg.all,
	          attr: {
	            x1: parseFloat(errorbarLine.getAttribute('x1')) - capwidth / 2,
	            y1: errorbarLine.getAttribute('y2'),
	            x2: parseFloat(errorbarLine.getAttribute('x1')) + capwidth / 2,
	            y2: errorbarLine.getAttribute('y2'),
	            stroke: color,
	            'stroke-width': linewidth
	          }
	        });

	        if (typeof min === 'number') {
	          var x1 = parseFloat(element.getAttribute('x')) + parseFloat(element.getAttribute('width')) / 2;
	          var errorbarLine = RGraph.SVG.create({
	            svg: this.svg,
	            type: 'line',
	            parent: this.svg.all,
	            attr: {
	              x1: x1,
	              y1: this.getYCoord(parseFloat(datapoint + min)),
	              x2: x1,
	              y2: this.getYCoord(parseFloat(datapoint)),
	              stroke: color,
	              'stroke-width': linewidth
	            }
	          });
	          var errorbarCap = RGraph.SVG.create({
	            svg: this.svg,
	            type: 'line',
	            parent: this.svg.all,
	            attr: {
	              x1: parseFloat(errorbarLine.getAttribute('x1')) - capwidth / 2,
	              y1: errorbarLine.getAttribute('y1'),
	              x2: parseFloat(errorbarLine.getAttribute('x1')) + capwidth / 2,
	              y2: errorbarLine.getAttribute('y1'),
	              stroke: color,
	              'stroke-width': linewidth
	            }
	          });
	        }
	      }
	    };

	    this.grow = function () {
	      var opt = arguments[0] || {},
	          frames = opt.frames || 30,
	          frame = 0,
	          obj = this,
	          data = [],
	          height = null;
	      data = RGraph.SVG.arrayClone(this.data);
	      this.draw();

	      var iterate = function () {
	        for (var i = 0, seq = 0, len = obj.coords.length; i < len; ++i, ++seq) {
	          var multiplier = frame / frames;

	          if (typeof data[i] === 'number') {
	            height = Math.abs(obj.getYCoord(data[i]) - obj.getYCoord(0));
	            obj.data[i] = data[i] * multiplier;
	            height = multiplier * height;
	            obj.coords[seq].element.setAttribute('height', height);
	            obj.coords[seq].element.setAttribute('y', data[i] < 0 ? obj.getYCoord(0) : obj.getYCoord(0) - height);

	            if (properties.variant === '3d') {
	              if (obj.coords[i].element.rgraph_3d_side_face[0].parentNode) obj.coords[i].element.rgraph_3d_side_face[0].parentNode.removeChild(obj.coords[i].element.rgraph_3d_side_face[0]);
	              if (obj.coords[i].element.rgraph_3d_side_face[1].parentNode) obj.coords[i].element.rgraph_3d_side_face[1].parentNode.removeChild(obj.coords[i].element.rgraph_3d_side_face[1]);
	              if (obj.coords[i].element.rgraph_3d_top_face[0].parentNode) obj.coords[i].element.rgraph_3d_top_face[0].parentNode.removeChild(obj.coords[i].element.rgraph_3d_top_face[0]);
	              if (obj.coords[i].element.rgraph_3d_top_face[1].parentNode) obj.coords[i].element.rgraph_3d_top_face[1].parentNode.removeChild(obj.coords[i].element.rgraph_3d_top_face[1]);
	              obj.drawSide3dFace({
	                rect: obj.coords[i].element
	              });

	              if (properties.grouping === 'grouped') {
	                obj.drawTop3dFace({
	                  rect: obj.coords[i].element
	                });
	              }

	              if (obj.coords[i].element.parentNode) {
	                var parent = obj.coords[i].element.parentNode;
	                var node = parent.removeChild(obj.coords[i].element);
	                parent.appendChild(node);
	              }
	            }
	          } else if (typeof data[i] === 'object') {
	            var accumulativeHeight = 0;

	            for (var j = 0, len2 = data[i].length; j < len2; ++j, ++seq) {
	              height = Math.abs(obj.getYCoord(data[i][j]) - obj.getYCoord(0));
	              height = multiplier * height;
	              obj.data[i][j] = data[i][j] * multiplier;
	              height = Math.round(height);
	              obj.coords[seq].element.setAttribute('height', height);
	              obj.coords[seq].element.setAttribute('y', data[i][j] < 0 ? obj.getYCoord(0) + accumulativeHeight : obj.getYCoord(0) - height - accumulativeHeight);

	              if (properties.variant === '3d') {
	                if (obj.coords[seq].element.rgraph_3d_side_face[0].parentNode) obj.coords[seq].element.rgraph_3d_side_face[0].parentNode.removeChild(obj.coords[seq].element.rgraph_3d_side_face[0]);
	                if (obj.coords[seq].element.rgraph_3d_side_face[1].parentNode) obj.coords[seq].element.rgraph_3d_side_face[1].parentNode.removeChild(obj.coords[seq].element.rgraph_3d_side_face[1]);
	                if (obj.coords[seq].element.rgraph_3d_top_face[0].parentNode) obj.coords[seq].element.rgraph_3d_top_face[0].parentNode.removeChild(obj.coords[seq].element.rgraph_3d_top_face[0]);
	                if (obj.coords[seq].element.rgraph_3d_top_face[1].parentNode) obj.coords[seq].element.rgraph_3d_top_face[1].parentNode.removeChild(obj.coords[seq].element.rgraph_3d_top_face[1]);
	                obj.drawSide3dFace({
	                  rect: obj.coords[seq].element
	                });
	                obj.drawTop3dFace({
	                  rect: obj.coords[seq].element
	                });

	                if (obj.coords[seq].element.parentNode) {
	                  var parent = obj.coords[seq].element.parentNode;
	                  var node = parent.removeChild(obj.coords[seq].element);
	                  parent.appendChild(node);
	                }
	              }

	              accumulativeHeight += properties.grouping === 'stacked' ? height : 0;
	            }

	            if (obj.stackedBackfaces[i]) {
	              obj.stackedBackfaces[i].setAttribute('height', accumulativeHeight);
	              obj.stackedBackfaces[i].setAttribute('y', obj.height - properties.marginBottom - accumulativeHeight);
	            }

	            --seq;
	          }
	        }

	        if (frame++ < frames) {
	          RGraph.SVG.FX.update(iterate);
	        } else if (opt.callback) {
	          opt.callback(obj);
	        }
	      };

	      iterate();
	      return this;
	    };

	    this.wave = function () {
	      this.draw();
	      var obj = this,
	          opt = arguments[0] || {};
	      opt.frames = opt.frames || 60;
	      opt.startFrames = [];
	      opt.counters = [];

	      var framesperbar = opt.frames / 3,
	          frame = -1,
	          callback = opt.callback || function () {};

	      for (var i = 0, len = this.coords.length; i < len; ++i) {
	        opt.startFrames[i] = opt.frames / 2 / (obj.coords.length - 1) * i;
	        opt.counters[i] = 0;
	        this.coords[i].element.setAttribute('height', 0);

	        if (this.coords[i].element.rgraph_3d_side_face) {
	          var parent = this.coords[i].element.rgraph_3d_side_face[0].parentNode;
	          parent.removeChild(this.coords[i].element.rgraph_3d_side_face[0]);
	          parent.removeChild(this.coords[i].element.rgraph_3d_side_face[1]);
	          parent.removeChild(this.coords[i].element.rgraph_3d_top_face[0]);
	          parent.removeChild(this.coords[i].element.rgraph_3d_top_face[1]);
	        }
	      }

	      function iterator() {
	        ++frame;

	        for (var i = 0, len = obj.coords.length; i < len; ++i) {
	          var el = obj.coords[i].element;

	          if (frame > opt.startFrames[i]) {
	            var originalHeight = el.getAttribute('data-original-height'),
	                height,
	                value = parseFloat(el.getAttribute('data-value'));
	            var height = Math.min((frame - opt.startFrames[i]) / framesperbar * originalHeight, originalHeight);
	            el.setAttribute('height', height < 0 ? 0 : height);
	            el.setAttribute('y', value >= 0 ? obj.getYCoord(0) - height : obj.getYCoord(0));

	            if (properties.variant === '3d') {
	              var parent = el.rgraph_3d_side_face[0].parentNode;
	              if (parent) parent.removeChild(el.rgraph_3d_side_face[0]);
	              if (parent) parent.removeChild(el.rgraph_3d_side_face[1]);
	              var parent = el.rgraph_3d_top_face[0].parentNode;
	              if (parent) parent.removeChild(el.rgraph_3d_top_face[0]);
	              if (parent) parent.removeChild(el.rgraph_3d_top_face[1]);

	              if (el.parentNode) {
	                var parent = el.parentNode;
	                var node = parent.removeChild(el);
	                parent.appendChild(node);
	              }
	            }

	            if (properties.grouping === 'stacked') {
	              var seq = el.getAttribute('data-sequential-index');
	              var indexes = RGraph.SVG.sequentialIndexToGrouped(seq, obj.data);

	              if (indexes[1] > 0) {
	                el.setAttribute('y', parseInt(obj.coords[i - 1].element.getAttribute('y')) - height);
	              }
	            }

	            if (properties.variant === '3d') {
	              obj.drawSide3dFace({
	                rect: el,
	                value: el.getAttribute('data-value')
	              });

	              if (properties.grouping === 'grouped' || properties.grouping === 'stacked' && indexes[1] + 1 === obj.data[indexes[0]].length) {
	                obj.drawTop3dFace({
	                  rect: el,
	                  value: el.getAttribute('data-value')
	                });
	              }
	            }
	          }
	        }

	        if (frame >= opt.frames) {
	          callback(obj);
	        } else {
	          RGraph.SVG.FX.update(iterator);
	        }
	      }

	      iterator();
	      return this;
	    };

	    this.tooltipSubstitutions = function (opt) {
	      var indexes = RGraph.SVG.sequentialIndexToGrouped(opt.index, this.data);
	      return {
	        index: indexes[1],
	        dataset: indexes[0],
	        sequentialIndex: opt.index,
	        value: typeof this.data[indexes[0]] === 'number' ? this.data[indexes[0]] : this.data[indexes[0]][indexes[1]],
	        values: typeof this.data[indexes[0]] === 'number' ? [this.data[indexes[0]]] : this.data[indexes[0]]
	      };
	    };

	    this.tooltipsFormattedCustom = function (specific, index) {
	      if (typeof this.data[0] === 'object') {
	        var label = !RGraph.SVG.isNull(properties.tooltipsFormattedKeyLabels) && typeof properties.tooltipsFormattedKeyLabels === 'object' && properties.tooltipsFormattedKeyLabels[index] ? properties.tooltipsFormattedKeyLabels[index] : '';
	      } else {
	        var label = !RGraph.SVG.isNull(properties.tooltipsFormattedKeyLabels) && typeof properties.tooltipsFormattedKeyLabels === 'object' && properties.tooltipsFormattedKeyLabels[specific.index] ? properties.tooltipsFormattedKeyLabels[specific.index] : '';
	      }

	      return {
	        label: label
	      };
	    };

	    this.positionTooltipStatic = function (args) {
	      var obj = args.object,
	          e = args.event,
	          tooltip = args.tooltip,
	          index = args.index,
	          svgXY = RGraph.SVG.getSVGXY(obj.svg),
	          coords = this.coords[args.index];
	      args.tooltip.style.left = svgXY[0] + coords.x - tooltip.offsetWidth / 2 + coords.width / 2 + 'px';
	      var adjustment = 0;

	      if (properties.variant === '3d') {
	        var left = coords.x;
	        var top = coords.y;
	        var angle = 5 / (180 / Math.PI);
	        var adjustment = Math.tan(angle) * left;
	      }

	      args.tooltip.style.top = svgXY[1] + coords.y - tooltip.offsetHeight - 15 + adjustment + 'px';
	      var data_arr = RGraph.SVG.arrayLinearize(this.data);

	      if (data_arr[index] < 0) {
	        args.tooltip.style.top = parseFloat(args.tooltip.style.top) + coords.height / 2 + 'px';
	      }

	      if (parseFloat(args.tooltip.style.top) < 0) {
	        args.tooltip.style.top = parseFloat(args.tooltip.style.top) + 20 + 'px';
	      }
	    };

	    for (i in conf.options) {
	      if (typeof i === 'string') {
	        this.set(i, conf.options[i]);
	      }
	    }
	  };

	  return this;
	})();

})));
