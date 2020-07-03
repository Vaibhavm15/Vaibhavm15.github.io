
display_box  = d3.select("#display");
explain_box = d3.select("#explain");
tooltip = d3.select("#tooltip_airports")
            .style("opacity" , 0);
can_explain  = d3.select("#can_info")
can_description = d3.select("#can_description")
can_tooltip = d3.select("#can_tooltip")
                .style("opacity" , 1)
                .style("position" , "absolute")
tooltip_trends = d3.select('#tooltip_trend')
                .style("opacity" , 0)
                .style("position" , "absolute");

trend_info = d3.select("#can_trend_info");

stack_tooltip = d3.select('#stack_tooltip')
              .style("position" , "absolute");
bubble_info = d3.select("#bubble_info")

show_cancellation_map = function(data , trial , path){
  var states = topojson.feature(data , data.objects.states ).features

  for (var i = 0; i < trial.length; i++) {
       // Grab State Name
       var dataState = trial[i].id;
       // Grab data value
       var dataValue = trial[i].value;
       var state_name = trial[i].state;
      // Find the corresponding state inside the GeoJSON
       for (var j = 0; j < states.length; j++) {
         var jsonState = states[j].id;
         if (dataState == jsonState) {
           // Copy the data value into the JSON
           states[j].amount = dataValue;
           states[j].state_name = state_name
           // Stop looking through the JSON
           break;
         }
       }
     }

     var minVal = d3.min(trial, function(d) { return +d.value;} )
     var maxVal = d3.max(trial, function(d) { return +d.value;} )
     var ramp = d3.scaleLinear().domain([minVal,maxVal]).range(["white","red"])


  var US_State = svg.selectAll(".state")
      .data(states)
      .enter().append("path")
      .attr("class" , "state")
      .attr("d" , path)
      .style("fill", function(d) {
        return ramp(d.amount)
       });
       d3.select("#explain").html("")
       selected = undefined;
       display_box.html("")
       explain_box
       .html("This map displays the percentage of flight cancellation in each state. Click on the state to see more information about it. The dots here represents the position of airports across U.S. Hover over the dots to view the name of the airports and number of flights that flew from that airport in year 2015 and the routes the airport connects.")
       .style("font-size" , "20px" )

       US_State
       .on('click' , function(d){
         if(selected == this){
          US_State.style("stroke" , "grey")
                  .style("stroke-width" , 1)
                  .style("opacity" , 1);
          display_box.html("")
          explain_box.html("This map displays the percentage of flight cancellation in each state. Click on the state to see more information about it. The dots here represents the position of airports across U.S. Hover over the dots to view the name of the airports and number of flights that flew from that airport in year 2015 and the routes the airport connects.")
          selected = undefined;
           }
         else{
           selected = this;
           US_State.style("stroke" , "grey")
                    .style("stroke-width" , 1)
                    .style("opacity" , 0.2);
           display_box.html(d.state_name + "<br>" +  parseFloat(d.amount).toFixed(2) + "%")
           explain_box.html("The above value represents the percentage of flights that were cancelled in the above state out of the total flights in the state for year 2015")

           d3.select(selected).style("stroke" , "purple")
                              .style("stroke-width" , 4)
                              .style("opacity" , 1);
          }
       }
     )
    d3.selectAll("#leg").remove()

     var w = 50, h = 300;

		var key = d3.select("#map")
			.append("svg")
      .attr("id" , "leg")
			.attr("width", w)
			.attr("height", h+20)
			.attr("class", "legend");

		var legend = key.append("defs")
			.append("leg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "red")
			.attr("stop-opacity", 1);

		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "white")
			.attr("stop-opacity", 1);

		key.append("rect")
			.attr("width", w-30)
			.attr("height", h+10)
			.style("fill", "url(#gradient)")
			// .attr("transform", "translate(0,10)");

		var y = d3.scaleLinear()
			.range([h, 0])
			.domain([minVal, maxVal]);


		var yAxis = d3.axisRight(y);

		key.append("g")
			.attr("class", "ylegaxis")
			.attr("transform", "translate(20,10)")
			.call(yAxis)

}

