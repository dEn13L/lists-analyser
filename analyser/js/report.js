/**
 * Show companies table in Companies TAB
 *
 * @param companies - objects {'RU': {'weightsum': 'sum of this banners weights', 'banners': []}, }
 */
function showCompaniesTable(banners){
	var html = "";
	var number = 1;
	var countriesTable = $('#tab_companies_analyser table.companies-rules');
	var linkClass = 'companies-rules-link';

	$(banners).each(function(i, banner){
		var company = banner['company'];
		var id = banner['id'];
		var percents = banner['percents'];
		var weight = banner['weight'];
		
		html += "<tr class='result'><td>" + (number++) + "</td>" +
					"<td id='" + id + "'><a href='#" + id + "'><b>" + company + "</b></a></td>" +
					"<td>" +
						"<table class='table tablesorter tablesorter-jui'>" +
							"<thead>" +
								"<tr>" +									
									"<td width='15%' class='tablesorter-header'>Percents</td>" +
									"<td width='80%' class='tablesorter-header'>Countries codes</td>" +
									"<td width='5%' class='tablesorter-header'>N</td>" +
								"</tr>" +
							"</thead>" +
							"<tbody>";
		var number2 = 1;
		for(var percent in percents){
			
			var countries = percents[percent];

			html += "<tr><td contenteditable='true'>" + percent + "%</td>";			
			html += "<td>";
			$(countries).each(function(j, country){
				var countryCode = country['code'];
				
   				html += "<a class='" + linkClass + "' href='#" + countryCode + "'><b>" + countryCode + "</b></a>";
   				if(j != countries.length - 1){
   					html += "; ";
   				}
			});	
			html += "</td>"
			html += "<td>" + countries.length + "</td></tr>";
		}			
   		html += "</tbody></table></td></tr>";
	});
	$(countriesTable).find('tbody').html(html);
	$(countriesTable.find('table')).tablesorter();

	initCompaniesTableLinkHandlers();
}

/*
 * Set click handkers
 */
function initCompaniesTableLinkHandlers(){	
	$('.companies-rules-link').click(function(){			
		showTab(4);
	});	
}

/**
 * Show countries table in Countries TAB
 *
 * @param countries - Country objects array
 */
function showCountriesTable(countries){	
	var trs = $('#tab_countries_analyser table.countries-rules tbody tr.result');
	var linkClass = 'countries-rules-link';
	
	$(trs).each(function(i){
		var tableCountryCode = $(this).find('td').eq(1).text();
				
		var found = false;
		var html = "<table class='table tablesorter tablesorter-jui'>" +
						"<thead>" +
							"<tr>" +
								"<td class='tablesorter-header'>#</td>" +
								"<td class='tablesorter-header'>Companies</td>" +
								"<td class='tablesorter-header'>Percents</td>" +
							"</tr>" +
						"</thead>" +
						"<tbody>";

		$(countries).each(function(j, country){
			var countryCode = country['code'];			
			if(tableCountryCode == countryCode){
				found = true;
				var banners = country['banners'];
	   			var weightSum = country['weightsum'];

	   			$(banners).each(function(k, banner){
	   				var company = banner['company'];
	   				var id = banner['id'];
	   				var weight = banner['weight'];
	   				var percents = (weight * 100 / weightSum).toFixed(1);

	   				html += "<tr><td>" + (k + 1) + "</td>";
	   				html += "<td data-id='" + id + "'><a class='" + linkClass + "' href='#" + id + "'><b>" + company + "</b></a></td>";
	   				html += "<td contenteditable='true'>" + percents + "%</td></tr>";	   				
	   			});
	   			return false;
			}
		});
		if(!found){
			html += "<tr><td>1</td><td><b>REMNANT</b></td><td>100.0%</td></tr>";
   		}
   		html += "</tbody></table>";
   		$(this).find('td').eq(3).html(html);
   		$(this).find('table').tablesorter();   		
	});
	initCountriesTableLinkHandlers();
}

/*
 * Set click handkers
 */
function initCountriesTableLinkHandlers(){	
	$('.countries-rules-link').click(function(){		
		showTab(3);
	});	
}

/**
 * Download excel
 */
function tableToExcel(tableHtml){
	var uri = 'data:application/vnd.ms-excel;base64,'
		, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
		, base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
		, format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
	
	var ctx = {worksheet: 'Worksheet', table: tableHtml}
	
	window.location.href = uri + base64(format(template, ctx))	
}

/*
 * Companies excel
 */
function exportCompaniesRules(){	
	tableToExcel($('#tab_companies_analyser table.companies-rules').html());
}

/*
 * Countries excel
 */
function exportCountriesRules(){
	tableToExcel($('#tab_countries_analyser table.countries-rules').html());
}