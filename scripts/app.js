var app = app || {};

app.launcher = new function() {
	var self = this;

	this.getDataFromServer = function(){
		$.ajax({
			type: "GET",
			url: "http://nikitoz.cloudant.com/test/b7eced176dc69c776dd379f596228930",
			success: this.buildChart,
			dataType: 'jsonp',
			error: function(){
				console.log("There is some problem with getting data from server");
			},
		});
	};

	this.buildChart = function(data){
		$(document.getElementById('container')).highcharts({
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
				categories: data.categories,
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
			series: data.series
		}).bind(this);
	};
}();

// launch
app.launcher.getDataFromServer();
