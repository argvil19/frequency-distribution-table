var max = function(arr) {
	var max = 0;
	for (var i=0;i<arr.length;i++) {
		if (max < arr[i]) 
			max = arr[i];
	}

	return max;
}

var min = function(arr) {
	var min = arr[0];
	for (var i=0;i<arr.length;i++) {
		if (min > arr[i])
			min = arr[i];
	}

	return min;
}