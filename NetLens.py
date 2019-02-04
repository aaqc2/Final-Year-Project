%spark.pyspark
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.tuning import ParamGridBuilder, TrainValidationSplit
from sqlalchemy import create_engine
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

# Calculate the RMSE of the recommendations model on the test data.
rmse = evaluator.evaluate(predictions)
print('RMSE: ' + str(rmse))

# Generate movie recommendations for all users.
#sql = 'SELECT COUNT(*) FROM titles;'
#cur.execute(sql, conn)
#result = cur.fetchone()
#count = int(result[0])
#mr = tuned_model.recommendForAllUsers(count)

# Generate movie recommendations for all users.
mr = tuned_model.recommendForAllUsers(100)
mr.cache()
df = mr.withColumn('recommendations', psf.explode('recommendations')).select(
        'userid',
        psf.col('recommendations.movieid'),
        psf.col('recommendations.rating')
    ).toPandas()

# Create the recommendations table.
cur.execute("CREATE TABLE IF NOT EXISTS recommendations (userid INT NOT NULL, movieid INT NOT NULL, rating NUMERIC(4,3), PRIMARY KEY (userid, movieid), FOREIGN KEY (userid) REFERENCES users (userid), FOREIGN KEY (movieid) REFERENCES titles (movieid));")
conn.commit()

# Copy the contents of the dataframe to RDS using SQLAlchemy.
engine = create_engine('postgresql+psycopg2://stc:pla%boy@netlensdb.c0ocrcqfkgqi.eu-west-2.rds.amazonaws.com/NetLensDB')
df.to_sql('recommendations', engine, if_exists='replace', index=False)

# Close all connections to the RDS.
cur.close()
conn.close()
engine.dispose()
