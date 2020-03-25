/*						     */
/* Setup the AgentMaps simulation and its interface. */
/*						     */

/* map_data.js and units_data.js should be in the document. */

//Get some interface features.
var animation_interval_input = document.getElementById("animation_interval"),
speed_controller_input = document.getElementById("speed_controller"),
infection_probability_input = 0;

//Set bounds for the area on the map where the simulation will run (gotten from openstreetmap.org).
var bounding_box = [[39.9058, -86.0910], [39.8992, -86.1017]];

//Create and setup the Leafvar map object.
var map = L.map("map").fitBounds(bounding_box).setZoom(16);

//Get map graphics by adding OpenStreetMap tiles to the map object.
L.tileLayer(
	"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	{
		attribution: "Thanks to <a href=\"http://openstreetmap.org\">OpenStreetMap</a> community",
		maxZoom: 18,
	}
).addTo(map);

//Create an Agentmap.
var agentmap = L.A.agentmap(map);

//Setup the epidemic simulation.
function setup() {
	//Generate and display streets and units on the map.
	//Load the units from units_data instead of generating them from scratch to speed things up.
	agentmap.buildingify(bounding_box, map_data, undefined, {"color": "black", "weight": 1.5, "opacity": .6}, units_data, streets_data);

	//Split the map's units into residential and commercial zones.
	var residential_streets = ["Wythe Lane", "Heyward Lane", "Lynch Lane", "Clymer Lane"],
	campus_streets = ["Heyward Place", "Heyward Drive", "Hooper Place"];
	agentmap.zoned_units = getZonedUnits(agentmap, residential_streets, campus_streets);

	//Use only a subset of the zoned units.
	agentmap.zoned_units.dorms = pick_random_n(agentmap.zoned_units.dorms, 6),
	agentmap.zoned_units.classrooms = pick_random_n(agentmap.zoned_units.classrooms, 20);

	//Generate 5 agents according to the rules of aliceAgentMaker, displaying them as red, 7.5 meter radsius circles.
	agentmap.agentify(5, aliceAgentMaker);
	//Generate 5 agents according to the rules of bobAgentMaker, displaying them as red, 7.5 meter radsius circles.
  agentmap.agentify(5, bobAgentMaker);

	//Attach a popup to show when any agent is clicked.
	agentmap.agents.bindPopup(agentPopupMaker);

	//Set the default speed for the agent.
	agentmap.speed_controller = 5;

	//Do the following on each tick of the simulation.
	agentmap.controller = agentmapController;

	//Set each Agent up.
	agentmap.agents.eachLayer(function(agent) {
		//Add the agent's ID to its home unit's resident_ids array to help keep track of which agents are in the same unit.
		var home_unit = agentmap.units.getLayer(agent.home_id);
		home_unit.resident_ids.push(agent._leaflet_id);

		//Define the update_func for the agent.
		setAgentController(agent);
	});

	//Set the data displays and input options in the interface to their default values.
	defaultInterface();
}

/*                                                 */
/* Function definitions for everything done above. */
/*                                                 */

//Set the elements of the interface to their default values.
function defaultInterface() {
	speed_controller_input.value = agentmap.speed_controller,
	// infection_probability_input.value = agentmap.infection_probability,
	animation_interval_input.value = 5,
	ticks_display.textContent = "";
}

//Given an agent, return an HTML string to embed in a popup.
function agentPopupMaker(agent) {
	var message = "Name: " + agent.name + "</br>Prom Date: " + agent.found_date + "</br>Schooltime: " + agent.schooltime;

	return message;
}

//Given two arrays of streets and their agentmap, split their units into residential and commercial zones,
//and return their division.
function getZonedUnits(agentmap, dorm_streets, commercial_streets) {
	var zoned_units = {
		dorms: [],
		classrooms: []
	};

	//Find and store the units on the perimeter of the lower part of the neighborhood,
	//and along the streets in the upper part of the neighborhood.
	agentmap.units.eachLayer(function(unit) {
		var street_id = unit.street_id,
		street = agentmap.streets.getLayer(street_id),
		street_name = street.feature.properties.name;

		if (dorm_streets.includes(street_name)) {
			zoned_units.dorms.push(unit._leaflet_id);
		}

		if (commercial_streets.includes(street_name)) {
			zoned_units.classrooms.push(unit._leaflet_id);
		}

		//For each zoned unit, add an array to store which agents are in it for easy searching.
		unit.resident_ids = [];
	});

	return zoned_units;
}

//The controller function for the Agentmap.
function agentmapController() {
	//Set the tick display box to display the number of the current tick.
	ticks_display.textContent = agentmap.state.ticks;

	//Check if any of the options have been changed in the interface and update the Agentmap accordingly.
	if (agentmap.animation_interval !== Number(animation_interval_map[animation_interval_input.value])) {
		agentmap.setAnimationInterval(animation_interval_map[animation_interval_input.value]);
	}
	if (agentmap.speed_controller !== Number(speed_controller_input.value)) {
		agentmap.speed_controller = Number(speed_controller_input.value);
		agentmap.agents.eachLayer(function(agent) {
			agent.setSpeed(agentmap.speed_controller);
		});
	}
}

//Given an agent, define its controller in a way conducive to the epidemic simulation.
function setAgentController(agent) {
	//Do the following on each tick of the simulation for the agent.\

  agent.controller = function() {
    //Do this when the commute_alarm tick is reached.
    // console.log(agent)
    if (agent.agentmap.state.ticks !== 0) {
      if (agent.agentmap.state.ticks % agent.commute_alarm === 0) {
    		if (agent.next_commute == "class1") {
    			commuteToClass1(agent);
    		}
        else if (agent.next_commute == "class2") {
          commuteToClass2(agent);
        }
        else if (agent.next_commute == "class3") {
          commuteToClass3(agent);
        }
    		else if (agent.next_commute == "home") {
    			commuteToHome(agent);
    		}
      }
    }

		//Apply the agentmap's speed control whenever the agent decides to commute.
		agent.setSpeed(agent.agentmap.speed_controller);

  	//Have the agent move along its scheduled trip.
  	agent.moveIt();
  }

}

//Update the numbers in the display boxes in the HTML document.
function updateEpidemicStats(agentmap) {
	var infected_display = document.getElementById("infected_value");
	infected_display.textContent = agentmap.infected_count;

	var healthy_display = document.getElementById("healthy_value");
	healthy_display.textContent = agentmap.agents.count() - agentmap.infected_count;
}
