
$(function () {
	var dt = $.ajax({
	   	type: 'GET',
	    url: 'http://nikitoz.cloudant.com/test/b7eced176dc69c776dd379f596228930',
	    dataType: 'jsonp',
		series : [],
	    success: function (data) {
			self.series = data.series;
	    	console.log(self.series);
		}
	});

	$('#container').highcharts({
    	chart: {
        	type: 'bar'
		},
		title: {
        	text: 'a'
        },
        subtitle: {
        	text: 'Source: Wikipedia.org'
        },
        xAxis: {
        	categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
            title: {
            	text: null
            }
		},
        yAxis: {
        	min: 0,
            title: {
            	text: 'Population (millions)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
		},
        tooltip: {
        	valueSuffix: ' millions'
        },
        plotOptions: {
        	bar: {
            	dataLabels: {
                	enabled: true
                }
            }
        },
        legend: {
        	layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
            shadow: true
		},
        credits: {
        	enabled: false
        },
        series:
			// this should be loaded from http://nikitoz.cloudant.com/test/b7eced176dc69c776dd379f596228930
			[{
                name: 'Year 1800',
                data: [107, 31, 635, 203, 2]
            }, {
                name: 'Year 1900',
                data: [133, 156, 947, 408, 6]
            }, {
                name: 'Year 2008',
                data: [973, 914, 4054, 732, 34]
            }]
	});
});

