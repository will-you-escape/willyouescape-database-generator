willyouescape-database-generator
=========

This project generates a csv file containing Escape Rooms in the world based on the website http://escaperoomdirectory.com/

CSV output is located in `data/roomsdb.csv` and its format is :

`'Country','Region','City','Organization','Room','URL','Address','Lat','Lng','GmapsName','GmapsId','GmapsPlaceID'`

with :

- Country : 2 digits country identification
- Region : region name
- City : city of the room
- Organization : name of the company running the room
- Room : name of the room
- URL : link to website
- Address : address (gmaps)
- Lat : latitude (gmaps)
- Lng : longitude (gmaps)
- GmapsName : name of the location (gmaps)
- GmapsId : id of the location (gmaps)
- GmapsPlaceId : place id of the location (gmaps)


## Startup

`node index`

## Prerequisites

- nodejs
- clone repository
- `npm install`