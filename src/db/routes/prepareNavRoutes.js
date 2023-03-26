import validate from "../middlewares/validate.js"
import { stringValidator, idValidator } from "../../validators.js"
import MenuModel from "../models/MenuModel.js"
import UserModel from "../models/UserModel.js"
import auth from "../middlewares/auth.js"

const prepareNavRoutes = ({ app }) => {
  app.post(
    "/create-menu",
    auth,
    validate({
      body: {
        title: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const { title } = req.locals.body
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: req.locals.session.user.id })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const insert_db = await MenuModel.query().insert({
        title,
      })
      res.send({ insert_db })
    }
  )
  app.get(
    "/lecture-menu/:id_menu",
    validate({
      params: {
        id_menu: idValidator.required(),
      },
    }),
    async (req, res) => {
      const lecture = await MenuModel.query().findById(req.params.id_menu)

      if (!lecture) {
        res.status(404).send({ error: "Menu not found." })

        return
      }

      res.send({ lecture })
    }
  )
  app.patch(
    "/update-menu/:id_menu",
    auth,
    validate({
      body: {
        title: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const { title } = req.locals.body
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: req.locals.session.user.id })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const insert_db = await MenuModel.query()
        .update({
          ...(title ? { title } : {}),
        })
        .where({ id: req.params.id_menu })
      res.send({ insert_db })
    }
  )
  app.delete(
    "/delete-menu/:id_menu",
    auth,
    validate({
      params: {
        id_menu: idValidator.required(),
      },
    }),
    async (req, res) => {
      const lecture = await MenuModel.query().findById(req.params.id_menu)
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: req.locals.session.user.id })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const delete_menu = await MenuModel.query()
        .delete()
        .where({ id: req.params.id_menu })

      if (!lecture) {
        res.status(404).send({ error: "Menu not found." })

        return
      }

      res.send({ delete_menu })
    }
  )
}

export default prepareNavRoutes
