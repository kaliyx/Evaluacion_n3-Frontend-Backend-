import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin", "routes/admin.tsx"),
  route("login", "routes/login.tsx"),
  route("vendedor", "routes/vendedor.tsx"),
  route("pago", "routes/pago.tsx"),
] satisfies RouteConfig;