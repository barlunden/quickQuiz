import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/quiz", "routes/QuizPage.tsx"),
    route("/scoreboard", "routes/Scoreboard.tsx"),
    route("/register", "routes/register.tsx")
] satisfies RouteConfig;
