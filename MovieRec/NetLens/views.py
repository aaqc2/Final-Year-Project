# cdfrom django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.db import connection
import jwt
import json
import operator
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Titles, Ratings, Users, Links, Recommendations
from .serializers import TitlesSerializer, RatingsSerializer, SearchSerializer, RatingSerializer, UserRating, AverageRatingSerializer, UserLoginSerializer, GenreSerializer
from rest_framework.decorators import api_view
from django.db.models import Avg, F, Sum, Q
from rest_framework.pagination import PageNumberPagination
from datetime import datetime, timedelta
from django.contrib.auth.hashers import make_password, check_password
from passlib.hash import pbkdf2_sha256
from django.conf import settings
from django.http import HttpResponse
from django.db import connection
# Create your views here.

def checkToken(request, token):
    try:
        jwt.decode(token, settings.SECRET_KEY)
        return HttpResponse("OK", status=status.HTTP_200_OK)
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid Token", status=status.HTTP_401_UNAUTHORIZED)

class ListTitles(generics.ListCreateAPIView):
    queryset = Titles.objects.all()
    # pagination_class = None
    serializer_class = TitlesSerializer


class ShowGenres(generics.RetrieveUpdateDestroyAPIView):
    queryset = Titles.objects.all()
    serializer_class = TitlesSerializer
    lookup_field = 'movieid'


@api_view(['GET'])
def showTopRated(request):
    # getMID = Titles.objects.values_list('movieid', flat=True).annotate(avg_rating=Avg('ratings__rating')).annotate(sum_rating=Sum('ratings__rating')).order_by(F('sum_rating').desc(nulls_last=True))
    # queryset = Links.objects.filter(movieid__in=list(getMID)).values('tmdbid')
    queryset = Links.objects.select_related('movieid').annotate(avg_rating=Avg('movieid__ratings__rating')).values('tmdbid').annotate(sum_rating=Sum('movieid__ratings__rating')).order_by(F('sum_rating').desc(nulls_last=True))
    # serializer = RatingsSerializer(queryset, many=True)
    paginator = PageNumberPagination()
    paginator.page_size = 5
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = RatingsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)
    # return Response(serializer.data)

@api_view(['GET', 'POST'])
def showSearch(request):
    title = request.GET['q']

    if request.method == 'GET':
        queryset = Titles.objects.filter(title__icontains=title).values('title', 'genre', 'links__tmdbid')
        paginator = PageNumberPagination()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = SearchSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        order = request.data.get('orderby')
        if(order == "-avg_rating"):
            order = F('sum_rating').desc(nulls_last=True)
        queryset = Titles.objects.select_related('links').filter(title__icontains=title).values('title', 'genre', 'links__tmdbid').annotate(avg_rating=Avg('ratings__rating')).annotate(sum_rating=Sum('ratings__rating')).order_by(order)
        paginator = PageNumberPagination()
        paginator.page_size = 8
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = SearchSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



@api_view(['GET', 'POST'])
def showSearchAndGenre(request):
    title = request.GET['q']
    genres = request.GET.getlist('gen')
    q = Q()
    for genre in genres:
        q |= Q(genre__contains=genre)
    if request.method == 'GET':
        queryset = Titles.objects.select_related('links').filter(q, title__icontains=title).values('title', 'genre', 'links__tmdbid')
        paginator = PageNumberPagination()
        paginator.page_size = 8
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = SearchSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        order = request.data.get('orderby')
        if (order == "-avg_rating"):
            order = F('sum_rating').desc(nulls_last=True)
        queryset = Titles.objects.select_related('links').filter(q, title__icontains=title).values('title', 'genre', 'links__tmdbid').annotate(avg_rating=Avg('ratings__rating')).annotate(sum_rating=Sum('ratings__rating')).order_by(order)
        paginator = PageNumberPagination()
        paginator.page_size = 8
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = SearchSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



@api_view(['GET'])
def paginationTest(request):
    queryset = Titles.objects.values('title').annotate(avg_rating=Avg('ratings__rating')).annotate(
        sum_rating=Sum('ratings__rating')).order_by(F('sum_rating').desc(nulls_last=True))
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = RatingsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
       email = request.data.get('email')
       password = request.data.get('password')
       username = request.data.get('username')
       if Users.objects.filter(email=email).exists():
           return Response("Email already in use", status=status.HTTP_406_NOT_ACCEPTABLE)
       elif Users.objects.filter(username=username).exists():
           return Response("Username already in use", status=status.HTTP_406_NOT_ACCEPTABLE)
       else:
           # hashPass = make_password(password, salt=None, hasher='pbkdf2_sha256')
           hashPass = pbkdf2_sha256.hash(password);
           queryset = str(Users.objects.values('userid').last().get("userid"))
           uid = int(queryset) + 1
           Users.objects.create(userid=str(uid), username=username, password=hashPass, email=email)
           return Response("Success", status=status.HTTP_201_CREATED)

