export enum NotificationType {
  BOOK_DUE = "BOOK_DUE",
  BOOK_OVERDUE = "BOOK_OVERDUE",
  BOOK_RESERVED = "BOOK_RESERVED",
  BOOK_RETURNED = "BOOK_RETURNED",
  NEW_ARRIVAL = "NEW_ARRIVAL",
  MEMBERSHIP_EXPIRY = "MEMBERSHIP_EXPIRY",
  FINE_IMPOSED = "FINE_IMPOSED",
}

export enum RolePermission {
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_BOOKS = "MANAGE_BOOKS",
  MANAGE_ROLES = "MANAGE_ROLES",
  VIEW_REPORTS = "VIEW_REPORTS",
  ISSUE_BOOKS = "ISSUE_BOOKS",
  RETURN_BOOKS = "RETURN_BOOKS",
  VIEW_BORROW_HISTORY = "VIEW_BORROW_HISTORY",
}

export enum BorrowRecordsEnum {
  ISSUED = "ISSUED",
  RETURNED = "RETURNED",
  LOST = "LOST",
  OVERDUE = "OVERDUE",
}

export enum BookStatusEnum {
  AVAILABLE = "AVAILABLE",
  CHECKED_OUT = "CHECKED_OUT",
  RESERVED = "RESERVED",
  LOST = "LOST",
}

export enum AuditLogsActionEnum {
  CREATE_BOOK = "CREATE_BOOK",
  UPDATE_MEMBER = "UPDATE_MEMBER",
  DELETE_RECORD = "DELETE_RECORD",
  ISSUE_BOOK = "ISSUE_BOOK",
  RETURN_BOOK = "RETURN_BOOK",
}

export enum UserStatusEnum {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export enum RoleOperations {
  CREATE = "ROLE_CREATE",
  UPDATE = "ROLE_UPDATE",
  DELETE = "ROLE_DELETE",
  SEARCH = "ROLE_SEARCH",
  GET = "ROLE_GET",
}

export enum HttpStatusCode {
  BadRequest = 400,
  ConflictError = 409,
  Forbidden = 403,
  InternalServerError = 500,
  NotFound = 404,
  Ok = 200,
  ServiceUnavailable = 503,
  Unauthorized = 401,
  Found = 302,
  MethodNotAllowed = 405,
  BadGateway = 502,
}

export enum ErrorType {
  NotFound = "NotFound",
  BadRequest = "BadRequest",
  Unauthorized = "Unauthorized",
  InternalServerError = "InternalServerError",
  SequelizeDatabaseError = "SequelizeDatabaseError",
  Conflict = "Conflict",
  RoleNotFound = "RoleNotFound",
  UserNotFound = "UserNotFound",
  RoleIsUnique = "RoleIsUnique",
  UserIsUnique = "UserIsUnique",
  BookIsUnique = "BookIsUnique",
  AuthorIsUnique = "AuthorIsUnique",
  CategoryIsUnique = "CategoryIsUnique",
  MemberIsUnique = "MemberIsUnique",
  UserIsInactive = "UserIsInactive",
  InvalidCredentials = "InvalidCredentials",
  CategoryNotFound = "CategoryNotFound",
  BookNotFound = "BookNotFound",
}

export enum AuthOperations {
  LOGIN = "AUTH_LOGIN",
  LOGOUT = "AUTH_LOGOUT",
  SIGNUP = "AUTH_SIGNUP",
  INVALID_CRED = "AUTH_INVALID_CRED",
  REFRESH_TOKEN = "AUTH_REFRESH_TOKEN",
  RESET_PASSWORD = "AUTH_RESET_PASSWORD",
}

export enum UsersOperations {
  USERS_CREATED = "USERS_CREATED",
  UPDATED = "USER_UPDATED",
  DELETED = "USER_DELETED",
  SEARCH = "USER_SEARCH",
  GET = "USER_GET",
  CREATE = "USER_CREATE",
}

export enum CategoriesOperations {
  UPDATED = "CATEGORIES_UPDATED",
  DELETED = "CATEGORIES_DELETED",
  SEARCH = "CATEGORIES_SEARCH",
  CREATE = "CATEGORIES_CREATE",
}
export enum BooksOperations {
  UPDATED = "BOOKS_UPDATED",
  DELETED = "BOOKS_DELETED",
  SEARCH = "BOOKS_SEARCH",
  GET = "BOOKS_GET",
  CREATE = "BOOKS_CREATE",
}

export const LogLevel = Object.freeze({
  info: 'info',
  error: 'error',
  warn: 'warn',
  debug: 'debug'
});