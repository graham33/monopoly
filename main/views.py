# Create your views here.

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response

def index(request):
    return render_to_response('index.html', {})

def route(request, route):
    
    return render_to_response('route.html', {"route": route,
                                             "route_template": route + ".html"})

def map(request, route):
    return render_to_response('map.html', {"route": route })

def facebook(request):
    return render_to_response('facebook.html', {})
