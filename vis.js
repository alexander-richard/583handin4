// Used the week 6 tutorial as a template to create these visualizations
// Used the tutorial at https://www.freshconsulting.com/d3-js-gradients-the-easy-way/ for the gradients
// Alexander Richard and Montek Parmar


var margins = {top: 20, right: 20, bottom: 30, left: 80};
var totalWidth = 1600;
var totalHeight = 800;

var innerWidth = totalWidth - margins.left - margins.right;
var innerHeight = totalHeight - margins.top - margins.bottom;

var ppl_affected = [];



// data modified from https://github.com/charliesmart/d3-square-tile-map/blob/master/square-tile-map.js
var states = [["AK", 0, 72],["AL",504,432,],["AR",360,360,],["AZ",144,360],["CA",72,288],["CO",216,288], ["CT",720,216],["DC",648,360],["DE",720,288],["FL",648,504],["GA",576,432],["HI",72,504], ["IA",360,216],["ID",144,144],["IL",432,144],["IN",432,216],["KS",288,360],["KY",432,288], ["LA",360,432],["MA",720,144],["MD",648,288],["ME",792.8,0],["MI",504,144],["MN",360,144], ["MO",360,288],["MS",432,432],["MT",216,144],["NC",504,360],["ND",288,144],["NE",288,288],[ "NH",792.8,72],["NJ",648,216],["NM",216,360],["NV",144,216],["NY",648,144],["OH",504, 216], ["OK",288,432],["OR",72,216],["PA",576,216],["RI",792.8,216],["SC",576,360],["SD",288,216], ["TN",432,360],["TX",288,504],["UT",144,288],["VA",576,288],["VT",720,72],["WA",72,144],["WI",432,72],[ "WV",504,288],["WY",216,216]];

function loadvis() {
	storeAffected();
	setTimeout(loadMap(), 10000);
}

// template taken from https://www.visualcinnamon.com/2013/07/self-organizing-maps-creating-hexagonal.html
async function loadMap() {

	let chart = d3.select("#state");
	makeInnerArea(chart);

	//The maximum radius the hexagons can have to still fit the screen
	var hexRadius = 25;

	//Calculate the center position of each hexagon
	var points = [];
	for (var i = 0; i < states.length; i++) {
		points.push([states[i][1] + 60, states[i][2] + 60]);
	}

	//Create SVG element
	var svg = d3.select("#state").append("svg")
		.attr("width", totalWidth + margins.left + margins.right)
		.attr("height", totalHeight + margins.top + margins.bottom)
		.append("g")
		.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

	//Set the hexagon radius
	var hexbin = d3.hexbin().radius(hexRadius);



	//Draw the hexagons
	svg.append("g")
		.selectAll(".hexagon")
		.data(hexbin(points))
		.enter().append("path")
		.attr("class", "hexagon")
		.attr("d", function (d) {
			return "M" + d.x + "," + d.y + hexbin.hexagon();
		})
		.attr("stroke", "grey")
		.attr("stroke-width", "1px")
		.style("fill", (d,i) => hexColor(i))
		.on("mouseover", (d,i) => mousehover(i))
		.on("mouseout", clearInfo);


	svg.append("rect")
		.attr("x", totalWidth - 600)
		.attr("y", 0)
		.attr("width", 500)
		.attr("height", 750)
		.style("fill", "rgb(64,64,64)");

	svg.append("rect")
		.attr("x", totalWidth - 525)
		.attr("y", 50)
		.attr("width", 350)
		.attr("height", 100)
		.style("fill", "rgb(32,32,32)");

	svg.append("text")
		.attr("x", totalWidth - 390)
		.attr("y", 45)
		.attr("fill", "black")
		.attr("font-family", "arial")
		.attr("font-size", "30px")
		.text("State");

	svg.append("text")
		.attr("text-anchor", "end")
		.attr("x", 575)
		.attr("y", 50)
		.attr("fill", "white")
		.attr("font-family", "arial")
		.attr("font-size", "25px")
		.text("Cyber Breaches in the United States of America");


	var minibox = svg.append("svg")
		.attr("id", "minibox")
		.attr("x", "1035")
		.attr("y", "275")
		.append("g");

	minibox.append("rect")
		.attr("class", "lg");

}

