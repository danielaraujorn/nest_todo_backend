export interface IWhereIds {
  _id: { $in: string[] }
  deleted: boolean
}
