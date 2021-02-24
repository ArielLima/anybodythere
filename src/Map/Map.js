import React, { Component } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

class Map extends Component {

    state = {
        position: {
            coordinates: [0, 0],
            zoom: 1
        }
    };

    constructor() {
        super();
    }

    componentWillMount() {
        
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
                    </ZoomableGroup>
                </ComposableMap>                
            </div>
        );
    }
};

export default Map;