show_delays_map = function(data , trial , path ){

  var states = topojson.feature(data , data.objects.states ).features

  for (var i = 0; i < trial.length; i++) {
       // Grab State Name
       var dataState = trial[i].id;
       // Grab data value
       var dataValue = trial[i].value;
       var state_name = trial[i].name;
      // Find the corresponding state inside the GeoJSON
       for (var j = 0; j < states.length; j++) {
         var jsonState = states[j].id;
         if (dataState == jsonState) {
           // Copy the data value into the JSON
           states[j].amount = dataValue;
           states[j].state_name = state_name;
           // Stop looking through the JSON
           break;
         }
       }
     }

     var minVal = d3.min(trial, function(d) { return +d.value;} )
     var maxVal = d3.max(trial, function(d) { return +d.value;} )
     var ramp = d3.scaleLinear().domain([minVal,maxVal]).range(["white","blue"])


  var US_State = svg.selectAll(".state")
      .data(states)
      .enter().append("path")
      .attr("class" , "state")
      .attr("d" , path)
      .style("fill", function(d) {
        return ramp(d.amount)
       });

       selected = undefined;
       display_box.html("");
       explain_box
       .html("This map displays the average time the flights gets delayed at each state. Click on the the state to display the mean time and the state name.The circles represents the airport at each state. Hover on the circles to know the number of flights that flew from that airport and the name of the airport ")
       .style("font-size" , "20px" )

       US_State
       .on('click' , function(d){
         if(selected == this){
           US_State.style("stroke" , "grey")
                   .style("stroke-width" , 1)
                   .style("opacity" , 1);
           display_box.html("");
           explain_box
           .html("This map displays the average time the flights gets delayed at each state. Click on the the state to display the mean time and the state name.The circles represents the airport at each state. Hover on the circles to know the number of flights that flew from that airport and the name of the airport ")

          selected = undefined;
           }
         else{
           selected = this;
           US_State.style("stroke" , "grey")
                    .style("stroke-width" , 1)
                    .style("opacity" , 0.2);
           display_box.html(d.state_name + "<br>" + parseFloat(d.amount).toFixed(2) + " minutes" )
           explain_box.html("The above value represents the mean of delay faced by passenger at each state in year 2015")

           d3.select(selected).style("stroke" , "purple")
                              .style("stroke-width" , 4)
                              .style("opacity" , 1);
          }
       }
     )
     d3.selectAll("#leg").remove()
     var w = 50, h = 300;

   var key = d3.select("#map")
     .append("svg")
      .attr("id" , "leg")
     .attr("width", w)
     .attr("height", h)
     .attr("class", "legend");

   var legend = key.append("defs")
     .append("svg:linearGradient")
     .attr("id", "gradient")
     .attr("x1", "100%")
     .attr("y1", "0%")
     .attr("x2", "100%")
     .attr("y2", "100%")
     .attr("spreadMethod", "pad");

   legend.append("stop")
     .attr("offset", "0%")
     .attr("stop-color", "blue")
     .attr("stop-opacity", 1);

   legend.append("stop")
     .attr("offset", "100%")
     .attr("stop-color", "white")
     .attr("stop-opacity", 1);

   key.append("rect")
     .attr("width", w-30)
     .attr("height", h)
     .style("fill", "url(#gradient)")
     .attr("transform", "translate(0,0)");

   var y = d3.scaleLinear()
     .range([h-10, 0])
     .domain([minVal, maxVal]);


   var yAxis = d3.axisRight(y);

   key.append("g")
     .attr("class", "y axis")
     .attr("class", "ylegaxis")
     .attr("transform", "translate(20,10)")
     .call(yAxis)

}

