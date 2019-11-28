import React, { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import bus1static from './images/bus1.png';
import bus1Gif from './images/busgif1.gif';
import bike1static from './images/bike1.png';
import bike1Gif from './images/bikeanim1.gif';
import car1static from './images/car1.png';
import car1Gif from './images/caranim1.gif';
import car2static from './images/car2.png';
import car2Gif from './images/caranim2.gif';
import car3static from './images/car3.png';
import car3Gif from './images/caranim3.gif';
import defaultStatic from './images/default.png';
import defaultGif from './images/defult.gif';
import axios from 'axios';
import Odometer from 'react-odometerjs';


const vehicleStore = {
  "bus":{"b1":{"static":bus1static, "running":bus1Gif}},
  "car":{"c1":{"static":car1static, "running":car1Gif},
      "c2":{"static":car2static, "running":car2Gif},
      "c3":{"static":car3static, "running":car3Gif}},
  "bike":{"m1":{"static":bike1static, "running":bike1Gif}},
};

const defaultImage = {"static":defaultStatic, "running":defaultGif}

function Garage(props) {
   const vehicles = props.vehicles.map( v => {
       return(
           <div>
             <span className={"vehicleNumber"}>VIN: {v.id}</span>
           <Vehicle
               key = {v.id}
               type = {v.type}
               model = {v.model}
               minSpeed = {v.minSpeed}
               maxSpeed = {v.maxSpeed}
               mileage = {v.mileage}
               id = {v.id}
           />
           </div>

       );
    });
    return (
        <div className="garage">
            <div className="vehicle_browser">
                <Carousel
                    showStatus={false}
                    showThumbs={false}
                    useKeyboardArrows={true}
                    showIndicators={false}
                    width={"49vw"}
                >
                    {vehicles}
                </Carousel>
            </div>
        </div>
    );
}


function Vehicle(props) {
    let [isRunning, setRunning] = useState(false);
    let [imgSrc, setImageSrc] = useState(getVehicleImage(props.type, props.model, "static"));
    let [odometerValue, setOdometerValue] = useState(props.mileage);
    let counterSpeed = ((props.maxSpeed + props.minSpeed) / 2 % 25);
    counterSpeed = isNaN(counterSpeed) ? 5 : counterSpeed;
    const update = () => setTimeout(() => {
        if(isRunning){
            setOdometerValue(odometerValue + 1);
        }
    }, counterSpeed);
    update();
    return (<div className="vehicle" onClick={

        async () => {
            setImageSrc(getVehicleImage(props.type, props.model, isRunning ? "static" : "running"));
            let wasRunning = isRunning;
            setRunning(!isRunning);
          if(wasRunning){
            try{
              await axios.post('http://localhost:8080/transaction', {
                "vin_number": props.id,
                "odo_value": odometerValue + 1,
                "timestamp": new Date().toISOString()
              });
              console.log("Successfully sent odometer reading");
            }
            catch (e) {
              console.error("Unable to post odometer readings", e);
            }
            if(localStorage[props.id]){
              let localVehicle = JSON.parse(localStorage[props.id]);
              localVehicle.mileage = odometerValue + 1;
              localStorage[props.id] = JSON.stringify(localVehicle);

            }
          }
        }
    }>
       <img src={imgSrc} alt={"Loading..."} className="image"/>
        <Odometer value={odometerValue} format="(,ddd),dd"/>
    </div>);
}

function getVehicleImage(type, model, mode){
    const img =  vehicleStore[type][model] || defaultImage;
    return img[mode] ;
}

export default Garage;

