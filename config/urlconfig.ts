
import config from "./config.json"

const BASE_ROUTE = `${config.BASE_API_ROUTE}/v${config.API_VERSION}`

export const routes = {
    PAYMENTS: `${BASE_ROUTE}/payments`,
    USERS: `${BASE_ROUTE}/users`,
    VIDEOS: `${BASE_ROUTE}/videos`
}