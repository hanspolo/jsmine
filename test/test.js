function test()
{

	loadHtml('./tmpl1.html', function(data) {
		var t = new Template();
		t.set('title', 'Hello World');
		t.set('place', 'World');
		t.setHtml(data);
		printHtml('Template 1', t.serve());
	});

	loadHtml('./tmpl2.html', function(data) {
		var entries = new Array();
		entries[0] = new Object();
		entries[1] = new Object();

		entries[0]['name'] = 'Eintrag 1';
		entries[1]['name'] = 'Eintrag 2';

		var t = new Template();
		t.set('entries', entries);
		t.setHtml(data);
		printHtml('Template 2', t.serve());
	});

	loadHtml('./tmpl3.html', function(data) {
		var entries = new Array();
		entries[0] = new Object();
		entries[1] = new Object();

		entries[0]['name'] = 'Eintrag 1';
		entries[1]['name'] = 'Eintrag 2';

		var t = new Template();
		t.set('entries', entries);
		t.setHtml(data);
		printHtml('Template 3', t.serve());
	});

	loadHtml('./tmpl4.html', function(data) {
		var t = new Template();
		t.set('itestValue', 1);
		t.set('btestPositive', true);
		t.set('btestNegative', false);
		t.setHtml(data);
		printHtml('Template 4', t.serve());
	});

	loadHtml('./tmpl5.html', function(data) {
		var entries = new Array();
		entries[0] = new Object();
		entries[1] = new Object();

		entries[0]['name'] = 'Eintrag 1';
		entries[1]['name'] = 'Eintrag 2';

console.debug(entries);
		var t = new Template();
		t.set('entries', entries);
		t.setHtml(data);
		printHtml('Template 5', t.serve());
	});

}


function loadHtml(url, callback)
{
	$.ajax({
		url: url,
		success: callback
	});
}

function printHtml(title, text)
{
	text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	$('#output').append('<div><h2>' + title + '</h2><pre>' + text + '</pre></div>');
}
