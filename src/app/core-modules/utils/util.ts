import { ApiEndpoint } from '../enums/auth-endpoints';

export function detailUrl(endpoint: ApiEndpoint, id: number) {
  return `${endpoint}${id}/`
}
