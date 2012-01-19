all:
	mkdir mini 
	jsmin < src/template.js > mini/jsmine.js

clean:
	rm mini/jsmine.js
	rmdir mini
