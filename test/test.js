function test()
{
/*
	loadHtml('./tmpl1.html', function(data) {
		Template.set('title', 'Hello World');
		Template.set('place', 'World');
		Template.html = data;
		alert(Template.serve());
	});

	loadHtml('./tmpl2.html', function(data) {
		var entries = new Array();
		entries[0] = new Object();
		entries[1] = new Object();

		entries[0]['name'] = 'Eintrag 1';
		entries[1]['name'] = 'Eintrag 2';

		Template.set('entries', entries);
		Template.html = data;
		alert(Template.serve());
	});


	loadHtml('./tmpl3.html', function(data) {
		var entries = new Array();
		entries[0] = new Object();
		entries[1] = new Object();

		entries[0]['name'] = 'Eintrag 1';
		entries[1]['name'] = 'Eintrag 2';

		Template.set('entries', entries);
		Template.html = data;
		alert(Template.serve());
	});

	loadHtml('./tmpl4.html', function(data) {
		Template.set('itestValue', 1);
		Template.set('btestPositive', true);
		Template.set('btestNegative', false);
		Template.html = data;
		alert(Template.serve());
	});
*/
	loadHtml('./tmpl5.html', function(data) {
		var entries = new Array();
		entries[0] = new Object();
		entries[1] = new Object();

		entries[0]['name'] = 'Eintrag 1';
		entries[1]['name'] = 'Eintrag 2';

		Template.set('entries', entries);
		Template.html = data;
		alert(Template.serve());
	});

}


function loadHtml(url, callback)
{
	$.ajax({
		url: url,
		success: callback
	});
}

