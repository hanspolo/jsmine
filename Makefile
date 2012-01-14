all:
	cat src/tree.js > src/jsmine.js
	cat src/node.js >> src/jsmine.js
	cat src/template.js >> src/jsmine.js
	mkdir mini 
	jsmin < src/jsmine.js > mini/jsmine.js
	rm src/jsmine.js

clean:
	rm mini/jsmine.js
	rmdir mini
