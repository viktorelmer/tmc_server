export type RESPONSE_DATA = {
    [key: number]: object
}
export type RESP_STATUSES = 200 | 300 | 400 | 500

export type RESPONSE_B_TYPE = {
    status: RESP_STATUSES,
    data: RESPONSE_DATA,
    code: 0 | 1
}
