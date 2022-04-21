from django.db import models


class Delegacion(models.Model):
    nombre = models.CharField(max_length=60)

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"{self.id} {self.nombre}"