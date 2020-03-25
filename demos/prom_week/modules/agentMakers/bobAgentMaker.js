//Return a GeoJSON feature representing an agent.
function bobAgentMaker(id) {
  //Is it schooltime, yes or no!
  var schooltime = false

	//Get a random residential unit and its center.
	var random_residential_index = Math.floor(Math.random() * this.zoned_units.dorms.length),
	random_residential_unit_id = this.zoned_units.dorms[random_residential_index];

	//Store the residential unit's ID as the agent's home ID.
	var home_id = random_residential_unit_id;

	var go_home_interval = null,
	class_id = null;

  //Get a random campus unit and its ID.
  var random_workplace_index = Math.floor(this.zoned_units.classrooms.length * Math.random()),
  random_class1_id = this.zoned_units.classrooms[random_workplace_index];
  var random_workplace_index = Math.floor(this.zoned_units.classrooms.length * Math.random()),
  random_class2_id = this.zoned_units.classrooms[random_workplace_index];
  var random_workplace_index = Math.floor(this.zoned_units.classrooms.length * Math.random()),
  random_class3_id = this.zoned_units.classrooms[random_workplace_index];

  //Store the commercial unit's ID as the agent's workplace ID.
  class1_id = random_class1_id;
  class2_id = random_class2_id;
  class3_id = random_class3_id;
  //i'll need three different calss ids

	//Get the agent's starting position.
	var home_unit = this.units.getLayer(home_id),
	home_center_coords = L.A.pointToCoordinateArray(home_unit.getCenter());

  var first_go_class_interval = 900;
  var stay_class_interval = 200;
  var stay_home_interval = 1800;

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
      "name": "Alice",
			"schooltime": schooltime,
      "next_commute": "class1",
			"commuting": false,
			"home_id": home_id,
			"class1_id": class1_id,
      "class2_id": class2_id,
      "class3_id": class3_id,
			"found_date": false,
      "first_go_class_interval": first_go_class_interval,
      "stay_class_interval": stay_class_interval,
      "stay_home_interval": stay_home_interval,
      "commute_alarm": first_go_class_interval,
		},
		"geometry": {
			"type": "Point",
			"coordinates": home_center_coords
		}
	};

	return feature;
}
