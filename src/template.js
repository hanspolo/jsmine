/*
* -------------------------------------------------------------------------
* "THE BEER-WARE LICENSE" (Revision 42):
* Philipp Hirsch wrote this file. As long as you retain this notice you
* can do whatever you want with this stuff. If we meet some day, and you think
* this stuff is worth it, you can buy me a beer in return Philipp Hirsch
* -------------------------------------------------------------------------
*/

var __TEMPLATE_REGEX_CLOSING = /<\/J:[a-zA-Z ]+>/g;
var __TEMPLATE_REGEX_INCLUDE = /<J:include[ ]+[a-zA-Z]+="{{[^}"]+}}"[ ]*>/g;
var __TEMPLATE_REGEX_REPEAT = /<J:repeat([ ]+[a-zA-Z]+="{{[^}"]+}}"){2,3}[ ]*>/g;
var __TEMPLATE_REGEX_CHECK = /<J:check[ ]+[a-zA-Z]+="{{[^}"]+}}"[ ]*>/g;
var __TEMPLATE_REGEX_FALSE = /<J:false[ ]*>/g;
var __TEMPLATE_REGEX_FALSE_CLOSING = /<\/J:false[ ]*>/g;
var __TEMPLATE_REGEX_TRUE = /<J:true[ ]*>/g;
var __TEMPLATE_REGEX_TRUE_CLOSING = /<\/J:true[ ]*>/g;
var __TEMPLATE_REGEX_EXPR = /{{[^}]+}}/g;
var __TEMPLATE_REGEX_ARG = /[a-zA-Z]+="{{[^}"]+}}"/g;
var __TEMPLATE_REGEX_VAR = /\@[a-zA-Z0-9._]+/g;

/**
 *	Creates a new and empty Template
 */
function Template()
{
	this.__data = new Object();
	this.__html = "";
	this.__output;
}

/**
 *	Sets the String that will be translated
 *
 *	@param String html
 */
Template.prototype.setHtml = function(html)
{
	this.__html = html.replace(/\n/g, '').replace(/\t/g, '');
}	

/**
 *	Sets a value to the Template, that can be accessed by a placeholder
 *
 *	@param String key
 *	@param Mixed value
 */
Template.prototype.set = function(key, value)
{
	key = key.replace(/@/g, '');

	this.__data[key] = value;
};

/**
 *	Finds a value identified by the key
 *
 *	@param String key
 *	@return Mixed 
 */
Template.prototype.get = function(key)
{
	try 
	{
		key = key.replace(/@/g, '');

		var str = key.split('.');
		var temp = this.__data[str[0]];

		for (var i = 1; i < str.length; i++)
			temp = temp[str[i]];
	
		return temp;
	}
	catch (err)
	{
		return undefined;
	}
};

/**
 *	Interprets an expression and returns its result
 *
 *	@param String expr
 *	@return Mixed
 */
Template.prototype.expr = function(expr)
{
	var vars = expr.match(__TEMPLATE_REGEX_VAR);

	for (var i = 0; vars != null && i < vars.length; i++)
	{
		if (expr.length == vars[i].length)
			return this.get(vars[i]);

		expr = expr.split(vars[i]).join(this.get(vars[i]));
	}

	try
	{
		return eval(expr);
	}
	catch (err)
	{
		return expr;
	}
}

/**
 *	This functions executes the parsing and building of the Template.
 *	After executing successfully it returns the new HTML-Code.
 *
 *	@return String
 */
Template.prototype.serve = function()
{
	if(this.parse())
		return this.build();
	else
		return "Failure while building";
};

/**
 *	Looks over the text replaces the functions.
 */
