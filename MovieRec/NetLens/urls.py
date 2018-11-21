from django.urls import path

from . import views


urlpatterns = [
    path('', views.ListTitles.as_view()),
    path('<int:movieid>/', views.ShowGenres.as_view()),
    path('toprated/', views.showTopRated),
    path('search/', views.showSearch),
    path('page/', views.paginationTest),
    path('register/', views.registerNewUser),
]