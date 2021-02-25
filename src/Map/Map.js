import React, { Component } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

// LONGITUDE -180 to + 180
function generateRandomLong() {
    var num = (Math.random()*180).toFixed(3);
    var posorneg = Math.floor(Math.random());
    if (posorneg == 0) {
        num = num * -1;
    }
    return num;
}
// LATITUDE -90 to +90
function generateRandomLat() {
    var num = (Math.random()*90).toFixed(3);
    var posorneg = Math.floor(Math.random());
    if (posorneg == 0) {
        num = num * -1;
    }
    return num;
}

class Map extends Component {

    state = {
        markers : [],
        members : []
    };

    constructor() {
        super();

        this.updateLocation = this.updateLocation.bind(this);        
    }

    componentDidMount() {

        const drone = new window.Scaledrone('tHOdFNSvsdAdax1Q');
        drone.on('error', error => console.error(error));
        drone.on('close', reason => console.error(reason));
        drone.on('open', error => {
            if (error) {
                return console.error(error);
            }
        });

        const room = drone.subscribe('observable-locations', {
            historyCount: 100 // load 100 past messages (this will get user locations)
        });
        
        const {longitude, latitude} = this.getLocation();

        room.on('open', error => {
            if (error) {
                return console.error(error);
            }        
            drone.publish({
                room: 'observable-locations',
                message: {latitude, longitude}
            });

            this.updateLocation({longitude: longitude, latitude: latitude}, drone.clientId);
        });
        // received past message
        room.on('history_message', message => {
            this.updateLocation(message.data, message.clientId)
        });
        // received new message
        room.on('data', (data, member) => {
            this.updateLocation(data, member.id)
        });
        // array of all connected members
        room.on('members', members =>
            this.setState({members})
        );
        // new member joined room
        room.on('member_join', member => {
            const members = this.state.members.slice(0);
            members.push(member);
            this.setState({members});
        });
        // member left room
        room.on('member_leave', member => {
            this.removeMember(member);
        });
    }

    removeMember(member) {
        const members = this.state.members.slice(0);
        const index = members.findIndex(m => m.id === member.id);
        if (index !== -1) {
            members.splice(index, 1);
            this.setState({members});

            // remove marker
            const markers = this.state.markers.slice(0);
            const marker_index = markers.findIndex(m => m.clientID === member.id);
            if (index !== -1) {
                markers.splice(marker_index, 1);
                this.setState({markers});
            }
        }
    }
    
    updateLocation(data, memberId) {
        const members = this.state.members;        

        const member = members.find(m => m.id === memberId);
        console.log(member);

        if (!member) {
            // a history message might be sent from a user who is no longer online
            return;
        }
        if (member) {
            const markers = this.state.markers;
            markers.push({coordinates: [data.longitude, data.latitude], clientID: memberId});
            this.setState({markers});
        }
       
    }

    getLocation() {
        return { longitude: generateRandomLong(), latitude: generateRandomLat() };
    }

    render() {
        return (
            <div className="Map">
                <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
                    <ZoomableGroup>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        style={{
                                            default: {
                                            fill: "lightgray",
                                            outline: "none"
                                        },
                                            hover: {
                                            fill: "#F53",
                                            outline: "none"
                                        },
                                            pressed: {
                                            fill: "#E42",
                                            outline: "none"
                                        }
                                    }}
                                    />
                                ))
                            }
                        </Geographies>
                        {this.state.markers.map(({ coordinates }) => (
                            <Marker coordinates={coordinates}>
                            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>              
            </div>
        );
    }
};

export default Map;
