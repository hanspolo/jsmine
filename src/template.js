/*
* ----------------------------------------------------------------------------
* "THE BEER-WARE LICENSE" (Revision 42):
* <philipp-hirsch@gmx.net> wrote this file. As long as you retain this notice you
* can do whatever you want with this stuff. If we meet some day, and you think
* this stuff is worth it, you can buy me a beer in return Philipp Hirsch
* ----------------------------------------------------------------------------
*/

/**
 *
 */
var Template = 
{
	data: new Object(),
	html: "",

	/**
	 *
	 *
	 *	@param String key
	 *	@param Mixed value
	 */
	set:
	function (key, value)
	{
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
		var str = key.split('.');
		var temp = this.data[str[0]];

		for (var i = 1; i < str.length; i++)
		{
			temp = temp[str[i]];
		}

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
		TemplateParser.tree = new Tree(root);
		TemplateParser.parse(this.html, root);
		return TemplateParser.build();
	}
};

var FUNC_REGEX = /<J:[a-zA-Z]{4,6}([ a-zA-Z+="]+{{[^}]}}){1,3}\">/g;
var FUNC_END_REGEX = /<\/J:[a-zA-Z]{4,6}>/g
var EXP_REGEX = /{{[^}]+}}/g;

var CLOSINGTAG_LENGTH_REPEAT = 11;
var CLOSINGTAG_LENGTH_CHECK = 10;
var CLOSINGTAG_LENGTH_FALSE = 10;
var CLOSINGTAG_LENGTH_TRUE = 9;

/**
 *
 */
var TemplateParser =
{
	tree: null,

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
	 *	@param Array data
	 *	@return String
	 */
	build: function (data) 
	{

	}
};
