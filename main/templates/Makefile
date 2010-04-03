
%.html: ../../scripts/%.xml ../../scripts/route.xsl
	xsltproc ../../scripts/route.xsl $< > $@

all: original.html inorder.html
