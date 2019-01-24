from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics
from .models import Titles, Ratings, Users, Links
from .serializers import TitlesSerializer, RatingsSerializer, SearchSerializer, RatingSerializer, UserRating
from rest_framework.decorators import api_view
from django.db.models import Avg, F, Sum, Q
from rest_framework.pagination import PageNumberPagination
from datetime import datetime
import json

# Create your views here.
class ListTitles(generics.ListCreateAPIView):
    queryset = Titles.objects.all()
    serializer_class = TitlesSerializer


class ShowGenres(generics.RetrieveUpdateDestroyAPIView):
    queryset = Titles.objects.all()
    serializer_class = TitlesSerializer
    lookup_field = 'movieid'


@api_view(['GET'])
def showTopRated(request):
    getMID = Titles.objects.values_list('movieid', flat=True).annotate(avg_rating=Avg('ratings__rating')).annotate(sum_rating=Sum('ratings__rating')).order_by(F('sum_rating').desc(nulls_last=True))[:10]
    queryset = Links.objects.filter(movieid__in=list(getMID)).values('tmdbid')
    serializer = RatingsSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def showSearch(request):
    title = request.GET['q']
    queryset = Titles.objects.filter(title__icontains=title) [:20]
    serializer = SearchSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def paginationTest(request):
    queryset = Titles.objects.values('title').annotate(avg_rating=Avg('ratings__rating')).annotate(
        sum_rating=Sum('ratings__rating')).order_by(F('sum_rating').desc(nulls_last=True))
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = RatingsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


def registerNewUser(self):
    queryset = str(Users.objects.values('userid').last().get("userid"))
    uid = int(queryset) + 1
    Users.objects.create(userid=str(uid), username="user", password="pass", email="email")

@api_view(['GET'])
def rate(request, m, u, r):
    movieId = Titles.objects.get(pk=m)
    userId= Users.objects.get(pk=u)
    rating = r

    if Ratings.objects.filter(userid=userId, movieid=movieId).exists():
        Ratings.objects.filter(userid=userId, movieid=movieId).update(rating=rating, timestamp=datetime.now().timestamp())
    else:
        testrating = Ratings(userid=userId, movieid=movieId, rating=rating, timestamp=datetime.now().timestamp())
        testrating.save(force_insert=True)


    queryset = Ratings.objects.filter(userid=userId)
    serializer_class = RatingSerializer(queryset, many=True)
    return Response(serializer_class.data)


@api_view(['GET'])
def getUser(request, u):
    userId = Users.objects.get(pk=u)
    userList = Ratings.objects.values_list('movieid').filter(userid=userId)
    queryset = Links.objects.filter(movieid__in=list(userList)).values('tmdbid')
    serializer_class = RatingsSerializer(queryset, many=True)
    return Response(serializer_class.data)

@api_view(['GET'])
def getUserRating(request, u, tmdbId):
    userId = Users.objects.get(pk=u)
    tMovie = Links.objects.get(tmdbid=tmdbId)
    queryset = Ratings.objects.filter(userid=userId, movieid=tMovie.movieid)
    if queryset.exists()==False:

    serializer_class = UserRating(queryset, many=True)
    return Response(serializer_class.data)