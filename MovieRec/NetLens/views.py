from django.contrib.auth import authenticate, login
import jwt
import json
import operator
from random import sample
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Titles, Ratings, Users, Links, Recommendations
from .serializers import RatingsSerializer, SearchSerializer, UserRatingSerializer, AverageRatingSerializer, GenreSerializer
from rest_framework.decorators import api_view
from django.db.models import Avg, F, Sum, Q, Count
from rest_framework.pagination import PageNumberPagination
from datetime import datetime, timedelta
from django.contrib.auth.hashers import make_password, check_password
from passlib.hash import pbkdf2_sha256
from django.conf import settings
from django.http import HttpResponse
from django.db import connection
from django.core.cache import cache


# functions to check if the token that is given to the users is still valid
# in order to continue using the webapp
@api_view(['GET'])
def checkToken(request, token):
    try:
        jwt.decode(token, settings.SECRET_KEY)
        return HttpResponse("OK", status=status.HTTP_200_OK)
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid Token", status=status.HTTP_401_UNAUTHORIZED)

# Function that only receive HTTP GET request.
# Shows the movies that has at least 50 ratings from the highest average ratings.
# The results are paginated and has different page size(number of results) based on screen width,
# screen width with more than 1280 or without given width would have page size of 7 else it would have page size of 5.
# The results retrieve from the query will fo through Ratings Serializer for standard output and format.
@api_view(['GET'])
def showTopRated(request):
    # Retrieve the tmdbid from Links Model joining Ratings model where the movies have at least 50 ratings
    # and in the descending order of average rating
    queryset = Links.objects.annotate(avg_rating=Avg('movieid__ratings__rating'), count_rating=Count('movieid__ratings__movieid')).filter(count_rating__gte=50).values('tmdbid').order_by('-avg_rating')
    paginator = PageNumberPagination()
    # check if width is given on url parameter and provide number of results based on the width
    if 'width' in request.GET:
        width = request.GET['width']
        if int(width) > 1280:
            paginator.page_size = 7
        else:
            paginator.page_size = 5
    else:
        paginator.page_size = 7
    # paginate the results
    result_page = paginator.paginate_queryset(queryset, request)
    # pass the results to Ratings Serializer for standard output and format
    serializer = RatingsSerializer(result_page, many=True)
    # response to the front end
    return paginator.get_paginated_response(serializer.data)


