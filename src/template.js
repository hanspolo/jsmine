/*
* ----------------------------------------------------------------------------
* "THE BEER-WARE LICENSE" (Revision 42):
* <philipp-hirsch@gmx.net> wrote this file. As long as you retain this notice you
* can do whatever you want with this stuff. If we meet some day, and you think
* this stuff is worth it, you can buy me a beer in return Philipp Hirsch
* ----------------------------------------------------------------------------
*/


var FUNC_REGEX = /<J:[a-zA-Z]{4,6}.*>/g; /*/\<J\:[a-zA-Z]{4,6}([ a-zA-Z="]+\{\{[^}]\}\}){1,3}\"\>/g;*/
var FUNC_END_REGEX = /<\/J:[a-zA-Z]{4,6}>/g
var EXP_REGEX = /{{[^}]+}}/g;

var CLOSINGTAG_LENGTH_REPEAT = 11;
var CLOSINGTAG_LENGTH_CHECK = 10;
var CLOSINGTAG_LENGTH_FALSE = 10;
var CLOSINGTAG_LENGTH_TRUE = 9;

/**
 *
 */
var Template =
{
	data: new Object(),
	html: "",
	tree: null,

	/**
	 *
	 *
	 *	@param String key
	 *	@param Mixed value
	 */
	set:
	function (key, value)
	{
		if (key.charAt(0) == '{')
			key = key.substring(3, key.length - 2);

		this.data[key] = value;
	},

	/**
	 *
	 *
	 *	@param String key
	 *	@return Mixed 
	 */
	get:
	function (key)
	{
		if (key.charAt(0) == '{')
			key = key.substring(3, key.length - 2);

		var str = key.split('.');
		var temp = this.data[str[0]];

		for (var i = 1; i < str.length; i++)
			temp = temp[str[i]];

		return temp;
	},

	/**
	 *
	 *
	 *	@return String
	 */
	serve: 
	function ()
	{
		var root = new Node(this.html);
		this.tree = new Tree(root);
		this.parse(this.html, root);
		return this.build();
	},

	/**
	 *
	 *
	 *	@param String text
	 *	@param Node parentNode
	 *	@return Integer
	 */
	parse: function (text, parentNode)
	{
		var firstOpeningFuncBegin = text.indexOf('<J:');
		var firstClosingFuncBegin = text.indexOf('</J:');

		var node = new Node();
		
		// No Function in this Page
		if (firstOpeningFuncBegin < 0 && firstClosingFuncBegin < 0)
			return ;

		// There is a next Function, so add the node to the tree
		parentNode.addChild(node);

		// Has this Function another Subfunction?
		var nextOpeningFuncBegin = text.indexOf('<J:', firstOpeningFuncBegin + 1);

		// If not, so init this Function and return
		if (nextOpeningFuncBegin < 0)
		{
			var firstClosingFuncEnd = text.indexOf('>', firstClosingFuncBegin);

			node.setText(text.substring(firstOpeningFuncBegin, firstClosingFuncEnd + 1));
			return firstClosingFuncEnd + 1;
		}
		
		// There is another Subfunction, so open the Parser recursively
		var lastClosingFuncEnd = this.parse(text.substring(nextOpeningFuncBegin), node);

		// Get the end of this Function and return
		var nextClosingFuncBegin = text.indexOf('</J:', lastClosingFuncEnd);
		var nextClosingFuncEnd = text.indexOf('>', nextClosingFuncBegin);

		node.setText(text.substring(firstOpeningFuncBegin, nextClosingFuncEnd));
		return nextClosingFuncEnd + 1;
	},

	/**
	 *
	 *
	 *	@return String
	 */
	build: function () 
	{
		var root = this.tree.getRoot();
		var text = root.getText();

		// Walk throug the Tree
		for (var i = 0; i < root.getChildren().length; i++)
		{
			var tmptext = this.translate(root.getChildren()[i]);
			
			text = text.split(root.getChildren()[i].getText()).join(tmptext);
		}

		// Replace the remaining Variables
		text = this.expression(text);		
	
		return text;
	},

	/**
	 *
	 *
	 *	@param Node node
	 *	@return String
	 */
	translate: function (node)
	{
		var text = node.getText();
		var children = node.getChildren();

		// Node is a TRUE
		if (text.substr(3, 4).toLowerCase() == "true")
			;
		// Node is a FALSE
		else if (text.substr(3, 5).toLowerCase() == "false")
			;
		// Node is a CHECK
		else if (text.substr(3, 5).toLowerCase() == "check")
			;
		// Node is a REPEAT
		else if (text.substr(3, 6).toLowerCase() == "repeat")
		{
			var group, key, value;

			var funcs = text.match(FUNC_REGEX);
			var expressions = funcs[0].match(EXP_REGEX);

			// Not enough expressions
			if (expressions.length < 2)
				return "Repeat needs at minimum a group and a value.";
			// group and value are set
			else if (expressions.length == 2)
			{
				group = expressions[0];
				value = expressions[1];
			}
			// group, key, value are set
			else
			{
				group = expressions[0];
				key = expressions[1];
				value = expressions[2];
			}

			var obj = this.get(group);
			console.debug(obj);
			var tmpText = "";

			// render subtemplate for every subobject
			for (var j = 0; obj != null && j < obj.length; j++)
			{
				if (key != null)
					this.set(key, j);
				this.set(value, obj[j]);

				// There are no subtemplates
				if (children.length == 0)
					tmpText += text.replace(FUNC_REGEX, '').replace(FUNC_END_REGEX, ' ');

				for (var k = 0; k < children.length; k++)
					tmpText += this.translate(children[k]);

				tmpText = this.expression(tmpText);
			}

			text = text.split(node.getText()).join(tmpText);
		}
		else
		{
			return text.substr(0, 10) + " isn't a correct functionname.";
		}

		return text;
	},

	/**
	 *
	 *
	 *	@param String text
	 *	@return String
	 */
	expression: function (text)
	{
		// Replace the remaining Variables
		var matches = text.match(EXP_REGEX);
		for (var i = 0; matches != null && i < matches.length; i++)
		{
			var tmpVar = matches[i].substring(3, matches[i].length - 2);

			var parts = text.split(matches[i]);

			text = parts.join(this.get(tmpVar));
		}

		return text;
	}
};
