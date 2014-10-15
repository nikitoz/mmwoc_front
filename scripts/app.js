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
	var current_date = new Date();

	var this_site = "watmedia.org/index.html";
	
	this.setCurrentSite = function(site_name) {
		if (typeof site_name === 'undefined')
			return;
		if (site_name in sites)
			current_site = site_name;
		else
			console.log('Site name ' + site_name + ' is not supported');
	};

	this.strToIsoDate = function(datestr) {
		if (typeof datestr === 'undefined')
			return;
		var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
		return new Date(datestr.replace(pattern,'$3-$2-$1'));
	};

	this.setCurrentDate = function(datestr) {
		current_date = self.strToIsoDate(datestr);
	};

	this.onOpenUrl = function() {
		var site_select = document.getElementById("site_select");
		var sitename = site_select.options[site_select.selectedIndex].value;
		var date = self.date();
		location.href = this_site + "?x="+sitename+"&y="+date;
	};

	this.parse_params = function() {
		var query_string = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0; i < vars.length; i++) {
			var pair = vars[i].split("=");
    		// If first entry with this name
    		if (typeof query_string[pair[0]] === "undefined") {
      			query_string[pair[0]] = pair[1];
    		// If second entry with this name
    		} else if (typeof query_string[pair[0]] === "string") {
      			var arr = [ query_string[pair[0]], pair[1] ];
      			query_string[pair[0]] = arr;
    			// If third or later entry with this name
			} else {
				query_string[pair[0]].push(pair[1]);
    		}
  		} 
    	return query_string;
	};

	this.site_from_params = function() {
		var params = self.parse_params();
		self.setCurrentSite(params['x']);
		self.setCurrentDate(params['y']);
	};

	this.show = function() {
		console.log(window.location.search);
		$.ajax({
			type: "GET",
			url: data_source + self.db_index(),
			success: this.buildChart,
			dataType: 'jsonp',
			error : function() {
				console.log("There is some problem getting data from server");
			},
		});
	};

	this.init = function() {
		console.log("init");
		console.log(current_site);
		console.log(current_date);
		self.site_from_params();
		console.log(current_site);
		console.log(current_date);
		document.getElementById("site_select").value = current_site;
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
			date            : current_date,
			change			: this.onOpenUrl,
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

	this.buildChart = function(data) {
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
