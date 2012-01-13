var Template = 
{
	data: new Object(),
	html: "",

	set:
	function (key, value)
	{
		this.data[key] = value;
	},

	get:
	function (key)
	{
		var str = key.split('.');
		var temp = this.data[str[0]];

		for (var i = 1; i < str.length; i++)
		{
			temp = temp[str[i]];
		}

		return temp;
	},

	serve: 
	function ()
	{
		var result = this.translate(this.html);
		return result;
	},

	translate:
	function (text)
	{
		var firstRepeat = text.indexOf('<J:repeat');
		var firstCheck = text.indexOf('<J:check');
		var lastIndex;

		// Neither repeat nor check
		// So translate the Variables
		if ((firstRepeat == null || firstRepeat < 0) &&
			(firstCheck == null || firstCheck < 0))
		{
			var matches = text.match(/\{\{\@.+[^}].*\}\}/g);
			for (var i = 0; i < matches.length; i++)
			{
				var tmpVar = matches[i].substring(3, matches[i].length - 2);
				var parts = text.split(matches[i]);

				text = parts.join(this.get(tmpVar));
			}

			return text;
		}

		// Execute a repeat
		if (firstCheck == null || firstCheck < 0 ||
			firstRepeat < firstCheck)
		{
			lastIndex = text.lastIndexOf('</J:repeat>');
		}
		// Execute a Check
		else
		{
			lastIndex = text.lastIndexOf('</J:check>');
		}

		return text;
	}
};
