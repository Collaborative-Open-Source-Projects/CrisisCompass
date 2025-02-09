import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
    const { waypoints } = props;
    const instance = L.Routing.control({
      waypoints,
      lineOptions: {
        styles: [{ color: "red", weight: 4 }]
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: function () {
        return null;
      }
    });
  
    return instance;
  };
  
  const RoutingMachine = createControlComponent(createRoutineMachineLayer);
  
  export default RoutingMachine;