from django.shortcuts import render
from django.contrib.auth import authenticate, login
import jwt
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Titles, Ratings, Users, Links, Recommendations
from .serializers import TitlesSerializer, RatingsSerializer, SearchSerializer, RatingSerializer, UserRating, AverageRatingSerializer, UserLoginSerializer
from rest_framework.decorators import api_view
from django.db.models import Avg, F, Sum, Q
from rest_framework.pagination import PageNumberPagination
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.
class ListTitles(generics.ListCreateAPIView):
    queryset = Titles.objects.all()
    pagination_class = None
    serializer_class = TitlesSerializer


class ShowGenres(generics.RetrieveUpdateDestroyAPIView):
    queryset = Titles.objects.all()
    serializer_class = TitlesSerializer
    lookup_field = 'movieid'


@api_view(['GET'])
def showTopRated(request):
    getMID = Titles.objects.values_list('movieid', flat=True).annotate(avg_rating=Avg('ratings__rating')).annotate(sum_rating=Sum('ratings__rating')).order_by(F('sum_rating').desc(nulls_last=True))[:15]
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

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
       email = request.data.get('email')
       password = request.data.get('password')
       username = request.data.get('username')
       if Users.objects.filter(email=email).exists():
           return Response("Email already in use", status=status.HTTP_406_NOT_ACCEPTABLE)
       elif Users.objects.filter(username=username).exists():
           return Response("Username already exist", status=status.HTTP_406_NOT_ACCEPTABLE)
       else:
           hashPass = make_password(password, salt=None, hasher='pbkdf2_sha256')
           queryset = str(Users.objects.values('userid').last().get("userid"))
           uid = int(queryset) + 1
           Users.objects.create(userid=str(uid), username=username, password=hashPass, email="email")
           return Response("success", status=status.HTTP_201_CREATED)

@api_view(['GET'])
def rate(request, m, u, r):
    tMovie = Links.objects.get(tmdbid=m)
    #movieId = Titles.objects.get(link.tmdbid=m)
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
    userId = Users.objects.get(pk=u)
    userList = Ratings.objects.values_list('movieid').filter(userid=userId)
    queryset = Links.objects.filter(movieid__in=list(userList)).values('tmdbid') [:20]
    serializer_class = RatingsSerializer(queryset, many=True)
    return Response(serializer_class.data)

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
    userId = Users.objects.get(pk=u)
    userList = list(Recommendations.objects.values_list('movieid').filter(userid=userId).order_by('-rating'))[:14]
    queryset = Links.objects.filter(movieid__in=list(userList)).values('tmdbid')
    serializer_class = RatingsSerializer(queryset, many=True)
    return Response(serializer_class.data)

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        user = Users.objects.get(username=email)
       # queryset = Users.objects.filter(email=email, password=password).values('userid')
        if Users.objects.filter(username=email).exists():
            user = Users.objects.get(username=email)
            if check_password(password, user.password):
                payload = {
                    'id': user.userid
                }
                jwt_token = {'token': jwt.encode(payload, '12345')}
            # serializer = UserLoginSerializer(queryset, many=True)
                return Response(
                    jwt_token,
                    status=200,
                    content_type="application/json"
                )#serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("Invalid email or password", status=status.HTTP_401_UNAUTHORIZED)


# @api_view(['GET'])
# def getGenres(request):
#     genres = request.GET.getlist('gen')
#     queryset = Titles.objects.all()
#     queryset = queryset.filter(genre__in=genres)
#     serializer = TitlesSerializer(queryset, many=True)
#     return Response(serializer.data)

@api_view(['GET'])
def getGenres(request):
    genres = request.GET.getlist('gen')
    # queryset = Titles.objects.all()
    # queryset = queryset.filter(genre__in=genres)
    q = Q()
    for genre in genres:
        q |= Q(genre__icontains=genre)
    queryset = Titles.objects.filter(q)
    serializer = TitlesSerializer(queryset, many=True)
    return Response(serializer.data)

