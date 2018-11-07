from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics
from .models import Titles, Ratings
from .serializers import TitlesSerializer, RatingsSerializer, SearchSerializer
from rest_framework.decorators import api_view
from django.db.models import Avg, F, Sum


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
    queryset = Titles.objects.values('title').annotate(avg_rating=Avg('ratings__rating')).annotate(sum_rating=Sum('ratings__rating')).order_by(F('sum_rating').desc(nulls_last=True))[:10]
    serializer = RatingsSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def showSearch(request):
    title = request.GET['q']
    queryset = Titles.objects.filter(title__icontains=title) [:20]
    serializer = SearchSerializer(queryset, many=True)
    return Response(serializer.data)


