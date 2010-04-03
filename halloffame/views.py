# Create your views here.

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from monopoly.halloffame.models import Crawler

def halloffame(request):
    crawlers = Crawler.objects.all().order_by('-hotels', '-houses', '-dogs')
    return render_to_response('halloffame.html', { "crawlers" : crawlers})

