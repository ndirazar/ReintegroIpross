from django.db import models


class Capitulo(models.Model):
    capitulo = models.PositiveIntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)
    coseguro = models.PositiveIntegerField()

    class Meta:
        app_label = "nomenclador"

    def __str__(self):
        return f"{self.capitulo} - {self.descripcion} - {self.coseguro}"