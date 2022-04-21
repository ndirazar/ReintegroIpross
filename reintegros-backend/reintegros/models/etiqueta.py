from django.db import models


class Etiqueta(models.Model):
    nombre = models.CharField(max_length=70)

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"{self.id} - {self.nombre}"