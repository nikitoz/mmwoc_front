var app = app || {};

app.launcher = new function() {
	var self = this;
	var data_source = 'http://flipflop.systems:27080/mmwocdb/graph/_find?';
	var sites = {
		'test'  : { url : 'nikitoz.github.io/mmwoc_testpage/'},
		'Lenta' : { url : 'lenta.ru' },
//		'Vesti' : { url : 'Vesti.ru' }
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
		self.setCurrentSite(site_select.options[site_select.selectedIndex].value);
		self.show();
	};

	this.onDateSelected = function() {
		console.log(self.date());
		// TODO : add date filter
	};

	this.show = function() {
		$.ajax({
			type: "GET",
			url: data_source + self.db_index(),
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
			max             : new Date(),
			selected        : true,
			date            : today,
			change			: this.onDateSelected,
		});
		$('.datepick').val(this.date());
	};

	this.date = function() {
		return $('.datepick').pickmeup('get_date', true);
	};

	this.db_index = function() {
		return 'criteria=' + encodeURI('{"_id" : "'+ sites[current_site].url.replace(/\//g, '').replace(/\./g, '') + '_'
			+ self.date().replace(/\./g, '_') + '"}');
	};

	this.buildChart = function(data){
		console.log(data)
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
				categories: data.results[0].data.words,
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
			series: [{ name : 'Word occurences', data : data.results[0].data.occurrences }]
		}).bind(this);
	};
}();
app.launcher.init();
app.launcher.show();
