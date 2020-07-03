
var margin = {top:0 , left:0 , right:0 , bottom:0 },
  height = 450 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var svg = d3.select("#map")
          .append("svg")
          .attr("id" , "choro")
          .attr("height" , height + margin.top , margin.bottom)
          .attr("width" , width + margin.left + margin.right)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.queue()
  .defer(d3.json , "us.json")
  .defer(d3.csv , "data/airports.csv")
  .defer(d3.csv , "data/cancel_map1.csv")
  .defer(d3.csv , "data/delay_map.csv")
  .defer(d3.csv , "data/general_map.csv")
  .defer(d3.csv , "data/flight_routes.csv")
  .defer(d3.csv , "data/cancellation_reason.csv")
  .defer(d3.csv , "data/cancellation_month.csv")
  .defer(d3.csv , "data/cancellation_week.csv")
  .defer(d3.csv , "data/cancel_flights_res.csv")
  .defer(d3.csv , "data/can_bubbles.csv" )
  .defer(d3.csv , "data/delay_bubbles.csv")
  .await(ready)

var projection = d3.geoAlbersUsa()
  .translate([width/2 , height/2])
  .scale(800)

var path = d3.geoPath()
  .projection(projection)


function ready (error , data , airport , cancel_map , delay_map , gen_map , gen_routes , cancellation_reasons , cancellation_month , cancellation_week , cancel_flights_res , can_bubbles , delay_bubbles)
{

show_cancellation_map(data , cancel_map ,  path)

add_airports(airport , gen_routes)

var dataDim = d3.select("#radio-toolbar")
dataDim.on("change", function(){
  var form_val = d3.select('input[name="mode"]:checked').property("id");
  console.log(form_val)
  if(form_val == "Cancellations"){

    svg.selectAll(".points").remove()
    svg.selectAll(".state").remove()
    show_cancellation_map(data , cancel_map ,  path)
    add_airports(airport , gen_routes)
  }
  else if (form_val == "Delays") {
    svg.selectAll(".state").remove()
    svg.selectAll(".points").remove()
    show_delays_map(data , delay_map ,  path)
    add_airports(airport , gen_routes)
  }
  else {
    d3.selectAll(".state").remove()
    d3.selectAll(".points").remove()
    show_general_map(data , gen_map ,  path)
    add_airports(airport , gen_routes)
  }
})


add_cancellation_graph(cancellation_reasons)
add_cancellation_month(cancellation_month)
var cancel_options = d3.select("#radios")
cancel_options.on("change", function(){
  var option_val = d3.select('input[name="cancel"]:checked').property("id");
  if (option_val == "month"){
    add_cancellation_month(cancellation_month )
  }
  else{
    add_cancellation_week(cancellation_week )
  }
});

show_cancellation_stack(cancel_flights_res)

show_bubbles_flights(can_bubbles, "cancel")


var bubbles_options = d3.select("#radios2")
bubbles_options.on("change", function(){
  var option_val = d3.select('input[name="bubble_mode"]:checked').property("id");
  if (option_val == "bub_Cancellations"){
  show_bubbles_flights(can_bubbles , "cancel")
  }
  else{
    show_bubbles_flights(delay_bubbles ,"delay")
  }
});

}
