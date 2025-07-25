// src/lib/redux/employeeApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface Employee {
  userID: string
  employeeStaffCode: string | null
  employeeFullName: string
  employeeMobile: string
  employeeEmail: string
  password: string
  isactive: boolean
  employeeRoleID: number
  employeeBranchID: number
  apprRoleID: number
  employeeChangePassword: boolean
  systemMappedIP: string | null
  isSystemMapp: boolean
  lockout: boolean
  lockoutdate: string
  failedLogin: number
  userRoleID: number
  userRoleName: string
  description: string
  branchCode: string
  branchName: string
  branchAddress: string
  branchMobile: string
  branchState: string
  createdate: string
  approvedUserDescription: string
  approvedUserApprRole: string
}

export interface EmployeesResponse {
  data: Employee[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface EmployeeDetailsResponse {
  data: Employee
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface NewEmployeeRequest {
  name: string
  mobile: string
  email: string
  password: string
  roleId: number
  branchId: number
  approvalId: number
  changePwd: boolean
  isactive: boolean
}

export interface NewEmployeeResponse {
  data: Employee
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface Role {
  id: number
  title: string
  description: string
}

export interface RolesResponse {
  data: Role[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface Branch {
  branchID: number
  branchCode: string
  branchName: string
  branchAddress: string
  branchMobile: string
  branchState: string
  branchManager: string
  branchStatus: boolean
  branchGLNumber: string
  regionID: number
  region: null | string
  createBy: string
  createdate: string
  modifyBy: null | string
  modifydate: string
  isDeleted: boolean
}

export interface BranchesResponse {
  data: Branch[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface ActivateEmployeeRequest {
  userEmail: string
  isActive: boolean
}

export interface ActivateEmployeeResponse {
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://cba-dev.otechbank.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("accept", "*/*")
      return headers
    },
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeesResponse, { pageNumber: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => ({
        url: `api/Employee/GetEmployees?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    getEmployeeDetails: builder.query<EmployeeDetailsResponse, string>({
      query: (userId) => ({
        url: `api/Employee/EmployeeDetails`,
        method: "POST",
        body: { userID: userId },
      }),
    }),
    getBranches: builder.query<BranchesResponse, void>({
      query: () => ({
        url: "api/Bank/BranchList",
        method: "GET",
      }),
    }),
    getRoles: builder.query<RolesResponse, void>({
      query: () => ({
        url: "api/Employee/GetUserRoles",
        method: "GET",
      }),
    }),
    addEmployee: builder.mutation<NewEmployeeResponse, NewEmployeeRequest>({
      query: (employeeData) => ({
        url: "api/Employee/NewEmployee",
        method: "POST",
        body: employeeData,
      }),
    }),
    activateEmployee: builder.mutation<ActivateEmployeeResponse, ActivateEmployeeRequest>({
      query: (requestBody) => ({
        url: "api/Employee/ActivateEmployee",
        method: "PATCH",
        body: requestBody,
      }),
    }),

    changeEmployeeRole: builder.mutation({
      query: ({ userId, newRoleId }) => ({
        url: `api/Employee/ChangeEmployeeRole?UserID=${userId}&NewUsersRoleID=${newRoleId}`,
        method: "PATCH",
      }),
      transformResponse: (response: { statusCode: number | null; message: string; succeeded: boolean }) => response,
    }),
    changeEmployeePassword: builder.mutation({
      query: ({ userId, oldPassword, newPassword }) => ({
        url: "api/Employee/ChangeEmployeePassword",
        method: "PATCH",
        body: {
          accId: userId,
          oldpassword: oldPassword,
          newpassword: newPassword,
        },
      }),
      transformResponse: (response: { statusCode: number | null; message: string; succeeded: boolean }) => response,
    }),
    // ... other endpoints
  }),
})

export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailsQuery,
  useGetRolesQuery,
  useGetBranchesQuery,
  useAddEmployeeMutation,
  useActivateEmployeeMutation,
  useChangeEmployeeRoleMutation,
  useChangeEmployeePasswordMutation, // Add this line
} = employeeApi
