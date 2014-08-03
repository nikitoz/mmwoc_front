var app = app || {};

app.launcher = new function() {
	var self = this;
	
	var sites = {
		'test'  : { url : '', data_source : 'https://nikitoz.cloudant.com/test/455144bd976624b0c9f7fb9cd530eb4d'},
	/*	'Lenta' : { url : 'Lenta.ru', data_source : 'http://nikitoz.cloudant.com/test/b7eced176dc69c776dd379f596228930' },
		'Vesti' : { url : 'Vesti.ru', data_source : 'http://nikitoz.cloudant.com/test/b7eced176dc69c776dd379f596228930' }*/
	};

	var current_site = 'test';
	
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
		console.log(data.words)
		console.log(data.occurances)
		$(document.getElementById('container')).highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: 'pew-pew'
			},
			subtitle: {
				text: ''
			},
			xAxis: {
				categories: data.words,
				title: {
					text: null
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Word occurances',
					align: 'high'
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				valueSuffix: ' word occurances'
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			/*legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -40,
				y: 100,
				floating: true,
				borderWidth: 1,
				backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
				shadow: false
			},*/
			credits: {
				enabled: false
			},
			series: [{ name : 'Word occurances', data : data.occurances }]
		}).bind(this);
	};
}();

// launch
app.launcher.getDataFromServer();
