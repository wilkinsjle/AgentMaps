//Given an array, return n random elements from it.
function pick_random_n(array, n) {
	if (array.length < n) {
		throw new Error("n cannot be bigger than the number of elements in the array!");
	}

	var random_indices = [];

	for (var i = 0; i < n; i++) {
		var random_index = Math.floor(Math.random() * array.length);
		if (!random_indices.includes(random_index)) {
			random_indices.push(random_index);
		}
		else {
			i--;
		}
	}

	var random_n = random_indices.map(function(index) {
		return array[index];
	});

	return random_n;
}
