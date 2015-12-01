# store-locator-sample
concept of web app for locating stores on a map

## Database
Data is pulled down from a local MongoDB database with the following setup:
```
port: 27017
database: tsdb
collection: locationData
```

Each document in the collection has the following fields:
```
id, 
latitude,
longitude,
city,country,
rss_range,
tz,
tz_index,
duration_threshold,
start_of_day,
is_updating,
rss_campaign,
session_timeout,
raw_data,
campaign_duration,
rss_walkby,
visit_duration_keep_fraction,
total_visitors
```

## Start server
Run the server using the following commands (in the project directory):
```
npm install 
node app.js
```