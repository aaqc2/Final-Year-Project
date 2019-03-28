from django.db import models

# Model class(database table) that is provided by Django for authentication
class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'

# Model class(database table) that is provided by Django for authentication & permission
class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)

# Model class(database table) that is provided by Django for authentication & permission
class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)

# Model class(database table) that is provided by Django for authentication
class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'

# Model class(database table) that is provided by Django for authentication
class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)

# Model class(database table) that is provided by Django for authentication & permission
class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)

# Model class(database table) that is provided by Django for admin
class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'

# Model class(database table) that is provided by Django
class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)

# Model class(database table) that is provided by Django for migrations when there is changes in the model
class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'

# Model class(database table) that is provided by Django for session
class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'

# Links Model(database table) from MovieLens dataset CSV which provide the tmdbid and imdbid to link movies in
# the dataset to tmdb/imdb. It has attributes of:
# movieid: foreign key that link to Titles model(table) which has movieid as primary key
#          and Posts, Ratings, Recommendations,Tags models which have movieid as foreign key.
#          Also acts as the primary key for Links Model
# imdbid: the actual imdb id for the movie on imdb to be used for api call
# tmdbid: the actual tmdb id for the movie on tmdb to be used for api call
class Links(models.Model):
    movieid = models.ForeignKey('Titles', primary_key=True, on_delete=models.CASCADE, db_column='movieid')
    imdbid = models.IntegerField()
    tmdbid = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'link'

# Posts Model(database table) that we have created that store the users' comments on the movies.
class Posts(models.Model):
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='userid', primary_key=True)
    movieid = models.ForeignKey('Titles', on_delete=models.CASCADE, db_column='movieid', blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    timestamp = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'posts'
        unique_together = (('userid', 'timestamp'),)


# Ratings Model(database table) from MovieLens dataset CSV which store the ratings of movies given by each user.
# It has attributes of:
# userid: foreign key that link to Users model(table) which has userid as primary key
#         and Posts, Recommendations,Tags models which have movieid as foreign key
# movieid: foreign key that link to Titles model(table) which has movieid as primary key
#          and Links, Posts, Recommendations,Tags models which have movieid as foreign key
# rating: store the ratings given by the users
# timestamp: the date of the rating that was given to the respective movie
# (userid, movieid) is the primary key of the Ratings model
class Ratings(models.Model):
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='userid', primary_key=True)
    movieid = models.ForeignKey('Titles', on_delete=models.CASCADE, db_column='movieid')
    rating = models.FloatField(blank=True, null=True)
    timestamp = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ratings'
        unique_together = (('userid', 'movieid'),)


# Recommendations Model(database table) that we created to store the recommended movies to the users
# after running the Machine Learning model. It has attributes of:
# userid: foreign key that link to Users model(table) which has userid as primary key
#         and Posts, Ratings,Tags models which have movieid as foreign key
# movieid: foreign key that link to Titles model(table) which has movieid as primary key
#          and Links, Posts, Ratings,Tags models which have movieid as foreign key
# rating: store the prediction ratings the user would give to each recommended movie.
# (userid, movieid) is the primary key of the Ratings model
class Recommendations(models.Model):
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='userid', primary_key=True)
    movieid = models.ForeignKey('Titles', db_column='movieid', primary_key=True, on_delete=models.CASCADE)
    rating = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recommendations'
        unique_together = (('userid', 'movieid'),)

# Tags Model(database table) from MovieLens dataset CSV which consists of the tags of each movies.
# It has attributes of:
# userid: foreign key that link to Users model(table) which has userid as primary key
#         and Posts, Ratings,Recommendations models which have movieid as foreign key
# movieid: foreign key that link to Titles model(table) which has movieid as primary key
#          and Links, Posts, Ratings, Recommendation models which have movieid as foreign key
# tag: store tags related to movies
# timestamp: store the date of the timestamp was added
# ('userid', 'movieid', 'tag', 'timestamp') is the primary key of Tags model
class Tags(models.Model):
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='userid', primary_key=True)
    movieid = models.ForeignKey('Titles', on_delete=models.CASCADE, db_column='movieid')
    tag = models.CharField(max_length=255)
    timestamp = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tags'
        unique_together = (('userid', 'movieid', 'tag', 'timestamp'),)


# Titles Model(database table) from MovieLens dataset CSV wthat store the details of the movies eg. title and genre
# It has attributes of:
# movieid: Act as primary key for Titles model
#          Link to Posts, Ratings, Recommendations, Links and Tags models which have movieid as foreign key
# title: store the title(name) of the movies
# genre: store the genres of each movie
class Titles(models.Model):
    movieid = models.IntegerField(db_column='movieid', primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    genre = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'titles'

# Users Model(database table) from MovieLens dataset CSV which store the details of user eg. username, password, email
# It has attributes of:
# userid: Acts as primary key for Users model
#         Link to Posts, Ratings, Recommendations, Tags models which have userid as foreign key
# username: store username of users and has to be unique and not blank/null
# password: store hashed password of the users
# email: store the email of the users and has to be uniquer and not blank/null
class Users(models.Model):
    userid = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=255, blank=False, null=False, unique=True)
    password = models.CharField(max_length=255, blank=False, null=False)
    email = models.EmailField(max_length=255, blank=False, null=False, unique=True)

    class Meta:
        managed = False
        db_table = 'users'
