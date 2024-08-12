import OrderForm from "./components/OrderForm";
import DashBoard from "./components/DashBoard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <div className="main-container">
      <DashBoard />
      <OrderForm />
    </div>
  );
};

export default App;
