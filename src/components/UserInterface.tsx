import { selectPlanetUI } from "../threejs/EventsScene";

const UserInterface = ({solarSystemsData, camera, controls, solarSystemsMesh}) => {

    const handleClick = (solarSystemData) => {
        const indexOfSolarSystem = solarSystemsData.findIndex(solarSystem => solarSystem.name === solarSystemData.name);
        const planetMesh = solarSystemsMesh[indexOfSolarSystem]
        selectPlanetUI(planetMesh, camera, controls, solarSystemsMesh, solarSystemsData);
    }

    return ( 
        <div className="user-interface">
            {solarSystemsData.map((solarSystemData, index) => (
                <div key={index} className="solar-system" onClick={() => handleClick(solarSystemData)}>
                    <div className="solar-system-name">{solarSystemData.name}</div>
                </div>
            ))}
        </div>
     );
}
 
export default UserInterface;