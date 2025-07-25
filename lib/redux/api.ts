// src/lib/redux/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface Bank {
  bankCode: string
  bankName: string
  bankAlias: string
}

export interface Business {
  createBy: string
  businessID: number
  name: string
  brandName: string
  appId: string
  logo: string
  website: string
  callbackUrl: string
  email: string
  hmacKey: string
  apiKeyMask: string
  accountNumber: string | null
  depositFeePercent: number
  depositFeeFlat: number
  depositFeeCap: number
  status?: "Active" | "Disabled" | "Deleted"
  dateCreated: string
}

export interface State {
  stateID: number
  stateCode: string
  stateName: string
  countryID: number
}

export interface LGA {
  stateLGAID: number
  stateLGACode: string
  stateLGAName: string
  stateID: number
}

export interface StatesResponse {
  data: State[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface LGAsResponse {
  data: LGA[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface BusinessesResponse {
  totalRecords: number
  currentPage: number
  pageSize: number
  data: Business[]
  statusCode: null | number
  message: null | string
  succeeded: boolean
}

export interface LoginResponse {
  data: {
    userId: string
    fullname: string
    username: string
    userrole: string
    token: string
    menus: any[]
  }
  statusCode: null | number
  message: string
  succeeded: boolean
}

export interface CreateBusinessPayload {
  corporateName: string
  headOfficeAddress: string
  headOfficeLgaName: string
  headOfficeStateName: string
  countryName: string
  officialEmailAddress: string
  officialPhoneNO: string
  dateIncorporated: string
  officialSignatures: string
  taxIdentificationNumber: string
  registrationNumber: string
  openingAmount: number
  accountProductTypeID: number
  referral: string
  accountGroup: string
  accountType: string
  accountCurrency: string
  customerTypeID: number
  identityTypeID: number
  business: {
    brandName: string
    logo: string
    website: string
    callbackUrl: string
    depositFeePercent: number
    depositFeeFlat: number
    depositFeeCap: number
  }
}

export interface CreateBusinessResponse {
  data: Business
  statusCode: number | null
  message: string | null
  succeeded: boolean
}

export interface ProductType {
  productTypeID: number
  productTypeName: string
  productTypeCode: string
  accountType: number
  createBy: string
  createdate: string
  modifyBy: string
  modifydate: string
  isDeleted: boolean
}

export interface ProductTypesResponse {
  data: ProductType[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface CustomerType {
  customerTypeID: number
  customerTypeName: string
  customerTypeCode: string
}

export interface CustomerTypesResponse {
  data: CustomerType[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface IdentityType {
  identityTypeID: number
  identityTypeName: string
  identityTypeObject: string
}

export interface IdentityTypesResponse {
  data: IdentityType[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://cba-dev.otechbank.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token

      if (token) {
        const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`
        headers.set("Authorization", authToken)
      }

      headers.set("accept", "*/*")
      return headers
    },
  }),
  endpoints: (builder) => ({
    getBanks: builder.query<Bank[], void>({
      query: () => "api/Bank/BankList",
      transformResponse: (response: { data: Bank[] }) => response.data,
    }),
    getBusinesses: builder.query<BusinessesResponse, { pageNumber: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => ({
        url: `api/Business?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    login: builder.mutation<LoginResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: "corecba/api/_Token/GetLoginToken",
        method: "POST",
        body: credentials,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }),
    }),
    createBusiness: builder.mutation<CreateBusinessResponse, CreateBusinessPayload>({
      query: (payload) => ({
        url: "api/Business/New",
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getStates: builder.query<StatesResponse, void>({
      query: () => "api/Setup/StateList",
    }),
    getProductTypes: builder.query<ProductTypesResponse, void>({
      query: () => "api/Setup/ProductType",
    }),
    getLGAsByState: builder.query<LGAsResponse, number>({
      query: (stateID) => ({
        url: `api/Setup/StateLGAList?StateID=${stateID}`, // Add StateID to URL
        method: "POST",
        body: { stateID }, // Also include in body
      }),
    }),
    getCustomerTypes: builder.query<CustomerTypesResponse, void>({
      query: () => "api/CustomerType/CustomerTypeList",
    }),
    getIdentityTypes: builder.query<IdentityTypesResponse, void>({
      query: () => "api/Setup/IdentityTypes",
    }),
  }),
})

export const {
  useGetBanksQuery,
  useLoginMutation,
  useGetBusinessesQuery,
  useCreateBusinessMutation,
  useGetStatesQuery,
  useGetLGAsByStateQuery,
  useGetProductTypesQuery,
  useGetCustomerTypesQuery,
  useGetIdentityTypesQuery,
} = api