show_general_map = function(data , trial , path ){

  var states = topojson.feature(data , data.objects.states ).features

  for (var i = 0; i < trial.length; i++) {
       // Grab State Name
       var dataState = trial[i].id;
       // Grab data value
       var dataValue = trial[i].value;
       var state_name = trial[i].name;
      // Find the corresponding state inside the GeoJSON
       for (var j = 0; j < states.length; j++) {
         var jsonState = states[j].id;
         if (dataState == jsonState) {
           // Copy the data value into the JSON
           states[j].amount = dataValue;
           states[j].state_name = state_name;
           // Stop looking through the JSON
           break;
         }
       }
     }

     var minVal = d3.min(trial, function(d) { return +d.value;} )
     var maxVal = d3.max(trial, function(d) { return +d.value;} )
     var ramp = d3.scaleLinear().domain([minVal,maxVal]).range(["white","yellow"])


  var US_State = svg.selectAll(".state")
      .data(states)
      .enter().append("path")
      .attr("class" , "state")
      .attr("d" , path)
      .style("fill", function(d) {
        return ramp(d.amount)
       });

       selected = undefined;

       display_box.html("")
       explain_box
       .html("This map gives a general distribution of domestic flight all over U.S. in year 2015. The color represents the percentage of flights that flew from a particular state of the total flights. Click on the state to know the exact percentage and state name. Hover on the circle to know the number of flights that flew from the partical airport ")
       .style("font-size" , "20px" )

       US_State
       .on('click' , function(d){
         if(selected == this){
           US_State.style("stroke" , "grey")
                   .style("stroke-width" , 1)
                   .style("opacity" , 1);
           display_box.html("");
           explain_box.html("This map gives a general distribution of domestic flight all over U.S. in year 2015. The color represents the percentage of flights that flew from a particular state of the total flights. Click on the state to know the exact percentage and state name. Hover on the circle to know the number of flights that flew from the partical airport ")
          selected = undefined;
           }
         else{
           selected = this;
           US_State.style("stroke" , "grey")
                    .style("stroke-width" , 1)
                    .style("opacity" , 0.2);
           display_box.html(d.state_name + "<br>" + parseFloat(d.amount).toFixed(2) + "%" )
           explain_box.html("The above values represents the percentage of flights that flew from the mentioned states out of the total flights flown in year 2015 in U.S.")

           d3.select(selected).style("stroke" , "purple")
                              .style("stroke-width" , 4)
                              .style("opacity" , 1);
          }
       }
     )
       d3.selectAll("#leg").remove()
     var w = 50, h = 300;

   var key = d3.select("#map")
     .append("svg")
      .attr("id" , "leg")
     .attr("width", w)
     .attr("height", h)
     .attr("class", "legend");

   var legend = key.append("defs")
     .append("svg:linearGradient")
     .attr("id", "gradient")
     .attr("x1", "100%")
     .attr("y1", "0%")
     .attr("x2", "100%")
     .attr("y2", "100%")
     .attr("spreadMethod", "pad");

   legend.append("stop")
     .attr("offset", "0%")
     .attr("stop-color", "yellow")
     .attr("stop-opacity", 1);

   legend.append("stop")
     .attr("offset", "100%")
     .attr("stop-color", "white")
     .attr("stop-opacity", 1);

   key.append("rect")
     .attr("width", w-30)
     .attr("height", h)
     .style("fill", "url(#gradient)")
     .attr("transform", "translate(0,0)");

   var y = d3.scaleLinear()
     .range([h, 0])
     .domain([minVal, maxVal]);

   var yAxis = d3.axisRight(y);

   key.append("g")
     .attr("class", "y axis")
     .attr("class", "ylegaxis")
     .attr("transform", "translate(20,10)")
     .call(yAxis)


}

