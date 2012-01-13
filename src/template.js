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
		// Translate Repeat and Check
		var result = this.translate(this.html);
		// Translate single Variables
		var result = this.translate(result);

		return result;
	},

	translate:
	function (text)
	{
		alert(text);
		var firstRepeat = text.indexOf('<J:repeat');
		var firstCheck = text.indexOf('<J:check');
		var lastIndex, firstEnd, lastEnd;

		// Neither repeat nor check
		// So translate the Variables
		if ((firstRepeat == null || firstRepeat < 0) &&
			(firstCheck == null || firstCheck < 0))
		{
			var matches = text.match(/\{\{\@[a-zA-Z0-9._]+\}\}/g);
			for (var i = 0; matches != null && i < matches.length; i++)
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
			firstEnd = text.indexOf('>', firstRepeat);
			lastEnd = text.indexOf('>', lastIndex);

			var group, key, value, obj, tmpText = text.substring(0, firstRepeat);
			var func = text.substring(firstRepeat, firstEnd + 1);

			var parts = func.match(/\{\{\@[a-zA-Z0-9._]+\}\}/g);

			for (var i = 0; parts != null && i < parts.length; i++)
				parts[i] = parts[i].substring(3, parts[i].length - 2);

			group = parts[0];

			// Group and Value
			if (parts != null && parts.length == 2)
			{
				key = null;
				value = parts[1];
			}
			// Group, Key and Value
			else if (parts != null && parts.length == 3)
			{
				key = parts[1];
				value = parts[2];
			}
			else
			{
				alert("Fehler ab " + text);
				return ;
			}

			var obj = this.get(group);

			for (var j = 0; obj != null && j < obj.length; j++)
			{
				if (key != null)
					this.set(key, j);
				this.set(value, obj[j]);
				tmpText += this.translate(text.substring(firstEnd + 1, lastIndex));
			}

			tmpText += text.substring(lastEnd + 1);

			return tmpText;
		}
		// Execute a Check
		else
		{
			lastIndex = text.lastIndexOf('</J:check>');
		}

		return text;
	}
};
