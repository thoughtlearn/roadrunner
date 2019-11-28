import React from 'react';
import './App.css';
import './odometer.css';
import Garage from "./Garage";
const vehicles = [{
    id:"v1",
    type:"car",
    model:"c1",
    minSpeed:10,
    maxSpeed:100,
    mileage:1000
},
    {
        id:"v2",
        type:"car",
        model:"c2",
        minSpeed:10,
        maxSpeed:15,
        mileage:2000
    },
    {
        id:"v3",
        type:"car",
        model:"c3",
        minSpeed:130,
        maxSpeed:13,
        mileage:3000
    },

    {
        id:"v4",
        type:"bus",
        model:"b1",
        minSpeed:10,
        maxSpeed:30,
        mileage:4000
    },
    {
        id:"v5",
        type:"bike",
        model:"m1",
        minSpeed:10,
        maxSpeed:1000,
        mileage:5000
    }];
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Garage
            vehicles = {getVehicles()}
        />
      </header>
    </div>
  );
}
function getVehicles(){
    let finalVehicles =  vehicles.map(v => {
        if(localStorage[v.id]){
            return JSON.parse(localStorage[v.id]);
        }
        else{
            localStorage[v.id] = JSON.stringify(v);
            return v;
        }
    });
    console.log(finalVehicles);
    return finalVehicles;
}
export default App;