add_airports = function(airport, gen_routes){


     var minVal = d3.min(airport, function(d) { return d.count;} )

     var maxVal = 379424;

     var ramps = d3.scaleLinear().domain([minVal,maxVal]).range(["orange","purple"])


  route_lines =   svg.selectAll(".fly")
      .data(gen_routes)
      .enter().append("line")
      .attr("x1" , function(d){
        coords = projection([d.source_long , d.source_lat])
        if (coords != null){
          return coords[0]
        }
      })
      .attr("y1" , function(d){
        coords = projection([d.source_long , d.source_lat])
        if (coords != null){
          return coords[1]
        }
      })
      .attr("x2" , function(d){
        coords = projection([d.target_long , d.target_lat])
        if (coords != null){
          return coords[0]
        }
      })
      .attr("y2" , function(d){
        coords = projection([d.target_long , d.target_lat])
        if (coords != null){
          return coords[1]
        }
      })
      .attr("stroke" , "cyan")
      .style("opacity" , 0);

      airport_points = svg.selectAll(".points")
        .data(airport)
        .enter().append("circle");

      airport_points
        .transition()
        .duration(2000)
        .attr("class" , "points")
        .attr("cx" , function(d){
          coords = projection([d.LONGITUDE,d.LATITUDE])
          if(coords != null){return coords[0];}
          })
        .attr("cy" , function(d){
          coords = projection([d.LONGITUDE,d.LATITUDE])
          if(coords != null){return coords[1]}

        })
        .attr("r" , "5")
        .attr("fill", function(d) {
          return ramps(d.count);
         });


    airport_points
    .on("mousemove" , function(d){

      coords = projection([d.LONGITUDE,d.LATITUDE])

    tooltip
      .style("left",coords[0]+15 + "px")
      .style("top",coords[1]+10+"px")
      .style("opacity" , 1);

      tooltip
      .html(d.AIRPORT + "<br>" + "no. of flights: " +d.count )

      d3.select(this).style("border" , "purple").style("r" , 6)
      route_lines.style("opacity" , function(route_d){
      return route_d.airport == d.AIRPORT ? 1 : 0;
      });
      route_lines.style("stroke-width" , function(route_d){
      return route_d.airport == d.AIRPORT ? 1.5 : 0;
      });
    })
    airport_points.on("mouseout" , function(d){
      tooltip
      .style("left",0+"px")
      .style("top",0+"px")
      .style("opacity" , 0);

      airport_points.style("border-color" , "dimgray").style("r" , 4.5)
      route_lines.style("opacity" , 0);
      route_lines.style("stroke-width" ,0)
    });



    // /////////////////////
    d3.select("#leg_circle").remove();


     var w = 80, h = 150;

    var key = d3.select("#map")
      .append("svg")
      .attr("id" , "leg_circle")
      .attr("width", w)
      .attr("height", h);


    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradients")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "purple")
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "orange")
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", w-60)
      .attr("height", h)
      .style("fill", "url(#gradients)")
      // .attr("transform", "translate(0,10)");

    var ys = d3.scaleLinear()
      .range([h, 0])
      .domain([minVal, maxVal]);


    var yAxiss = d3.axisRight(ys);

    key.append("g")
      .attr("class", "ylegaxis_circ")
      .attr("transform", "translate(20,0)")
      .call(yAxiss)



    // /////////////////////
}

