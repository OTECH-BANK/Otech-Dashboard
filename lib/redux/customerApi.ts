// src/lib/redux/customerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

//
// ─── INTERFACES FOR BUYERS ─────────────────────────────────────────────────────
//

// Basic “lookup” entities used within Customer
export interface CustomerIDType {
  identityTypeID: number
  identityTypeName: string
  identityTypeObject: string
}

export interface LGA {
  stateLGAID: number
  stateLGACode: string
  stateLGAName: string
  stateID: number
  entryDate: string
}

export interface State {
  stateID: number
  stateCode: string
  stateName: string
  countryID: number
  entryDate: string
}

export interface Country {
  countryID: number
  countryCode: string
  countryName: string
  entryDate: string
}

export interface CustomerType {
  customerTypeID: number
  customerTypeName: string
  customerTypeCode: string
}

// ─── ACCOUNT & BUSINESS ENTITIES ───────────────────────────────────────────────

export interface Account {
  casaAccountID: number
  customerID: number
  businessID: number
  branchCode: number
  productCode: string
  currencyCode: string
  isTarget: boolean
  accountNumber: string
  accountTitle: string
  accountProductID: number
  floatAccountNo: string
  cintRate: number
  dintRate: number
  crIntVar: number
  drIntVar: number
  dateOpened: string
  status: number
  lnBalance: number
  availableBalance: number
  openingAmount: number
  openingCharge: number
  accountOfficer: string
  lastMonthBal: number
  lien: boolean
  accountTier: number
  totalDebit: number
  totalCredit: number
  totalCharge: number
  lastTransDate: string
  accountType: number
  approvedBy: string
  approvedDate: string
  createBy: string
  createdate: string
  modifyBy: string
  modifydate: string
  isDeleted: boolean
}

export interface Business {
  businessID: number
  businessName: string
  businessAddress: string
  businessEmail: string
  businessPhone: string
  registrationNumber: string
  taxID: string
  industryType: string
  dateIncorporated: string
  website: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  approvedBy: string
  approvedDate: string
  createBy: string
  createdate: string
  modifyBy: string
  modifydate: string
  isDeleted: boolean
}

// ─── CUSTOMER ENTITY ────────────────────────────────────────────────────────────

export interface Customer {
  customerID: number
  id: string
  title: string
  lastName: string
  firstName: string
  customerAddress: string
  stateLGAID: number
  stateID: number
  countryID: number
  isForeigner: boolean
  customerEmailAdd: string
  mobile: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  emailAlert: boolean
  smsAlert: boolean
  customerStatus: boolean
  customerTypeID: number
  customerPhoto: string
  customerSignature: string
  customerBankAccNumber: string
  bvnData: string
  ninData: string
  branchCode: number
  customerScanID: string
  customerIDNo: string
  identityTypeID: number
  isPoliticallyExposed: boolean
  customerTIN: string
  registrationNumber: string
  fullName: string
  customerIDType: CustomerIDType
  lga: LGA
  state: State
  country: Country
  business: Business | null
  bankName: string
  bankFeatures: string
  referral: string
  accountGroup: string
  accountType: string
  identifierAlias: string
  createIdentifier: boolean
  stateOfOrigin: string
  maritalStatus: string
  occupation: string
  buildingNo: string
  busStop: string
  town: string
  postalCode: string
  approvedBy: string
  approvedDate: string
  createBy: string
  createdate: string
  modifyBy: string
  modifydate: string
  isDeleted: boolean
}

// ─── RESPONSE SHAPES ────────────────────────────────────────────────────────────

export interface CustomerResponseItem {
  customer: Customer
  customerIDType: CustomerIDType
  customerType: CustomerType
  lga: LGA
  state: State
  country: Country
  business: Business | null
  accounts: Account[]
}

