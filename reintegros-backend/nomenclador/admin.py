from django.contrib import admin
from .models.capitulo import *
from .models.nomenclador import *

admin.site.register(Capitulo)
admin.site.register(Nomenclador)
