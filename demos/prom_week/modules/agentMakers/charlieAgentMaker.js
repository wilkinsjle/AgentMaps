//Return a GeoJSON feature representing an agent.
export function charlieAgentMaker(id) {
	//Decide whether the agent will be homebound.
	var homebound = Math.random() < .25 ? true : false;

	//Get a random residential unit and its center.
	var random_residential_index = Math.floor(Math.random() * this.zoned_units.residential.length),
	random_residential_unit_id = this.zoned_units.residential[random_residential_index];

	//Store the residential unit's ID as the agent's home ID.
	var home_id = random_residential_unit_id;

	var go_home_interval = null,
	workplace_id = null,
	first_go_work_interval = null;
	go_work_interval = null;

	if (true) {
		//Get a random campus unit and its ID.
		var random_workplace_index = Math.floor(this.zoned_units.campus.length * Math.random()),
		random_workplace_id = this.zoned_units.campus[random_workplace_index];

		//Store the commercial unit's ID as the agent's workplace ID.
		workplace_id = random_workplace_id;

		//Approximately many ticks until any agent goes to work or back home will be based on these numbers.
		//Make the first commute to work come quicker than any subsequent ones.
		var first_go_work_base_interval = 300,
		go_work_base_interval = 900,
		go_home_base_interval = 900;

		//Randomize how early or late agents make their commute.
		var sign = Math.random() < .5 ? 1 : -1,
		go_home_randomizer = sign * Math.floor(Math.random() * 200),
		go_work_randomizer = -sign * Math.floor(Math.random() * 200);

		first_go_work_interval = first_go_work_base_interval + go_work_randomizer,
		go_work_interval = go_work_base_interval + go_work_randomizer,
		go_home_interval = go_home_base_interval - go_home_randomizer;
	}

	//Get the agent's starting position.
	var home_unit = this.units.getLayer(home_id),
	home_center_coords = L.A.pointToCoordinateArray(home_unit.getCenter());

	var feature = {
		"type": "Feature",
		"properties": {
			"place": {
				"type": "unit",
				"id": home_id
			},
			"layer_options": {
				"color": "blue",
				"radius": 7.5
			},
      "name": "Charlie",
			"recent_unit_id": home_id,
			"homebound": homebound,
			"next_commute": "work",
			"commuting": false,
			"home_id": home_id,
			"workplace_id": workplace_id,
			"first_go_work_interval": first_go_work_interval,
			"go_work_interval": go_work_interval,
			"go_home_interval": go_home_interval,
			"commute_alarm": first_go_work_interval,
			"found_date": false,
			"recovery_tick": 0,
		},
		"geometry": {
			"type": "Point",
			"coordinates": home_center_coords
		}
	};

	return feature;
}
