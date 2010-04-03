from monopoly.halloffame.models import Crawler
from django.contrib import admin
from lxml import etree

documentRoot = "/var/www/monopolypubcrawl.org.uk/monopoly";

def import_crawlers(modeladmin, request, queryset):    
    filename = documentRoot + "/halloffame.xml"
    f = open(filename, "r")
    doc = etree.parse(f)
    num = 0
    people = doc.xpath("/halloffame/person")
    for person in people:
        name = person.xpath("name/text()")[0]
        print name
        num = num+1
        hotels = person.xpath("count(hotel)")
        houses = person.xpath("count(house)")
        dogs = person.xpath("count(dog)")
        c = Crawler(name=name, hotels=hotels, houses=houses, dogs=dogs)
        c.save()

import_crawlers.short_description = "Import crawler data from XML"

class CrawlerAdmin(admin.ModelAdmin):
    list_display = ('name', 'hotels', 'houses', 'dogs')
    ordering = ['name']
    actions = [import_crawlers]

admin.site.register(Crawler, CrawlerAdmin)
