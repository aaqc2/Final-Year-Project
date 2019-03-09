from rest_framework import serializers
from .models import Titles, Ratings, Links, Users


class TitlesSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'movieid',
            'title',
            'genre',
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

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'userid',
            'movieid',
            'rating',
            'timestamp',
        )
        model = Ratings

class UserRating(serializers.ModelSerializer):
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

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'userid',
        )
        model = Users
