"use server"

import axios from "axios"

interface companyInfoInterface {
  companyName: string
  keywords: string[]
  companyIndustry: string
  goal: string
}

export async function updateCompany({
  userId,
  companyInfo,
}: {
  userId: string
  companyInfo: companyInfoInterface
}) {
  try {
    const res = await axios.put(`${process.env.API_SERVICE_URL}/company`, {
      ...companyInfo,
      user_id: userId,
    })
    return res
  } catch (e) {
    return { error: true, message: e }
  }
}

export async function createCompany({
  userId,
  companyInfo,
}: {
  userId: string
  companyInfo: companyInfoInterface
}) {
  try {
    const res = await axios.post(
      `${process.env.API_SERVICE_URL}/company/create_company`,
      {
        ...companyInfo,
        user_id: userId,
      }
    )
    return res
  } catch (e) {
    return { error: true, message: e }
  }
}

export async function getCompany(userId: string) {
  try {
    console.log("the user id", userId)
    const res = await axios.get(
      `${process.env.API_SERVICE_URL}/company/?user_id=${encodeURIComponent(
        userId
      )}`
    )
    if (res && res.data && res.data.length) {
      let companyObj = res.data[0]
      return companyObj
    }
    return {}
  } catch (e) {
    return { error: true, message: "Unable to get company" }
  }
}
