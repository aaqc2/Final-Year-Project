%spark.pyspark
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.tuning import ParamGridBuilder, TrainValidationSplit
from sqlalchemy import create_engine
from psycopg2 import sql
import pyspark.sql.functions as psf
import psycopg2 as pg
import pandas as pd

# Read the SQL query from the RDS database, store the results into a
# dataframe and split the dataframe into training and testing sets.
conn = pg.connect("dbname='NetLensDB' user='stc' host='netlensdb.c0ocrcqfkgqi.eu-west-2.rds.amazonaws.com' password='pla%boy'")
cur = conn.cursor()
sql = 'SELECT userid, movieid, rating FROM ratings;'
pdf = pd.read_sql_query(sql, conn)
df = spark.createDataFrame(pdf)
(training, testing) = df.randomSplit([0.7, 0.3])

# Create a recommendations model using the ALS algorithm on the training data.
als = ALS(userCol='userid', itemCol='movieid', ratingCol='rating', coldStartStrategy='drop')

# Build a parameter grid to assign a range of values to
# the given ALS parameters.
output = ParamGridBuilder() \
             .addGrid(als.rank, [10, 11, 12]) \
             .addGrid(als.maxIter, [6, 7, 8]) \
             .addGrid(als.regParam, [.16, .17, .18]) \
             .build()

# Use the regression evaluator and fit the model to the training data.
evaluator = RegressionEvaluator(metricName='rmse', labelCol='rating', predictionCol='prediction')
tvs = TrainValidationSplit(estimator=als, estimatorParamMaps=output, evaluator=evaluator)
model = tvs.fit(training)
tuned_model = model.bestModel
predictions = tuned_model.transform(testing)

# Get the size of the dataset.
query = 'SELECT COUNT(*) FROM ratings;'
pdf = pd.read_sql_query(query, conn)
df = spark.createDataFrame(pdf).collect()

for row in df:
	count = int(row[0])

# Get the total number of movies a user has rated.
users = [1, 613, 614, 615, 616, 617, 628, 414]
ratings = []

for u in users:
	query = 'SELECT COUNT(*) FROM ratings where userid = %s' % str(u)
	pdf = pd.read_sql_query(query, conn)
	df = spark.createDataFrame(pdf).collect()
	for row in df:
		rated = int(row[0])
		ratings.append(rated)

#Generate RMSE values for each user in the users list.
evaluations = []

for u in users:
	subset = predictions.where(predictions.userid == u)
	evaluations.append(evaluator.evaluate(subset))

df = spark.createDataFrame(zip(users, evaluations, ratings), schema=['userid', 'rmse', 'movies_rated']).collect()

# Insert into database
for row in df:
	user = int(row.userid)
	rmse = float(row.rmse)
	total = int(row.movies_rated)
	print(str(user) + ' ' + str(rmse) + ' ' + str(total))
	query = "INSERT INTO individual_rmse_values VALUES (DEFAULT, current_timestamp, %s, %s, %s, %s);" % (str(user), str(rmse), str(total), str(count))
	cur.execute(query)
	conn.commit()

# Calculate the RMSE of the recommendations model on the training 
# and then insert the RMSE value and the timestamp into the RDS.
rmse = evaluator.evaluate(predictions)
query = "INSERT INTO rmseSmallDataset VALUES (DEFAULT, %s, CURRENT_TIMESTAMP)" % str(rmse)
cur.execute(query)
conn.commit()

# Generate movie recommendations for all users.
mr = tuned_model.recommendForAllUsers(200)
mr.cache()
df = mr.withColumn('recommendations', psf.explode('recommendations')).select(
        'userid',
        psf.col('recommendations.movieid'),
        psf.col('recommendations.rating')
    ).toPandas()

# Create the recommendations relation.
cur.execute("CREATE TABLE IF NOT EXISTS recommendations (userid INT NOT NULL, movieid INT NOT NULL, rating NUMERIC(4,3), PRIMARY KEY (userid, movieid), FOREIGN KEY (userid) REFERENCES users (userid), FOREIGN KEY (movieid) REFERENCES titles (movieid));")
conn.commit()

# Copy the contents of the dataframe to RDS using SQLAlchemy.
engine = create_engine('postgresql+psycopg2://stc:pla%boy@netlensdb.c0ocrcqfkgqi.eu-west-2.rds.amazonaws.com/NetLensDB')
df.to_sql('recommendations', engine, if_exists='replace', index=False)

# Close all connections to the RDS.
cur.close()
conn.close()
engine.dispose()
