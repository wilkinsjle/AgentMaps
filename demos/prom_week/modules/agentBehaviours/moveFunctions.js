function commuteToHome(agent) {
	//Schedule the agent to move to a random point in its home and replace the currently scheduled trip.

  home_location = agent.agentmap.getUnitPoint(agent.home_id,Math.random(),Math.random());
  agent.scheduleTrip(home_location, {"type": "unit", "id": agent.home_id} , 1);

  agent.next_commute = "class1"
	agent.commute_alarm += agent.stay_home_interval;
}

function commuteToClass1(agent) {
	//Schedule the agent to move to a random point in its class and replace the currently scheduled trip.
  class_location = agent.agentmap.getUnitPoint(agent.class1_id,Math.random(),Math.random());
  agent.scheduleTrip(class_location, {"type": "unit", "id": agent.class1_id} , 1);

  agent.next_commute = "class2"
	agent.commute_alarm += agent.stay_class_interval;
}

function commuteToClass2(agent) {
	//Schedule the agent to move to a random point in its class and replace the currently scheduled trip.
  class_location = agent.agentmap.getUnitPoint(agent.class2_id,Math.random(),Math.random());
  agent.scheduleTrip(class_location, {"type": "unit", "id": agent.class2_id} , 1);

  agent.next_commute = "class3"
	agent.commute_alarm += agent.stay_class_interval;
}

function commuteToClass3(agent) {
	//Schedule the agent to move to a random point in its class and replace the currently scheduled trip.
  class_location = agent.agentmap.getUnitPoint(agent.class3_id,Math.random(),Math.random());
  agent.scheduleTrip(class_location, {"type": "unit", "id": agent.class3_id} , 1);

agent.next_commute = "home"
	agent.commute_alarm += agent.stay_class_interval;
}

// function setCommuteFlag(agent, flagBoolean) {
//   //set the commute flag to either tru or false.
//   agent.commuting = flagBoolean;
// }
//
// function getCommuteFlag(agent) {
//   //set the commute flag to either tru or false.
//   return agent.commuting;
// }
