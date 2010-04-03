<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:pubcrawl="http://www.monopolypubcrawl.org.uk/ns/1.0" exclude-result-prefixes="pubcrawl">

  <xsl:output method="xml" indent="yes" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="pubcrawl:pubcrawl">
    <div style="text-align: center"><h1><xsl:value-of select="pubcrawl:title"/></h1></div>
    <p class="introduction">
      <xsl:apply-templates select="pubcrawl:introduction"/>
    </p>
    <h2>Starting Off</h2>
    <p class="start">
      <xsl:apply-templates select="pubcrawl:start"/>
    </p>
    <xsl:apply-templates select="pubcrawl:pub"/>
  </xsl:template>
  <xsl:template match="pubcrawl:pub">
    <h2><xsl:value-of select="attribute::stop"/>. <xsl:value-of select="pubcrawl:square"/></h2>
    <table class="stop">
      <tr>
	<td colspan="2">
	  <xsl:attribute name="class">
	    <xsl:value-of select="pubcrawl:colour" />
	  </xsl:attribute> 
	  <xsl:call-template name="entity-ref">
	    <xsl:with-param name="name">nbsp</xsl:with-param>
	  </xsl:call-template>
	</td>							
      </tr>
      <tr>
	<td colspan="2">
	  <p class="directions">
	    <xsl:apply-templates select="pubcrawl:directions"/>
	  </p>
	</td>
      </tr>
      <tr>
	<td style="text-align:center; width: 60%;">
	  <table class="pub">
	    <tr>
	      <td class="pubname" colspan="2">
		<xsl:value-of select="pubcrawl:name"/>
	      </td>
	      <td class="pubtitle">Rating</td> 
	      <td class="pub"><xsl:value-of select="pubcrawl:rating"/></td>
	    </tr>
	    <tr>
	      <td class="pubtitle">Location</td> 
	      <td class="pub"><xsl:value-of select="pubcrawl:location"/></td>
	      <td class="pubtitle" rowspan="2">Beers</td> 						
	      <td class="pub" rowspan="2">
		<xsl:apply-templates select="pubcrawl:beers"/>
	      </td>
	    </tr>
	    <tr>
	      <td class="pubtitle">Time</td>
	      <td class="pub">until <xsl:value-of select="pubcrawl:time"/></td>
	    </tr>
	  </table>
	</td>
	<td style="text-align: center; width: 40%;">
	  <a>
	    <xsl:attribute name="href">
	      <xsl:value-of select="pubcrawl:image" />
	    </xsl:attribute>
	    <img>
	      <xsl:attribute name="src">
		<xsl:value-of select="pubcrawl:thumbnail" />
	      </xsl:attribute>
	      <xsl:attribute name="alt">
		<xsl:value-of select="pubcrawl:name" />
	      </xsl:attribute>  
	    </img>
	  </a>
	</td>
      </tr>
      <tr>
	<td colspan="2">
	  <p class="description"><xsl:value-of select="pubcrawl:description"/></p>
	</td>
      </tr>
      <tr>
	<td colspan="2">	  
	  <xsl:apply-templates select="pubcrawl:alternatives"/>	  
	</td>
      </tr>
    </table>
  </xsl:template>
  <xsl:template match="pubcrawl:beers">
    <xsl:for-each select="pubcrawl:beer">
      <xsl:value-of select="."/><br/>
    </xsl:for-each>
  </xsl:template>
  <xsl:template match="pubcrawl:alternatives">
    <h3 class="alternatives">Alternatives</h3>
    <ul class="alternatives">
      <xsl:for-each select="pubcrawl:alternative">
	<li>
	  <b>
	    <xsl:value-of select="pubcrawl:name"/>
	  </b>
	  <br/>
	  <span class="comments">
	    <xsl:apply-templates select="pubcrawl:comments"/>
	  </span>
	</li>
      </xsl:for-each>
    </ul>
  </xsl:template>
  <xsl:template match="pubcrawl:directions">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="pubcrawl:comments">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="pubcrawl:emph">
    <b>
      <xsl:value-of select="."/>
    </b>
  </xsl:template>
  <xsl:template name="entity-ref">
    <xsl:param name="name"/>
    <xsl:text disable-output-escaping="yes">&amp;</xsl:text>
    <xsl:value-of select="$name"/>
    <xsl:text>;</xsl:text>
  </xsl:template>
</xsl:stylesheet>
