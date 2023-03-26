import hashPassword from "../hashPassword.js"

const [passwordHash, passwordSalt] = await hashPassword("1Testpassword!")

export const up = async (knex) => {
  await knex.schema
    .createTable("roles", (table) => {
      table.increments("id")
      table.text("name").notNullable()
    })
    .then(() =>
      knex("roles").insert([
        { name: "admin" },
        { name: "manager" },
        { name: "editor" },
      ])
    )

  await knex.schema
    .createTable("users", (table) => {
      table.increments("id")
      table.text("firstName").notNullable()
      table.text("lastName").notNullable()
      table.text("email").notNullable().unique()
      table.text("passwordHash").notNullable()
      table.text("passwordSalt").notNullable()
      table.integer("roleId").references("id").inTable("roles")
    })
    .then(() =>
      knex("users").insert({
        firstName: "Test",
        lastName: "Test",
        email: "test@avetisk.com",
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        roleId: 1,
      })
    )

  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable().unique()
    table.text("content").notNullable()
    table.text("url").notNullable()
    table.text("status").notNullable()
    table.integer("createdById").references("id").inTable("users")
    table.integer("updatedById").references("id").inTable("users")
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("menu", (table) => {
    table.increments("id")
    table.text("title").notNullable().unique()
    table.integer("idPage").references("id").inTable("pages")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("pages")
  await knex.schema.dropTable("users")
  await knex.schema.dropTable("roles")
  await knex.schema.dropTable("menu")
}
