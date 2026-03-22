class NetworkInfo {
  static readonly URL: string =
    import.meta.env.VITE_ENV === "DEV"
      ? import.meta.env.VITE_API_URL || "http://localhost:8080/api"
      : import.meta.env.VITE_API_URL || "http://localhost:8080/api";
}

class NetworkModule {
  static readonly AUTH: string = "/auth";
  static readonly USER: string = "/users";
  static readonly EMPLOYEE: string = "/employees";
  static readonly TIMESHEET: string = "/timesheets";
}

class HTTPMethod {
  static readonly GET: string = "get";
  static readonly POST: string = "post";
  static readonly PUT: string = "put";
  static readonly PATCH: string = "patch";
  static readonly DELETE: string = "delete";
}

class AuthURL {
  static readonly LOGIN: string = "/login";
  static readonly REGISTER: string = "/register";
  static readonly REFRESH_TOKEN: string = "/refresh";
  static readonly LOGOUT: string = "/logout";
}

class PostLoginURL {
  // General CRUD
  static readonly GET: string = "";
  static readonly ADD_DATA: string = "";
  static readonly UPDATE_DATA: string = "";
  static readonly DELETE: string = "";
  static readonly LIST: string = "";

  // Employee specific routes
  static readonly SEARCH_BY_EMPLOYEE_ID: string = "/search/by-employee-id";
  static readonly DEPARTMENT: string = "/department";
}

export { NetworkInfo, NetworkModule, AuthURL, PostLoginURL, HTTPMethod };
