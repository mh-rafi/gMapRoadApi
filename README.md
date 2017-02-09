
     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.
    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'
    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--, 
    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.
     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'
    ----------------------------------------------------------------- 


## APIs

### Add new raw GPS data
POST https://gmap-road.herokuapp.com/api/gps/raw

### Get all raw GPS data
GET https://gmap-road.herokuapp.com/api/gps/raw

### Get single raw GPS data by id
GET https://gmap-road.herokuapp.com/api/gps/raw/?id=589c02bcf9c7f53a5fee39fb


### Get single Road api snapedToRoad GPS data by id
GET https://gmap-road.herokuapp.com/api/gps/road/?id=589c02bcf9c7f53a5fee39fb

Note: For only first time this data will come from google and autometically will be saved to mongoDB,
        Next time it will be retrieved form mongoDB.

