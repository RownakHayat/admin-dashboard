export const TransformResponse = (response: any) => {
  const transform = {
    code: response.code,
    data: response?.data?.data,
    pagination: {
      current_page: response?.data.current_page,
      to: response?.data.to,
      from: response?.data.from,
      last_page: response?.data.last_page,
      per_page: response?.data.per_page,
      total: response?.data.total,
    },
  }
  return transform
}

export const TransformResponseForLeaveRecord = (response: any) => {
  const transform = {
    code: response.code,
    data: response?.data?.all_employee_leave_info?.data,
    pagination: {
      current_page: response?.data?.all_employee_leave_info?.current_page,
      to: response?.data?.all_employee_leave_info?.to,
      from: response?.data?.all_employee_leave_info?.from,
      last_page: response?.data?.all_employee_leave_info?.last_page,
      per_page: response?.data?.all_employee_leave_info?.per_page,
      total: response?.data?.all_employee_leave_info?.total,
    },
    typeWiseEmployeeLeave: response?.data?.typeWiseEmployeeLeave,
  }
  return transform
}

// export const IndexSerial = (
//   page: number,
//   pageSize: number,
//   index: number,
//   orderBy?: string,
//   total?: number
// ) => {
//   let current_page = Number(page)
//   let perPageSize = Number(pageSize)
//   let row_index = Number(index) + 1
//   let serial_num
//   if (orderBy === "ASC") {
//     serial_num = perPageSize * (current_page - 1) + row_index
//   } else {
//     serial_num =
//       (total || 10) - (perPageSize * (current_page - 1) + (row_index - 1))
//   }
//   return serial_num < 10 ? "0" + serial_num : serial_num
// }

export const IndexSerial = (
  page: number,
  pageSize: number,
  index: number,
  orderBy?: string,
  total?: number
) => {
  let current_page = Number(page)
  let perPageSize = Number(pageSize)
  let row_index = Number(index) + 1
  let serial_num
  if (orderBy === "ASC") {
    serial_num =
      (total || 10) - (perPageSize * (current_page - 1) + (row_index - 1))
  } else {
    serial_num = perPageSize * (current_page - 1) + row_index
  }
  return serial_num < 10 ? "0" + serial_num : serial_num
}


