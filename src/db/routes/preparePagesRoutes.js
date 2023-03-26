import validate from "../middlewares/validate.js"
import { idValidator, stringValidator } from "../../validators.js"
import PageModel from "../models/PageModel.js"
import UserModel from "../models/UserModel.js"
import auth from "../middlewares/auth.js"

const preparePagesRoutes = ({ app }) => {
  app.post(
    "/create-page",
    auth,
    validate({
      body: {
        title: stringValidator.required(),
        content: stringValidator.required(),
        url: stringValidator.required(),
        status: stringValidator,
      },
    }),
    async (req, res) => {
      const {
        body: { title, content, url, status },
        session: {
          user: { id: userId },
        },
      } = req.locals
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: userId })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const insert_db = await PageModel.query().insert({
        title,
        content,
        url,
        status,
      })
      res.send({ insert_db })
    }
  )
  app.get(
    "/lecture-page/:id_page",
    validate({
      params: {
        id_page: idValidator.required(),
      },
    }),
    async (req, res) => {
      const lecture = await PageModel.query().findById(req.params.id_page)

      if (!lecture) {
        res.status(404).send({ error: "Page not found." })

        return
      }

      res.send({ lecture })
    }
  )
  app.patch(
    "/update-page/:id_page",
    auth,
    validate({
      body: {
        title: stringValidator.required(),
        content: stringValidator.required(),
        url: stringValidator.required(),
        status: stringValidator,
      },
    }),
    async (req, res) => {
      const { title, content, url, status } = req.locals.body
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: req.locals.session.user.id })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const insert_db = await PageModel.query()
        .update({
          ...(title ? { title } : {}),
          ...(content ? { content } : {}),
          ...(url ? { url } : {}),
          ...(status ? { status } : {}),
        })
        .where({ id: req.params.id_page })
      res.send({ insert_db })
    }
  )
  app.delete(
    "/delete-page/:id_page",
    auth,
    validate({
      params: {
        id_page: idValidator.required(),
      },
    }),
    async (req, res) => {
      const lecture = await PageModel.query().findById(req.params.id_page)
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: req.locals.session.user.id })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const delete_page = await PageModel.query()
        .delete()
        .where({ id: req.params.id_page })

      if (!lecture) {
        res.status(404).send({ error: "Page not found." })

        return
      }

      res.send({ delete_page })
    }
  )
}

export default preparePagesRoutes
