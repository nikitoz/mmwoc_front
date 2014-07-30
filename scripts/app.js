var app = app || {};

app.launcher = new function() {
	var self = this;
	
	var sites = {
		'Lenta' : { url : 'Lenta.ru', data_source : 'http://nikitoz.cloudant.com/test/b7eced176dc69c776dd379f596228930' },
		'Vesti' : { url : 'Vesti.ru', data_source : 'http://nikitoz.cloudant.com/test/b7eced176dc69c776dd379f596228930' }
	};

	var current_site = 'Lenta';
	
	this.setCurrentSite = function(site_name) {
		if (site_name in sites)
			current_site = site_name
		else
			console.log('Site name ' + site_name + ' is not supported');
	};

	this.onSiteSelected = function() {
		var site_select = document.getElementById("site_select");
		self.show(site_select.options[site_select.selectedIndex].value);
	}

	this.show = function(site_name) {
		self.setCurrentSite(site_name);
		self.getDataFromServer();
	};

	this.getDataFromServer = function(){
		$.ajax({
			type: "GET",
			url: sites[current_site].data_source,
			success: this.buildChart,
			dataType: 'jsonp',
			error: function(){
				console.log("There is some problem getting data from server");
			},
		});
	};

	this.buildChart = function(data){
		$(document.getElementById('container')).highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: 'pew-pew'
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
