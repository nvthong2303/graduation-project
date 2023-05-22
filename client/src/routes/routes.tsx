import {
    BrowserRouter,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import { PATHS } from "../constants/paths";
import HomePage from "../pages/Home";
import WorkSpace from "../pages/WorkSpace";
import Chat from "../pages/Chat";
import General from "../pages/General";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={[PATHS.HOME]} >
                    <HomePage />
                </Route>
                <Route exact path={[PATHS.CHAT, PATHS.CHAT_DETAIL]} >
                    <Chat />
                </Route>
                <Route exact path={[PATHS.GROUP]} >
                    <WorkSpace />
                </Route>
                <Route exact path={[PATHS.GENERAL]} >
                    <General />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}