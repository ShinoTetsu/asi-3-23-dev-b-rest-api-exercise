import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class RoleModel extends BaseModel {
  static tableName = "roles"

  static relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "roles.userId",
          to: "users.id",
        },
        modify: (query) => query.select("id"),
      },
    }
  }
}

export default RoleModel
