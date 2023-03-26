import BaseModel from "./BaseModel.js"
import PageModel from "./PageModel.js"

class MenuModel extends BaseModel {
  static tableName = "menu"

  static relationMappings() {
    return {
      pages: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PageModel,
        join: {
          from: "menu.pageId",
          to: "pages.id",
        },
        modify: (query) => query.select("id"),
      },
    }
  }
}

export default MenuModel
