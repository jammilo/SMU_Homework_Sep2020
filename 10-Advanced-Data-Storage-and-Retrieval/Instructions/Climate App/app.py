import datetime as dt
import numpy as np
import pandas as pd
from flask import Flask, jsonify
import json
from sqlHelper import SQLHelper


app = Flask(__name__)

sqlHelper = SQLHelper()

@app.route("/")
def home():
    print("Client requested the home page from the server")
#     return(f"<br/>--List of all the routes that are available--<br/>"
#         f"<br/>Returns the dates and rainfall(precipitation):<br/>"
#         f"/api/v1.0/precipitation<br/>"
#         f"<br/>Returns a list of stations<br/>"
#         f"/api/v1.0/stations<br/>"
#         f"<br/>Returns a list of Temperature for the previous year:<br/>"
#         f"/api/v1.0/tobs<br/>"
#         f"<br/>Returns the minimum, average and maximum temperature for a date<br/>"
#         f"/api/v1.0/start_date<br/>"
#         f"<br/>Returns the minimum, average and maximum temperature for a start and end date<br/>"
#         f"/api/v1.0/start_date/end_date<br/>"
#         f"<br/>-Dates are in YYYY-MM-DD format"
# )

    return"""<h1>Welcome to my homework page: Hawaii Climate App (Flask API)</h1>
<p>Precipitation Analysis:</p>
<ul>
  <li><a href="/api/v1/precipitation">//api/v1/precipitation</a></li>
</ul>
<p>Station Analysis:</p>
<ul>
  <li><a href="/api/v1/stations">/api/v1/stations</a></li>
</ul>
<p>Temperature Analysis:</p>
<ul>
  <li><a href="/api/v1/tobs">/api/v1/tobs</a></li>
</ul>
<p>Start Day Analysis:</p>
<ul>
  <li><a href="/api/v1/<start_date>/<end_date>">/api/v1/<start_date>/<end_date></a></li>
</ul>
<p>Start & End Day Analysis:</p>
<ul>
  <li><a href="/api/v1/<start_date>">/api/v1/<start_date></a></li>
</ul>"""
    
    

@app.route("/api/v1/precipitation")
def get_precipitation():
    data = sqlHelper.get_precipitation()
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1/stations")
def get_all_stations():
    data = sqlHelper.get_all_stations()
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1/tobs")
def get_tobs_for_most_active():
    data = sqlHelper.get_tobs_for_most_active()
    return jsonify(json.loads(data.to_json(orient="records")))

# date must be in format YYYYMMDD
@app.route("/api/v1/<start_date>/<end_date>")
def get_temp_data_for_date_range(start_date, end_date):
    data = sqlHelper.get_temp_data_for_date_range(start_date, end_date)
    return jsonify(json.loads(data.to_json(orient="records")))

# date must be in format YYYY-MM-DD
@app.route("/api/v1/<start_date>")
def get_temp_data_for_date(start_date):
    data = sqlHelper.get_temp_data_for_date(start_date)
    return jsonify(json.loads(data.to_json(orient="records")))

if __name__ == "__main__":
    app.run(debug=True)
