from rest_framework import serializers
from .models import Titles, Ratings, Links, Users



class GenreSerializer(serializers.ModelSerializer):
    links__tmdbid = serializers.IntegerField()
    class Meta:
        fields = (
            'links__tmdbid',
        )
        model = Titles

class RatingsSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'tmdbid',
        )
        model = Links


class SearchSerializer(serializers.ModelSerializer):
    links__tmdbid=serializers.IntegerField()
    class Meta:
        fields = (
            'title',
            'genre',
            'links__tmdbid',
        )
        model = Titles

class UserRatingSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'rating',
        )
        model = Ratings

class AverageRatingSerializer(serializers.ModelSerializer):
    avg_rating = serializers.FloatField()
    class Meta:
        fields = (
            'avg_rating',
        )
        model = Ratings

