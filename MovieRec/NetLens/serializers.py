from rest_framework import serializers
from .models import Titles, Ratings


class TitlesSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'movieid',
            'title',
            'genres',
        )
        model = Titles


class RatingsSerializer(serializers.ModelSerializer):
    avg_rating = serializers.FloatField()
    class Meta:
        fields = (
            'title',
            'avg_rating',
        )
        model = Titles


class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'title',
            'genres',
        )
        model = Titles