# Function that only receive HTTP GET request.
# Return movies that contain the letter/word given(searched) by the users.
# Return movies in different order based on the way chosen by the users but it is ordered in movieid by default
# different way of sorting: alphabetical order of title, reverse alphabetical order of title, average rating of movies
@api_view(['GET'])
def showSearch(request):
    # get the word/letter given by the user from the parameter of url, q (?q='searchedword')
    title = request.GET['q']
    # Check if the users choose any way of sorting from the parameter of url, gen (?gen='Action')
    # and order it accordingly.
    # Ordered in movieid by default.
    if 'orderby' in request.GET:
        orderby = request.GET['orderby']
    else:
        orderby = 'movieid'

    # Check if the ordering of movies chosen by the user is from highest average rating to the lowest
    if orderby == '-avg_rating':
        # Retrieve title, genre and tmdbid of the movies
        # from the Titles Model join the Ratings and Links Model
        # where the title of movies contain the given word/letter and
        # the movies have at least 50 ratings and in the descending order of average rating
        queryset = Titles.objects.annotate(avg_rating=Avg('ratings__rating'), count_rating=Count('ratings__movieid')).filter(title__icontains=title, count_rating__gte=50).values('title', 'genre', 'links__tmdbid').order_by(orderby)
    else:
        # Retrieve title, genre and tmdbid of the movies
        # from the Titles Model join the Ratings and Links Model
        # where the title of the movies contain the given word/letter
        # and in the given order the users preferred besides average rating
        queryset = Titles.objects.annotate(avg_rating=Avg('ratings__rating')).filter(title__icontains=title).values('title', 'genre', 'links__tmdbid').order_by(orderby)
    paginator = PageNumberPagination()
    paginator.page_size = 7
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = SearchSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# Function that only receive HTTP GET request.
# Return movies that contain the letter/word given(searched) by the users with the genre chosen by the users.
# Return movies in different order based on the way chosen by the users but it is ordered in movieid by default
# different way of sorting: alphabetical order of title, reverse alphabetical order of title, average rating of movies
@api_view(['GET'])
def showSearchAndGenre(request):
    title = request.GET['q']

    if 'orderby' in request.GET:
        orderby = request.GET['orderby']
    else:
        orderby = 'movieid'

    # get the genre chosen by the user from the parameter of url, gen (?gen='Action' or &gen='Comedy')
    genres = request.GET.getlist('gen')

    # Loop through the gen parameter as it can contain more than one genre
    gen = Q()
    for genre in genres:
        gen |= Q(genre__contains=genre)

    if orderby == '-avg_rating':
        # Retrieve title, genre and tmdbid of the movies
        # from the Titles Model join the Ratings and Links Model
        # where the title of movies contain the given word/letter and the genre chosen by the users
        # the movies have at least 50 ratings and in the descending order of average rating
        queryset = Titles.objects.annotate(avg_rating=Avg('ratings__rating'), count_rating=Count('ratings__movieid')).filter(gen, title__icontains=title, count_rating__gte=50).values('title', 'genre', 'links__tmdbid').order_by(orderby)
    else:
        # Retrieve title, genre and tmdbid of the movies
        # from the Titles Model join the Ratings and Links Model
        # where the title of the movies contain the given word/letter and genre chosen by the users
        # and in the given order the users preferred besides average rating
        queryset = Titles.objects.annotate(avg_rating=Avg('ratings__rating')).filter(gen, title__icontains=title).values('title', 'genre', 'links__tmdbid').order_by(orderby)
    paginator = PageNumberPagination()
    paginator.page_size = 7
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = SearchSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# Function that only receive HTTP POST request.
# Register(Add) new user to the Users Model with user details
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        username = request.data.get('username')

        # Display error message if the given email is used
        if Users.objects.filter(email=email).exists():
            return Response("Email already in use", status=status.HTTP_406_NOT_ACCEPTABLE)
        # Display error message if the given username is used
        elif Users.objects.filter(username=username).exists():
            return Response("Username already in use", status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            #hash the password using sha256 with the pbkdf2 function
            hashPass = pbkdf2_sha256.hash(password)
            # get the last userid on the Users Model
            queryset = str(Users.objects.values('userid').last().get("userid"))
            # increment the last userid to 1
            uid = int(queryset) + 1
            # Create new user with the incremented userid and username, hashed password and email
            Users.objects.create(userid=str(uid), username=username, password=hashPass, email=email)

            #create a token here

            # use the secret key given by Django
            secret = settings.SECRET_KEY
            payload = {
                'id': uid,
                # current time when token is created
                'iat': datetime.now(),
                # expiry date for the token (in 6 hours after creation of token)
                'exp': datetime.now() + timedelta(hours=6)
            }

            # create jwt token by encoding the payload and secret key
            jwt_token = {'token': jwt.encode(payload, secret)}
            return Response(
                {
                    'userid': uid,
                    'username': username,
                    'token': jwt_token,
                    'email': email
                },
                status=200,
                content_type="application/json"
            )


# Function that only receive HTTP GET request.
#
@api_view(['POST'])
def rate(request):
    if request.method == 'POST':
        tmdbid = request.data.get('tmdbid')
        userid = request.data.get('userid')
        rated = request.data.get('rated')
        tMovie = Links.objects.get(tmdbid=tmdbid)
        userId= Users.objects.get(pk=userid)
        try:
            # convert the ratings user rated to the movies into float
            rating = float(rated)
            # if the movie and user already exist in the Rating model (was rated previously)
            if Ratings.objects.filter(userid=userId, movieid=tMovie.movieid).exists():
                # update the new rating given by the user to the movie as well as change the timestamp to latest date
                Ratings.objects.filter(userid=userId, movieid=tMovie.movieid).update(rating=rating,
                                                                                     timestamp=datetime.now().timestamp())
            else:
                # if the movie was not previously rated,
                # insert the ratings the user rated to the movie
                testrating = Ratings(userid=userId, movieid=tMovie.movieid, rating=rating,
                                     timestamp=datetime.now().timestamp())
                testrating.save(force_insert=True)
            queryset = Ratings.objects.filter(userid=userId, movieid=tMovie.movieid)
            serializer_class = UserRatingSerializer(queryset, many=True)
            return Response(serializer_class.data)
        except ValueError:
            return Response("invald value")


# Function that only receive HTTP GET request.
# Retrieve all the movies rated by the user
@api_view(['GET'])
def getUser(request, u):
    queryset = list(Links.objects.raw('SELECT l.movieid, l.tmdbid FROM link l JOIN ratings r ON r.movieid = l.movieid WHERE r.userid = %s ORDER BY r.timestamp DESC', [u]))
    paginator = PageNumberPagination()
    paginator.page_size = 4
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = RatingsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# Function that only receive HTTP GET request.
# get the ratings of the given movie by the given user
@api_view(['GET'])
def getUserRating(request, u, tmdbId):
    # get the user from Users Model where its userid is equal to the given userid
    userId = Users.objects.get(pk=u)
    # get the movie from Links Model where its tmdbid is equal to the given tmdbid
    tMovie = Links.objects.get(tmdbid=tmdbId)
    # get the ratings of the movie from the Ratings Model where the userid is equal to the given userid
    # and tmdbid is equal to the given tmdbid
    queryset = Ratings.objects.filter(userid=userId, movieid=tMovie.movieid)
    serializer_class = UserRatingSerializer(queryset, many=True)
    return Response(serializer_class.data)


# Function that only receive HTTP GET request.
# get the average rating of the given movie
@api_view(['GET'])
def AverageRating(request, tmdbid):
    # get the movieid of the movie from the Links model where the tmdbid is equal to the given tmdbid
    movieId = Links.objects.filter(tmdbid=tmdbid).values('movieid')
    # get the average rating of the movie where the movieid is equal to the movieid retrieved previously
    # group by movieid
    queryset = Ratings.objects.values('movieid').filter(movieid__in=movieId).annotate(avg_rating=Avg('rating'))
    serializer = AverageRatingSerializer(queryset, many=True)
    return Response(serializer.data)


# Function that only receive HTTP GET request.
# Retrieve movies to be recommended to the users which was generated by the Machine Learning Model in AWS
@api_view(['GET'])
def getRecommendation(request, u):
    queryset = list(Links.objects.raw(' SELECT l.tmdbid, l.movieid FROM link l JOIN recommendations r ON '
                                      ' l.movieid = r.movieid WHERE r.userid = %s AND r.movieid NOT IN '
                                      '(SELECT movieid FROM ratings rt WHERE rt.userid = %s) ORDER BY r.rating DESC', [u, u]))
    paginator = PageNumberPagination()
    if 'width' in request.GET:
        width = request.GET['width']
        if int(width) > 1280:
            paginator.page_size = 7
        else:
            paginator.page_size = 5
    else:
        paginator.page_size = 7
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = RatingsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# Function that only receive HTTP POST request.
# Log the user in if the given email and password is correct
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        # check in username given can be found in User model
        if Users.objects.filter(username=username).exists():
            # get the details of the given user
            user = Users.objects.get(username=username)
            # verify the password input with the hashed password saved in the User model
            if pbkdf2_sha256.verify(str(password), user.password):
                # produce token if the password is right
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
                    status=200,
                    content_type="application/json"
                )
            # return error message if the given password is wrong
            else:
                return Response("Invalid username or password", status=status.HTTP_401_UNAUTHORIZED)
        # return error message if the given username is wrong
        else:
            return Response("Invalid username or password", status=status.HTTP_401_UNAUTHORIZED)


