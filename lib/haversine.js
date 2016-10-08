const R = 6371e3; /* radius of earth */
const radians = Math.PI / 180;

module.exports = (lon1, lat1, lon2, lat2) => { /* return distance between two points in meters */
	lat1 *= radians;
	lat2 *= radians;
	const dLat = (lat1 - lat2) * radians;
	const dLon = (lon1 - lon2) * radians;

	const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1) * Math.cos(lat2) *
		Math.sin(dLon/2) * Math.sin(dLon/2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;

	return d;
};
