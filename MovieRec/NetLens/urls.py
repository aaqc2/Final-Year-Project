from django.urls import path, re_path

from . import views


urlpatterns = [
    path('', views.ListTitles.as_view()),
    path('<int:movieid>/', views.ShowGenres.as_view()),
    path('toprated/', views.showTopRated),
    path('search/', views.showSearch),
    path('page/', views.paginationTest),
    path('register/', views.registerNewUser),
    path('rate/<int:m>/<int:u>/<str:r>', views.rate),
    path('getUser/<int:u>/', views.getUser),
    path('getUser/<int:u>/<int:tmdbId>', views.getUserRating),
    path('avgrate/<int:tmdbid>', views.AverageRating),
    path('recommendation/<int:u>', views.getRecommendation),
]