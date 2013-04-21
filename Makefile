all:
	mkdir -p bin
	jsmin < src/template.js > bin/jsmine.js
	jsmin < src/jquery.js >> bin/jsmine.js

clean:
	rm bin/jsmine.js
	rmdir bin
