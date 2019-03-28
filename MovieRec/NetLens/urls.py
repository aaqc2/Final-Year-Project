from django.urls import path
from . import views


urlpatterns = [
    path('toprated/', views.showTopRated),
    path('search/', views.showSearch),
    path('register/', views.register),
    path('rate/', views.rate),
    path('getUser/<int:u>/', views.getUser),
    path('getUser/<int:u>/<int:tmdbId>', views.getUserRating),
    path('avgrate/<int:tmdbid>', views.AverageRating),
    path('recommendation/<int:u>', views.getRecommendation),
    path('genres/', views.getGenres),
    path('check/<str:token>', views.checkToken),
    path('titleandgenre/', views.showSearchAndGenre),
    path('getNumMovies/<int:u>', views.getNumMovies),
    path('getCustomRec/<int:u>', views.getCustomRec)
]