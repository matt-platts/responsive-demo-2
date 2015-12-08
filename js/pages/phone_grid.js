/* function to fire when the document is loaded */
whenDocumentLoaded(loadPhones());

/* initialise vars */

display_templates = Array( 
	/* These are templates for each item in each column. 
	 * Later will loop through these. This ensures that no matter how many phones are loaded, 
	 * the pattern of one double-column row followed by two single column rows propogates throughout the columns irrespective of how many phones we have. 
	 * This is just a suggestion for layout based on the template I was given, in a production environment phones could be tagged as 'promoted' to give double 
	 * columns rather than randomly assigned, but this is good for keeping the layout interesting.
	 * NB: In a full framework this would not be js variables but actual templates stored and loaded from elsewhere.
	*/

	// double column
	'<div id="[id]" class="item double" style="background-image:url([background-image])"><div class="phone-overlay"><p>[name]</p><p>[price]</p></div></div>', 
	
	// L & R single columns
	'<div id="[id]" class="item single left" style="background-image:url([background-image])"><div class="phone-overlay"><p>[name]</p><p>[price]</p></div></div>', 
	'<div id="[id]" class="item single itemRight" style="background-image:url([background-image])"><div class="phone-overlay"><p>[name]</p><p>[price]</p></div></div>',

	// L & R single columns
	'<div id="[id]" class="item single left" style="background-image:url([background-image])"><div class="phone-overlay"><p>[name]</p><p>[price]</p></div></div>', 
	'<div id="[id]" class="item single itemRight" style="background-image:url([background-image])"><div class="phone-overlay"><p>[name]</p><p>[price]</p></div></div>'

);

column_data = Array(); // This array will contain the html for each column in an indexed array 


/*
 * Function: loadPhones 
 * Meta: Function to load the phone data via an ajax call and populate the columns on the page, select drop down etc.
*/
function loadPhones(){

	var feed_url='/tele2/feed.json';

	var counter=0;
	var current_column=1;
	var current_template=0;
	var template_start=null; // which point in the templates array to start looping for each column.
	select_list="<option value=\"\">Select Phone</option>";


	// Ajax Call to retrive list of phones in json format
	var request = new XMLHttpRequest();
	request.open('GET', feed_url, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {

			var data = JSON.parse(request.responseText);
			total_phones=0;
			for (i=0;i<data.length;i++){
				if (data[i]['brand']){
					total_phones++;
				}
			}

			phones_per_col=Math.floor(total_phones/4); // number of full rows for each column
			if (phones_per_col<5){ phones_per_col=5;}
			additional_rows=total_phones%4; // number of extra phones which won't fill a row

			for (i=0;i<data.length;i++){

				// if we don't have a brand, it appears to be a section header(?), for now we discard this. 
				// NB: It would be far better to have a properly formatted phone list from a better API, rather than skipping things in this way.
				if (!data[i]['brand']){
					continue;
				}

				select_list = select_list + "<option value=\"" + data[i]['entity_id'] + "\">" + data[i]['name'] + "</option>";
				console.log(current_column, (counter % phones_per_col), data[i]['name']);

				// If we are starting a new column, adjust where we start looping through the templates.
				// This serves two purposes - we don't start with a right floated column, and we can start at different points so that
				// The template pattern of wide/thin doesn't simply repliate for each column. 
				if (counter % phones_per_col==0){
					if (template_start==null){ current_template=0;template_start=3; }
					else if (template_start==0){ current_template=0;template_start=3; }
					else if (template_start==1){ current_template=1;template_start=0; }
					else if (template_start==3){ current_template=3;template_start=1; }
	
					console.log("Starting new column from " + current_template + ", next start is " + template_start);
				}

				// load the next template in the sequence, and increment or reset number for next time
				template=display_templates[current_template];
				if (current_template==display_templates.length-1){
						current_template=0;
				} else {
					current_template++;	
				}


				// replace template variables
				template=template.replace("[id]",data[i]['entity_id'] + "" );
				template=template.replace("[name]",data[i]['name'] + "" );
				template=template.replace("[price]","EUR " + data[i]['price'] + "" );
				template=template.replace("[background-image]",data[i]['image'] );

				// add templated phone to columns data array
				if (column_data[current_column]===undefined){
					column_data[current_column] = template;
				} else {
					column_data[current_column] = column_data[current_column] + template;
				}


				// increment vars
				if (counter % phones_per_col==4){
					current_column++;
				}

				counter++;

				/* This is just in for debugging, simply shows all properties of the object
				for (j in data[i]){
					//console.log(j, data[i][j]);
				}
				*/
			}

			// 
			console.log(column_data[1]);
			console.log(column_data[2]);
			console.log(column_data[3]);
			console.log(column_data[4]);

			document.getElementById('column1').innerHTML=column_data[1];
			document.getElementById('column2').innerHTML=column_data[2];
			document.getElementById('column3').innerHTML=column_data[3];
			document.getElementById('column4').innerHTML=column_data[4];

			// load the list of phones into the select drop down
			document.getElementById("phone-selector").innerHTML=select_list;

			
			// add mouse over and out listeners
			allItems = document.getElementsByClassName('item');
			Array.prototype.filter.call(allItems, function(el){
				el.addEventListener("mouseover",function(){
					this.querySelector("div").style.display="inline-block";
				});
				el.addEventListener("mouseout",function(){
					this.querySelector("div").style.display="none";
				});
			});


		} else {
			alert("An error occurred connecting to the server"); // wouuld not do this in a production environment - a better formatted and more informative message
		}

	};

	request.onerror = function() {
		alert("An error occurred connecting to the server"); // wouuld not do this in a production environment - a better formatted and more informative message
	};

	request.send();

};

/* 
 * Function: selectPhone
 * Meta: Called when a phone is selected from the select drop down 
*/
function selectPhone(which){
	allItems = document.getElementsByClassName('item');
	Array.prototype.filter.call(allItems, function(el){
		el.style.backgroundColor="blue";
		el.style.border="2px blue solid";
	});
	document.getElementById(which).style.backgroundColor="black";
	document.getElementById(which).style.border="2px red solid";
	if (!isInViewport(document.getElementById(which))){
		document.getElementById(which).scrollIntoView(true); // for production, would do a quick animated scroll
	}
	
}

