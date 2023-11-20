import "./App.css";
import { Nav } from "./components/Nav";
import { Banner } from "./components/Banner";
import { Spartak } from "./components/Spartak";
import { Town } from "./components/Town";
import { Surname } from "./components/Surname";
import { Cities } from "./components/Cities";
import { Countries } from "./components/Countries";
import { ThreeVar } from "./components/ThreeVar";
import { Schedule } from "./components/Schedule";
import { VityaTask } from "./components/VityaTask";
import { ButtonSave } from "./components/ButtonSave";
function App() {
  return (
    <div>
      {/* <Nav />
      <Banner />
      <div style={{ display: "flex" }}>
        <Spartak />
        <Town />
        <Surname />
      </div>
      <div style={{ display: "flex" }}>
        <Cities />
        <Countries />
        <ThreeVar />
      </div> */}
      <ButtonSave />
    </div>
  );
}

export default App;
