from django.contrib import admin
from django.urls import include, path
from django.urls.conf import re_path
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from django.conf.urls.static import static
from django.conf import settings
from django.views.static import serve 

router = routers.DefaultRouter()
urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path(
        "api/token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path(
        "api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"
    ),
    path("api/", include("reintegros.urls")),
    path("api/", include("nomenclador.urls")),
    path("api/", include("usuario.urls")),
    # Route TemplateView to serve the ReDoc template.
    #   * Provide `extra_context` with view name of `SchemaView`.
    path(
        "redoc/",
        TemplateView.as_view(
            template_name="redoc.html", extra_context={"schema_url": "openapi-schema"}
        ),
        name="redoc",
    ),
    # Use the `get_schema_view()` helper to add a `SchemaView` to project URLs.
    #   * `title` and `description` parameters are passed to `SchemaGenerator`.
    #   * Provide view name for use with `reverse()`.
    path(
        "openapi",
        get_schema_view(
            title="IPROSS Reintegros API", description="API enpoints", version="1.0.0"
        ),
        name="openapi-schema",
    ),
    re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}), 
    re_path(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT}), 
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
