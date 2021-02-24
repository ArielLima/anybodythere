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

class Map extends Component {

    state = {
        markers : []
    };

    constructor() {
        super();
    }

    componentWillMount() {
        this.mapMe = this.mapMe.bind(this);
    }

    mapMe() {
        this.setState({markers: [{ coordinates: [-121.838780, 39.728960] }]});
    }

    render() {

        // const markers = [
        //     {
        //       coordinates: [-58.3816, -34.6037]
        //     },
        //     { coordinates: [-68.1193, -16.4897] },
        //     { coordinates: [-47.8825, -15.7942] },
        //     { coordinates: [-70.6693, -33.4489] },
        //     { coordinates: [-74.0721, 4.711] },
        //     { coordinates: [-78.4678, -0.1807] },
        //     { coordinates: [-58.1551, 6.8013] },
        //     { coordinates: [-57.5759, -25.2637] },
        //     { coordinates: [-55.2038, 5.852] },
        //     { coordinates: [-56.1645, -34.9011] },
        //     { coordinates: [-66.9036, 10.4806] },
        //     { coordinates: [-77.0428, -12.0464] }
        //   ];

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
                        {this.state.markers.map(({ name, coordinates, markerOffset }) => (
                            <Marker key={name} coordinates={coordinates}>
                            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                            <text
                                textAnchor="middle"
                                y={markerOffset}
                                style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
                            >
                                {name}
                            </text>
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>  
                <button onClick={this.mapMe}>Where am I?</button>              
            </div>
        );
    }
};

export default Map;
