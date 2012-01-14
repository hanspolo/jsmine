function Node(text) 
{
	if (text != null)
		this.text = text;
	else
		this.text = "";
	this.children = new Array();
}

Node.prototype.getChildren = function()
{
	return this.children;
};

Node.prototype.getText = function()
{
	return this.text;
};

Node.prototype.addChild = function(node)
{
	this.children.push(node);
};

Node.prototype.setText = function(text)
{
	this.text = text;
};
