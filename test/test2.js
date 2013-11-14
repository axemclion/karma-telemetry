var css = {
	'width': '300px',
	'height': '300px',
	'margin': '10px',
	'borderRadius': '400px',
	'backgroundColor': '#840b2a'
};

for (var i = 0; i < 10; i++) {
	var x = document.createElement('div');
	for (var key in css) {
		x.style[key] = css[key];
	}
	document.body.appendChild(x);
}