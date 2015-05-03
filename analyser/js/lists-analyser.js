var FAST_SPEED = 200;
var SLOW_SPEED = 'slow';
var IMMEDIATELY = 0;
var ruleCountries;
var ruleBanners;
var contenteditableHtml;

$(document).ready(function(){
	init();	
	$(this).on('click', '#analyser #tab_uniqs button#get_uniqs', handleGetUniqs);
	$(this).on('click', '#analyser #tab_compare button#compare', handleCompare);
});

/*
 * Initialization function
 */
function init() {
	$('textarea').flexText();	
}

/*
 * Get object size
 */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 *	Block UI
 */
function blockUI() {
	var data = {
    	overlayCSS: { backgroundColor: '#FCFCFC' }, 
    	centerY: 0, 
    	fadeIn: FAST_SPEED,
        fadeOut: FAST_SPEED,
        message: null, 
   	};
	$.blockUI(data);
}

/**
 *	UnBlock UI
 */
function unBlockUI() {
	$.unblockUI();
}

/*
 * Show <hr>, because double click on last panel very ugly
 */
function showHR(selector) {
	$(selector).append('<hr/>');
} 

/*
 * Scroll page to bottom
 */
function scrollToBottom(speed) {
	$("html").animate({ scrollTop: $(document).height() }, speed != undefined ? speed : SLOW_SPEED);
	return false;
}

/**
 * Scroll page to top
 */
function scrollToTop(speed) {
	$("html").animate({ scrollTop: 0 }, speed != undefined ? speed : SLOW_SPEED);
	return false;
}

/**
 * Scroll to element
 */
function scrollTo(element, speed) {
	$('html').animate({ scrollTop: $(element).offset().top }, speed != undefined ? speed : SLOW_SPEED);
	return false;
}

/*
 * Get uniqs
 */
function handleGetUniqs() {
	blockUI();

	var input = $('#tab_uniqs textarea#input');
	var output = $('#tab_uniqs textarea#output');
	
	var inputCountOutput = $(input).closest('.col-md-6').find('span');
	var outputCountOutput = $(output).closest('.col-md-6').find('span')

	var duplicatesOutput = $('#tab_uniqs #duplicatesOutput');

	// clear outputs
	$(output).html('');
	$(duplicatesOutput).html('');
	
	var inputText = $(input).val().trim();
	var inputHeight = $(input).css('height');		
	var lines = inputText.split('\n');	
	var duplicates = {};
	var uniqs = [];			

	// remove empty lines
	for(var i = 0; i < lines.length; i++) {
		var line = lines[i].trim();
		if(!line.length) {
			lines.splice(i--, 1);
		} else {
			lines[i] = line;
		}
	}

	var inputCount = lines.length;

	// find uniqs and duplicates
	for(var i = 0; i < lines.length; i++) {
		var found = false;
		var current = lines[i];
		for(var j = i + 1; j < lines.length; j++) {
			var next = lines[j];
			if(next == current) {
				if(duplicates[current] != undefined) {
					duplicates[current]++;
				} else {
					found = true;
					duplicates[current] = 1;
					uniqs.push(current);
				}
				lines.splice(j--, 1);
			}
		}
		if(!found) {
			uniqs.push(current);
		}
	}

	var outputCount = uniqs.length;

	var log = '<p><b>Duplicates:</b></p><br/>';
	for (var duplicate in duplicates) {
		log += '<p><b>' + duplicate + ': ' + duplicates[duplicate] + '</b></p>';
	}

	$(input).css('height', inputHeight);
	$(output).css('height', inputHeight);

	$(inputCountOutput).html('<b>' + inputCount + '</b>');
	$(outputCountOutput).html('<b>' + outputCount + '</b>');

	console.log(uniqs);
	$(output).html(uniqs.join('\n'));
	$(duplicatesOutput).html(log);

	unBlockUI();
}

/*
 * Compare lists
 */
function handleCompare() {
	blockUI();

	var list1 = $('#tab_compare textarea#list1');
	var list2 = $('#tab_compare textarea#list2');

	var col1 = $(list1).closest('.col-md-6');
	var col2 = $(list2).closest('.col-md-6');

	var list1Same = $(col1).find('#uniq1');
	var list1Dif = $(col1).find('#same1');

	var list2Same = $(col2).find('#uniq2');
	var list2Dif = $(col2).find('#same2');

	var list1Output = $(col1).find('.output');
	var list2Output = $(col2).find('.output');

	$(list1Output).html('');
	$(list2Output).html('');

	var list1Text = $(list1).val().trim();
	var list2Text = $(list2).val().trim();

	var list1Lines = list1Text.split('\n');
	var list2Lines = list2Text.split('\n');
	
	var uniq1 = [];
	var same1 = [];
	var uniq1Html = "";	
	var same1Html = "";

	var uniq2 = [];
	var same2 = [];
	var uniq2Html = "";	
	var same2Html = "";

	for (var i = 0; i < list1Lines.length; i++) {
		var find = false;
		var current = list1Lines[i].trim();
		for (var j = 0; j < list2Lines.length; j++) {
			var next = list2Lines[j].trim();
			if (current == next) {
				find = true;
				same1.push(current);
				same1Html += "<p>" + current + "</p>";
				break;
			}
		}
		if (!find) {
			uniq1.push(current);
			uniq1Html += "<p>" + current + "</p>";
		}
	}

	for (var i = 0; i < list2Lines.length; i++) {
		var find = false;
		var current = list2Lines[i].trim();
		for (var j = 0; j < list1Lines.length; j++) {
			var next = list1Lines[j].trim();
			if (current == next) {
				find = true;
				same2.push(current);
				same2Html += "<p>" + current + "</p>";
				break;
			}
		}
		if (!find) {
			uniq2.push(current);
			uniq2Html += "<p>" + current + "</p>";
		}
	}

	$(list1Same).html("<p>Total: <b>" + list1Lines.length + "</b></p><br/><p>Unique Count: <b>" + uniq1.length + "</b></p><br>" + uniq1Html);
	$(list2Same).html("<p>Total: <b>" + list2Lines.length + "</b></p><br/><p>Unique Count: <b>" + uniq2.length + "</b></p><br>" + uniq2Html);

	$(list1Dif).html("<p>Same Count: <b>" + same1.length + "</b></p><br>" + same1Html);
	$(list2Dif).html("<p>Same Count: <b>" + same2.length + "</b></p><br>" + same2Html);


	unBlockUI();
}