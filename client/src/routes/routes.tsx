import {
    BrowserRouter,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import {PATHS} from "../constants/paths";
import HomePage from "../pages/Home";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={[PATHS.HOME]} >
                    <HomePage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}