// This matches exactly what your API returns under `/api/Customer/CustomerDetails/{id}`
// i.e. `{ data: [ CustomerResponseItem ], totalRecords, currentPage, pageSize, … }`
export interface CustomerDetailsResponseRaw {
  data: CustomerResponseItem[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string
  message: string
  succeeded: boolean
}

// After we “unwrap” the `data[0]` array, RTK Query will hand us exactly this shape:
export interface CustomerDetailsResponse {
  data: CustomerResponseItem
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string
  message: string
  succeeded: boolean
}

// The “list” endpoint (e.g. paginated) returns an array under `data`, so this matches it directly:
export interface CustomersResponse {
  data: CustomerResponseItem[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string
  message: string
  succeeded: boolean
}

// ─── MUTATION / CREATE REQUESTS ─────────────────────────────────────────────────

export interface NewCustomerRequest {
  lastName: string
  firstName: string
  customerAddress: string
  stateID: number
  countryID: number
  customerEmailAdd: string
  mobile: string
  dateOfBirth: string
  gender: string
  customerTypeID: number
  branchCode: number
  identityTypeID: number
  customerTIN: string
  stateOfOrigin: string
}

export interface NewCustomerResponse {
  data: Customer
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface ActivateCustomerRequest {
  customerID: number
  isActive: boolean
}

export interface ActivateCustomerResponse {
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface ApproveCustomerRequest {
  customerID: number
  approvalType: number
}

export interface ApproveCustomerResponse {
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface CorporateCustomerRequest {
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
  identityTypeID: number
  accountProductTypeID: number
  accountType: string
  customerTypeID: number
}

export interface CorporateCustomerResponse {
  data: Customer
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface DeactivateCustomerRequest {
  id: string // expects GUID
  customerStatus: boolean
}

export interface DeactivateCustomerResponse {
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

// ─── createApi DEFINITION ───────────────────────────────────────────────────────

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://corecba.otechbank.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("accept", "*/*")
      return headers
    },
  }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    // ─── List / Paginated “AllCustomerList” ───────────────────────────────────────
    getCustomers: builder.query<CustomersResponse, { pageNumber: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => ({
        url: `api/Customer/AllCustomerList?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),

    // ─── List / Paginated “CustomerAppovalList” ─────────────────────────────────
    getPendingApprovalCustomers: builder.query<CustomersResponse, { pageNumber: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => ({
        url: `api/Customer/CustomerAppovalList?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),

    // ─── DETAILS (unwrap the single‐item array from the API) ──────────────────────
    getCustomerDetails: builder.query<CustomerDetailsResponse, number>({
      query: (CustomerID) => ({
        url: `api/Customer/CustomerDetails/${CustomerID}`,
        method: "GET",
      }),
      providesTags: ["Customer"],

      // transformResponse unwraps: { data: [ … ] } → { data: data[0] }
      transformResponse: (raw: CustomerDetailsResponseRaw) => {
        const firstItem = Array.isArray(raw.data) && raw.data.length > 0 ? raw.data[0] : (null as any)

        return {
          data: firstItem as CustomerResponseItem,
          totalRecords: raw.totalRecords,
          currentPage: raw.currentPage,
          pageSize: raw.pageSize,
          statusCode: raw.statusCode,
          message: raw.message,
          succeeded: raw.succeeded,
        }
      },
    }),

    // ─── MUTATIONS ────────────────────────────────────────────────────────────────
    addCustomer: builder.mutation<NewCustomerResponse, NewCustomerRequest>({
      query: (customerData) => ({
        url: "api/Customer/NewCustomer",
        method: "POST",
        body: customerData,
      }),
      invalidatesTags: ["Customer"],
    }),

    addCorporateCustomer: builder.mutation<CorporateCustomerResponse, CorporateCustomerRequest>({
      query: (customerData) => ({
        url: "api/Customer/NewCustomer",
        method: "POST",
        body: customerData,
      }),
      invalidatesTags: ["Customer"],
    }),

    activateCustomer: builder.mutation<ActivateCustomerResponse, ActivateCustomerRequest>({
      query: (requestBody) => ({
        url: "api/Customer/ActivateCustomer",
        method: "PATCH",
        body: requestBody,
      }),
      invalidatesTags: ["Customer"],
    }),

    approveCustomer: builder.mutation<ApproveCustomerResponse, ApproveCustomerRequest>({
      query: (requestBody) => ({
        url: `api/Customer/ApproveNewCustomer/${requestBody.customerID}`,
        method: "PATCH",
        body: requestBody,
      }),
      transformResponse: (response: { statusCode: number | null; message: string; succeeded: boolean }) => response,
      invalidatesTags: ["Customer"],
    }),

    updateCustomer: builder.mutation<
      { statusCode: number | null; message: string; succeeded: boolean },
      Partial<Customer>
    >({
      query: (customerData) => ({
        url: "api/Customer/UpdateCustomer",
        method: "PUT",
        body: customerData,
      }),
      transformResponse: (response: { statusCode: number | null; message: string; succeeded: boolean }) => response,
      invalidatesTags: ["Customer"],
    }),

    deleteCustomer: builder.mutation<{ statusCode: number | null; message: string; succeeded: boolean }, number>({
      query: (CustomerID) => ({
        url: `api/Customer/DeleteNewCustomer/${CustomerID}`,
        method: "DELETE",
      }),
      transformResponse: (response: { statusCode: number | null; message: string; succeeded: boolean }) => response,
      invalidatesTags: ["Customer"],
    }),

    deactivateCustomer: builder.mutation<DeactivateCustomerResponse, DeactivateCustomerRequest>({
      query: (requestBody) => ({
        url: `api/Customer/DeActivateCustomer`,
        method: "POST",
        body: requestBody,
      }),
      transformResponse: (response: { statusCode: number | null; message: string; succeeded: boolean }) => response,
      invalidatesTags: ["Customer"],
    }),
  }),
})

//
// ─── EXPORT HOOKS ───────────────────────────────────────────────────────────────
//
export const {
  useGetCustomersQuery,
  useGetCustomerDetailsQuery,
  useAddCustomerMutation,
  useActivateCustomerMutation,
  useApproveCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useAddCorporateCustomerMutation,
  useGetPendingApprovalCustomersQuery,
  useDeactivateCustomerMutation,
} = customerApi
