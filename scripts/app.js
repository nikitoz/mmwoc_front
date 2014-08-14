var app = app || {};

app.launcher = new function() {
	var self = this;
	var data_source = 'http://flipflop.systems:27080/mmwocdb/graph/_find?';
	var sites = {
		'test'           : { url : 'nikitoz.github.io/mmwoc_testpage/'},
		'lenta.ru'       : { url : 'lenta.ru' },
		'vesti.ru'       : { url : 'vesti.ru' },
		'news2.ru'       : { url : 'news2.ru'},
		'ria.ru'         : { url : 'ria.ru' },
		'newsru.com'     : { url : 'newsru.com'},
		'kp.ru'          : { url : 'kp.ru' },
		'lifenews.ru'    : { url : 'lifenews.ru'},
		'russian.rt.com' : { url : 'russian.rt.com'},
		'itar-tass'      : { url : 'itar-tass.com'},
		'pravda.ru'      : { url : 'pravda.ru'}
	};

	var current_site = 'lenta.ru';
	
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
		self.show();
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
			min             : new Date(2014, 7, 13, 0, 0, 0, 0),
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
		var graph = (0 == data.results.length)
			? {	title: { text: 'No data for ' + current_site + ' on ' + self.date() } }
			: {
				chart: {
					type: 'bar'
				},
				title: {
					text: current_site + ' on ' + self.date()
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
					title: {
						align: 'high'
					},
					labels: {
						overflow: 'justify'
					}
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
				series: [{ name : 'Число вхождений', data : data.results[0].data.occurrences }]
			};
		$(document.getElementById('container')).highcharts(graph).bind(this);
	};
}();
app.launcher.init();
app.launcher.show();
