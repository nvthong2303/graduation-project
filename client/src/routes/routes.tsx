import {
    BrowserRouter,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import { PATHS } from "../constants/paths";
import HomePage from "../pages/Home";
import WorkSpace from "../pages/WorkSpace";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={[PATHS.HOME]} >
                    <HomePage />
                </Route>
                <Route exact path={[PATHS.WORK, PATHS.ROOM]} >
                    <WorkSpace />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}