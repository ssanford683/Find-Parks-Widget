// Find Parks Widget
// Author: Steve Sanford, Hamilton County ISS
// Email: steve.sanford@hamiltoncounty.in.gov

define(["esri/map",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/InfoTemplate",
  "dojo/_base/Color",
  "dojo/dom",
  "dojo/on",
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dojo/_base/lang',
  'esri/graphicsUtils'
],
function(Map, QueryTask, Query, SimpleMarkerSymbol, InfoTemplate, Color, dom, on, declare, BaseWidget, lang, graphicsUtils) {
    //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

	name: 'FindParkWidget',  
    baseClass: 'jimu-widget-FindParkWidget',

    postCreate: function() {
      this.inherited(arguments);
      // console.log('post create');
    },

    startup: function() {
      this.inherited(arguments);
      // console.log('startup');
    },

    onOpen: function(){
      console.log('widget opened');
	  var mapFrame = this;
	  map = this.map;

	  //create symbol for selected features
	  symbol = new SimpleMarkerSymbol();
	  symbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
	  symbol.setSize(12);
	  symbol.setColor(new Color([56,168,0,0.5]));

	  function executeQueryTask() {
		var inputElements = document.getElementsByClassName('checkbox');
		checkedValues = [];
		for(var i=0; inputElements[i]; ++i){
			if(inputElements[i].checked){
				checkedValues.push(inputElements[i].value);
			}
		};
		
		console.log("Amenities selected: " + checkedValues.join(', '));
		var numCheckedValues = checkedValues.length;
		console.log("Number of Amenities: " + numCheckedValues.toString());
		
		queryTask = new QueryTask("https://gis1.hamiltoncounty.in.gov/arcgis/rest/services/HamCoParks/MapServer/4");
	    query = new Query();
	    query.outFields = ["*"];
	    query.returnGeometry = true;
		// create query with all checkedValues values in array
		// if more than one one box checked, format query
		i=0
		for (const checkedValue of checkedValues) {
			query.where += "(PARK_AM1 = '" + checkedValue + "' OR PARK_AM2 = '" + checkedValue + "' OR PARK_AM3 = '" + checkedValue + "' OR PARK_AM4 = '" + checkedValue + "' OR PARK_AM5 = '" + checkedValue + "' OR PARK_AM6 = '" + checkedValue + "' OR PARK_AM7 = '" + checkedValue + "' OR PARK_AM8 = '" + checkedValue + "' OR PARK_AM9 = '" + checkedValue + "' OR PARK_AM10 = '" + checkedValue + "' OR PARK_AM11 = '" + checkedValue + "' OR PARK_AM12 = '" + checkedValue + "')";
			i+=1;
			if (i < numCheckedValues) {
				console.log("i is " + i.toString() + "; adding 'AND' to query");
				query.where += " AND ";
			}
			else {
				console.log("i is " + i.toString() + "; ending query");
			}
		}
			
		console.log("Query: " + query.where);

        // execute query
        queryTask.execute(query, showResults);
      };
	  
	  on(this.findparks, 'click', lang.hitch(this, function(evt){
		executeQueryTask ();
	  }));

	  function showResults(featureSet) {
		  //remove all graphics on the maps graphics layer
		  map.graphics.clear();
		  //Performance enhancer - assign featureSet array to a single variable.
		  var resultFeatures = featureSet.features;
		  var extent = graphicsUtils.graphicsExtent(resultFeatures);
		  //console.log(resultFeatures);
		  //Loop through each feature returned
		  for (var i=0, il=resultFeatures.length; i<il; i++) {
			  //Get the current feature from the featureSet.
			  //Feature is a graphic
			  var graphic = resultFeatures[i];
			  graphic.setSymbol(symbol);
			  //Set the infoTemplate.
			  graphic.setInfoTemplate(infoTemplate);
			  //Add graphic to the map graphics layer.
			  map.graphics.add(graphic);
			  }
		  map.setExtent(extent, true);
      };
	  
	  // format popup
	  var infoTemplate = new InfoTemplate();
	  infoTemplate.setTitle("${NAME} Amenities");
	  infoTemplate.setContent(formatContent);
	  function formatContent(infoTemplate) {
		  var displayArray = [];
		  var owner = infoTemplate.attributes.PARK_OWNER;
		  // checkNull(owner, displayArray);
		  var attr1 = infoTemplate.attributes.PARK_AM1;
		  checkNull(attr1, displayArray);
		  var attr2 = infoTemplate.attributes.PARK_AM2;
		  checkNull(attr2, displayArray);
		  var attr3 = infoTemplate.attributes.PARK_AM3;
		  checkNull(attr3, displayArray);
		  var attr4 = infoTemplate.attributes.PARK_AM4;
		  checkNull(attr4, displayArray);
		  var attr5 = infoTemplate.attributes.PARK_AM5;
		  checkNull(attr5, displayArray);
		  var attr6 = infoTemplate.attributes.PARK_AM6;
		  checkNull(attr6, displayArray);
		  var attr7 = infoTemplate.attributes.PARK_AM7;
		  checkNull(attr7, displayArray);
		  var attr8 = infoTemplate.attributes.PARK_AM8;
		  checkNull(attr8, displayArray);
		  var attr9 = infoTemplate.attributes.PARK_AM9;
		  checkNull(attr9, displayArray);
		  var attr10 = infoTemplate.attributes.PARK_AM10;
		  checkNull(attr10, displayArray);
		  var attr11 = infoTemplate.attributes.PARK_AM11;
		  checkNull(attr11, displayArray);
		  var attr12 = infoTemplate.attributes.PARK_AM12;
		  checkNull(attr12, displayArray);
		  // alphabetize array
		  alphaArray = displayArray.sort();
		  displayLength = alphaArray.length;
		  // format display text
		  displayText = "";
		  for (i = 0; i < displayLength; i++) {
			  if (checkedValues.includes(alphaArray[i])) {
				  displayText += "<b>" + alphaArray[i] + "</b><br>";
			  }
			  else {
				  displayText += alphaArray[i] + "<br>";
			  }
		  }
		  if (owner == 'HAMILTON') {
			  displayText += "<br><i>Park Administered by: " + owner[0].toUpperCase() + owner.slice(1).toLowerCase() + " County</i>";
		  }
		  else {
			  displayText += "<br><i>Park Administered by: " + owner[0].toUpperCase() + owner.slice(1).toLowerCase() + "</i>";
		  }
		  // return display text
		  return displayText;
		  
		}
	  // if park amenity not null, add to array
	  function checkNull(inValue, inArray) {
		  if (inValue) {
			  inArray.push(inValue);
		  }
	  }

	  on(this.clear, 'click', lang.hitch(this, function(evt){  
		console.log("Results cleared");
		map.graphics.clear();
		map.infoWindow.hide();
		var clist = document.getElementsByClassName("checkbox");
		for (var i = 0; i < clist.length; ++i) { clist[i].checked = false; }
	}));
    },

    onClose: function(){
      console.log('Widget closed');
    },

    onMinimize: function(){
      console.log('Widget minimized');
    },

    onMaximize: function(){
      console.log('Widget maximized');
    }

    //onSignIn: function(credential){
    //  console.log('on sign in');
    //},

    //onSignOut: function(){
    //  console.log('on sign out');
    //}

    // onPositionChange: function(){
    //   console.log('onPositionChange');
    // },

    // resize: function(){
    //   console.log('resize');
    // }

    });
  });