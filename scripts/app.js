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

	this.init = function() {
		var today = new Date();
		var pick = $('.datepick').pickmeup({
			format          : 'd.m.Y',
			select_year     : false,
			select_month    : false,
			position		: 'right',
			hide_on_select	: true,
			min             : new Date(2014, 7, 5, 0, 0, 0, 0),
			selected        : true,
			date            : today,
			change			: this.getDataFromServer,
		});
		$('.datepick').val(this.date());
		console.log(this.date().replace(/\./g, '_'));
	};

	this.date = function() {
		return $('.datepick').pickmeup('get_date', true);
	};

	this.buildChart = function(data){
		console.log(data.words)
		console.log(data.occurrences)
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
					text: 'Word occurrences',
					align: 'high'
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				valueSuffix: ' word occurrences'
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{ name : 'Word occurences', data : data.occurrences }]
		}).bind(this);
	};
}();
app.launcher.init();
// launch
app.launcher.getDataFromServer();