Template.prototype.parse = function()
{
	var text = "var _txt = '" + this.__html + "'";
	
	// Remove all unused Functions
	text = text.replace(__TEMPLATE_REGEX_TRUE, '');
	text = text.replace(__TEMPLATE_REGEX_TRUE_CLOSING, '');
	text = text.replace(__TEMPLATE_REGEX_FALSE_CLOSING, '');

	// Find all functions
	var closing_matches = text.match(__TEMPLATE_REGEX_CLOSING);
	var include_matches = text.match(__TEMPLATE_REGEX_INCLUDE);
	var repeat_matches = text.match(__TEMPLATE_REGEX_REPEAT);
	var check_matches = text.match(__TEMPLATE_REGEX_CHECK);
	var false_matches = text.match(__TEMPLATE_REGEX_FALSE);

	var tmp_match;
	var tmp_replace;

	// Replace all Functionclosings
	for (var c = 0; closing_matches != null && c < closing_matches.length; c++)
	{
		tmp_match = closing_matches[c];
		tmp_replace = "'; } _txt += '";

		text = text.split(tmp_match).join(tmp_replace);
	}

	// Replace all Includes
	for (var i = 0; include_matches != null && i < include_matches.length; i++)
	{
		tmp_match = include_matches[i];
		tmp_replace = "'; if (false) { _txt += '";

		text = text.split(tmp_match).join(tmp_replace);
	}

	// Replace all Repeats
	for (var r = 0; repeat_matches != null && r < repeat_matches.length; r++)
	{
		var tmp_for;
		tmp_match = repeat_matches[r];
		tmp_replace = "'; %s _txt += '";

		var args;
		var expr;
		var groupexpr;
		var valueexpr;
		var keyexpr;

		args = tmp_match.match(__TEMPLATE_REGEX_ARG);
		if (args.length < 2 || args.length > 3)
			return ;

		for (var a in args)
		{
			// Is a an Integer?
			a = parseInt(a);
			if (isNaN(a))
				continue;

			args[a] = args[a].split("=");

			expr = args[a][1].replace(/[{}"]/g, '');

			if (args[a][0] == 'group')
				groupexpr = expr;
			else if (args[a][0] == 'key')
				keyexpr = expr;
			else if (args[a][0] == 'value')
				valueexpr = expr;
			else
				return ;
		}

		tmp_for = "for (var i" + r + " in this.expr('" + groupexpr + "')) {";
		if (keyexpr != null)
			tmp_for += "this.set('" + keyexpr + "', i" + r + ");";
		tmp_for +=  "this.set('" + valueexpr + "', (this.expr('" + groupexpr + "'))[i" + r + "]);";

		tmp_replace = tmp_replace.replace(/%s/g, tmp_for);

		text = text.split(tmp_match).join(tmp_replace);
	}

	// Replace all Checks
	for (var c = 0; check_matches != null && c < check_matches.length; c++)
	{
		var args;
		var expr;
		tmp_match = check_matches[c];

		args = tmp_match.match(__TEMPLATE_REGEX_ARG);

		if (args.length != 1)
			return ;

		args = args[0].split("=");
		if (args[0] != 'if')
			return;
		
		expr = args[1].replace(/[{}"]/g, '');;
		tmp_replace = "';  if (this.expr('" + expr + "')) { _txt += '";

		text = text.split(tmp_match).join(tmp_replace);
	}

	// Replace all Falses
	for (var f = 0; false_matches != null && f < false_matches.length; f++)
	{
		tmp_match = false_matches[f];
		tmp_replace = "'; } else { _txt += '";

		text = text.split(tmp_match).join(tmp_replace);
	}
	
	// Find the remaining Expressions
	var expr_matches = text.match(__TEMPLATE_REGEX_EXPR);

	// Replace all Expressions
	for (var e = 0; expr_matches != null && e < expr_matches.length; e++)
	{
		var expr;
		tmp_match = expr_matches[e];
		expr = tmp_match.replace(/[{}"]/g, '');
		tmp_replace = "' + this.expr('" + expr + "') + '";

		text = text.split(tmp_match).join(tmp_replace);
	}

	// Set the text as output
	this.__output = text;
	return true;
};

/**
 *	Uses the output of the parser and creates HTML
 *
 *	@return String
 */
Template.prototype.build = function()
{
	eval(this.__output);
	return _txt;
};
