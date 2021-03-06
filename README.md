Run the Makefile to create a minified file.

## Documentation
### How to use JSmine
To add data to the template engine use:

	Template.set(key, value);

Also JSmine needs the templates html code.
To set it call:

	Template.setHtml("...");

When all data and the html code is set, call:

	Template.serve();

It returns the translated html code.

### Use JSmine as jQuery Plugin
To use JSmine as a jQuery Plugin, include the file and use:

	$.jsmine(template, data);

The template is the html code that will be replaced.
Data is an list of data, that normally would be sad with Template.set(key, value);

### How to write a template
The Templates can use HTML Code, but isn't committed to this.
To use a placeholder write the following listing, where @foo is the name of the variable.
More complex expressions will follow soon.

	{{@foo}}

If a part of a template should be repeated, there is a function for that.
You can use the next listing, where @foo is the list, that will be iterated and @bar is the new name of a single entry of that list.
The key is optional and will set the actual index to @key.

	<repeat group="{{@foo}}" [key="{{@key}}"] value="{{@bar}}">
		part that will be repeated
	</repeat>

To check, that a expression is true, use the check-function

	<check if="{{@tobeornottobe}}">
		part that will be executed, if the check succeeds
	</check>

To add a part that contains the code of a failing expression, you have to add a true and false sector.
The order of true and false is (currently) required.

	<check...>
		<true>expression was true</true>
		<false>expression was false</false>
	</check>

## License
"THE BEER-WARE LICENSE" (Revision 42):
Philipp Hirsch wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return
