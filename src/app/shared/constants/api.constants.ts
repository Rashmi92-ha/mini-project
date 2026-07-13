import { environment } from "../../../environments/environment";

const API_BASE_URL = environment.apiUrl;

export const API_ENPOINTS = {
    AUTH: {
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REFRESH: `${API_BASE_URL}/api/auth/refresh`,
        LOGOUT:`${API_BASE_URL}/api/auth/logout`,
        USERS: `${API_BASE_URL}/api/auth/users`,
    },
    EMPLOYEE: {
        BASE: `${API_BASE_URL}/employees`,
    },
}as const;