import OrderForm from "./components/OrderForm";
import DashBoard from "./components/DashBoard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <div className="main-container">
      <h1 className="heading">Trading Orders Platform</h1>
      <hr />
      <div className="below-part-container">
        <OrderForm />
        <DashBoard />
      </div>
    </div>
  );
};

export default App;
