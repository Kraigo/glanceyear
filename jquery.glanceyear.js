(function($) {
	$.fn.glanceyear = function(massive, options) {

		var settings = $.extend({
			months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			weeks: ['M','T','W','T','F','S', 'S'],
			targetQuantity: '.glanceyear-quantity'
		}, options );

		var svgElement = createElementSvg('svg', {'width': 53*12+15, 'height': 7*12+15 } );

		var gElementContainer = createElementSvg('g', {'transform': 'translate(15, 15)'} );

		var dayCount = 366;
		var monthCount;
		var today = new Date();


		  //Weeks
		  for (var i=0; i<53; i++) {
		  	var gElement = createElementSvg('g', {'transform': 'translate('+(12*i)+',0)'} );   
		  	var firstDate = new Date();
		  	firstDate.setDate(today.getDate() - dayCount-1);
		    // Days in week
		    for (var j=firstDate.getDay(); j<7 ; j++) {

		    	var rectDate = new Date();
		    	rectDate.setDate(today.getDate() - dayCount);
		    	if ( rectDate.getMonth() != monthCount && i < 51 && j > 3 ) {
		          //new Month
		          var offset = 12;
		          if (rectDate.getDate()> 7) offset = 0;
		          var textMonth = createElementSvg('text', {'x': 12*i+offset, 'y':'-6', 'class':'month'} );
		          textMonth.textContent = getNameMonth(rectDate.getMonth());
		          gElementContainer.appendChild(textMonth);
		          monthCount = rectDate.getMonth();
		      }
		      
		      dayCount--;
		      if (dayCount>=0) {
		      	var rectElement = createElementSvg('rect', {
		      		'class': 'day',
		      		'width': '10px',
		      		'height': '10px',
		      		'data-date': rectDate.getFullYear()+'-'+(rectDate.getMonth()+1)+'-'+rectDate.getDate(),
		      		'y': 12*j            
		      	});
		      	gElement.appendChild(rectElement);
		      }
		  }

		  gElementContainer.appendChild(gElement);
		}
		var textM = createElementSvg('text', {'x':'-14', 'y':'8'} );
			textM.textContent = getNameWeek(0);
			gElementContainer.appendChild(textM);
		var textW = createElementSvg('text', {'x':'-14', 'y':'32'} );
			textW.textContent = getNameWeek(2);
			gElementContainer.appendChild(textW);
		var textF = createElementSvg('text', {'x':'-14', 'y':'56'} );
			textF.textContent = getNameWeek(4);
			gElementContainer.appendChild(textF);
		var textS = createElementSvg('text', {'x':'-14', 'y':'80'} );
			textS.textContent = getNameWeek(6);
			gElementContainer.appendChild(textS);
		
		svgElement.appendChild(gElementContainer);

		// Append Calendar to document;
		$(this).append(svgElement);


		fillData(massive);

		$('<div>')
		.addClass('svg-tag')
		.attr('id', 'svgTag')
		.appendTo( $('body') )
		.hide();

		$('.day').hover(function(){
			var dateString = $(this).attr('data-date').split('-');
			var date = new Date(dateString[0], dateString[1]-1, dateString[2]);

			var tagDate =  getBeautyDate(date);
			var tagCount = $(this).attr('data-count');
			var tagCountData = $(this).attr('data-count');

			if (tagCountData) {
				if (tagCountData > 1 )
					tagCount = $(this).attr('data-count')+' scores';
				else
					tagCount = $(this).attr('data-count')+' score';
			} else {
				tagCount = 'No scores';
			}

			$('#svgTag').html( '<b>' + tagCount + '</b> on ' + tagDate)
			.show()
			.css({
				'left': $(this).offset().left - $('#svgTag').outerWidth()/2+5,
				'top': $(this).offset().top-33
			});
		},function() {
			$('#svgTag').text('').hide();
		});

		function createElementSvg(type, prop={} ) {
			var e = document.createElementNS('http://www.w3.org/2000/svg', type);
			for (var p in prop) {
				e.setAttribute(p, prop[p]);
			}
			return e;
		}


		function fillData(massive) {
			var scoreCount = 0;
			for (var m in massive) {
				$('rect.day[data-date="' + massive[m].date + '"]').attr('data-count', massive[m].value);
				scoreCount += parseInt(massive[m].value);
			}
			$(settings.targetQuantity).text(massive.length + ' days, ' + scoreCount + ' scores');
		}

		function getNameMonth(a) {
			return settings.months[a];
		}
		function getNameWeek(a) {
			return settings.weeks[a];
		}
		function getBeautyDate(a) {
			return getNameMonth(a.getMonth()) + ' ' + a.getDate() + ', ' + a.getFullYear();
		}

	};
})(jQuery);