add_cancellation_graph = function(cancellation_reasons){
  var margin_1 = {top: 0, right: 20, bottom: 30, left: 70},
      width_1 = 500 - margin_1.left - margin_1.right,
      height_1 = 350 - margin_1.top - margin_1.bottom;

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width_1])
            .padding(0.2);
  var y = d3.scaleLinear()
            .range([height_1, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg_new = d3.select("#cancellation").append("svg")
      .attr("width", width_1 + margin_1.left + margin_1.right)
      .attr("height", height_1 + margin.top + margin_1.bottom)
      .append("g")
      .attr("transform", "translate(" + margin_1.left + "," + margin_1.top + ")");

    // format the data

    // Scale the range of the data in the domains
    x.domain(cancellation_reasons.map(function(d) { return d.CANCELLATION_REASON; }));
    y.domain([0, d3.max(cancellation_reasons, function(d) { return d.n; })]);

    // append the rectangles for the bar chart
    bar_graph_1 =  svg_new.selectAll(".cancel_reason_bars")
      .data(cancellation_reasons)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.CANCELLATION_REASON); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.n); })
        .attr("height", function(d) { return height_1 - y(d.n); })
        .attr("fill","#7a8ab1")
        .attr("stroke" , "#2a222b")
        .attr("stroke-width" , 5);
    // add the x Axis

    svg_new.append("g")
        .attr("transform", "translate(0," + height_1 + ")")
        .attr("class" , "can_graph_x")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg_new.append("g")
        .attr("class" , "can_graph_y")
        .call(d3.axisLeft(y));
        can_description.html("Click on the graph to know more")
  selected = undefined;
  bar_graph_1
  .on('click' , function(d){
    if(selected == this){
     bar_graph_1.attr("fill" , "#7a8ab1")
     can_explain.html("")
     can_description.html("Click on the graph to know more")
     selected = undefined;
      }
    else{
      selected = this;
      bar_graph_1.attr("fill" , "#7a8ab1")
      can_explain.html("")
      d3.select(selected).attr("fill" , "blue")

      if (d.CANCELLATION_REASON == "Weather"){
      can_explain.html(d.CANCELLATION_REASON)
      can_description.html("Weather is the most common reason of cancellation. 54% of the total cancelled flights were cancelled due to severe weather conditions")
      }
      else if (d.CANCELLATION_REASON == "Airline/Carrier") {
        can_description.html("This is the second most common reason for flight cancellations. About 28% of total cancelled flights were cancelled due to Airline or Carrier mismanagement")
        can_explain.html(d.CANCELLATION_REASON)
      }
      else if (d.CANCELLATION_REASON == "National Air System") {
            can_description.html("National Air System faults merely caused the cancellation of flights in U.S.for year 2015 with less than 20 % of the total cancelled flights cancelled due to National Air System related reasons.");
            can_explain.html(d.CANCELLATION_REASON)

      }
      else{
          can_explain.html(d.CANCELLATION_REASON)
            can_description.html("")
      }

     }
  })
  .on("mousemove" , function(d){
       can_tooltip.html(d.n+"%")
       .style("opacity", 1)
       .style("top" ,y(d.n)+65+"px")
       .style("left" ,  x(d.CANCELLATION_REASON)+80+"px");
  })
  .on("mouseout" , function(d){
    can_tooltip.html("")
    .style("opacity" , 0)
    .style("top" , 0)
    .style("left" , 0)
  });
}

