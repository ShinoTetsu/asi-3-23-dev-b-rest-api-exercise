import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static modifiers = {
    paginate: (query, limit, page) => {
      return query.limit(limit).offset((page - 1) * limit)
    },
  }

  static relationMappings() {
    return {
      createdBy: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.creatorId",
          to: "users.id",
        },
        modify: (query) => query.select("id", "firstName", "lastName"),
      },
      updatedBy: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.updatedById",
          to: "users.id",
        },
        modify: (query) => query.select("id", "firstName", "lastName"),
      },
    }
  }
}

export default PageModel
