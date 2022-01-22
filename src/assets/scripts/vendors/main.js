(function (factory) {
    typeof define === 'function' && define.amd ? define('main', factory) :
    factory();
}((function () { 'use strict';

    // APPEARS
    $(function () {
      const animations = $('.animated');
      $('.animate__animated').appear();
      animations.on('appear', function () {
        var element = $(this);
        var animation = element.data('animation');
        element.addClass(`animate__ ${animation}`);
      });
    }); // TABLEAU RGRAPH - NOMS POPULAIRES

    const afficherGraphiqueDesFilms = () => {
      const bar = new RGraph.SVG.Bar({
        id: 'films-chart-container',
        data: [29, 39, 47, 124, 314],
        options: {
          labelsAboveSize: 12,
          labelsAboveColor: '#563f55',
          labelsAboveBold: true,
          colors: ['#563f55'],
          backgroundGridBorder: false,
          backgroundGridVlines: false,
          xaxis: false,
          yaxis: false,
          xaxisLabels: ['Tron', 'Conan', 'Rambo', 'Rocky 3', 'E.T.'],
          textSize: 14,
          marginLeft: 80,
          yaxisScaleUnitsPost: '$'
        }
      }).draw().responsive([{
        maxWidth: null,
        width: 550,
        height: 350,
        options: {
          labelsAboveSize: 12,
          textSize: 14
        },
        parentCss: {
          'float': 'none'
        }
      }, {
        maxWidth: 800,
        width: 400,
        height: 200,
        options: {
          labelsAboveSize: 8,
          textSize: 10
        },
        parentCss: {
          'float': 'none'
        }
      }]);
    };

    afficherGraphiqueDesFilms(); // ÉLÉMENT CANVAS

    var canvasElement = document.querySelector("#moncanvas");
    var context = canvasElement.getContext("2d");
    context.beginPath();
    context.moveTo(150, 125);
    context.lineTo(50, 50);
    context.lineTo(250, 50);
    context.closePath();
    context.lineWidth = 10;
    context.strokeStyle = '#563f55';
    context.stroke();
    context.fillStyle = "#563f55";
    context.fill();

})));