@api_view(['GET'])
def rate(request, m, u, r):
    tMovie = Links.objects.get(tmdbid=m)
    userId= Users.objects.get(pk=u)
    try:
        rating = float(r)
    except ValueError:
        print("invald value")

    if Ratings.objects.filter(userid=userId, movieid=tMovie.movieid).exists():
        Ratings.objects.filter(userid=userId, movieid=tMovie.movieid).update(rating=rating, timestamp=datetime.now().timestamp())
    else:
        testrating = Ratings(userid=userId, movieid=tMovie.movieid, rating=rating, timestamp=datetime.now().timestamp())
        testrating.save(force_insert=True)


    queryset = Ratings.objects.filter(userid=userId, movieid=tMovie.movieid)
    serializer_class = UserRating(queryset, many=True)
    return Response(serializer_class.data)


@api_view(['GET'])
def getUser(request, u):
    queryset = list(Links.objects.raw('SELECT l.movieid, l.tmdbid FROM link l JOIN ratings r ON r.movieid = l.movieid WHERE r.userid = %s ORDER BY r.timestamp DESC', [u]))
    # serializer_class = RatingsSerializer(queryset, many=True)
    paginator = PageNumberPagination()
    paginator.page_size = 4
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = RatingsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def getUserRating(request, u, tmdbId):
    userId = Users.objects.get(pk=u)
    tMovie = Links.objects.get(tmdbid=tmdbId)
    queryset = Ratings.objects.filter(userid=userId, movieid=tMovie.movieid)
    serializer_class = UserRating(queryset, many=True)
    return Response(serializer_class.data)

