from django import template  

register = template.Library()  
  
@register.filter  
def django_range(value):  
    return range(value)  
