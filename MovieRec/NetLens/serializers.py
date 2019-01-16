from rest_framework import serializers
from .models import Titles, Ratings, Links


class TitlesSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'movieid',
            'title',
            'genres',
        )
        model = Titles


class RatingsSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'tmdbid',
        )
        model = Links


class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'title',
            'genres',
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