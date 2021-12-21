import { createStore } from "redux";
import rootReducer from "../redux/index";

const store = createStore(rootReducer);

export default store;