@api_view(['GET'])
def AverageRating(request, tmdbid):
    movieId = Links.objects.filter(tmdbid=tmdbid).values('movieid')
    queryset = Ratings.objects.values('movieid').filter(movieid__in=movieId).annotate(avg_rating=Avg('rating'))
    serializer = AverageRatingSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getRecommendation(request, u):
    #queryset = Links.objects.raw('SELECT l.movieid, l.tmdbid FROM link l JOIN recommendations r ON l.movieid = r.movieid'
    #                             ' WHERE userid = %s ORDER BY r.rating DESC', [u])[:20]
    queryset = list(Links.objects.raw(' SELECT l.tmdbid, l.movieid FROM link l JOIN recommendations r ON '
                                 ' l.movieid = r.movieid WHERE r.userid = %s AND r.movieid NOT IN '
                                 '(SELECT movieid FROM ratings rt WHERE rt.userid = %s) ORDER BY r.rating DESC', [u, u]))
    # serializer_class = RatingsSerializer(queryset, many=True)
    paginator = PageNumberPagination()
    paginator.page_size = 5
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = RatingsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)
    # return Response(serializer_class.data)

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        if Users.objects.filter(username=email).exists():
            user = Users.objects.get(username=email)
            # if check_password(password, user.password):
            if pbkdf2_sha256.verify(str(password), user.password):
                secret = settings.SECRET_KEY
                payload = {
                    'id': user.userid,
                    'iat': datetime.now(),
                    'exp': datetime.now() + timedelta(hours=6)
                }
                jwt_token = {'token': jwt.encode(payload, secret)}
                return Response(
                    {
                        'userid': user.userid,
                        'username': user.username,
                        'token': jwt_token,
                        'email': user.email


                    },
                    # jwt_token,
                    status=200,
                    content_type="application/json"
                )
            else:
                return Response("Invalid email or password", status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response("Invalid email or password", status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def getGenres(request):
    genres = request.GET.getlist('gen')
    q = Q()
    for genre in genres:
        q |= Q(genre__icontains=genre)
    queryset = Titles.objects.filter(q).select_related('links').values('links__tmdbid')
    paginator = PageNumberPagination()
    paginator.page_size = 5
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = GenreSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)
    # serializer = TitlesSerializer(queryset, many=True)
    # return Response(serializer.data)


@api_view(['GET'])
def getNumMovies(request, u):
    query = Ratings.objects.filter(pk=u).count()
    return Response(query)

@api_view(['GET'])
def getCustomRec(request, u):
    user = Users.objects.get(pk=u)
    cursor = connection.cursor()
    query = ("SELECT SUM((CASE WHEN genre LIKE '%%Romance%%' THEN 1 ELSE 0 end) * r.rating) AS Romance, "
                                    " SUM((CASE WHEN genre LIKE '%%Action%%' THEN 1 ELSE 0 end) * r.rating) AS Action,"
                                    " SUM((CASE WHEN genre LIKE '%%Comedy%%' THEN 1 ELSE 0 end) * r.rating) AS Comedy,"
                                    " SUM((CASE WHEN genre LIKE '%%Drama%%' THEN 1 ELSE 0 end) * r.rating) AS Drama,"
                                    " SUM((CASE WHEN genre LIKE '%%Horror%%' THEN 1 ELSE 0 end) * r.rating) AS Horror,"
                                    " SUM((CASE WHEN genre LIKE '%%Thriller%%' THEN 1 ELSE 0 end) * r.rating) AS Thriller,"
                                    " SUM((CASE WHEN genre LIKE '%%Sci-Fi%%' THEN 1 ELSE 0 end) * r.rating) AS SciFi,"
                                    " SUM((CASE WHEN genre LIKE '%%Romance%%' THEN 1 ELSE 0 end) * 5) AS RRomance,"
                                    " SUM((CASE WHEN genre LIKE '%%Action%%' THEN 1 ELSE 0 end) * 5) AS RAction,"
                                    " SUM((CASE WHEN genre LIKE '%%Comedy%%' THEN 1 ELSE 0 end) * 5) AS RComedy,"
                                    " SUM((CASE WHEN genre LIKE '%%Drama%%' THEN 1 ELSE 0 end) * 5) AS RDrama,"
                                    " SUM((CASE WHEN genre LIKE '%%Horror%%' THEN 1 ELSE 0 end) * 5) AS RHorror,"
                                    " SUM((CASE WHEN genre LIKE '%%Thrille%%' THEN 1 ELSE 0 end) * 5) AS RThriller,"
                                    " SUM((CASE WHEN genre LIKE '%%Sci-Fi%%' THEN 1 ELSE 0 end) * 5) AS RSciFi,"
                                    " SUM((CASE WHEN GENRE LIKE '%%Romance%%' THEN 1 ELSE 0 end)) AS TRomance,"
                                    " SUM((CASE WHEN GENRE LIKE '%%Action%%' THEN 1 ELSE 0 end)) AS TAction,"
                                    " SUM((CASE WHEN GENRE LIKE '%%Comedy%%' THEN 1 ELSE 0 end)) AS TComedy,"
                                    " SUM((CASE WHEN GENRE LIKE '%%Drama%%' THEN 1 ELSE 0 end)) AS TDrama,"
                                    " SUM((CASE WHEN GENRE LIKE '%%Horror%%' THEN 1 ELSE 0 end)) AS THorror,"
                                    " SUM((CASE WHEN GENRE LIKE '%%Thriller%%' THEN 1 ELSE 0 end)) AS TThriller,"
                                    " SUM((CASE WHEN GENRE LIKE '%%Sci-Fi%%' THEN 1 ELSE 0 end)) AS TSciFi,"
                                    " COUNT(*) AS total FROM titles t "
                                    " JOIN ratings r ON t.movieid = r.movieid WHERE userid = %s;")
    cursor.execute(query, [u])
    results = cursor.fetchall()
    data = {
        "Romance": [(results[0][0]/results[0][7])*(results[0][14]/results[0][21])],
        "Action": [(results[0][1] / results[0][8])*(results[0][15]/results[0][21])],
        "Comedy": [(results[0][2] / results[0][9])*(results[0][16]/results[0][21])],
        "Drama": [(results[0][3] / results[0][10])*(results[0][17]/results[0][21])],
        "Horror": [(results[0][4] / results[0][11])*(results[0][18]/results[0][21])],
        "Thriller": [(results[0][5] / results[0][12])*(results[0][19]/results[0][21])],
        "Scifi": [(results[0][6] / results[0][13])*(results[0][20]/results[0][21])]
    }
    sortedList = sorted(data.items(), key=operator.itemgetter(1), reverse=True)

    genre1 = sortedList[0][0]
    genre2 = sortedList[1][0]
    queryset = Titles.objects.filter(genre__icontains=genre1 and genre2).only('movieid')[:200]
    #serializer = Test(queryset, many=True)
    #i = 0;
    #while i < len(queryset):
    #    Recommendations.objects.create(userid=user, movieid=queryset[i])

    return Response(data)