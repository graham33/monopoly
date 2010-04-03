from django.conf.urls import patterns, url, include
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^monopoly/', include('monopoly.foo.urls')),

    (r'^/*$', 'monopoly.main.views.index'),
    (r'^route/(\w+)/$', 'monopoly.main.views.route'),
    (r'^map/(\w+)/$', 'monopoly.main.views.map'),
    (r'^facebook/$', 'monopoly.main.views.facebook'),
    (r'^halloffame/$', 'monopoly.halloffame.views.halloffame'),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('',
                            (r'^site_media/(?P<path>.*)$', 'django.views.static.serve',
                             {'document_root': 'site_media'}),
                            (r'^scripts/(?P<path>.*)$', 'django.views.static.serve',
                             {'document_root': 'scripts'}),
                            )
