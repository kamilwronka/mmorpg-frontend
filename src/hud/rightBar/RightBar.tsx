import Equipment from "../equipment/Equipment";
import ExperienceBar from "../experienceBar/ExperienceBar";
import Healthbar from "../healthbar/HealthBar";
import Inventory from "../inventory/Inventory";
import Stats from "../stats/Stats";

function RightBar() {
  return (
    <div id="rightBar" className="right_bar-container">
      <Healthbar />
      <ExperienceBar />
      <Equipment />
      <Stats />
      <Inventory />
    </div>
  );
}

export default RightBar;
