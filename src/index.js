import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import './index.scss';
import reportWebVitals from './reportWebVitals';

// Import Landing page
import Home from './pages/home';
import Bucket from './pages/bucket';

const Root = (props) => {
  return (
    <Fragment>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home}/>
            <Route exact path={`${process.env.PUBLIC_URL}/bucket/:id`} component={Bucket}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    </Fragment>
  )
}
ReactDOM.render(<Root/>, document.getElementById('root'));
reportWebVitals();