function hexColor(index) {
	if (ppl_affected[index] > 1000000) {
		return("rgb(150,0,0)");
	} else if (ppl_affected[index] < 100000) {
		return("rgb(0, 0, 204)");
	} else if (ppl_affected[index] <= 1000000 && ppl_affected[index] >= 100000) {
		return("rgb(102, 0, 102)");
	} else {
		return("rgb(255, 255, 255)");
	}
}

function storeAffected() {
	d3.csv("cyberSecurityBreaches.csv").then(function(data) {
		data.forEach(function(d) {
			d["Individuals_Affected"] = +d["Individuals_Affected"];
		});

		var ind_aff = 0;
		for (var i = 0; i < states.length; i++) {
			if (ppl_affected.length == states.length) {
				break;
			}
			for (var j = 0; j < data.length; j++) {
				if (data[j]["State"] === states[i][0]) {
					ind_aff += data[j]["Individuals_Affected"];
				}
			}
			ppl_affected.push(ind_aff);
			ind_aff = 0;
		}

	});
}
function createGraph(index) {
	let chart = d3.select("#year");
	makeInnerArea(chart);

	let data = d3.csv("cyberSecurityBreaches.csv", function (d, i, names) {
		return {
			year: +d.year,
			affected: +d["Individuals_Affected"]
		};
	}).then(function (data) {

		var svg = d3.select("#year").append("svg")
			.attr("width", totalWidth + margins.left + margins.right)
			.attr("height", totalHeight + margins.top + margins.bottom)
			.append("g")
			.attr("transform", "translate(" + margins.left + "," + margins.top + ")");


		// Add X axis --> it is a date format
		var x = d3.scaleTime()
			.domain(d3.extent(data, function(d) { return d.year; }))
			.range([ 0, 1000 ]);
		svg.append("g")
			.attr("transform", "translate(0," + 500 + ")")
			.call(d3.axisBottom(x));

		// Add Y axis
		var y = d3.scaleLinear()
			.domain([0, d3.max(data, function(d) { return +d.affected; })])
			.range([ 500, 0 ]);
		svg.append("g")
			.call(d3.axisLeft(y));

		// Add the line
		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)
			.attr("d", d3.line()
				.x(function(d) { return x(d.year) })
				.y(function(d) { return y(d.affected) })
			)
	});

}

function mousehover(index) {
	var svg = d3.select("#state").append("svg")
		.attr("width", totalWidth + margins.left + margins.right)
		.attr("height", totalHeight + margins.top + margins.bottom)
		.append("g")
		.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

	svg.append("text")
		.attr("id", "stateStat")
		.attr("x", totalWidth - 390)
		.attr("y", 115)
		.attr("fill", "white")
		.attr("font-family", "arial")
		.attr("font-size", "50px")
		.text(states[index][0]);

	svg.append("text")
		.attr("id", "attackStat")
		.attr("x", totalWidth - 550)
		.attr("y", 215)
		.attr("fill", "white")
		.attr("font-family", "arial")
		.attr("font-size", "20px")
		.text("Total Number of People Affected: " + ppl_affected[index]);

}

function clearInfo() {
	document.getElementById("stateStat").remove();
	document.getElementById("attackStat").remove();
}

function makeInnerArea(chart) {
	chart.append("rect")
		.attr("class", "inner")
		.attr("x", margins.left)
		.attr("y", margins.top)
		.attr("width", innerWidth)
		.attr("height", innerHeight)
		.attr("fill", "black");
}
function test() {
	console.log("hi");
}

function translate(x, y) {
	return `translate (${x}, ${y})`;
}