add_cancellation_month = function(cancellation_month){
  d3.select("#can_month").remove()
  var margin_1 = {top: 10, right: 20, bottom: 30, left: 50}
    , width_1 = 500 - margin_1.left - margin_1.right
    , height_1 = 320 - margin_1.top - margin_1.bottom;

  // The number of datapoints
  var n = 21;

  // 5. X scale will use the index of our data
  var xScale = d3.scaleBand()
            .range([0, width_1])
            .padding(0.1); // output

  xScale.domain(cancellation_month.map(function(d) { return d.MONTH; }));
  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
      .domain([0, d3.max(cancellation_month, function(d) { return +d.n;} )]) // input
      .range([height_1, 0]); // output

  // 7. d3's line generator
  var line = d3.line()
      .x(function(d) { return xScale(d.MONTH); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.n); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number


  // 1. Add the SVG to the page and employ #2
  var svg_1 = d3.select("#cancellation").append("svg")
      .attr("id" , "can_month")
      .attr("width", width_1 + margin_1.left + margin_1.right)
      .attr("height", height_1 + margin_1.top + margin_1.bottom)
    .append("g")
      .attr("transform", "translate(" + margin_1.left + "," + margin_1.top + ")");

  // 3. Call the x axis in a group tag
  svg_1.append("g")
      .attr("class" , "trend_month_x")
      .attr("transform", "translate(0," + height_1 + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg_1.append("g")
  .attr("class" , "trend_month_y")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg_1.append("path")
      .datum(cancellation_month) // 10. Binds data to the line
      .attr("class", "line_month") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator


      trend_info.html("February experienced the maximum cancellations in year 2015, followed by January and March. There is a steep decrease in cancellations after February")
  // 12. Appends a circle for each datapoint
  circle = svg_1.selectAll(".dot_month")
    .data(cancellation_month)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot_month") // Assign a class for styling
      .attr("cx", function(d) {  return xScale(d.MONTH); })
      .attr("cy", function(d) { return yScale(d.n) })
      .attr("r", 5)
      .on("mousemove" , function(d){
        d3.select(this).attr("r" , "7").style("fill" , "blue")
        tooltip_trends
        .style("opacity" , 1)
        .style("left" ,  xScale(d.MONTH)+770+"px")
        .style("top" ,   yScale(d.n)+65+"px")
        .html(d.n);
      })
      .on("mouseout" , function(d){
        circle.attr("r" , "5").style("fill", "red")
        tooltip_trends
        .style("opacity" , 0)
        .style("left" , 0)
        .style("top" ,   0)
        .html("");
      });
      d3.select("#can_option_x").html("Month")
}

add_cancellation_week = function(cancellation_week){

  d3.select("#can_month").remove()
  var margin_1 = {top: 10, right: 20, bottom: 30, left: 50}
    , width_1 = 500 - margin_1.left - margin_1.right
    , height_1 = 320 - margin_1.top - margin_1.bottom;


  // 5. X scale will use the index of our data
  var xScale = d3.scaleBand()
            .range([0, width_1])
            .padding(0.1); // output

  xScale.domain(cancellation_week.map(function(d) { return d.DAY_OF_WEEK; }));
  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
      .domain([0, d3.max(cancellation_week, function(d) { return +d.n;} )]) // input
      .range([height_1, 0]); // output

  // 7. d3's line generator
  var line = d3.line()
      .x(function(d) { return xScale(d.DAY_OF_WEEK); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.n); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number


  // 1. Add the SVG to the page and employ #2
  var svg_1 = d3.select("#cancellation").append("svg")
      .attr("id" , "can_month")
      .attr("width", width_1 + margin_1.left + margin_1.right)
      .attr("height", height_1 + margin_1.top + margin_1.bottom)
    .append("g")
      .attr("transform", "translate(" + margin_1.left + "," + margin_1.top + ")");

  // 3. Call the x axis in a group tag
  svg_1.append("g")
      .attr("transform", "translate(0," + height_1 + ")")
      .attr("class" , "trend_month_x")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg_1.append("g")
  .attr("class" , "trend_month_y")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg_1.append("path")
      .datum(cancellation_week)// 10. Binds data to the line
      .attr("class", "line_week") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator

      trend_info.html("Flights cancellations were highest on Mondays and Tuesdays this is due to high number of flights during those days of week ")
  days = ["MON" , "TUE" , "WED" , "THU", "FRI" , "SAT" , "SUN"]
  // 12. Appends a circle for each datapoint
  circle = svg_1.selectAll(".dot_month")
    .data(cancellation_week)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot_month") // Assign a class for styling
      .attr("cx", function(d) {  return xScale(d.DAY_OF_WEEK); })
      .attr("cy", function(d) { return yScale(d.n) })
      .attr("r", 5)
      .on("mousemove" , function(d){
        d3.select(this).attr("r" , "7").style("fill" , "blue")

        tooltip_trends
        .style("opacity" , 1)
        .style("left" ,  xScale(d.DAY_OF_WEEK)+770+"px")
        .style("top" ,   yScale(d.n)+60+"px")
        .html(days[d.DAY_OF_WEEK-1]+"<br>"+d.n);
      })
      .on("mouseout" , function(d){
        circle.attr("r" , "5").style("fill", "red")
        tooltip_trends
        .style("opacity" , 0)
        .style("left" , 0)
        .style("top" ,   0)
        .html("");
      });
      d3.select("#can_option_x").html("Day of Week");
}

show_cancellation_stack = function(cancel_flights_res){

  margin_1 = {top: 20, right: 20, bottom: 30, left: 50},
  width_1 = 1000 - margin_1.left - margin_1.right,
  height_1 =400 - margin_1.top - margin_1.bottom;

  var svg = d3.select("#can_flight_res")
  .append("svg")
  .attr("id" , "can_res_stack")
  .attr("width", width_1 + margin_1.left + margin_1.right)
  .attr("height", height_1 + margin_1.top + margin_1.bottom)
  g = svg.append("g").attr("transform", "translate(" + margin_1.left + "," + margin_1.top + ")");


    var x = d3.scaleBand()
        .rangeRound([0, width_1])
        .paddingInner(0.05)
        .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
        .rangeRound([height_1, 0]);

    // set the colors
    var z = d3.scaleOrdinal()
        .range(["#b33040", "#d25c4d", "#f2b447", "#d9d574"]);



    var keys = cancel_flights_res.columns.slice(1,5);


    x.domain(cancel_flights_res.map(function(d) { return d.Airline; }));
    y.domain([0, 17000]);
    z.domain(keys);

  stacks =   g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(cancel_flights_res))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Airline); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { stack_tooltip.html(""); tooltip.style("display", "none"); })
      .on("mousemove", function(d,i) {
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        stack_tooltip
          .style("margin-top" , 50 +"px")
          .style("margin-left" ,  xPosition+70+"px")
          .html(d.data.airline_name)
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d[1]-d[0]);
        console.log(y(d[0]))
      });
    //
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height_1 + ")")
        .style("font", "18px times")
        .style("stroke" , "white")
        .call(d3.axisBottom(x));

    g.append("g")
          .attr("class", "axis_y")
        .style("font", "18px times")
        .style("stroke" , "white")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#b00")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 18)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(150," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);




    legend.append("text")
        .attr("fill" , "white")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });


    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

      tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

     tooltip.append("text")
      .attr("x", 30)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
}

