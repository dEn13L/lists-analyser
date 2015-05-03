/*
 * Panel class
 */
var Panel = function(){
	this.title = '';	// panel title
	this.badge = 0;		// panel badge
	this.output = '';	// panel body
}

/**
 * Country class
 */
var Country = function(code){
	this.code = code;
	this.weightsum = 0;
	this.banners = [];
}

/*
 * Banner class
 *
 * @param bannerContainer 	- elements where banner contained	 
 */
var Banner = function(bannerContainer){
	
	/* private */		
	
	var mId = $(bannerContainer).find('td').eq(0).text();
	var mData = $(bannerContainer).find('textarea').val().trim();
	var selectedOption = $(bannerContainer).find('select.company option:selected');
	var mDivisor = $(bannerContainer).find('input.divisor').val();
	var mWeight = parseFloat($(bannerContainer).find('input.weight').val());
	
	/* public */

	this.container = bannerContainer;
	this.id = $(selectedOption).val() + mId;
	this.company = $(selectedOption).text()												// company of textarea
	this.weight = isNaN(mWeight) ? 1 : mWeight;											// weight of Banner countries
	this.divisor = (mDivisor == undefined || mDivisor.length == 0) ? ';' : mDivisor;	// countries divisor
	this.inputData = mData.split(new RegExp(this.divisor, 'g'));						// total countries
	this.countries = [];		// countries
	this.success = [];			// successfully parsed countries
	this.prioritySuccess = [];	// priority success countries
	this.unknown = [];			// unknown countries
	this.ownDuplicated = [];	// own duplicated countries		
	this.percents = {};			// objects of countris by there percents {'20': ['RU', 'US'], }. 
	this.empty = 0;				// empty countries

	init(this);

	function init(banner){
		var inputCountries = banner['inputData'].slice(0);
		var keys = ['code', 'name'];

		// Search empty countries			
		for (var i = 0; i < inputCountries.length; i++) {
		    inputCountries[i] = inputCountries[i].trim();
		    if (!inputCountries[i]) {
		    	banner['empty']++;
		        inputCountries.splice(i, 1);
		    	i--;
		    }
		}

		// Search ISO 3166 countries			
		for(var i = 0; i < inputCountries.length; i++){
			var countryCode = inputCountries[i];
			var result = null;
			var key;
			var inExceptions = false;

			if(countryCode.length != 2){
				key = keys[1];
			}
			else{
				key = keys[0];
				$(ISO_3166_Exceptions).each(function(i, iso3166Country){
					if(iso3166Country[keys[1]] == countryCode.toUpperCase()){
						inExceptions = true;
						result = iso3166Country[keys[0]];
						return false;
					}
				});
			}

			if(!inExceptions){					
				$(ISO_3166).each(function(i, iso3166Country){
					if(iso3166Country[key] === countryCode.toUpperCase()){						
						result = iso3166Country[keys[0]];
						return false;
					}
				});												
			}
			if(result != null){
				banner['success'].push(result);				
			}
			else{
				banner['unknown'].push(countryCode);
			}
		}

		// Search own duplicated and set upper case			
		banner['success'].sort();
		for (var i = 0; i < banner['success'].length - 1; i++) {
		    if (banner['success'][i] == banner['success'][i + 1]) {
		        banner['ownDuplicated'].push(banner['success'][i]);
		        banner['success'].splice(i--, 1);
		    }
		}
		// copy success
		banner['prioritySuccess'] = banner['success'].slice(0);
	}

	this.getErrors = function(){
		var html = '';
		var count = 0;
		if(this.empty){				
			html += '<span class="badge">' + this.empty + '</span> <b>EMPTY</b><br/>';
			count += this.empty;
		}
		// own duplicated			
		if(this.ownDuplicated.length){
			html += 	'<span class="badge">' + this.ownDuplicated.length + '</span> <b>OWN DUPLICATED:</b><br/>' + 
						'<div class="output-countries-list">' + this.ownDuplicated.join(OUTPUT_DIVISOR) + '</div>';
			count += this.ownDuplicated.length;
		}
		// unknown			
		if(this.unknown.length){
			html += 	'<span class="badge">' + this.unknown.length + '</span> <b>UNKNOWN:</b><br/>' + 
						'<div class="output-countries-list">' + this.unknown.join(OUTPUT_DIVISOR) + '</div>';
			count += this.unknown.length;
		}
		return {'data': html, 'count': count};
	}
}