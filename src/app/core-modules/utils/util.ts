import { ApiEndpoint } from '../enums/api-endpoints';

export function detailUrl(endpoint: ApiEndpoint, id: number) {
  return `${endpoint}${id}/`
}