# Function that only receive HTTP GET request.
# Return movies in random order with given genre
@api_view(['GET'])
def getGenres(request):
    # get the cached shuffle order of movie list
    randomList = cache.get('shuffle')

    # if no cache is available, generates a random movie list with the genre given
    if not randomList:
        genres = request.GET.getlist('gen')
        q = Q()
        for genre in genres:
            q |= Q(genre__icontains=genre)
        queryset = list(Titles.objects.filter(q).values('links__tmdbid'))
        # randomise the order of the list of movies
        result = sample(queryset, len(queryset))
        # cache the movie list in random order for 2 hours
        cache.set('shuffle', result, 7200)

    paginator = PageNumberPagination()
    paginator.page_size = 7
    result_page = paginator.paginate_queryset(cache.get('shuffle'), request)
    serializer = GenreSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# Function that only receive HTTP GET request.
# get the number of movies the user has rated
@api_view(['GET'])
def getNumMovies(request, u):
    query = Ratings.objects.filter(pk=u).count()
    return Response(query)


# Function that only receive HTTP GET request.
@api_view(['GET'])
def getCustomRec(self, u):
    #clears the cache of the random list from getGenres()
    cache.clear()
    user = Users.objects.get(pk=u)
    cursor = connection.cursor()
    #sums all genres that occur in the users rated list of movies * the rating the user gave for that movie
    query = ("SELECT SUM((CASE WHEN genre LIKE '%%Romance%%' THEN 1 ELSE 0 end) * r.rating) AS Romance, "
             " SUM((CASE WHEN genre LIKE '%%Action%%' THEN 1 ELSE 0 end) * r.rating) AS Action,"
             " SUM((CASE WHEN genre LIKE '%%Comedy%%' THEN 1 ELSE 0 end) * r.rating) AS Comedy,"
             " SUM((CASE WHEN genre LIKE '%%Drama%%' THEN 1 ELSE 0 end) * r.rating) AS Drama,"
             " SUM((CASE WHEN genre LIKE '%%Horror%%' THEN 1 ELSE 0 end) * r.rating) AS Horror,"
             " SUM((CASE WHEN genre LIKE '%%Thriller%%' THEN 1 ELSE 0 end) * r.rating) AS Thriller,"
             " SUM((CASE WHEN genre LIKE '%%Sci-Fi%%' THEN 1 ELSE 0 end) * r.rating) AS SciFi,"
             #sums all genres that occur in the users rated list of movies * the max rating that can be given (5)
             " SUM((CASE WHEN genre LIKE '%%Romance%%' THEN 1 ELSE 0 end) * 5) AS RRomance,"
             " SUM((CASE WHEN genre LIKE '%%Action%%' THEN 1 ELSE 0 end) * 5) AS RAction,"
             " SUM((CASE WHEN genre LIKE '%%Comedy%%' THEN 1 ELSE 0 end) * 5) AS RComedy,"
             " SUM((CASE WHEN genre LIKE '%%Drama%%' THEN 1 ELSE 0 end) * 5) AS RDrama,"
             " SUM((CASE WHEN genre LIKE '%%Horror%%' THEN 1 ELSE 0 end) * 5) AS RHorror,"
             " SUM((CASE WHEN genre LIKE '%%Thriller%%' THEN 1 ELSE 0 end) * 5) AS RThriller,"
             " SUM((CASE WHEN genre LIKE '%%Sci-Fi%%' THEN 1 ELSE 0 end) * 5) AS RSciFi,"
             #sums all genres that occur in the users rated list of movies
             " SUM((CASE WHEN GENRE LIKE '%%Romance%%' THEN 1 ELSE 0 end)) AS TRomance,"
             " SUM((CASE WHEN GENRE LIKE '%%Action%%' THEN 1 ELSE 0 end)) AS TAction,"
             " SUM((CASE WHEN GENRE LIKE '%%Comedy%%' THEN 1 ELSE 0 end)) AS TComedy,"
             " SUM((CASE WHEN GENRE LIKE '%%Drama%%' THEN 1 ELSE 0 end)) AS TDrama,"
             " SUM((CASE WHEN GENRE LIKE '%%Horror%%' THEN 1 ELSE 0 end)) AS THorror,"
             " SUM((CASE WHEN GENRE LIKE '%%Thriller%%' THEN 1 ELSE 0 end)) AS TThriller,"
             " SUM((CASE WHEN GENRE LIKE '%%Sci-Fi%%' THEN 1 ELSE 0 end)) AS TSciFi,"
             " COUNT(*) AS total FROM titles t "
             " JOIN ratings r ON t.movieid = r.movieid WHERE userid = %s;")
    #executes the query and parses the userid into %s
    cursor.execute(query, [u])
    results = cursor.fetchall()
    replacement = []
    #replaces all 0's at RGenre to avoid the divide by 0 error later on
    for i in range(7):
        if results[0][i+7] == 0:
            replacement.append(1)
        else:
            replacement.append(results[0][i+7])

    #for each genre, gets the sum*userRating for that genre/max possible rating for that genre
    #then multiplies by the % appearance of the genre within the given list of movies
    data = {
        "Romance": [(results[0][0]/replacement[0])*(results[0][14]/results[0][21])],
        "Action": [(results[0][1] / replacement[1])*(results[0][15]/results[0][21])],
        "Comedy": [(results[0][2] / replacement[2])*(results[0][16]/results[0][21])],
        "Drama": [(results[0][3] / replacement[3])*(results[0][17]/results[0][21])],
        "Horror": [(results[0][4] / replacement[4])*(results[0][18]/results[0][21])],
        "Thriller": [(results[0][5] / replacement[5])*(results[0][19]/results[0][21])],
        "Sci-Fi": [(results[0][6] / replacement[6])*(results[0][20]/results[0][21])]
    }
    #sorts the lit out in descending order (highest first)
    sortedList = sorted(data.items(), key=operator.itemgetter(1), reverse=True)

    #keeps track of the top 2 genres, and the last genre
    genre1 = sortedList[0][0]
    genre2 = sortedList[1][0]
    genre3 = sortedList[6][0]
    #Select first 200 movie titles with genre1 OR genre2 excluding genre3 i.e. titles with Action OR Comedy BUT EXCLUDES Horror
    queryset = list(Titles.objects.filter(Q(genre__icontains=genre1) | Q(genre__icontains=genre2)).exclude(genre__icontains=genre3).values_list('movieid', flat=True))[:200]
    i = 0
    #for the list of 200 movies, adds each one to the recommendations table
    while i < len(queryset):
        title = Titles.objects.get(pk=queryset[i])
        Recommendations.objects.create(userid=user, movieid=title)
        i += 1
    return Response(status=status.HTTP_200_OK)