show_bubbles_flights = function(can_bubbles , type){

  if(type == "delay"){
    d3.select("#bubble_heading").html("Which airlines were the top 5 defaulters in terms of Delays? ")
  }
  else{
    d3.select("#bubble_heading").html("Which airlines were the top 5 defaulters in terms of Cancellations?")
  }

  d3.select("#bubbles_svg").remove()

  bubbles = d3.select("#bubbles")
          .append("svg")
          .attr("id" , "bubbles_svg")
          .attr("width" , 1270 )
          .attr("height" , 600 )


  x_array = [150 , 324+60 , 486+50+60, 648+100+50 , 810+160+11 ]
  r_array = [100 , 90 , 80 , 70 , 60 ]

  circs = bubbles.selectAll(".balls")
          .data(can_bubbles)
          .enter().append("circle")

       circs
        .attr("cy" , 400)
        .attr("cx" , "250")
        .attr("r" , 80)
        .attr("fill" , "orange");

        circs
          .transition()
          .duration(2000)
          .attr("cx" , function(d,i){return x_array[i]+200;})
          .attr("cy" , 250)
          .attr("r" , function(d,i){return r_array[i]-20;});

    nums = [1,2,3,4,5]
    text = bubbles.selectAll(".numbers")
                  .data(nums)
                  .enter().append("text")
                  .attr("x" ,  function(d,i){return x_array[i]+200;} )
                  .attr("y" , function(d,i){return r_array[i]+200;})
                  .text(function(d){return d;})
                  .attr("font-family", "sans-serif")
                  .attr("font-size", "30px")
                  .attr("fill", "red");



          prev = undefined;
          k = undefined;
          bubble_info.html("Cick on the circles to reveal")

      circs
          .on("mousemove" , function(d , i){
            d3.select(this).style("fill" , "chocolate");
          })
          .on("mouseout" , function(d){
            circs.style("fill" , "orange")
          })
          .on('click' , function(d,i){
            console.log(d)
            if( k != undefined){
              d3.select(prev)
                    .transition()
                    .duration(1000)
                    .attr("cx" , x_array[k]+200)
                    .attr("cy" , 250);
            bubble_info.html("Cick on the circles to reveal")
            };

            if(selected == this){

            d3.select(selected)
                .transition()
                .duration(1000)
                .attr("cx" , x_array[i]+200)
                .attr("cy" , 250);
            prev = this
            k = i
             selected = undefined;
              }

            else{
              if(type == "cancel"){
                  bubble_info.html("<span id = 'hello' >" + d.airline_name +"</span>" + "<br>"+ "Around "+ d.count + " %" + " of total flights that were scheduled by this airline were cancelled");
              }
              else{
                bubble_info.html("<span id = 'hello' >" + d.airline +"</span>" +"<br>"+ "On an average this Airlines had a delay of " + parseFloat(d.count).toFixed(2) + " minutes")
              };
              // bubble_info.html("<span id = 'hello' >" + d.airline +"</span>" + "&nbsp;&nbsp;&nbsp;" + parseFloat(d.count).toFixed(2))
              selected = this;
              d3.select(selected)
              .transition()
              .duration(1000)
              .attr("cy" , 400)
              .attr("cx" , "250")
              prev = this
              k = i
             }
          })
};
