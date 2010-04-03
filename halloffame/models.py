from django.db import models

# Create your models here.

class Crawler(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    hotels = models.IntegerField("hotels", default=0)
    houses = models.IntegerField("houses", default=0)
    dogs = models.IntegerField("dogs", default=0)
    
    def __unicode__(self):
        return self.name

