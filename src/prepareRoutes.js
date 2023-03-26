import prepareNavRoutes from "./db/routes/prepareNavRoutes.js"
import preparePagesRoutes from "./db/routes/preparePagesRoutes.js"
import prepareUsersRoutes from "./db/routes/prepareUsersRoutes.js"

const prepareRoutes = (ctx) => {
  prepareUsersRoutes(ctx)
  prepareNavRoutes(ctx)
  preparePagesRoutes(ctx)
}

export default prepareRoutes
