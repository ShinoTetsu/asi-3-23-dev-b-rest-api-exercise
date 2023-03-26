import hashPassword from "../hashPassword.js"
import validate from "../middlewares/validate.js"
import {
  emailValidator,
  stringValidator,
  idValidator,
  intValidator, passwordValidator,
} from "../../validators.js"
import jsonwebtoken from "jsonwebtoken"
import config from "../../config.js"
import UserModel from "../models/UserModel.js"
import auth from "../middlewares/auth.js"

const prepareUsersRoutes = ({ app, db }) => {
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    async (req, res) => {
      const { email, password } = req.locals.body
      const [user] = await db("user").where({ email })

      if (!user) {
        res.status(401).send({ error: "Invalid credentials." })

        return
      }

      const [passwordHash] = await hashPassword(password, user.passwordSalt)

      if (passwordHash !== user.passwordHash) {
        res.status(401).send({ error: "Invalid credentials." })

        return
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
            },
          },
        },
        config.security.jwt.secret,
        config.security.jwt.options
      )

      res.send({ result: jwt })
    }
  )
  app.post(
    "/create-user",
    auth,
    validate({
      body: {
        firstName: stringValidator.required(),
        lastName: stringValidator.required(),
        email: stringValidator.required(),
        roleId: intValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        body: { firstName, lastName, email, roleId, password },
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

      const [passwordHash, passwordSalt] = await hashPassword(password)
      const insert_db = await UserModel.query().insert({
        firstName,
        lastName,
        email,
        roleId,
        passwordHash,
        passwordSalt,
      })
      res.send({ insert_db })
    }
  )
  app.get(
    "/check-user/:id_user",
    validate({
      params: {
        id_user: idValidator.required(),
      },
    }),
    async (req, res) => {
      const check = await UserModel.query().findById(req.params.id_user)

      if (!check) {
        res.status(404).send({ error: "User not found." })

        return
      }

      res.send({ check })
    }
  )
  app.patch(
    "/update-user/:id_user",
    auth,
    validate({
      body: {
        firstName: stringValidator.required(),
        lastName: stringValidator.required(),
        email: stringValidator.required(),
        roleId: intValidator.required(),
      },
    }),
    async (req, res) => {
      const { firstName, lastName, email, roleId } = req.locals.body
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: req.locals.session.user.id })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const insert_db = await UserModel.query()
        .update({
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(email ? { email } : {}),
          ...(roleId ? { roleId } : {}),
        })
        .where({ id: req.params.id_user })
      res.send({ insert_db })
    }
  )
  app.delete(
    "/delete-user/:id_user",
    auth,
    validate({
      params: {
        id_user: idValidator.required(),
      },
    }),
    async (req, res) => {
      const lecture = await UserModel.query().findById(req.params.id_user)
      const loggedUserRole = await UserModel.query()
        .select("roleId")
        .findOne({ id: req.locals.session.user.id })

      if (loggedUserRole.roleId !== 1) {
        res.status(403).send({ error: "Forbidden." })

        return
      }

      const delete_user = await UserModel.query()
        .delete()
        .where({ id: req.params.id_user })

      if (!lecture) {
        res.status(404).send({ error: "User not found." })

        return
      }

      res.send({ delete_user })
    }
  )
}

export default prepareUsersRoutes
